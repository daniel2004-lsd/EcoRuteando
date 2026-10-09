# Caso de Uso N° 18 — Alertas climáticas

> Requisito asociado: **RF19** · SRS EcoRuteando, sección 4.2

**Descripción:** Informa al usuario las condiciones climáticas del trayecto (vehículo/a pie) y sugiere rutas alternativas más seguras.

| Campo | Descripción |
|---|---|
| **Nombre** | Alertas climáticas |
| **Prioridad** | Media |
| **Precondición** | Conexión a internet y disponibilidad del servicio meteorológico. |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El usuario consulta una ruta (vehículo/a pie) | El sistema se conecta al servicio climático (RF19.1). |
| 2 | — | El sistema evalúa las condiciones climáticas del trayecto. |
| 3 | — | El sistema muestra alertas de lluvia, tormentas o altas temperaturas si aplican. |
| 4 | — | El sistema sugiere rutas alternativas ante condiciones adversas (RF19.2). |

## Postcondición

Las alertas y sugerencias quedan mostradas junto a la ruta consultada.

## Excepciones (flujo alterno)

| Paso | Condición | Respuesta del sistema |
|:---:|---|---|
| E1 | Fallo de conexión con servicio del clima. | Omite las alertas sin bloquear la consulta de rutas (degradación elegante). |
| E2 | Servicio climático responde con datos vacíos/erróneos. | Muestra “Información climática no disponible”. |
| E3 | Timeout o cuota excedida del proveedor climático. | Usa último caché y marca como “datos aproximados”. |
| E4 | Error PostGIS al calcular área de impacto. | Registra el fallo y no bloquea el flujo principal. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario |
| **Comentarios** | Las alertas nunca deben bloquear la consulta básica de rutas. Trazabilidad: RF19 → CU18. |

