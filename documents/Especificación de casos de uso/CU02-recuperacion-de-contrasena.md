# Caso de Uso N° 2 — Recuperación de contraseña

> Requisito asociado: **RF2** · SRS EcoRuteando, sección 4.2

**Descripción:** Le permite al usuario poder recuperar su contraseña si la a olvidado.

| Campo | Descripción |
|---|---|
| **Nombre** | Recuperación de contraseña |
| **Prioridad** | Media |
| **Precondición** | El usuario debe tener una cuenta registrada en el sistema. |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El usuario selecciona la opción “Recuperar contraseña” | El sistema solicita el correo electrónico asociado a la cuenta. |
| 2 | El usuario ingresa su correo | El sistema comprobará si los datos introducidos son correctos. |
| 4 | Verifica que la contraseña coincida con el usuario en la base de datos | El sistema enviará un código de autenticación al correo registrado por el usuario. |
| 5 | El usuario ingresa el enlace e ingresa una nueva contraseña | El sistema actualiza la contraseña en la base de datos y confirma el cambio. |

## Postcondición

La cuenta queda registrada y habilitada para inicio de sección

## Excepciones (flujo alterno)

| Paso | Acción |
|:---:|---|
| 1 | Si los datos ingresados son incompletos o inválidos. |
| 2 | El sistema mostrará error en el sistema. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario |
| **Comentarios** | Validar que el correo no exista previamente en la base de datos. |
