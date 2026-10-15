---

## 8. Modelo de datos

### 8.1 Esquemas de base de datos

| Esquema | Propósito | Tablas |
|---------|-----------|--------|
| `security` | Identidad, autorización, sesiones, auditoría | 14 |
| `mobility` | Rutas, POIs, favoritos, ratings, viajes | 10 |
| `community` | Reportes de obstáculos, alertas | 5 |
| `admin` | Estadísticas, exportes, configuración, soporte | 6 |
| `integrations` | Caché APIs externas, clima, calidad del aire | 3 |
| `notifications` | Notificaciones, plantillas, device tokens | 3 |
| **Total** | | **36 tablas + 17 ENUMs** |

### 8.2 Extensiones PostgreSQL habilitadas

| Extensión | Esquema | Propósito |
|-----------|---------|-----------|
| `postgis` | public | Tipos geoespaciales (`GEOGRAPHY`, `GEOMETRY`) |
| `pgcrypto` | public | `gen_random_uuid()` para IDs |
| `unaccent` | public | Normalización de texto (búsqueda) |
| `pg_trgm` | public | Búsqueda por similitud (trigram) |
| `citext` | public | Columnas de email case-insensitive |

### 8.3 Tablas principales por esquema

#### `security` (14 tablas)

| Tabla | Propósito | Campos clave |
|-------|-----------|-------------|
| `users` | Usuarios del sistema | `id UUID PK`, `email CITEXT UNIQUE`, `password_hash`, `full_name`, `primary_role_id`, `email_verified`, `profile_photo_url TEXT`, `created_at` |
| `roles` | Roles del sistema | `id SERIAL PK`, `name`, `description` |
| `permissions` | Permisos granulares | `id SERIAL PK`, `name`, `description` |
| `role_permissions` | Asignación rol→permiso | `role_id`, `permission_id` |
| `user_roles` | Asignación usuario→rol | `user_id`, `role_id` |
| `refresh_tokens` | Tokens de refresh (rotación) | `id UUID PK`, `user_id`, `token_hash`, `expires_at`, `revoked_at` |
| `sessions` | Sesiones activas | `id UUID PK`, `user_id`, `ip_address`, `user_agent`, `revoked_at` |
| `two_factor_auth` | Configuración 2FA TOTP | `user_id PK`, `secret_encrypted` (AES-256-GCM), `enabled`, `backup_codes` |
| `email_verifications` | Tokens de verificación de email | `user_id PK`, `token_hash`, `expires_at`, `verified_at` |
| `password_recovery` | Tokens de recuperación | `user_id`, `token_hash`, `expires_at`, `used_at` |
| `oauth_accounts` | Cuentas OAuth vinculadas | `user_id`, `provider`, `provider_user_id` |
| `audit_logs` | Auditoría de seguridad | `id UUID PK`, `event_type`, `user_id`, `ip_address`, `details JSONB` |
| `error_logs` | Errores de seguridad | `id UUID PK`, `message`, `stack_trace`, `created_at` |
| `security_policies` | Política de seguridad global | `id PK`, `password_min_length`, `require_2fa`, `lockout_max_attempts`, `lockout_duration_minutes` |

#### `mobility` (10 tablas)

| Tabla | Propósito | Campos clave |
|-------|-----------|-------------|
| `routes` | Rutas planificadas | `id UUID PK`, `user_id`, `name`, `route_type` (ENUM), `origin GEOGRAPHY(POINT)`, `destination GEOGRAPHY(POINT)`, `geometry GEOGRAPHY(LINESTRING)`, `distance_meters`, `duration_seconds`, `co2_grams`, `calories`, `status` (ENUM), `is_public`, `created_at` |
| `route_poi` | POIs asociados a una ruta | `route_id`, `poi_id`, `order_index` |
| `points_of_interest` | Puntos de interés | `id UUID PK`, `name`, `category`, `location GEOGRAPHY(POINT)`, `rating` |
| `favorite_routes` | Favoritos del usuario | `user_id`, `route_id`, `created_at` |
| `ratings` | Calificaciones de rutas | `id UUID PK`, `route_id`, `user_id`, `score` (1-5), `comment` |
| `rating_votes` | Votos sobre calificaciones | `rating_id`, `user_id`, `is_helpful` |
| `shared_routes` | Rutas compartidas | `id UUID PK`, `route_id`, `shared_by`, `share_token`, `expires_at` |
| `trip_history` | Historial de viajes | `id UUID PK`, `user_id`, `route_id`, `started_at`, `ended_at`, `status` (ENUM), `distance_meters`, `co2_saved_grams` |
| `route_usage` | Registro de uso de rutas | `id UUID PK`, `route_id`, `user_id`, `started_at`, `ended_at`, `completed` |
| `route_usage_default` | Configuración por defecto de uso | `id PK`, `default_transport_type` |

