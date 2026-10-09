# Caso de Uso N° 1 — Registro del usuario

> Requisito asociado: **RF1** · SRS EcoRuteando, sección 4.2

**Descripción:** Permite a un nuevo usuario crear una cuenta en la plataforma mediante un formulario que solicita datos personales, credenciales y aceptación de términos y condiciones.

| Campo | Descripción |
|---|---|
| **Nombre** | Registro del usuario |
| **Prioridad** | Alta |
| **Precondición** | El usuario no debe tener una cuenta previa registrada con el mismo correo. |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El usuario accede a la opción “Registrarse” y abre el formulario. | El sistema muestra el formulario con campos: nombre, apellido, teléfono, correo, contraseña y confirmación, además de la casilla de términos. |
| 2 | El usuario diligencia sus datos personales y credenciales. | El sistema valida en tiempo real formato de correo, longitud de contraseña (≥8 caracteres) y coincidencia de contraseñas. |
| 3 | El usuario acepta los Términos y Condiciones y pulsa “Registrarse”. | El sistema verifica que el correo no exista previamente en la BD y que los términos estén aceptados (RF8.2). |
| 4 | — | El sistema crea el usuario con contraseña cifrada (BCrypt), lo guarda en la BD y genera un código de verificación. |
| 5 | El usuario consulta su correo e ingresa el código de verificación. | El sistema valida el código, marca el correo como verificado y habilita la cuenta para inicio de sesión (CU05). |

## Postcondición

La cuenta queda creada, verificada y habilitada para iniciar sesión. El usuario recibe confirmación por correo y queda registrado en la tabla `usuarios`.

## Excepciones (flujo alterno)

| Paso | Condición | Respuesta del sistema |
|:---:|---|---|
| E1 | Datos incompletos, formato de correo inválido o contraseña débil. | Muestra mensaje “Complete todos los campos correctamente” e indica el campo específico. |
| E2 | El correo ya existe en la base de datos. | Muestra “El correo ya está registrado” y sugiere recuperar contraseña (CU02). |
| E3 | Las contraseñas no coinciden. | Muestra “Las contraseñas no coinciden” y bloquea el envío. |
| E4 | El usuario no acepta los Términos y Condiciones. | Mantiene deshabilitado el botón “Registrarse” (RF8.2). |
| E5 | Fallo de conexión con BD o servicio de correo (SMTP/DB timeout). | Muestra “No fue posible completar el registro. Intente más tarde” y registra el error (Serilog). |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario |
| **Comentarios** | Validar que el correo no exista previamente en la base de datos (RF1.1). Trazabilidad: RF1 → CU01. |

