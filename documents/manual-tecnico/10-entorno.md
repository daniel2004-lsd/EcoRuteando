---

## 10. Configuración del entorno

### 10.1 Variables de entorno requeridas

#### Backend (`EcoRuteandoBackend/.env`)

> Plantilla oficial: `EcoRuteandoBackend/.env.example`

| Variable | Descripción | Ejemplo / Nota |
|----------|-------------|----------------|
| `ConnectionStrings__DefaultConnection` | Cadena de conexión PostgreSQL | `Host=postgres;Port=5432;Database=ecoRuteando_db;Username=postgres;Password=postgres` |
| `Jwt__SecretKey` | Clave secreta JWT (mínimo 32 bytes) | Generar con `openssl rand -base64 64` |
| `Jwt__Issuer` | Emisor del token | `EcoRuteando` |
| `Jwt__Audience` | Audiencia del token | `EcoRuteandoUsers` |
| `Jwt__ExpirationMinutes` | Minutos de expiración access token | `60` |
| `EmailSettings__Host` | Servidor SMTP | `smtp.gmail.com` |
| `EmailSettings__Port` | Puerto SMTP | `587` |
| `EmailSettings__EnableSsl` | Habilitar StartTLS | `true` |
| `EmailSettings__Username` | Usuario SMTP | Gmail address |
| `EmailSettings__Password` | Contraseña de aplicación Gmail | **16 caracteres** |
| `EmailSettings__FromName` | Nombre del remitente | `EcoRuteando` |
| `EmailSettings__FromEmail` | Email del remitente | `no-reply@ecoruteando.com` |
| `Google__ClientId` | Client ID OAuth Google | Console Cloud |
| `Google__ClientSecret` | Client Secret OAuth Google | Console Cloud |
| `Facebook__AppId` | App ID OAuth Facebook | Meta Developers |
| `Facebook__AppSecret` | App Secret OAuth Facebook | Meta Developers |
| `GoogleMaps__ApiKey` | API key Google Maps (servidor) | Console Cloud |
| `Admin__Email` | Email del admin seed | `admin@ecoruteando.com` |
| `Admin__Password` | Contraseña del admin seed | Definida en Liquibase |

> **Nota:** Las claves de Google Maps para el **frontend** (`VITE_GOOGLE_MAPS_API_KEY`) y para el **backend** (`GoogleMaps__ApiKey`) son independientes — cada una debe habilitar las APIs correspondientes en Google Cloud Console.

#### Frontend (`front-end/ecoRuteando-react/.env`)

| Variable | Descripción |
|----------|-------------|
| `VITE_GOOGLE_MAPS_API_KEY` | Clave JavaScript API para renderizado de mapas |
| `VITE_GOOGLE_CLIENT_ID` | Client ID OAuth Google (para login desde web) |
| `VITE_FACEBOOK_APP_ID` | App ID OAuth Facebook |

#### Móvil (`Movil-EcoRuteando/.env`)

| Variable | Descripción |
|----------|-------------|
| `EXPO_PUBLIC_API_URL` | URL base del backend (`http://localhost:5124` en dev; `https://ecoruteando-backend.onrender.com` en prod) |
| `EXPO_PUBLIC_GOOGLE_MAPS_KEY` | Clave Maps para React Native |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID` | Client ID OAuth Google |

### 10.2 Política de secretos

- **NUNCA** commitear secretos. Los archivos `.env` van en `.gitignore`.
- Los `docker-compose.yml` están trackeadados: **NO** poner secretos ahí; usar `env_file` o variables del host.
- El backend cifra secretos TOTP con AES-256-GCM (`IEncryptionService`) — mantener este patrón.
- El `.env.example` es la plantilla oficial para nuevos desarrolladores.

### 10.3 Puertos del stack

| Servicio | Puerto host | Puerto contenedor | Protocolo |
|----------|------------|-------------------|-----------|
| PostgreSQL | 5450 | 5432 | TCP |
| Backend API | 5124 | 5124 | HTTP |
| Frontend (nginx) | 3007 | 80 | HTTP |
| Liquibase | — | — | one-shot |

---

## 11. Instalación y ejecución paso a paso

### 11.1 Requisitos previos

| Herramienta | Versión mínima | Propósito |
|------------|---------------|-----------|
| Docker + Docker Compose | 29.x / v2 | Stack completo |
| .NET SDK | 9.0 (o superior) | Backend |
| Node.js | 22.x | Frontend y móvil |
| npm | 10.x | Paquetes JS |
| Expo CLI | ~57 | App móvil |
| Git | 2.x | Control de versiones |

### 11.2 Clonar los repositorios

```bash
# Backend
git clone <repo-backend> ~/Escritorio/EcoRuteandoBackend

# Frontend + docker-compose
git clone <repo-frontend> ~/Escritorio/EcoRuteando

# Base de datos
git clone <repo-db> ~/Escritorio/EcoRuteandoDb

# Móvil
git clone <repo-movil> ~/Escritorio/Movil-EcoRuteando
```

### 11.3 Ejecutar el stack completo (Docker)

```bash
cd ~/Escritorio/EcoRuteando

