# Caso de Uso N° 4 — Historial de trayectos

> Requisito asociado: **RF4** · SRS EcoRuteando, sección 4.2

**Descripción:** Permite visualizar los recorridos realizados por el usuario.

| Campo | Descripción |
|---|---|
| **Nombre** | Historial de trayectos |
| **Prioridad** | Media |
| **Precondición** | El usuario debe haber realizado al menos un trayecto. |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El usuario accede al historial de trayectos. | El sistema solicita la información del usuario. |
| 2 | — | El sistema busca los trayectos guardados. |
| 3 | — | El sistema muestra los trayectos realizados con fecha y hora |
| 4 | El usuario selecciona un trayecto | El istema muestra los detalles del recorrido. |

## Postcondición

: El usuario visualiza correctamente su historial de trayectos.

## Excepciones (flujo alterno)

| Paso | Acción |
|:---:|---|
| 1 | Si no existen trayectos registrados, el sistema muestra mensaje “sin información disponible”. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario |
| **Comentarios** | Verificar que no se repitan registros de trayectos. |
