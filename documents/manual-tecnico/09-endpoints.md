---

## 9. APIs, endpoints, autenticación y autorización

### 9.1 Autenticación

**Esquema:** JWT Bearer (access token) + Refresh Token (rotación).

| Elemento | Detalle |
|----------|---------|
| Access Token | JWT firmado con `Jwt:Key`, expiración configurable |
| Refresh Token | Token opaco hasheado con BCrypt, rotación en cada uso |
| Header | `Authorization: Bearer <access_token>` |
| Almacenamiento móvil | `expo-secure-store` (clave `auth_token`, `refresh_token`) |
| Almacenamiento web | `localStorage` |

**Flujo de refresh:** El interceptor de axios en el móvil detecta 401, llama a `POST /api/auth/refresh` con el refresh token, reintenta la petición original. Si el refresh falla, cierra sesión y limpia `profileAvatarUri` (clave legacy).

### 9.2 Autorización

**Dos mecanismos superpuestos:**

1. **`[Authorize]`** — Autenticación requerida (JWT válido)
2. **`[HasPermission("permiso.nombre")]`** — Permiso granular verificado contra `role_permissions` del usuario

El `PermissionPolicyProvider` (Shared Kernel) resuelve políticas dinámicas `Permission:{name}`.

### 9.3 Endpoints por módulo

> **Verificado** mediante inspección de `[Route]`, `[Http*]`, `[Authorize]`, `[AllowAnonymous]`, `[HasPermission]` en los controllers.

---

#### 9.3.1 Security (8 controllers)

##### AuthController — `api/auth`

| Método | Ruta | Auth | Permiso | Descripción |
|--------|------|------|---------|-------------|
| POST | `/register` | Anónimo | — | Registro con email/contraseña |
| POST | `/login` | Anónimo | — | Login, retorna access + refresh token |
| POST | `/refresh` | Anónimo | — | Rotación de refresh token |
| POST | `/logout` | Anónimo | — | Revoca refresh token |
| GET | `/me` | JWT | — | Usuario autenticado actual |
| POST | `/sensitive/forgot-password` | Anónimo | — | Solicitud de recuperación |
| POST | `/sensitive/reset-password` | Anónimo | — | Reset con token |
| POST | `/sensitive/change-password` | JWT | — | Cambio autenticado |
| POST | `/sensitive/send-verification` | Anónimo | — | Envía email de verificación |
| POST | `/sensitive/verify-email` | Anónimo | — | Verifica token de email |
| POST | `/oauth/login` | Anónimo | — | Login OAuth (Google/Facebook) |
| GET | `/sessions` | JWT | — | Lista sesiones activas |
| DELETE | `/sessions/{sessionId}` | JWT | — | Revoca sesión específica |
| DELETE | `/sessions` | JWT | — | Revoca todas las sesiones |
| POST | `/2fa/enable` | JWT | — | Habilita 2FA ( retorna QR/secret) |
| POST | `/2fa/verify` | JWT | — | Verifica código TOTP |
| POST | `/2fa/disable` | JWT | — | Deshabilita 2FA |

##### UsersController — `api/users`

| Método | Ruta | Auth | Permiso | Descripción |
|--------|------|------|---------|-------------|
| GET | `/` | JWT | `users.read`* | Lista usuarios (paginado) |
| GET | `/{id}` | JWT | `users.read`* | Detalle de usuario |
| PUT | `/me` | JWT | — | Actualiza perfil propio |
| PUT | `/me/photo` | JWT | — | Sube foto de perfil (base64) |
| PUT | `/{id}` | JWT | `users.update`* | Actualiza usuario |
| DELETE | `/{id}` | JWT | `users.delete`* | Elimina usuario |

> \* Los controllers de usuarios usan `[Authorize]` + verificación inline; revisar `UsersController` para detalles exactos.

##### RolesController — `api/roles`

| Método | Ruta | Permiso |
|--------|------|---------|
| GET | `/` | `roles.read` |
| GET | `/{id:int}` | `roles.read` |
| POST | `/` | `roles.create` |
| PUT | `/{id:int}` | `roles.update` |
| DELETE | `/{id:int}` | `roles.delete` |

##### PermissionsController — `api/permissions`

| Método | Ruta | Permiso |
|--------|------|---------|
| GET | `/` | `permissions.read` |
| GET | `/{id:int}` | `permissions.read` |
| POST | `/` | `permissions.create` |
| PUT | `/{id:int}` | `permissions.update` |
| DELETE | `/{id:int}` | `permissions.delete` |

##### RolePermissionsController — `api/rolepermissions`

