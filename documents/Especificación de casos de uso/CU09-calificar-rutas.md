# Caso de Uso N° 9 — Calificar rutas

> Requisito asociado: **RF9** · SRS EcoRuteando, sección 4.2

**Descripción:** Permite al usuario calificar las rutas utilizadas según su experiencia.

| Campo | Descripción |
|---|---|
| **Nombre** | Calificar rutas |
| **Prioridad** | Media |
| **Precondición** | El usuario debe haber finalizado una ruta. |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | el usuario accede al historial de rutas | El sistema muestra las rutas completas |
| 2 | El usuario selecciona una ruta | El sistema habilita la opción de calificación |
| 3 | El usuario ingresa la puntuación y comentario. | El sistema guarda la calificación |

## Postcondición

La calificación se almacena en la base de datos.

## Excepciones (flujo alterno)

| Paso | Acción |
|:---:|---|
| 1 | Si la ruta no ha sido completada, el sistema no permite calificar. |
| 2 | Si falta información, se muestra mensaje “debe completar todos los campos”. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario |
| **Comentarios** | Calificación de 1 a 5 estrellas según satisfacción. |
