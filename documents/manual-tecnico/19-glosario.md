---

## 19. Glosario técnico

| Término | Definición |
|---------|-----------|
| **API** | Application Programming Interface — contrato de comunicación entre sistemas |
| **API Key** | Clave identificadora para acceder a un servicio externo (Google Maps) |
| **ASP.NET Core** | Framework web de Microsoft para construir APIs y aplicaciones web |
| **Bounded Context** | Límite explícito dentro del cual un modelo de dominio es consistente (DDD) |
| **BCrypt** | Algoritmo de hash lento diseñado para contraseñas |
| **CDN** | Content Delivery Network |
| **Clean Architecture** | Arquitectura que separa dependencias por capas con reglas de dependencia estrictas |
| **Command** | Operación de escritura en CQRS |
| **CQRS** | Command Query Responsibility Segregation — separa lecturas y escrituras |
| **CORS** | Cross-Origin Resource Sharing |
| **CSV** | Comma-Separated Values (formato de exportación) |
| **DDD** | Domain-Driven Design — diseño centrado en el modelo de negocio |
| **Docker** | Plataforma de contenedores |
| **EAS** | Expo Application Services — servicio de builds para Expo/React Native |
| **EF Core** | Entity Framework Core — ORM de .NET |
| **ENUM** | Tipo de dato de PostgreSQL con valores predefinidos |
| **FIFO** | First In, First Out |
| **GeoJSON** | Formato JSON para datos geoespaciales |
| **GEOGRAPHY** | Tipo PostGIS para coordenadas geográficas (lat/lon) |
| **Google Maps API** | Servicios de mapas, direcciones, geocodificación de Google |
| **Healthcheck** | Verificación periódica de que un servicio está operativo |
| **JWT** | JSON Web Token — token firmado para autenticación stateless |
| **LINQ** | Language Integrated Query — consultas en C# |
| **Liquibase** | Herramienta de migración de base de datos basada en changelogs |
| **MediatR** | Librería .NET para patrón mediator (desacoplamiento CQRS) |
| **Migration** | Cambio versionado en el esquema de BD |
| **nginx** | Servidor web de alto rendimiento (proxy reverso + estáticos) |
| **Npgsql** | Proveedor ADO.NET para PostgreSQL |
| **NuGet** | Gestor de paquetes .NET |
| **OAuth** | Protocolo de autorización delegada (Google, Facebook) |
| **ORM** | Object-Relational Mapping |
| **POI** | Point of Interest — punto de interés |
| **PostGIS** | Extensión geoespacial para PostgreSQL |
| **PostgreSQL** | Sistema de gestión de bases de datos relacional |
| **Query** | Operación de lectura en CQRS |
| **React Native** | Framework para apps móviles con JavaScript/TypeScript |
| **React** | Biblioteca de UI de Facebook |
| **RBAC** | Role-Based Access Control |
| **Repositorio** | Abstracción de acceso a datos (patrón DDD) |
| **Sandbox** | Entorno aislado para pruebas |
| **SecureStore** | Almacenamiento seguro nativo de Expo (iOS Keychain / Android Keystore) |
| **Serilog** | Biblioteca de logging estructurado para .NET |
| **SPA** | Single Page Application |
| **SQL** | Structured Query Language |
| **StartTLS** | Extensión de SMTP para cifrar la conexión |
| **Stored Procedure** | Procedimiento almacenado en la BD |
| **Swagger/OpenAPI** | Especificación y UI para documentar APIs |
| **Tailwind CSS** | Framework CSS utilitario |
| **TOTP** | Time-based One-Time Password (2FA) |
| **TTL** | Time To Live (expiración de caché) |
| **TypeScript** | Lenguaje JS con tipos estáticos |
| **Unit of Work** | Patrón que agrupa operaciones de BD en una transacción |
| **UX** | User Experience |
| **UUID** | Universally Unique Identifier |
| **Vite** | Bundler y dev server para frontend moderno |

---

## Apéndice A: Comandos útiles rápidos

```bash
# === DOCKER ===
docker compose up -d                    # Levantar todo
docker compose down -v                  # Bajar todo + borrar volúmenes
docker compose build --no-cache frontend # Rebuild frontend
docker compose logs -f backend          # Logs backend

# === BASE DE DATOS ===
docker compose exec postgres psql -U postgres -d ecoRuteando_db
docker compose exec postgres psql -U postgres -d ecoRuteando_db -c "\dn"  # Esquemas
docker compose exec postgres psql -U postgres -d ecoRuteando_db -c "\dt security.*"

# === BACKEND ===
dotnet build                           # Compilar
dotnet run --project src/Api/EcoRuteando.Api  # Ejecutar

# === FRONTEND ===
npm install
npm run dev
npm run build

# === MÓVIL ===
npm install
npx expo start
adb reverse tcp:5124 tcp:5124          # Conectar a backend local
adb reverse tcp:8081 tcp:8081          # Conectar a Metro bundler

# === GIT ===
git status
git log --oneline -10
git diff --stat
```

---

## Apéndice B: Credenciales seed (solo desarrollo)

> ⚠️ **Estas credenciales son SOLO para desarrollo local.** Nunca usar en producción.

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| `admin@ecoruteando.com` | `EcoAdmin!2026` | Admin |

**Para promover un usuario a Admin manualmente:**

```sql
-- Obtener el id del rol Admin
SELECT id FROM security.roles WHERE name = 'Admin';

-- Obtener el id del usuario
SELECT id FROM security.users WHERE email = 'usuario@ejemplo.com';

-- Insertar en user_roles
INSERT INTO security.user_roles (user_id, role_id) VALUES ('<user_id>', '<admin_role_id>');

-- Actualizar primary_role_id (para que el JWT refleje Admin)
UPDATE security.users SET primary_role_id = <admin_role_id> WHERE id = '<user_id>';
```

---

*Fin del Manual Técnico de EcoRuteando — v1.0 — 13 de octubre de 2026*
