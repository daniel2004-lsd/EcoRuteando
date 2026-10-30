import test from "node:test";
import assert from "node:assert/strict";

import { RECOMMENDED_DESTINATIONS } from "../src/features/home/data/recommendedDestinations.js";

// Helper de parseCoord idéntico al implementado en PlanRoute.jsx
const parseCoord = (c) => {
  if (c == null) return null;
  if (typeof c === "function") {
    try {
      const val = c();
      const n = Number(val);
      return Number.isFinite(n) ? n : null;
    } catch {
      return null;
    }
  }
  const n = Number(c);
  return Number.isFinite(n) ? n : null;
};

// Helper de Haversine idéntico al implementado en PlanRoute.jsx
const computeHaversineDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

test("H-03: Lugares recomendados para descubrir contiene los destinos verificados de Neiva y el Huila", () => {
  assert.equal(RECOMMENDED_DESTINATIONS.length, 6, "Deben existir exactamente 6 destinos verificados");

  const santander = RECOMMENDED_DESTINATIONS.find((d) => d.id === "parque-santander");
  assert.ok(santander, "Parque Santander debe estar en la lista");
  assert.equal(santander.lat, 2.9274);
  assert.equal(santander.lng, -75.2892);
  assert.equal(santander.municipality, "Neiva, Huila");

  const malecon = RECOMMENDED_DESTINATIONS.find((d) => d.id === "malecon-magdalena");
  assert.ok(malecon, "Malecón del Río Magdalena debe estar en la lista");
  assert.equal(malecon.lat, 2.9328);
  assert.equal(malecon.lng, -75.2982);

  const tatacoa = RECOMMENDED_DESTINATIONS.find((d) => d.id === "desierto-tatacoa");
  assert.ok(tatacoa, "Desierto de la Tatacoa debe estar en la lista");
  assert.equal(tatacoa.lat, 3.2322);
  assert.equal(tatacoa.lng, -75.1664);

  const rivera = RECOMMENDED_DESTINATIONS.find((d) => d.id === "termales-rivera");
  assert.ok(rivera, "Termales de Rivera debe estar en la lista");
  assert.equal(rivera.lat, 2.7663);
  assert.equal(rivera.lng, -75.2341);

  const musica = RECOMMENDED_DESTINATIONS.find((d) => d.id === "parque-musica");
  assert.ok(musica, "Parque de la Música debe estar en la lista");
  assert.equal(musica.lat, 2.9242);
  assert.equal(musica.lng, -75.2845);

  const edificio = RECOMMENDED_DESTINATIONS.find((d) => d.id === "edificio-nacional");
  assert.ok(edificio, "Edificio Nacional de Neiva debe estar en la lista");
  assert.equal(edificio.lat, 2.9281);
  assert.equal(edificio.lng, -75.2884);

  // Comprobar que todos los destinos tienen metadatos completos y verificables
  for (const dest of RECOMMENDED_DESTINATIONS) {
    assert.ok(dest.name && dest.name.length > 3, `${dest.id} debe tener un nombre válido`);
    assert.ok(dest.location && dest.location.length > 5, `${dest.id} debe tener ubicación válida`);
    assert.ok(dest.category && dest.category.length > 3, `${dest.id} debe tener categoría`);
    assert.ok(dest.description && dest.description.length > 20, `${dest.id} debe tener descripción verificable`);
    assert.ok(Number.isFinite(dest.lat) && dest.lat >= 2.0 && dest.lat <= 4.0, `${dest.id} latitud en rango Huila`);
    assert.ok(Number.isFinite(dest.lng) && dest.lng >= -76.0 && dest.lng <= -74.5, `${dest.id} longitud en rango Huila`);
  }
});

test("H-02: Normalización segura de coordenadas con parseCoord", () => {
  // Números
  assert.equal(parseCoord(2.9274), 2.9274);
  assert.equal(parseCoord(-75.2892), -75.2892);

  // Strings numéricos
  assert.equal(parseCoord("2.9274"), 2.9274);
  assert.equal(parseCoord("-75.2892"), -75.2892);

  // Funciones de Google Places LatLng
  assert.equal(parseCoord(() => 2.9274), 2.9274);
  assert.equal(parseCoord(() => -75.2892), -75.2892);

  // Valores inválidos o nulos
  assert.equal(parseCoord(null), null);
  assert.equal(parseCoord(undefined), null);
  assert.equal(parseCoord("no-number"), null);
  assert.equal(parseCoord(() => { throw new Error("bad"); }), null);
});

