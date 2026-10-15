---

## 17. Seguridad, permisos y manejo de secretos

### 17.1 Superficie de autenticación

| Mecanismo | Implementación | Estado |
|-----------|---------------|--------|
| Email + contraseña | BCrypt (`BCrypt.Net-Next`) | ✅ Implementado |
| JWT access token | `JwtBearer` 9.0, expiración 60 min | ✅ Implementado |
| Refresh token | Rotación opaca, hasheado con BCrypt | ✅ Implementado |
| OAuth Google | `Google__ClientId` / `Google__ClientSecret` | ✅ Implementado |
| OAuth Facebook | `Facebook__AppId` / `Facebook__AppSecret` | ✅ Implementado |
| 2FA TOTP | Secretos cifrados con AES-256-GCM | ✅ Implementado |
| Verificación de email | Tokens hasheados con expiración | ✅ Implementado (parcialmente operativo en Docker — SMTP roto) |
| Recuperación de contraseña | Tokens hasheados con expiración | ✅ Implementado |

### 17.2 Autorización (RBAC + permisos)

**Dos niveles:**

1. **Rol** (`User`, `Admin`, `SuperAdmin`) — asignado en `user_roles`
2. **Permisos granulares** (22 permisos) — asignados a roles vía `role_permissions`

**Permisos disponibles:**

| Categoría | Permisos |
|-----------|----------|
| Rutas | `routes.read`, `routes.write`, `routes.delete` |
| POIs | `pois.read`, `pois.write` |
| Estadísticas | `stats.read` |
| Reportes | `reports.read`, `reports.create`, `reports.vote`, `reports.validate` |
| Roles | `roles.read`, `roles.create`, `roles.update`, `roles.delete` |
| Permisos | `permissions.read`, `permissions.create`, `permissions.update`, `permissions.delete` |
| Asignación | `rolepermissions.read`, `rolepermissions.assign`, `rolepermissions.remove` |
| Sistema | `systemconfig.read` |

### 17.3 Protección de datos sensibles

| Medida | Implementación |
|--------|---------------|
| Contraseñas | BCrypt hash (no reversible) |
| Secretos TOTP | AES-256-GCM (`IEncryptionService`) |
| Refresh tokens | Hash BCrypt (el token real viaja por HTTP, solo se almacena el hash) |
| Tokens de email/reset | Hash almacenado, token real enviado por email |
| Datos de sesión | IP + User Agent en `sessions` |

### 17.4 Hallazgos de seguridad

| # | Hallazgo | Severidad | Descripción |
|---|---------|-----------|-------------|
| 1 | **API keys hardcodeadas en `.env` commiteado** | 🔴 Alta | Claves reales de Google Maps y OAuth presentes en `.env` que fue commiteado al repositorio. **Acción inmediata:** rotar claves, remover del historial de git, `.env` en `.gitignore`. |
| 2 | **SMTP roto en Docker** | 🟠 Media | Configuración SMTP no funciona en el stack Docker — correos de verificación no se envían. Workaround manual: marcar usuarios como `email_verified=true`. |
| 3 | **`SuperAdmin` no sembrado** | 🟡 Baja | El rol existe en código pero no está en los seeds de Liquibase. |
| 4 | **Sin rate limiting** | 🟡 Baja | No hay `[EnableRateLimiting]` en endpoints de login/refresh. |
| 5 | **Serilog sin configurar** | 🟡 Baja | Logging estructurado no activo — dificulta auditoría forense. |
| 6 | **`TestController` expuesto** | 🟡 Baja | Endpoints `/api/test/*` deberían deshabilitarse en producción. |

### 17.5 Buenas prácticas activas (mantener)

- ✅ Secretos solo en `.env` (untracked)
- ✅ `docker-compose.yml` sin secretos (usa `env_file`)
- ✅ Cifrado AES-256-GCM para secretos TOTP
- ✅ BCrypt para contraseñas (no MD5/SHA)
- ✅ Refresh token rotation
- ✅ Permisos granulares por recurso
- ✅ Auditoría de eventos de seguridad (`security_audit`)

---

## 18. Funcionalidades: estado de implementación

### 18.1 Security

| Funcionalidad | Estado | Detalle |
|--------------|--------|---------|
| Registro / Login | ✅ Completo | Email+password, OAuth Google/Facebook |
| JWT + Refresh | ✅ Completo | Rotación de tokens |
| Gestión de usuarios | ✅ Completo | CRUD con permisos |
| Roles y permisos | ✅ Completo | RBAC + permisos granulares |
| 2FA TOTP | ✅ Completo | Habilitar/verificar/deshabilitar |
| Verificación de email | ⚠️ Parcial | Código completo, SMTP roto en Docker |
| Recuperación de contraseña | ⚠️ Parcial | Código completo, SMTP roto en Docker |
| Sesiones (listar/revocar) | ✅ Completo | IP + User Agent |
| Auditoría de seguridad | ✅ Completo | Eventos en `security_audit` |
| Política de seguridad | ✅ Completo | Configurable por admin |

### 18.2 Mobility

