# Caso de Uso N° 8 — Portal de estadísticas

> Requisito asociado: **RF8** · SRS EcoRuteando, sección 4.2

**Descripción:** Permite al administrador visualizar estadísticas del sistema (rutas consultadas, usuarios activos, CO₂ ahorrado).

| Campo | Descripción |
|---|---|
| **Nombre** | Portal de estadísticas |
| **Prioridad** | Alta |
| **Precondición** | El administrador debe haber iniciado sesión. |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El administrador accede al módulo de estadísticas. | El sistema obtiene los datos de la base de datos |
| 2 | El administrador selecciona filtro o rango de fechas | El sistema genera las gráficas correspondientes. |
| 3 | — | El sistema muestra estadísticas actualizadas. |

## Postcondición

Se muestran las métricas actualizadas

## Excepciones (flujo alterno)

| Paso | Acción |
|:---:|---|
| 1 | Si no hay datos disponibles, el sistema muestra mensaje “sin información”. |
| 2 | Si ocurre un error de conexión se muestra un mensaje “error al cargar estadísticas” |

| Campo | Descripción |
|---|---|
| **Actores** | Administrador |
| **Comentarios** | Generar gráficos con Chart.js, Recharts.js o Power BI |
