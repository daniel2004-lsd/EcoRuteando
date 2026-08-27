# Caso de Uso N° 19 — Exportación de historial

> Requisito asociado: **RF29** · SRS EcoRuteando, sección 4.2

**Descripción:** Permite al usuario exportar su historial de trayectos dentro de un rango de fechas en formato PDF o Excel.

| Campo | Descripción |
|---|---|
| **Nombre** | Exportación de historial |
| **Prioridad** | Media |
| **Precondición** | Sesión activa y registros previos en el historial de trayectos. |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El usuario accede a su historial | El sistema muestra los trayectos registrados. |
| 2 | El usuario selecciona un rango de fechas | El sistema filtra los trayectos del período (RF29.2). |
| 3 | El usuario pulsa “Exportar” y elige PDF o Excel | El sistema genera el archivo con los datos filtrados. |
| 4 | — | El sistema descarga el archivo al dispositivo del usuario. |

## Postcondición

El archivo con el historial queda guardado en el dispositivo del usuario (RF29.1).

## Excepciones (flujo alterno)

| Paso | Acción |
|:---:|---|
| 1 | Si no hay trayectos en el rango elegido, el sistema muestra “sin información disponible”. |
| 2 | Si ocurre un error al generar el archivo, el sistema informa “error al exportar”. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario |
| **Comentarios** | Formatos soportados: PDF y Excel (ver también RF22.2). |
