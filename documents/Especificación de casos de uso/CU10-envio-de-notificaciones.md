# Caso de Uso N° 10 — Envío de notificaciones

> Requisito asociado: **RF10** · SRS EcoRuteando, sección 4.2

**Descripción:** Permite al administrador enviar mensajes informativos o ecológicos a usuarios o grupos de usuarios a través de múltiples canales (in-app, correo, push).

| Campo | Descripción |
|---|---|
| **Nombre** | Envío de notificaciones |
| **Prioridad** | Media |
| **Precondición** | El administrador debe haber iniciado sesión con rol autorizado. |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El administrador accede al módulo de notificaciones. | El sistema muestra el formulario de envío con plantillas disponibles y selector de destinatarios. |
| 2 | El administrador redacta el mensaje y selecciona destinatarios (todos, por rol o individual). | El sistema valida que el mensaje no esté vacío, que los destinatarios existan y prepara el contenido con variables (ej. `{{nombre}}`). |
| 3 | El administrador confirma el envío. | El sistema envía las notificaciones por los canales configurados, registra el envío en `notificaciones` y muestra “Notificaciones enviadas correctamente”. |

## Postcondición

Las notificaciones quedan registradas en la base de datos y son entregadas a los usuarios por los canales correspondientes.

## Excepciones (flujo alterno)

| Paso | Condición | Respuesta del sistema |
|:---:|---|---|
| E1 | El mensaje está vacío o supera el límite de caracteres. | Bloquea el envío y muestra “El mensaje no puede estar vacío / excede el límite”. |
| E2 | No se seleccionó ningún destinatario o destinatario inexistente. | Muestra “Seleccione al menos un destinatario válido”. |
| E3 | Permisos insuficientes (usuario no es administrador). | Deniega el acceso con “No tiene permisos para enviar notificaciones” (403). |
| E4 | Error en el envío (SMTP, push service o DB timeout). | Muestra “Fallo en el envío de notificación. Intente más tarde” y registra el error para reintento. |
| E5 | Sesión expirada durante la redacción. | Guarda borrador local, redirige a login y notifica “Sesión expirada”. |

| Campo | Descripción |
|---|---|
| **Actores** | Administrador, Usuario (receptor) |
| **Comentarios** | Usar este módulo para alertas ecológicas o avisos del sistema. Trazabilidad: RF10 → CU10. |

