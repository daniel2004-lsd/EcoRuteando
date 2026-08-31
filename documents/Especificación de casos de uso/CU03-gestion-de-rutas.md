# Caso de Uso N° 3 — Gestión de rutas

> Requisito asociado: **RF3** · SRS EcoRuteando, sección 4.2

**Descripción:** Permite al usuario ingresar, modificar o eliminar rutas de viajes dentro de la aplicación

| Campo | Descripción |
|---|---|
| **Nombre** | Gestión de rutas |
| **Prioridad** | Alta |
| **Precondición** | El usuario debe haber iniciado sesión. |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El usuario accede al modulo de rutas | El sistema muestra las rutas registradas |
| 2 | El usuario selecciona una acción (agregar, modificar o eliminar). | El sistema muestra los formularios correspondientes. |
| 3 | El usuario completa la información requerida. | El sistema guarda o actualiza la base de datos |
| 4 | — | El sistema confirma la acción realizada |

## Postcondición

Las rutas quedan actualizadas según la acción realizada.

## Excepciones (flujo alterno)

| Paso | Acción |
|:---:|---|
| 1 | si no existen las rutas actualizadas el sistema muestra un mensaje ‘sin información disponible’ |
| 2 | Si los datos ingresados son inválidos, el sistema muestra mensaje de error. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario |
| **Comentarios** | Verificar que no existan rutas duplicadas. |
