# Caso de Uso N° 5 — Inicio de sesión

> Requisito asociado: **RF5** · SRS EcoRuteando, sección 4.2

**Descripción:** Permite al usuario autenticarse en el sistema mediante correo y contraseña para acceder a funcionalidades protegidas.

| Campo | Descripción |
|---|---|
| **Nombre** | Inicio de sesión |
| **Prioridad** | Alta |
| **Precondición** | El usuario debe estar registrado y con correo verificado. |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El usuario selecciona “Iniciar sesión”. | El sistema muestra el formulario de correo y contraseña. |
| 2 | El usuario ingresa sus credenciales y confirma. | El sistema valida formato, verifica hash BCrypt y estado de la cuenta. |
| 3 | — | El sistema genera tokens JWT (access + refresh), registra la sesión y permite el acceso al panel principal. |

## Postcondición

El usuario queda autenticado con sesión activa; tokens JWT emitidos y último acceso actualizado.

## Excepciones (flujo alterno)

| Paso | Condición | Respuesta del sistema |
|:---:|---|---|
| E1 | Credenciales incorrectas (correo o contraseña no coinciden). | Muestra “Credenciales incorrectas” sin revelar qué campo falló. |
| E2 | Usuario no registrado o correo no verificado. | Muestra “Cuenta no encontrada / verifique su correo” y sugiere registro o reenvío de verificación. |
| E3 | Cuenta bloqueada por 5 intentos fallidos o desactivada. | Muestra “Cuenta bloqueada hasta HH:MM. Use recuperación de contraseña (CU02)”. |
| E4 | Fallo de conexión con BD o servicio de autenticación (timeout). | Muestra “No fue posible iniciar sesión. Intente más tarde” y registra el error. |
| E5 | Validación de formato fallida (correo inválido, campos vacíos). | Muestra error inline por campo y bloquea el envío. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario |
| **Comentarios** | Autenticación segura con BCrypt + JWT + revocación de sesiones (RF5). Trazabilidad: RF5 → CU05. |