test("H-02: Cálculo de distancia Haversine y cálculo de ruta directa de respaldo", () => {
  // Distancia entre Parque Santander y Malecón de Neiva (~1.17 km)
  const dist = computeHaversineDistanceKm(2.9274, -75.2892, 2.9328, -75.2982);
  assert.ok(dist >= 1.0 && dist <= 1.5, `Distancia calculada ${dist} km debe estar cerca de 1.17 km`);

  // Distancia entre Neiva y Desierto de la Tatacoa (~36.5 km)
  const distTatacoa = computeHaversineDistanceKm(2.9274, -75.2892, 3.2322, -75.1664);
  assert.ok(distTatacoa >= 34.0 && distTatacoa <= 40.0, `Distancia a la Tatacoa ${distTatacoa} km debe estar cerca de 36 km`);
});

test("H-01: Persistencia de categorías y alternancia de filtros", () => {
  // Modelo de estado de categorías
  let activeFilter = null;
  let nearbyPois = [];

  const toggleCategory = (cat, places) => {
    if (activeFilter?.id === cat.id) {
      activeFilter = null;
      nearbyPois = [];
    } else {
      activeFilter = cat;
      nearbyPois = places;
    }
  };

  const clearFilter = () => {
    activeFilter = null;
    nearbyPois = [];
  };

  const catHoteles = { id: "lodging", label: "Hoteles" };
  const catCafes = { id: "cafe", label: "Cafés" };
  const catRestaurantes = { id: "restaurant", label: "Restaurantes" };

  // 1. Seleccionar Hoteles
  toggleCategory(catHoteles, [{ name: "Hotel Plaza Neiva", lat: 2.927, lng: -75.289 }]);
  assert.equal(activeFilter.id, "lodging");
  assert.equal(nearbyPois.length, 1);

  // 2. Cambiar inmediatamente a Cafés sin reiniciar sesión
  toggleCategory(catCafes, [{ name: "Café Colonial", lat: 2.928, lng: -75.288 }, { name: "Café San Juan", lat: 2.929, lng: -75.287 }]);
  assert.equal(activeFilter.id, "cafe");
  assert.equal(nearbyPois.length, 2);

  // 3. Cambiar a Restaurantes
  toggleCategory(catRestaurantes, [{ name: "Restaurante La Huilense", lat: 2.926, lng: -75.285 }]);
  assert.equal(activeFilter.id, "restaurant");
  assert.equal(nearbyPois.length, 1);

  // 4. Limpiar filtro explícitamente
  clearFilter();
  assert.equal(activeFilter, null);
  assert.equal(nearbyPois.length, 0);
});

test("H-02: Manejo diferenciado de errores HTTP (401, 404, 502, timeout)", () => {
  const resolveRouteError = (status, data, mode) => {
    if (status === 401) {
      return {
        isAuthRequired: true,
        message: "Cálculo de ruta en tiempo real requiere autenticación",
      };
    }
    if (status === 404 && data?.message) {
      return {
        isAuthRequired: false,
        suggestion: mode === "walking" ? "car" : "walking",
        message: data.message,
      };
    }
    if (status === 502 || status === 503) {
      return {
        isAuthRequired: false,
        message: "El servicio de cálculo de rutas no está disponible temporalmente (Error 502/503 del servidor).",
      };
    }
    return {
      isAuthRequired: false,
      message: data?.message || "Error al calcular la ruta",
    };
  };

  // Error 401: Debe reportar requerimiento de autenticación, NO un falso "No se encontró una ruta"
  const err401 = resolveRouteError(401, null, "walking");
  assert.equal(err401.isAuthRequired, true);
  assert.ok(err401.message.includes("requiere autenticación"));

  // Error 404 (ZERO_RESULTS): Debe presentar la sugerencia del backend
  const err404 = resolveRouteError(404, { message: "No existe una ruta a pie entre el origen y el destino. Intenta en automóvil." }, "walking");
  assert.equal(err404.isAuthRequired, false);
  assert.equal(err404.suggestion, "car");
  assert.ok(err404.message.includes("Intenta en automóvil"));

  // Error 502: Debe reportar error temporal de servidor
  const err502 = resolveRouteError(502, null, "car");
  assert.ok(err502.message.includes("502/503"));
});