| Método | Ruta | Permiso |
|--------|------|---------|
| GET | `/{roleId:Guid}` | `rolepermissions.read` |
| POST | `/` | `rolepermissions.assign` |
| DELETE | `/{roleId:Guid}/{permissionId:Guid}` | `rolepermissions.remove` |

##### UserRolesController — `api/userroles`

| Método | Ruta | Permiso |
|--------|------|---------|
| GET | `/{userId:guid}` | `roles.read` |
| DELETE | `/{userId:guid}/{roleId:int}` | `roles.update` |

##### SecurityPoliciesController — `api/security-policies`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/` | JWT | Consulta política vigente |
| PUT | `/` | JWT | Actualiza política (solo Admin) |

##### TestController — `api/test` *(solo para diagnóstico)*

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/public` | Anónimo | Prueba de conectividad |
| GET | `/private` | JWT | Prueba de autenticación |

---

#### 9.3.2 Mobility (11 controllers)

##### RoutesController — `api/routes`

| Método | Ruta | Permiso | Descripción |
|--------|------|---------|-------------|
| GET | `/` | `routes.read` | Lista rutas (filtros: `type`, `includeInactive`, `mine`) |
| GET | `/{id:guid}` | `routes.read` | Detalle de ruta |
| POST | `/` | `routes.write` | Crea ruta (usa Google Maps Directions) |
| PUT | `/{id:guid}` | `routes.write` | Actualiza ruta |
| DELETE | `/{id:guid}` | `routes.delete` | Elimina ruta |
| POST | `/{id:guid}/pois/{poiId:guid}` | `routes.write` | Asocia POI a ruta |
| DELETE | `/{id:guid}/pois/{poiId:guid}` | `routes.write` | Remueve POI de ruta |

##### PoisController — `api/pois`

| Método | Ruta | Permiso | Descripción |
|--------|------|---------|-------------|
| GET | `/` | — | Lista POIs |
| GET | `/{id:guid}` | — | Detalle POI |
| POST | `/` | `routes.write` | Crea POI |
| PUT | `/{id:guid}` | `routes.write` | Actualiza POI |
| DELETE | `/{id:guid}` | `routes.write` | Elimina POI |

##### FavoritesController — `api/favorites`

| Método | Ruta | Permiso | Descripción |
|--------|------|---------|-------------|
| GET | `/` | `routes.read` | Rutas favoritas del usuario |
| POST | `/` | `routes.write` | Agrega a favoritos |
| DELETE | `/{routeId:guid}` | `routes.write` | Remueve de favoritos |

##### RatingsController — `api/ratings`

| Método | Ruta | Permiso | Descripción |
|--------|------|---------|-------------|
| POST | `/` | `routes.write` | Califica ruta |
| GET | `/route/{routeId:guid}` | `routes.read` | Ratings de una ruta |
| GET | `/route/{routeId:guid}/mine` | `routes.read` | Rating del usuario actual |

##### SharedRoutesController — `api/shared-routes`

| Método | Ruta | Permiso | Descripción |
|--------|------|---------|-------------|
| POST | `/` | `routes.write` | Comparte ruta (genera token) |
| GET | `/` | `routes.read` | Lista rutas compartidas |

##### TripHistoryController — `api/trips`

| Método | Ruta | Permiso | Descripción |
|--------|------|---------|-------------|
| GET | `/` | `routes.read` | Historial de viajes |
| GET | `/{id:guid}` | `routes.read` | Detalle de viaje |
| POST | `/` | `routes.write` | Inicia viaje |
| POST | `/{id:guid}/complete` | `routes.write` | Finaliza viaje |
| POST | `/{id:guid}/interrupt` | `routes.write` | Interrumpe viaje |

##### ObstacleReportsController — `api/obstacle-reports`

| Método | Ruta | Auth | Permiso | Descripción |
|--------|------|------|---------|-------------|
| GET | `/active` | Anónimo | — | Reportes activos (público) |
| POST | `/` | JWT | `reports.create` | Crea reporte (con foto y GPS) |
| GET | `/mine` | JWT | `reports.read` | Reportes del usuario |
| GET | `/` | JWT | `reports.read` | Todos los reportes (admin) |
| POST | `/{reportId:guid}/vote` | JWT | `reports.vote` | Vota reporte |
| PATCH | `/{reportId:guid}/status` | JWT | `reports.validate` | Valida/rechaza reporte |

##### StatisticsController — `api/admin/stats` *(en Mobility)*

| Método | Ruta | Permiso | Descripción |
|--------|------|---------|-------------|
| GET | `/` | `stats.read` | Estadísticas de movilidad |

##### SustainabilityController — `api/sustainability`

| Método | Ruta | Permiso | Descripción |
|--------|------|---------|-------------|
| GET | `/estimate` | `routes.read` | Estimación CO₂/calorías |

##### WeatherController — `api/weather` *(en Mobility)*

| Método | Ruta | Permiso | Descripción |
|--------|------|---------|-------------|
| GET | `/route` | `routes.read` | Clima a lo largo de una ruta |
| GET | `/current` | `routes.read` | Clima actual en ubicación |

##### GoogleMapsController — `api/maps`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/directions` | — | Direcciones Google Maps |
| GET | `/geocode` | — | Geocodificación |
| GET | `/reverse-geocode` | — | Geocodificación inversa |
| GET | `/places` | — | Búsqueda de lugares |

