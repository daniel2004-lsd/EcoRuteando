---

## 5. Tecnologías, herramientas y versiones

> **Verificado** en `*.csproj`, `package.json` y `docker-compose.yml` (13 oct 2026).

### 5.1 Backend (.NET)

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| .NET | 9.0 (`net9.0`) | Runtime y SDK del proyecto |
| ASP.NET Core | 9.0 | Framework web (API REST) |
| Entity Framework Core | 9.0 | ORM |
| Npgsql / Npgsql.EntityFrameworkCore.PostgreSQL | 9.0 | Proveedor PostgreSQL + PostGIS |
| NetTopologySuite | 11.x (via Npgsql) | Tipos espaciales (Point, LineString) |
| MediatR | 14.1.0 | Desacoplamiento CQRS |
| FluentValidation | 11.11.0 | Validación de commands/queries |
| BCrypt.Net-Next | 4.x | Hash de contraseñas |
| MailKit | 4.x | Envío de correos SMTP |
| Microsoft.AspNetCore.Authentication.JwtBearer | 9.0.0 | Autenticación JWT |
| Swashbuckle | 6.x | Swagger/OpenAPI |
| Serilog.AspNetCore | 8.0.3 | Logging (**referenciado, sin configurar**) |
| Microsoft.VisualStudio.Azure.Containers.Tools.Targets | 1.22.1 | Integración Docker en IDE |

> **Nota:** El SDK instalado en la máquina es .NET 10.0.112 (mayor compatibilidad hacia atrás con `net9.0`).

### 5.2 Frontend Web

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Node.js | v22.22.1 | Runtime JS |
| React | ^18.2.0 | UI library |
| Vite | ^8.0.1 | Bundler / dev server |
| Tailwind CSS | ^3.4.19 | Estilos utilitarios |
| react-router-dom | ^7.x | Enrutamiento SPA |
| axios | ^1.x | Cliente HTTP |
| nginx | alpine | Servidor estático + proxy reverso (producción) |

### 5.3 App Móvil

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Expo SDK | 57.0.24 | Framework React Native |
| React Native | 0.86.3 | Runtime móvil |
| expo-router | ~6.x | Navegación por archivos |
| @react-native-async-storage/async-storage | 2.x | Persistencia local |
| expo-secure-store | 14.x | Almacenamiento seguro (tokens) |
| expo-image-picker | 17.x | Selección de fotos de perfil |
| expo-file-system | 19.x | Lectura de archivos (base64) |
| @expo/vector-icons | ^15.x | Iconos |
| nativewind | 4.x | **Instalado pero no utilizado** |

### 5.4 Base de Datos

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| PostgreSQL | 16 (`postgis/postgis:16-3.5`) | Motor de datos |
| PostGIS | 3.5 | Extensión geoespacial |
| Liquibase | 5.0.2 | Gestión de migraciones (fuente de verdad) |
| pgcrypto | integrada | Contraseñas y tokens |
| unaccent / pg_trgm / citext | integradas | Búsqueda y normalización |

### 5.5 Herramientas de orquestación y cliente móvil

| Herramienta | Versión | Uso |
|------------|---------|-----|
| Docker | 29.7.2 | Contenedores |
| Docker Compose | v2 | Orquestación del stack |
| EAS CLI | (config en `eas.json`) | Builds de Expo |

---

## 6. Estructura de los repositorios

### 6.1 EcoRuteandoBackend

```
EcoRuteandoBackend/
├── EcoRuteando.sln                       # Solución .NET (23 proyectos)
├── Dockerfile                            # Multi-stage build
├── src/
│   ├── Api/
│   │   └── EcoRuteando.Api/              # Composition Root (Program.cs, appsettings)
│   ├── Modules/
│   │   ├── Security/
│   │   │   ├── EcoRuteando.Modules.Security.Domain/
│   │   │   ├── EcoRuteando.Modules.Security.Application/
│   │   │   ├── EcoRuteando.Modules.Security.Infrastructure/
│   │   │   └── EcoRuteando.Modules.Security.Presentation/
│   │   ├── Mobility/                     # (misma estructura 4 capas)
│   │   ├── Notifications/                # (misma estructura 4 capas)
│   │   ├── Admin/                        # (misma estructura 4 capas)
│   │   └── Integrations/                 # (misma estructura 4 capas)
│   └── Shared/
│       └── EcoRuteando.Shared/           # Shared Kernel mínimo
└── (sin carpeta de tests)
```

> **Hallazgo:** Existe un proyecto `EcoRuteando.Modules.Security` huérfano `net8.0` que no forma parte de la solución moderna.

### 6.2 EcoRuteando (raíz — contiene docker-compose y frontend)

```
EcoRuteando/
├── docker-compose.yml                    # Stack completo (postgres, backend, frontend, liquibase)
├── docs/adr/                             # Decisiones de arquitectura (ADR)
├── documents/                            # Documentación del proyecto (este manual vive aquí)
│   ├── manual-tecnico/                   # ← ESTE DOCUMENTO
│   ├── auditoria-manual-tecnico.md
│   ├── documento-arquitectura.md
│   └── ...
└── front-end/
    └── ecoRuteando-react/                # Aplicación React
        ├── src/
        │   ├── features/                 # Feature-based: auth, home, routes, admin...
        │   ├── shared/                   # Componentes, hooks, i18n, services
        │   └── App.jsx / main.jsx
        ├── vercel.json                   # Rewrites Vercel → Render
        └── package.json
```

