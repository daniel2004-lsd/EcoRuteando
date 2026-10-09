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

| Paso | Condición | Respuesta del sistema |
|:---:|---|---|
| E1 | Idioma no disponible temporalmente. | Conserva el idioma actual e informa “Idioma no disponible”. |
| E2 | Fallo al cargar paquete de traducción (i18n). | Mantiene idioma previo y registra el error. |
| E3 | Preferencia corrupta en localStorage/DB. | Restaura al idioma por defecto (es) y notifica. |
| E4 | Error de persistencia al guardar preferencia. | Muestra “No fue posible guardar la preferencia”. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario |
| **Comentarios** | Traducción con react-i18next. Trazabilidad: RF34 → CU21. |

