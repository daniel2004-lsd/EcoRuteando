# Caso de Uso N° 20 — Compartir recorridos

> Requisito asociado: **RF32** · SRS EcoRuteando, sección 4.2

**Descripción:** Permite al usuario compartir un recorrido (vehículo o a pie) en redes sociales seleccionando qué información hacer pública.

| Campo | Descripción |
|---|---|
| **Nombre** | Compartir recorridos |
| **Prioridad** | Baja |
| **Precondición** | Sesión activa y al menos un recorrido finalizado o guardado. |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El usuario selecciona un recorrido de su historial | El sistema muestra la opción “Compartir” (RF32.1). |
| 2 | El usuario elige los datos a incluir | El sistema genera una vista previa protegiendo los datos privados (RF32.5). |
| 3 | El usuario selecciona la red social o enlace | El sistema prepara el contenido para la red elegida (RF32.3). |
| 4 | El usuario confirma la publicación | El sistema comparte el recorrido y confirma el resultado (RF32.4). |

## Postcondición

El recorrido queda compartido únicamente con los datos autorizados por el usuario.

## Excepciones (flujo alterno)

| Paso | Condición | Respuesta del sistema |
|:---:|---|---|
| E1 | El usuario intenta incluir datos privados. | Los oculta automáticamente antes de publicar (RF32.5). |
| E2 | Red social no disponible o API falla. | Sugiere otra red o copiar el enlace. |
| E3 | Permisos de la red denegados por el usuario. | Muestra “Autorización requerida” y cancela. |
| E4 | Sesión expirada durante el flujo. | Guarda borrador y redirige a login. |
| E5 | Contenido excede límites de la plataforma. | Trunca y avisa “Contenido ajustado a límites”. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario |
| **Comentarios** | Protección de datos privados prioritaria (RF32.5). Trazabilidad: RF32 → CU20. |