### 6.3 Movil-EcoRuteando

```
Movil-EcoRuteando/
├── app/                                  # expo-router (rutas por archivos)
│   ├── (tabs)/                           # index, routes, profile, notifications
│   └── _layout.tsx
├── src/
│   ├── shared/
│   │   ├── services/apiClient.ts         # axios + interceptor JWT
│   │   ├── store/AuthContext.tsx         # Auth + SecureStore
│   │   └── i18n/                         # Traducciones
│   └── features/
├── app.json / app.config.ts
├── eas.json                              # Builds EAS (development/preview/production)
└── package.json
```

### 6.4 EcoRuteandoDb

```
EcoRuteandoDb/
├── changelog/
│   └── db.changelog-master.yaml          # Master changelog (77 changesets)
├── 01_ddl/
│   ├── 01_extensions/                    # postgis, pgcrypto, unaccent...
│   ├── 02_schemas/                       # security, mobility, admin, community, integrations, notifications
│   ├── 03_tables/                        # 006_security_module/, mobility/, admin/...
│   └── 04_indexes_constraints/
├── 02_dml/
│   └── seeds/                            # Roles, permisos, policy, factores de transporte
└── docker/liquibase/Dockerfile
```

---

## 7. Descripción de módulos y componentes

### 7.1 Módulo Security (Bounded Context: identidad y acceso)

**Responsabilidad:** Registro, login, JWT, refresh tokens, sesiones, roles, permisos, 2FA TOTP, OAuth (Google/Facebook), verificación de email, recuperación de contraseñas, auditoría, políticas de seguridad.

| Subdominio | Entidades | Tablas (esquema `security`) |
|-----------|-----------|----------------------------|
| Identidad | `User` | `users` |
| Autorización | `Role`, `Permission`, `RolePermission`, `UserRole` | `roles`, `permissions`, `role_permissions`, `user_roles` |
| Sesión | `RefreshToken`, `Session` | `refresh_tokens`, `sessions` |
| 2FA | `TwoFactorAuth` | `two_factor_auth` |
| Verificación | `EmailVerification` | `email_verifications` |
| OAuth | `UserOAuthAccount` | `user_oauth_accounts` |
| Auditoría | `SecurityAudit` | `security_audit` |
| Política | `SecurityPolicy` | `security_policies` |

**Roles sembrados:** `User`, `Admin`, `SuperAdmin` (el último existe en código pero **no está sembrado** por Liquibase).

**Permisos (22):** `routes.read`, `routes.write`, `routes.delete`, `pois.read`, `pois.write`, `stats.read`, `reports.read`, `reports.create`, `reports.vote`, `reports.validate`, `roles.read`, `roles.create`, `roles.update`, `roles.delete`, `permissions.read`, `permissions.create`, `permissions.update`, `permissions.delete`, `rolepermissions.read`, `rolepermissions.assign`, `rolenotifications.remove`, `systemconfig.read`.

### 7.2 Módulo Mobility (Bounded Context: movilidad sostenible)

**Responsabilidad:** Planificación de rutas con Google Maps, estimación CO₂/calorías, POIs, favoritos, calificaciones, compartir rutas, reportes de obstáculos, historial de viajes, estadísticas, clima por ruta.

| Subdominio | Entidades | Tablas principales |
|-----------|-----------|-------------------|
| Rutas | `Route`, `RoutePoi` | `mobility.routes`, `mobility.route_pois` |
| POIs | `Poi` | `mobility.pois` |
| Favoritos | `FavoriteRoute` | `mobility.favorite_routes` |
| Calificaciones | `RouteRating` | `mobility.route_ratings` |
| Compartir | `SharedRoute` | `mobility.shared_routes` |
| Reportes | `ObstacleReport`, `ReportVote` | `community.obstacle_reports`, `community.report_votes` |
| Viajes | `TripHistory` | `mobility.trip_history` |
| Factores | `TransportFactor` | `mobility.transport_factors` |

**Tipos de ruta soportados:** `walking`, `driving`, `bicycling`, `transit` (enum `RouteType`).
**Métodos de estimación:** `distance`, `duration`, `calories`, `co2` (enum `EstimationMethod`).

### 7.3 Módulo Notifications

**Responsabilidad:** Notificaciones in-app, push (device tokens), plantillas, envío programado.

| Subdominio | Tablas (esquema `notifications`) |
|-----------|--------------------------------|
| Notificaciones | `notifications` |
| Plantillas | `notification_templates` |
| Tokens push | `device_tokens` |

### 7.4 Módulo Admin

**Responsabilidad:** Estadísticas consolidadas, exportes CSV/Excel, configuración del sistema, factores de transporte, tickets de soporte.

| Subdominio | Tablas (esquema `admin`) |
|-----------|-------------------------|
| Estadísticas | `daily_statistics` |
| Exportes | `exports` |
| Configuración | `system_configuration` |
| Factores | `transport_factors` |
| Soporte | `support_tickets`, `support_messages` |

### 7.5 Módulo Integrations

**Responsabilidad:** Caché de APIs externas, ingesta de datos meteorológicos y calidad del aire.

| Subdominio | Tablas (esquema `integrations`) |
|-----------|--------------------------------|
| Caché | `api_cache` |
| Clima | `weather_data` |
| Aire | `air_quality_data` |
