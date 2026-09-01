# Caso de Uso N° 17 — Consulta de puntos de interés

> Requisito asociado: **RF15** · SRS EcoRuteando, sección 4.2

**Descripción:** Muestra sobre el mapa puntos de interés sostenibles (parques, ciclorrutas, estaciones) cercanos a la ruta del usuario.

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

| Paso | Acción |
|:---:|---|
| 1 | Si no existen puntos en la zona, el sistema muestra “sin puntos de interés disponibles”. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario |
| **Comentarios** | Aplica tanto para usuarios registrados como para modo invitado. |