#### `community` (5 tablas)

| Tabla | Propósito |
|-------|-----------|
| `obstacle_reports` | Reportes de obstáculos con foto y GPS |
| `report_votes` | Votos de la comunidad sobre reportes |
| `alerts` | Alertas climáticas/notificaciones |
| `alert_route` | Asociación alerta→ruta |
| `route_reports` | Reportes generales de rutas |

#### `admin` (6 tablas)

| Tabla | Propósito |
|-------|-----------|
| `daily_statistics` | Estadísticas diarias consolidadas |
| `exports` | Exportes CSV/Excel solicitados |
| `system_configuration` | Configuración global del sistema |
| `transport_factors` | Factores de emisión/calorías por tipo de transporte |
| `support_tickets` | Tickets de soporte |
| `support_messages` | Mensajes de tickets |

#### `integrations` (3 tablas)

| Tabla | Propósito |
|-------|-----------|
| `api_cache` | Caché de respuestas de APIs externas (TTL) |
| `weather_data` | Datos meteorológicos cacheados |
| `air_quality_data` | Datos de calidad del aire cacheados |

#### `notifications` (3 tablas)

| Tabla | Propósito |
|-------|-----------|
| `notifications` | Notificaciones in-app por usuario |
| `notification_templates` | Plantillas de notificación |
| `device_tokens` | Tokens de dispositivos push |

### 8.4 ENUMs (17)

| Esquema | ENUM | Valores |
|---------|------|---------|
| `security` | `user_status` | `active`, `inactive`, `suspended`, `locked` |
| `security` | `oauth_provider` | `google`, `facebook` |
| `security` | `audit_event_type` | `login_success`, `login_failed`, `logout`, `token_refresh`, `password_change`, `2fa_enable`, `2fa_disable` |
| `mobility` | `route_type` | `walking`, `driving`, `bicycling`, `transit` |
| `mobility` | `route_status` | `planned`, `in_progress`, `completed`, `cancelled`, `interrupted` |
| `mobility` | `estimation_method` | `distance`, `duration`, `calories`, `co2` |
| `mobility` | `transport_type` | `walking`, `cycling`, `driving`, `public_transport` |
| `mobility` | `poi_category` | `park`, `restaurant`, `shop`, `school`, `hospital`, `other` |
| `mobility` | `trip_status` | `active`, `completed`, `interrupted` |
| `community` | `report_status` | `pending`, `validated`, `rejected`, `resolved` |
| `community` | `report_category` | `road_damage`, `traffic`, `obstacle`, `other` |
| `community` | `alert_type` | `weather`, `air_quality`, `route_change` |
| `admin` | `export_status` | `pending`, `processing`, `completed`, `failed` |
| `admin` | `export_format` | `csv`, `excel` |
| `admin` | `ticket_status` | `open`, `in_progress`, `resolved`, `closed` |
| `admin` | `ticket_priority` | `low`, `medium`, `high`, `critical` |
| `notifications` | `notification_type` | `info`, `warning`, `success`, `error`, `weather`, `social` |

### 8.5 Procedimientos almacenados

| Procedamiento | Esquema | Propósito |
|--------------|---------|-----------|
| `sp_get_user_stats` | `mobility` | Estadísticas de un usuario (rutas, viajes, CO₂ ahorrado) |
| `sp_get_system_stats` | `admin` | Estadísticas consolidadas del sistema |
| `sp_cleanup_expired_tokens` | `security` | Limpieza de tokens expirados |
| `sp_cleanup_old_audit_logs` | `security` | Purga de logs de auditoría antiguos |

> **Nota:** La numeración de tablas y ENUMs proviene del conteo de `CREATE TABLE` / `CREATE TYPE` en los cambiosets Liquibase. El total de 36 tablas y 17 ENUMs se verificó mediante `grep` sobre `01_ddl/03_tables/`.
