# Caso de Uso N° 18 — Alertas climáticas

> Requisito asociado: **RF19** · SRS EcoRuteando, sección 4.2

**Descripción:** Informa al usuario las condiciones climáticas del trayecto y sugiere rutas alternativas más seguras.

| Campo | Descripción |
|---|---|
| **Nombre** | Alertas climáticas |
| **Prioridad** | Media |
| **Precondición** | Conexión a internet y disponibilidad del servicio meteorológico. |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El usuario consulta una ruta | El sistema se conecta al servicio climático (RF19.1). |
| 2 | — | El sistema evalúa las condiciones climáticas del trayecto. |
| 3 | — | El sistema muestra alertas de lluvia, tormentas o altas temperaturas si aplican. |
| 4 | — | El sistema sugiere rutas alternativas ante condiciones adversas (RF19.2). |

## Postcondición

Las alertas y sugerencias quedan mostradas junto a la ruta consultada.

## Excepciones (flujo alterno)

| Paso | Acción |
|:---:|---|
| 1 | Si falla la conexión con el servicio del clima, el sistema omite las alertas sin interrumpir la consulta de rutas. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario |
| **Comentarios** | Las alertas nunca deben bloquear la consulta básica de rutas. |
