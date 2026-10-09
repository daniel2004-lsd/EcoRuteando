# Caso de Uso N° 5 — Inicio sesión

> Requisito asociado: **RF5** · SRS EcoRuteando, sección 4.2

**Descripción:** Permite al usuario ingresar al sistema mediante su correo y contraseña.

| Campo | Descripción |
|---|---|
| **Nombre** | Inicio sesión |
| **Prioridad** | Alta |
| **Precondición** | El usuario debe de estar registrado previamente |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El usuario selecciona “iniciar sesión” | El sistema solicita correo y contraseña |
| 2 | el usuario ingresa sus datos | El sistema valida las credenciales |
| 3 | — | El sistema permite acceso al panel principal |

## Postcondición

El usuario accede correctamente al sistema

## Excepciones (flujo alterno)

| Paso | Acción |
|:---:|---|
| 1 | Si las credenciales son incorrectas, el sistema muestra mensaje de error. |
| 2 | Si el usuario no está registrado, el sistema sugiere registrarse. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario |
| **Comentarios** | Asegurar autenticación segura y cifrado de contraseñas. |