# 1. Copiar y completar variables de entorno
cp ../EcoRuteandoBackend/.env.example ../EcoRuteandoBackend/.env
# Editar .env con valores reales

# 2. Levantar todo (postgres + liquibase + backend + frontend)
docker compose up -d

# 3. Verificar contenedores
docker compose ps

# 4. Ver logs del backend
docker compose logs -f backend
```

**Orden de arranque automático:**
1. `postgres` (healthcheck con `pg_isready`)
2. `liquibase` (one-shot: aplica 77 changesets)
3. `backend` (espera a liquibase)
4. `frontend` (espera a backend)

### 11.4 Ejecutar backend sin Docker (desarrollo)

```bash
cd ~/Escritorio/EcoRuteandoBackend

# Asegurar que PostgreSQL esté corriendo (puede ser el de Docker)
docker compose up -d postgres

# Restaurar y ejecutar
dotnet restore
dotnet build
dotnet run --project src/Api/EcoRuteando.Api
```

Backend disponible en `http://localhost:5124`.

### 11.5 Ejecutar frontend sin Docker (desarrollo)

```bash
cd ~/Escritorio/EcoRuteando/front-end/ecoRuteando-react

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env
# Editar .env

# Dev server
npm run dev
```

Frontend disponible en `http://localhost:3007` (o el puerto Vite asigne).

### 11.6 Ejecutar app móvil

```bash
cd ~/Escritorio/Movil-EcoRuteando

# Instalar dependencias
npm install

# Variables de entorno
cp .env.example .env
# Editar .env (EXPO_PUBLIC_API_URL=http://localhost:5124)

# Para desarrollo con Expo Go
npx expo start
```

**Para conectar con el backend local desde un dispositivo/emulador:**

```bash
# USB (emulador Android):
adb reverse tcp:5124 tcp:5124
adb reverse tcp:8081 tcp:8081

# O usar la IP local en EXPO_PUBLIC_API_URL
```

### 11.7 Reconstruir imágenes Docker

```bash
# Si hay cambios en backend o frontend
cd ~/Escritorio/EcoRuteando
docker compose build --no-cache backend
docker compose build --no-cache frontend
docker compose up -d
```

> **Nota:** Siempre usar `--no-cache` para frontend — los builds cacheados pueden quedar con versiones stale del bundle.

---

## 12. Compilación y construcción

### 12.1 Backend

```bash
dotnet build EcoRuteando.sln          # Compila los 23 proyectos
dotnet publish src/Api/EcoRuteando.Api -c Release -o ./publish
```

**Docker multi-stage:**
```bash
docker build -t ecoruteando-backend .
```

### 12.2 Frontend

```bash
npm run build                          # Genera dist/
```

**Docker (nginx):**
```bash
docker build -t ecoruteando-frontend .
```

### 12.3 Móvil (EAS Build)

```bash
# Requiere Expo CLI autenticado
eas build --profile development --platform android
eas build --profile preview --platform android
eas build --profile production --platform all
```

**Perfiles en `eas.json`:**

| Profile | Uso | EXPO_PUBLIC_API_URL |
|---------|-----|-------------------|
| `development` | Desarrollo local | `http://localhost:5124` |
| `preview` | Build de prueba | URL de Render |
| `production` | Producción | URL de Render |

---

## 13. Pruebas y validación

### 13.1 Estado actual de pruebas

| Tipo | Estado | Detalle |
|------|--------|---------|
| **Unit tests (backend)** | ❌ **No existen** | No hay proyectos `*.Tests` en la solución |
| **Integration tests (backend)** | ❌ **No existen** | Sin `WebApplicationFactory` ni `Testcontainers` |
| **E2E tests** | ❌ **No existen** | Sin Cypress/Playwright |
| **Frontend tests** | ❌ **No existen** | Sin archivos `*.test.*` o `*.spec.*` |
| **Móvil tests** | ❌ **No existen** | Sin Jest ni Detox configurados |

> **Hallazgo importante:** El proyecto **no tiene ninguna suite de pruebas automatizadas**. Toda validación es manual.

### 13.2 Validación manual disponible

| Herramienta | Propósito |
|------------|-----------|
| Swagger UI | Explorar y probar endpoints (`/swagger`) |
| TestController | Endpoints de diagnóstico (`/api/test/public`, `/api/test/private`) |
| `docker compose logs` | Verificar arranque y errores |
| `psql` | Verificar datos en PostgreSQL |

### 13.3 Checklist de validación manual post-cambio

```bash
# 1. Compilar backend
dotnet build

# 2. Verificar liquibase
docker compose up liquibase   # Debe aplicar cambiosets sin errores

# 3. Probar endpoint de salud
curl http://localhost:5124/api/test/public

# 4. Login manual
curl -X POST http://localhost:5124/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ecoruteando.com","password":"EcoAdmin!2026"}'

# 5. Verificar flujo completo en web y móvil
```

### 13.4 Recomendación para futuros tests

Prioridad sugerida:
1. **Unit tests de handlers CQRS** (Application layer) — mayor ROI
2. **Integration tests de repositorios** (con Testcontainers PostgreSQL)
3. **Tests de autorización** (permisos por rol)
4. **E2E de flujos críticos** (login → planificar ruta → guardar)
