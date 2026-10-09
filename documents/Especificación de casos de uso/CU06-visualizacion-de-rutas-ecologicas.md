# Caso de Uso N° 6 — Visualización de rutas ecologicas

> Requisito asociado: **RF6** · SRS EcoRuteando, sección 4.2

**Descripción:** Permite al usuario consultar y visualizar rutas ecológicas combinando transporte público y bicicleta.

| Campo | Descripción |
|---|---|
| **Nombre** | Visualización de rutas ecologicas |
| **Prioridad** | Alta |
| **Precondición** | El usuario debe ingresar punto de partida y destino. |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El usuario ingresa al punto de partida y destino | El sistema calcula las rutas disponibles |
| 2 | — | El sistema muestra el mapa con las rutas ecológicas |
| 3 | El usuario selecciona una ruta. | El sistema muestra detalles: tiempo, distancia y CO₂ ahorrado. |

## Postcondición

La ruta se muestra correctamente en el mapa interactivo.

## Excepciones (flujo alterno)

| Paso | Acción |
|:---:|---|
| 1 | Si no hay rutas disponibles, se muestra mensaje “sin opciones disponibles”. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario |
| **Comentarios** | Priorizar rutas sostenibles y optimizadas en tiempo. |
