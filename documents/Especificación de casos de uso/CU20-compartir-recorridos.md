# Caso de Uso N° 20 — Compartir recorridos

> Requisito asociado: **RF32** · SRS EcoRuteando, sección 4.2

**Descripción:** Permite al usuario compartir un recorrido en redes sociales seleccionando qué información hacer pública.

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

| Paso | Acción |
|:---:|---|
| 1 | Si el usuario incluye datos privados, el sistema los oculta automáticamente antes de publicar. |
| 2 | Si la red social no está disponible, el sistema sugiere otra red o copiar el enlace. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario |
| **Comentarios** | La protección de datos personales tiene prioridad sobre el contenido compartido (RF32.5). |
