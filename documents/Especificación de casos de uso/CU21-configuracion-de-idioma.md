# Caso de Uso N° 21 — Configuración de idioma

> Requisito asociado: **RF34** · SRS EcoRuteando, sección 4.2

**Descripción:** Permite cambiar el idioma de la interfaz entre español, inglés, portugués y francés, guardando la preferencia del usuario.

| Campo | Descripción |
|---|---|
| **Nombre** | Configuración de idioma |
| **Prioridad** | Media |
| **Precondición** | Acceso a la pantalla de configuración (usuario registrado o invitado). |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El usuario accede a la configuración | El sistema lista los idiomas disponibles: español, inglés, portugués y francés (RF34.1). |
| 2 | El usuario selecciona un idioma | El sistema aplica la traducción automática a toda la interfaz (RF34.2). |
| 3 | — | El sistema guarda la preferencia para las próximas sesiones (RF34.3). |

## Postcondición

La interfaz se muestra en el idioma elegido y la preferencia persiste tras cerrar sesión.

## Excepciones (flujo alterno)

| Paso | Acción |
|:---:|---|
| 1 | Si un idioma no está disponible temporalmente, el sistema conserva el idioma actual y lo informa. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario |
| **Comentarios** | Traducción gestionada con i18n (react-i18next) en el frontend. |
