# Caso de Uso N° 12 — Edición de perfil

> Requisito asociado: **RF5** · SRS EcoRuteando, sección 4.2

**Descripción:** Permite al usuario modificar sus datos personales (nombre, correo electrónico) confirmando su identidad antes de aplicar los cambios.

| Campo | Descripción |
|---|---|
| **Nombre** | Edición de perfil |
| **Prioridad** | Media |
| **Precondición** | El usuario debe tener sesión activa. |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El usuario accede a la sección “Mi perfil” | El sistema muestra los datos actuales del usuario. |
| 2 | El usuario selecciona “Editar perfil” | El sistema habilita los campos editables. |
| 3 | El usuario modifica los datos y guarda | El sistema solicita confirmar identidad con la contraseña actual. |
| 4 | El usuario ingresa su contraseña | El sistema valida la identidad y guarda los nuevos datos. |
| 5 | — | El sistema registra la fecha de actualización y confirma “Datos actualizados”. |

## Postcondición

Los datos del perfil quedan actualizados con su respectiva fecha de modificación (RF5.3).

## Excepciones (flujo alterno)

| Paso | Acción |
|:---:|---|
| 1 | Si la contraseña de confirmación es incorrecta, el sistema cancela la edición y muestra un error. |
| 2 | Si el nuevo correo ya está registrado, el sistema muestra “correo no disponible”. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario |
| **Comentarios** | Asociado a RF5 (RF5.1 Editar datos, RF5.2 Confirmar identidad, RF5.3 Fecha de actualización). |