| Funcionalidad | Estado | Detalle |
|--------------|--------|---------|
| Planificar ruta (Google Maps) | ✅ Completo | Walking, driving, bicycling, transit |
| Estimación CO₂ / calorías | ✅ Completo | Factores configurables |
| Guardar rutas | ✅ Completo | Con POIs asociados |
| Favoritos | ✅ Completo | Agregar/remover |
| Calificar rutas | ✅ Completo | Score 1-5 + comentario + votos |
| Compartir rutas | ✅ Completo | Token de compartir |
| Reportar obstáculos | ✅ Completo | Foto + GPS + votos + validación |
| Historial de viajes | ✅ Completo | Iniciar/completar/interrumpir |
| Estadísticas personales | ✅ Completo | Vía stored procedure |
| Clima por ruta | ✅ Completo | Google Weather API |
| Búsqueda de POIs | ✅ Completo | Con categorías |

### 18.3 Notifications

| Funcionalidad | Estado | Detalle |
|--------------|--------|---------|
| Notificaciones in-app | ✅ Completo | CRUD + mark as read |
| Conteo de no leídas | ✅ Completo | Badge en UI |
| Registro de device tokens | ✅ Completo | Para push futuro |
| Plantillas | ✅ Completo | CRUD básico |
| Push notifications (envío real) | ⚠️ Parcial | Registro de tokens implementado, envío FCM/APNs pendiente |
| Notificaciones automáticas (clima, social) | ⚠️ Parcial | Lógica parcial en backend |

### 18.4 Admin

| Funcionalidad | Estado | Detalle |
|--------------|--------|---------|
| Dashboard de estadísticas | ✅ Completo | Resumen + diarias |
| Gestión de usuarios (admin) | ✅ Completo | Listar, ver, editar, eliminar |
| Moderación de reportes | ✅ Completo | Validar/rechazar obstáculos |
| Exportes CSV/Excel | ✅ Completo | Viajes + estadísticas |
| Configuración del sistema | ✅ Completo | Singleton editable |
| Factores de transporte | ✅ Completo | CRUD |
| Tickets de soporte | ✅ Completo | Crear, responder, cambiar estado |
| Gestión de notificaciones (envío) | ✅ Completo | Endpoint `/send` |

### 18.5 Integrations

| Funcionalidad | Estado | Detalle |
|--------------|--------|---------|
| Caché de APIs externas | ✅ Completo | TTL configurable |
| Datos meteorológicos | ✅ Completo | Consulta + ingesta |
| Calidad del aire | ✅ Completo | Consulta + ingesta |
| Google Maps (proxy) | ✅ Completo | Directions, geocode, places |

### 18.6 Frontend Web

| Funcionalidad | Estado | Detalle |
|--------------|--------|---------|
| Login / Registro | ✅ Completo | Con OAuth |
| Planificador de rutas | ✅ Completo | Mapa interactivo |
| Gestión de rutas | ✅ Completo | CRUD, favoritos, compartir |
| Panel de administración | ✅ Completo | Usuarios, reportes, stats, exportes |
| Notificaciones | ✅ Completo | Lista + badge |
| Perfil de usuario | ✅ Completo | Editar datos, cambiar contraseña |
| Multi-idioma | ✅ Completo | i18n (ES/EN) |
| Responsive | ✅ Completo | Tailwind CSS |

### 18.7 App Móvil

| Funcionalidad | Estado | Detalle |
|--------------|--------|---------|
| Login / Registro | ✅ Completo | Con OAuth |
| Planificador de rutas | ✅ Completo | Google Maps |
| Rutas guardadas | ✅ Completo | Lista + detalle |
| Favoritos | ✅ Completo | |
| Perfil con foto | ✅ Completo | Upload base64 a backend |
| Notificaciones | ✅ Completo | Lista in-app |
| Avatar por cuenta | ✅ Completo | SecureStore por userId |
| Modo invitado | ✅ Completo | Sin autenticación |
| Push notifications | ⚠️ Pendiente | Device tokens registrados, envío no implementado |
| Offline mode | ⚠️ Pendiente | Sin caché offline de rutas |

### 18.8 Resumen global

| Categoría | Completado | Parcial | Pendiente |
|-----------|-----------|---------|-----------|
| Security | 8/10 | 2/10 | 0/10 |
| Mobility | 11/11 | 0/11 | 0/11 |
| Notifications | 3/5 | 2/5 | 0/5 |
| Admin | 7/8 | 1/8 | 0/8 |
| Integrations | 4/4 | 0/4 | 0/4 |
| Frontend | 8/8 | 0/8 | 0/8 |
| Móvil | 8/10 | 1/10 | 1/10 |
| **Total** | **49/56 (87%)** | **6/56 (11%)** | **1/56 (2%)** |

**Funcionalidades principales completamente operativas:** autenticación, autorización, planificación de rutas, gestión de rutas/POIs, favoritos, calificaciones, reportes de obstáculos, historial de viajes, estadísticas, exportes, configuración, soporte, notificaciones in-app, panel admin, app móvil.

**Principales gaps:** SMTP en Docker, push notifications (envío real), suite de pruebas automatizadas, CI/CD, Serilog.