##### ExportsController — `api/exports` *(en Mobility)*

| Método | Ruta | Permiso | Descripción |
|--------|------|---------|-------------|
| GET | `/trips` | `routes.read` | Exporta viajes |
| GET | `/stats` | `stats.read` | Exporta estadísticas |

---

#### 9.3.3 Notifications (2 controllers)

##### NotificationsController — `api/notifications`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/` | JWT | Lista notificaciones |
| GET | `/unread-count` | JWT | Conteo de no leídas |
| PATCH | `/{id:guid}/read` | JWT | Marca como leída |
| PATCH | `/read-all` | JWT | Marca todas como leídas |
| POST | `/device-token` | JWT | Registra token push |
| POST | `/send` | JWT | Envía notificación (admin) |

##### NotificationTemplatesController — `api/notification-templates`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/` | JWT | Lista plantillas |
| POST | `/` | JWT | Crea plantilla |

---

#### 9.3.4 Admin (5 controllers)

##### StatisticsController — `api/admin/statistics`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/daily` | JWT | Estadísticas diarias |
| GET | `/summary` | JWT | Resumen consolidado |
| POST | `/daily` | JWT | Genera estadísticas del día |

##### ExportsController — `api/admin/exports`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/` | JWT | Lista exportes |
| POST | `/` | JWT | Crea exporte |
| GET | `/{id:guid}` | JWT | Descarga exporte |
| PATCH | `/{id:guid}/status` | JWT | Actualiza estado |

##### SystemConfigurationController — `api/admin/system-configuration`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/` | Anónimo | Configuración pública |
| PUT | `/` | JWT | Actualiza configuración (Admin) |

##### TransportFactorsController — `api/admin/transport-factors`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/` | JWT | Lista factores |
| GET | `/active` | Anónimo | Factores activos |
| POST | `/` | JWT | Crea factor |
| PUT | `/{id:guid}` | JWT | Actualiza factor |

##### SupportTicketsController — `api/support/tickets`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/` | JWT | Crea ticket |
| GET | `/mine` | JWT | Tickets del usuario |
| GET | `/` | JWT | Todos los tickets (admin) |
| GET | `/{id:guid}` | JWT | Detalle de ticket |
| POST | `/{id:guid}/messages` | JWT | Agrega mensaje |
| PATCH | `/{id:guid}/status` | JWT | Cambia estado |

---

#### 9.3.5 Integrations (3 controllers)

##### WeatherController — `api/integrations/weather`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/` | Anónimo | Consulta clima (cacheado) |
| POST | `/ingest` | JWT | Ingesta manual de datos |

##### AirQualityController — `api/integrations/air-quality`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/` | Anónimo | Consulta calidad del aire |
| POST | `/ingest` | JWT | Ingesta manual |

##### ApiCacheController — `api/integrations/cache`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/` | JWT | Consulta caché |
| POST | `/set` | JWT | Inserta en caché |
| POST | `/invalidate` | JWT | Invalida entrada |
| POST | `/purge-expired` | JWT | Purga expirados |

---

### 9.4 Resumen de cobertura

| Módulo | Controllers | Endpoints | Anónimos | Con Permiso |
|--------|------------|-----------|----------|-------------|
| Security | 8 | ~40 | 8 | ~15 |
| Mobility | 11 | ~35 | 6 | ~25 |
| Notifications | 2 | 8 | 0 | 0 |
| Admin | 5 | ~18 | 2 | 0 |
| Integrations | 3 | 9 | 2 | 0 |
| **Total** | **29** | **~110** | **18** | **~40** |

> **Nota:** Los totales son aproximados basados en el conteo de atributos `[Http*]` en los controllers. Algunos endpoints usan verificación inline en lugar de `[HasPermission]`.
