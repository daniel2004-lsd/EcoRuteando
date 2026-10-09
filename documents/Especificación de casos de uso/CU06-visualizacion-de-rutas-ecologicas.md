# Caso de Uso N° 6 — Visualización de rutas ecológicas

> Requisito asociado: **RF6** · SRS EcoRuteando, sección 4.2

**Descripción:** Permite al usuario consultar y visualizar rutas ecológicas en modos vehículo y a pie (caminando) — bus y bicicleta fuera de alcance según decisión 2026-09 — con detalles de tiempo, distancia y CO₂ ahorrado.

| Campo | Descripción |
|---|---|
| **Nombre** | Visualización de rutas ecológicas |
| **Prioridad** | Alta |
| **Precondición** | El usuario debe ingresar punto de partida y destino válidos. |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El usuario ingresa punto de partida y destino. | El sistema valida direcciones contra el servicio de mapas y calcula rutas disponibles. |
| 2 | — | El sistema muestra el mapa interactivo con las rutas ecológicas diferenciadas. |
| 3 | El usuario selecciona una ruta. | El sistema muestra detalles: tiempo estimado, distancia, CO₂ ahorrado y puntos de interés cercanos. |

## Postcondición

La ruta seleccionada queda visible en el mapa interactivo con sus métricas asociadas.

## Excepciones (flujo alterno)

| Paso | Condición | Respuesta del sistema |
|:---:|---|---|
| E1 | No hay rutas disponibles para el par origen/destino. | Muestra “Sin opciones disponibles para este trayecto” y sugiere ajustar los puntos. |
| E2 | Direcciones inválidas o no encontradas por el servicio de mapas. | Muestra “No se encontró la dirección” y solicita corregir. |
| E3 | Fallo del servicio externo de mapas (timeout, cuota excedida). | Muestra “Servicio de mapas temporalmente no disponible” y ofrece usar caché o reintentar. |
| E4 | Error de geocodificación o datos PostGIS inconsistentes. | Muestra “Error al calcular la ruta” y registra el fallo sin exponer detalles internos. |
| E5 | Sesión expirada si requiere autenticación para favoritos. | Solicita iniciar sesión sin perder el origen/destino ingresado. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario |
| **Comentarios** | Priorizar rutas sostenibles y optimizadas en tiempo. Alcance actual: solo vehículo y a pie. Trazabilidad: RF6 / RF10 / RF11 → CU06. |

