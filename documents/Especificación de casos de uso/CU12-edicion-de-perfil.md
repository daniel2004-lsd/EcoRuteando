# Caso de Uso N° 12 — Edición de perfil

> Requisito asociado: **RF12** · SRS EcoRuteando, sección 4.2

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

Los datos del perfil quedan actualizados con su respectiva fecha de modificación (RF12.3).

## Excepciones (flujo alterno)

| Paso | Condición | Respuesta del sistema |
|:---:|---|---|
| E1 | Contraseña de confirmación incorrecta. | Cancela la edición, muestra “Contraseña incorrecta” y registra intento fallido. |
| E2 | El nuevo correo ya está registrado por otro usuario. | Muestra “Correo no disponible, ya está en uso” y mantiene datos previos. |
| E3 | Sesión expirada o token inválido durante la edición. | Redirige a login con “Sesión expirada” y descarta cambios no guardados. |
| E4 | Fallo de validación (formato correo inválido, nombre vacío). | Muestra error de campo específico y bloquea el guardado. |
| E5 | Error de concurrencia o timeout de BD. | Muestra “No fue posible guardar. Intente más tarde” y registra el fallo (Serilog). |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario |
| **Comentarios** | Asociado a RF12 (RF12.1 Editar datos, RF12.2 Confirmar identidad, RF12.3 Fecha de actualización). Trazabilidad: RF12 → CU12. |
