# Caso de Uso N° 17 — Consulta de puntos de interés

> Requisito asociado: **RF15** · SRS EcoRuteando, sección 4.2

**Descripción:** Muestra sobre el mapa puntos de interés sostenibles (parques, estaciones, zonas peatonales) cercanos a la ruta del usuario — transporte público y ciclorrutas fuera de alcance.

| Campo | Descripción |
|---|---|
| **Nombre** | Consulta de puntos de interés |
| **Prioridad** | Media |
| **Precondición** | El usuario debe tener una ruta o zona visualizada en el mapa. |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El usuario visualiza su ruta en el mapa | El sistema dibuja los íconos de puntos de interés sostenibles (RF15.3). |
| 2 | El usuario selecciona un punto de interés | El sistema muestra su información: nombre, tipo y distancia. |
| 3 | — | El sistema sugiere puntos adicionales cercanos a la ruta (RF15.2). |

## Postcondición

Los puntos de interés quedan visibles e identificados con íconos en el mapa (RF15.1).

## Excepciones (flujo alterno)

| Paso | Condición | Respuesta del sistema |
|:---:|---|---|
| E1 | No existen puntos en la zona/modo (vehículo/a pie). | Muestra “Sin puntos de interés disponibles”. |
| E2 | Fallo del servicio de mapas al cargar POIs. | Muestra “No fue posible cargar puntos” con reintento. |
| E3 | Datos PostGIS inconsistentes o coordenadas inválidas. | Registra error y omite el punto afectado. |
| E4 | Límite de cuota de API excedido. | Usa caché local y notifica “Datos aproximados”. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario |
| **Comentarios** | Aplica para registrados y modo invitado. Trazabilidad: RF15 → CU17. |

