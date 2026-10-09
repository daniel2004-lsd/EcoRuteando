# Caso de Uso N° 16 — Estimación de tiempo y CO₂

> Requisito asociado: **RF11** · SRS EcoRuteando, sección 4.2

**Descripción:** Calcula el tiempo estimado de recorrido y el CO₂ ahorrado para modos vehículo y a pie (caminando). Bus y bicicleta fuera de alcance (decisión 2026-09).

| Campo | Descripción |
|---|---|
| **Nombre** | Estimación de tiempo y CO₂ |
| **Prioridad** | Alta |
| **Precondición** | El usuario debe haber definido origen y destino del trayecto. |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El usuario define origen y destino | El sistema obtiene las rutas disponibles (vehículo y a pie) mediante la API de mapas. |
| 2 | — | El sistema calcula el tiempo estimado según el modo (vehículo / a pie) (RF11.1). |
| 3 | — | El sistema estima el CO₂ ahorrado para modo a pie frente a vehículo particular (RF11.2). |
| 4 | — | El sistema muestra los resultados junto a cada ruta sugerida (RF11.3). |

## Postcondición

Los indicadores de tiempo y CO₂ quedan visibles asociados a cada ruta consultada (solo vehículo y a pie).

## Excepciones (flujo alterno)

| Paso | Condición | Respuesta del sistema |
|:---:|---|---|
| E1 | Si faltan datos de la API para alguno de los dos modos. | Presenta la estimación disponible con carácter aproximado y advierte “Datos incompletos”. |
| E2 | Fallo de conexión con la API de mapas. | Muestra “Error al calcular la ruta” y ofrece reintentar o usar caché. |
| E3 | Origen/destino inválidos o sin cobertura para modo a pie. | Solicita corregir direcciones y sugiere alternativa vehicular. |
| E4 | Timeout de BD al persistir estimación. | Registra el fallo y muestra “No fue posible guardar la estimación”. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario |
| **Comentarios** | Alcance reducido: solo vehículo y a pie (bus/bici descartados). El cálculo depende de fuentes externas (restricción 2.3.2 SRS). Trazabilidad: RF11 → CU16. |

