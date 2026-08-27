# Caso de Uso N° 15 — Consulta y aceptación de términos

> Requisito asociado: **RF8** · SRS EcoRuteando, sección 4.2

**Descripción:** Muestra los Términos y Condiciones del servicio y exige su aceptación obligatoria durante el registro.

| Campo | Descripción |
|---|---|
| **Nombre** | Consulta y aceptación de términos |
| **Prioridad** | Media |
| **Precondición** | El usuario debe encontrarse en el formulario de registro. |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El usuario accede al formulario de registro | El sistema muestra la casilla de aceptación de términos. |
| 2 | El usuario pulsa el enlace “Términos y Condiciones” | El sistema despliega el documento completo en una ventana modal (RF8.1). |
| 3 | El usuario pulsa “Acepto los términos” | El sistema marca la casilla y habilita el botón “Registrarse”. |

## Postcondición

La aceptación queda registrada y el registro puede continuar.

## Excepciones (flujo alterno)

| Paso | Acción |
|:---:|---|
| 1 | Si el usuario no acepta los términos, el sistema mantiene deshabilitada la opción de registro (RF8.2). |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario |
| **Comentarios** | La aceptación es obligatoria: el botón de registro permanece inactivo hasta marcar la casilla. |
