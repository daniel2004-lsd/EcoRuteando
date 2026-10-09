# Caso de Uso N° 7 — Reporte ciudadano de obstáculos

> Requisito asociado: **RF7** · SRS EcoRuteando, sección 4.2

**Descripción:** Permite al usuario reportar obstáculos o problemas en las rutas ecológicas.

| Campo | Descripción |
|---|---|
| **Nombre** | Reporte ciudadano de obstáculos |
| **Prioridad** | Media |
| **Precondición** | El usuario debe tener sesión activa. |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El usuario selecciona “Reportar obstáculo”. | El sistema muestra el formulario de reporte. |
| 2 | El usuario ingresa tipo de obstáculo, ubicación y descripción. | El sistema valida los datos ingresados. |
| 3 | — | El sistema guarda el reporte y notifica al administrador. |

## Postcondición

El reporte queda almacenado y en espera de validación.

## Excepciones (flujo alterno)

| Paso | Acción |
|:---:|---|
| 1 | Si la información está incompleta, el sistema muestra mensaje de error. |
| 2 | Si no se puede conectar al servidor, el sistema informa que intente más         tarde. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario, Administrador |
| **Comentarios** | Validar ubicación mediante GPS. |
