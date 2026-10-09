# Caso de Uso N° 14 — Modo invitado

> Requisito asociado: **RF7** · SRS EcoRuteando, sección 4.2

**Descripción:** Permite consultar rutas ecológicas sin necesidad de tener una cuenta registrada, con funcionalidades limitadas.

| Campo | Descripción |
|---|---|
| **Nombre** | Modo invitado |
| **Prioridad** | Baja |
| **Precondición** | Ninguna. No requiere cuenta ni inicio de sesión. |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El usuario abre la aplicación sin iniciar sesión | El sistema ofrece el modo invitado. |
| 2 | El usuario selecciona “Continuar como invitado” | El sistema otorga acceso con funciones limitadas (RF7.2). |
| 3 | El usuario consulta rutas en el mapa | El sistema permite visualizar rutas ecológicas normalmente. |
| 4 | El usuario intenta usar funciones exclusivas (favoritos, historial) | El sistema solicita registrarse o iniciar sesión. |

## Postcondición

El usuario navega en modo limitado sin que se almacenen datos personales (RF7.1).

## Excepciones (flujo alterno)

| Paso | Acción |
|:---:|---|
| 1 | Al intentar una función exclusiva, el sistema redirige al formulario de registro. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario (invitado) |
| **Comentarios** | Las acciones protegidas deben redirigir siempre al registro, nunca fallar silenciosamente. |
