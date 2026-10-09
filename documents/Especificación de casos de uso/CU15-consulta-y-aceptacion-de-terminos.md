# Caso de Uso N° 15 — Consulta y aceptación de términos

> Requisito asociado: **RF18** · SRS EcoRuteando, sección 4.2

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
| 2 | El usuario pulsa el enlace “Términos y Condiciones” | El sistema despliega el documento completo en una ventana modal (RF18.1). |
| 3 | El usuario pulsa “Acepto los términos” | El sistema marca la casilla y habilita el botón “Registrarse”. |

## Postcondición

La aceptación queda registrada con timestamp y el registro puede continuar.

## Excepciones (flujo alterno)

| Paso | Condición | Respuesta del sistema |
|:---:|---|---|
| E1 | El usuario no acepta los términos. | Mantiene deshabilitado el botón “Registrarse” (RF18.2) y muestra tooltip “Debe aceptar los términos”. |
| E2 | El documento de términos no carga (error de red/servidor). | Muestra “No fue posible cargar los términos. Intente más tarde” con opción de reintento. |
| E3 | El usuario cierra la modal sin aceptar. | Conserva el estado previo (casilla desmarcada) y no habilita el registro. |
| E4 | Timeout o error de validación en el registro posterior. | No persiste la aceptación hasta completar el registro exitosamente. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario |
| **Comentarios** | La aceptación es obligatoria: el botón de registro permanece inactivo hasta marcar la casilla. Trazabilidad: RF18 → CU15 (RF18.1 Consulta, RF18.2 Aceptación obligatoria). |
