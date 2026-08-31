# Caso de Uso N° 13 — Eliminación de cuenta

> Requisito asociado: **RF6** · SRS EcoRuteando, sección 4.2

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

La cuenta queda eliminada/desactivada y sus datos personales borrados (RF6.2, RF6.3).

## Excepciones (flujo alterno)

| Paso | Acción |
|:---:|---|
| 1 | Si la contraseña es incorrecta, el sistema no elimina la cuenta y muestra un error. |
| 2 | Si hay falla de conexión durante el proceso, el sistema informa “intente más tarde”. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario, Administrador |
| **Comentarios** | El administrador puede reactivar cuentas desde el módulo de gestión de usuarios (RF21.3). |
