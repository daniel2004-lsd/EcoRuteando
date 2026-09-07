// Carga singleton de la Google Maps JavaScript API.
// Evita inyectar el <script> más de una vez (carga múltiple rompe callbacks
// como las de Places Autocomplete y produce el warning del navegador).

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

let mapsLoadingPromise = null;
let scriptInjected = false;

export const loadGoogleMapsApi = () => {
  if (mapsLoadingPromise) return mapsLoadingPromise;

  if (window.google?.maps) {
    mapsLoadingPromise = Promise.resolve(window.google);
    return mapsLoadingPromise;
  }

  mapsLoadingPromise = new Promise((resolve, reject) => {
    if (scriptInjected) {
      // El <script> ya fue inyectado pero aún no cargó: esperar su onload.
      const existing = document.querySelector(
        'script[src^="https://maps.googleapis.com/maps/api/js"]'
      );
      if (existing) {
        existing.addEventListener("load", () => resolve(window.google), { once: true });
        existing.addEventListener("error", () => reject(new Error("Error cargando Google Maps")), { once: true });
        return;
      }
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry&language=es`;
    script.async = true;
    script.defer = true;
    scriptInjected = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error("Error cargando Google Maps"));
    document.head.appendChild(script);
  });

  return mapsLoadingPromise;
};