# Caso de Uso N° 8 — Portal de estadísticas

> Requisito asociado: **RF8** · SRS EcoRuteando, sección 4.2

**Descripción:** Permite al administrador visualizar estadísticas del sistema (rutas consultadas, usuarios activos, CO₂ ahorrado) para modos vehículo y a pie.

| Campo | Descripción |
|---|---|
| **Nombre** | Portal de estadísticas |
| **Prioridad** | Alta |
| **Precondición** | El administrador debe haber iniciado sesión con rol autorizado. |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El administrador accede al módulo de estadísticas. | El sistema obtiene los datos de la base de datos (cache_apis / estadisticas_diarias). |
| 2 | El administrador selecciona filtro o rango de fechas. | El sistema genera las gráficas correspondientes (vehículo vs a pie). |
| 3 | — | El sistema muestra estadísticas actualizadas. |

## Postcondición

Se muestran las métricas actualizadas.

## Excepciones (flujo alterno)

| Paso | Condición | Respuesta del sistema |
|:---:|---|---|
| E1 | No hay datos disponibles para el rango. | Muestra “Sin información para el período seleccionado”. |
| E2 | Permisos insuficientes (no es administrador). | Deniega acceso con 403 “No autorizado”. |
| E3 | Error de conexión/BD al cargar estadísticas. | Muestra “Error al cargar estadísticas” y registra el fallo. |
| E4 | Rango de fechas inválido (inicio > fin). | Muestra “Rango de fechas no válido”. |
| E5 | Timeout al generar gráficas con volumen alto. | Muestra indicador de carga y sugiere filtrar por rango menor. |

| Campo | Descripción |
|---|---|
| **Actores** | Administrador |
| **Comentarios** | Gráficos con Recharts/Power BI. Trazabilidad: RF8 → CU08. |

