# Caso de Uso N° 16 — Estimación de tiempo y CO₂

> Requisito asociado: **RF11** · SRS EcoRuteando, sección 4.2

**Descripción:** Calcula el tiempo estimado de recorrido y el CO₂ ahorrado al elegir opciones de movilidad sostenible.

| Campo | Descripción |
|---|---|
| **Nombre** | Estimación de tiempo y CO₂ |
| **Prioridad** | Alta |
| **Precondición** | El usuario debe haber definido origen y destino del trayecto. |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El usuario define origen y destino | El sistema obtiene las rutas disponibles mediante la API de mapas. |
| 2 | — | El sistema calcula el tiempo estimado según el modo de transporte (RF11.1). |
| 3 | — | El sistema estima el CO₂ ahorrado frente al vehículo particular (RF11.2). |
| 4 | — | El sistema muestra los resultados junto a cada ruta sugerida (RF11.3). |

## Postcondición

Los indicadores de tiempo y CO₂ quedan visibles asociados a cada ruta consultada.

## Excepciones (flujo alterno)

| Paso | Acción |
|:---:|---|
| 1 | Si faltan datos públicos de transporte, el sistema presenta la estimación con carácter aproximado. |
| 2 | Si falla la conexión con la API de mapas, el sistema muestra “error al calcular la ruta”. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario |
| **Comentarios** | El cálculo depende de la calidad de fuentes externas (restricción 2.3.2 del SRS). |
