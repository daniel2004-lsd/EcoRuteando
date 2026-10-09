# Caso de Uso N° 13 — Eliminación de cuenta

> Requisito asociado: **RF13** · SRS EcoRuteando, sección 4.2

**Descripción:** Permite al usuario solicitar la eliminación permanente de su cuenta y de sus datos personales del sistema.

| Campo | Descripción |
|---|---|
| **Nombre** | Eliminación de cuenta |
| **Prioridad** | Media |
| **Precondición** | El usuario debe tener sesión activa. |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El usuario accede a la configuración de su cuenta | El sistema muestra la opción “Eliminar cuenta”. |
| 2 | El usuario selecciona eliminar cuenta | El sistema advierte las consecuencias y solicita confirmación. |
| 3 | El usuario confirma ingresando su contraseña | El sistema valida sus credenciales. |
| 4 | — | El sistema elimina los datos personales y desactiva la cuenta. |
| 5 | — | El sistema cierra la sesión y muestra la confirmación de eliminación. |

## Postcondición

La cuenta queda eliminada/desactivada y sus datos personales borrados (RF13.2, RF13.3).

## Excepciones (flujo alterno)

| Paso | Condición | Respuesta del sistema |
|:---:|---|---|
| E1 | Contraseña de confirmación incorrecta. | Cancela la eliminación y muestra “Contraseña incorrecta”. |
| E2 | Sesión expirada o permisos insuficientes. | Deniega la operación con “Sesión expirada / permisos insuficientes” (401/403). |
| E3 | Fallo de conexión o timeout de BD durante el borrado. | Muestra “No fue posible eliminar la cuenta. Intente más tarde” y revierte la transacción. |
| E4 | Cuenta ya eliminada o en proceso de eliminación concurrente. | Informa “La cuenta ya se encuentra en proceso de eliminación”. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario, Administrador |
| **Comentarios** | El administrador puede reactivar cuentas desde el módulo de gestión de usuarios (RF21.3). Trazabilidad: RF13 → CU13 (RF13.1 Solicitar eliminación, RF13.2 Borrado de datos, RF13.3 Cierre de sesión). |
