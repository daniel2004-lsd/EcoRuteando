# Caso de Uso N° 10 — Envió de notificaciones

> Requisito asociado: **RF10** · SRS EcoRuteando, sección 4.2

**Descripción:** Descripción: Permite al administrador enviar mensajes informativos o ecológicos a los usuarios.

| Campo | Descripción |
|---|---|
| **Nombre** | Envió de notificaciones |
| **Prioridad** | Media |
| **Precondición** | El administrador debe haber iniciado sesión. |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El administrador accede el modulo de notificaciones | El sistema muestra los formularios de envió |
| 2 | el administrador redacta el mensaje y selecciona destinatarios | El sistema prepara las notificaciones |
| 3 | — | El sistema envía las notificaciones y registra él envió |

## Postcondición

Las notificaciones son entregadas correctamente a los usuarios.

## Excepciones (flujo alterno)

| Paso | Acción |
|:---:|---|
| 1 | Si ocurre un error en el envío, se muestra mensaje “fallo en el envío de notificación”. |
| 2 | Si el mensaje está vacío, el sistema no permite enviarlo |

| Campo | Descripción |
|---|---|
| **Actores** | Administrador, usuario |
| **Comentarios** | Usar este módulo para alertas ecológicas o avisos del sistema. |
