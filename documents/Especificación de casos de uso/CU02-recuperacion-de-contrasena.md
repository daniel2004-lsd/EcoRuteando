# Caso de Uso N° 2 — Recuperación de contraseña

> Requisito asociado: **RF2** · SRS EcoRuteando, sección 4.2

**Descripción:** Permite al usuario recuperar el acceso a su cuenta cuando ha olvidado su contraseña, mediante la verificación de su correo electrónico y el establecimiento de una nueva contraseña.

| Campo | Descripción |
|---|---|
| **Nombre** | Recuperación de contraseña |
| **Prioridad** | Media |
| **Precondición** | El usuario debe tener una cuenta registrada y verificada en el sistema. |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El usuario selecciona la opción “Recuperar contraseña” en la pantalla de inicio de sesión. | El sistema muestra el formulario para ingresar el correo electrónico asociado a la cuenta. |
| 2 | El usuario ingresa su correo electrónico y confirma el envío. | El sistema valida el formato del correo y verifica que exista en la base de datos. |
| 3 | — | El sistema genera un código/enlace temporal de recuperación y lo envía al correo registrado vía SMTP (MailKit :587). |
| 4 | El usuario abre el enlace recibido y accede al formulario de nueva contraseña. | El sistema valida que el token/código no haya expirado y habilita el formulario. |
| 5 | El usuario ingresa y confirma la nueva contraseña. | El sistema valida fortaleza (≥8 caracteres), actualiza el hash BCrypt en la BD, invalida sesiones previas y confirma el cambio con mensaje “Contraseña actualizada correctamente”. |

## Postcondición

La contraseña queda actualizada con hash BCrypt en la base de datos; el usuario puede iniciar sesión con la nueva credencial y recibe confirmación por correo.

## Excepciones (flujo alterno)

| Paso | Condición | Respuesta del sistema |
|:---:|---|---|
| E1 | El correo ingresado no existe en la base de datos. | Muestra mensaje “No existe una cuenta asociada a ese correo” sin revelar enumeración de usuarios y sugiere registro. |
| E2 | El formato del correo es inválido o campos incompletos. | Muestra error de validación “Ingrese un correo válido” y mantiene el formulario. |
| E3 | El código/enlace ha expirado o es inválido. | Muestra “El enlace ha expirado” y ofrece reenviar un nuevo código. |
| E4 | La nueva contraseña no cumple políticas (longitud, coincidencia). | Muestra “Las contraseñas no coinciden / debe tener al menos 8 caracteres” y no actualiza la BD. |
| E5 | Fallo de conexión con el servicio de correo o base de datos (timeout SMTP/DB). | Muestra “No fue posible enviar el correo. Intente más tarde” y registra el error en logs (Serilog) sin exponer detalles internos. |
| E6 | Sesión expirada durante el flujo o concurrencia (solicitud duplicada). | Cancela la operación, redirige a inicio de sesión y notifica “Sesión expirada, inicie nuevamente el proceso”. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario |
| **Comentarios** | Validar que el correo **exista** previamente en la base de datos (RF2.1). El token expira en 15 minutos. Trazabilidad: RF2 → CU02. |