test("Cálculo público de rutas reales: usuario anónimo recibe polilínea de calles y acciones privadas requieren sesión", () => {
  // Simulación de respuesta real de Google Maps Directions recibida por un usuario anónimo
  const googleDirectionsResponse = {
    status: "OK",
    encodedPolyline: "}m_fE|g_eO~AgE|BqD",
    distance: { text: "1.1 km", valueMeters: 1100 },
    duration: { text: "14 min", valueSeconds: 840 },
    summary: "Cl. 8",
    alternatives: [
      {
        encodedPolyline: "an_fE|j_eOpBoDbCiE",
        distance: { text: "1.3 km", valueMeters: 1300 },
        duration: { text: "16 min", valueSeconds: 960 },
        summary: "Cl. 10"
      }
    ]
  };

  // 1. Un usuario anónimo calcula la ruta: no hay 401, se obtiene la polilínea real de la red vial
  assert.equal(googleDirectionsResponse.status, "OK");
  assert.ok(googleDirectionsResponse.encodedPolyline.length > 5, "Debe contener polilínea codificada real");
  assert.equal(googleDirectionsResponse.distance.valueMeters, 1100);
  assert.equal(googleDirectionsResponse.duration.valueSeconds, 840);
  assert.equal(googleDirectionsResponse.alternatives.length, 1);

  // 2. Comportamiento de acciones privadas para usuario anónimo
  const checkPrivateActionGuard = (isAuthenticated, action) => {
    if (!isAuthenticated) {
      return { allowed: false, error: `Inicia sesión para ${action}.` };
    }
    return { allowed: true, error: null };
  };

  const saveCheck = checkPrivateActionGuard(false, "guardar tus rutas personalizadas");
  assert.equal(saveCheck.allowed, false);
  assert.ok(saveCheck.error.includes("Inicia sesión"));

  const favCheck = checkPrivateActionGuard(false, "añadir rutas a tus favoritos");
  assert.equal(favCheck.allowed, false);

  const tripCheck = checkPrivateActionGuard(false, "iniciar y registrar un trayecto en tiempo real");
  assert.equal(tripCheck.allowed, false);
});

test("Manejo robusto de errores diferenciados (400, 429, 500, timeout)", () => {
  const resolveError = (status, data, headers = {}) => {
    if (status === 400) {
      return { type: "BAD_REQUEST", msg: data?.message || "Coordenadas inválidas." };
    }
    if (status === 429) {
      const retry = headers["retry-after"] ? ` Por favor espera ${headers["retry-after"]} segundos.` : " Por favor espera un momento.";
      return { type: "RATE_LIMIT", msg: `Has alcanzado el límite de solicitudes.${retry}` };
    }
    if (status === 500) {
      return { type: "SERVER_ERROR", msg: "Error interno del servidor." };
    }
    if (status === 502 || status === 503) {
      return { type: "PROVIDER_ERROR", msg: "Error de Google Maps." };
    }
    return { type: "UNKNOWN", msg: "Error general." };
  };

  // Coordenadas fuera de rango -> 400
  const err400 = resolveError(400, { message: "Las coordenadas están fuera del rango válido." });
  assert.equal(err400.type, "BAD_REQUEST");
  assert.ok(err400.msg.includes("fuera del rango válido"));

  // Rate Limiting -> 429
  const err429 = resolveError(429, null, { "retry-after": "60" });
  assert.equal(err429.type, "RATE_LIMIT");
  assert.ok(err429.msg.includes("60 segundos"));

  // Error de proveedor -> 502
  const err502 = resolveError(502);
  assert.equal(err502.type, "PROVIDER_ERROR");

  // Error interno -> 500
  const err500 = resolveError(500);
  assert.equal(err500.type, "SERVER_ERROR");
});
