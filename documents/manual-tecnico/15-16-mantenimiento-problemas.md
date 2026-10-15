---

## 15. Mantenimiento, registros y diagnóstico

### 15.1 Registros (Logs)

| Componente | Mecanismo | Ubicación |
|-----------|-----------|-----------|
| Backend | `ILogger<T>` + Serilog (**referenciado, sin configurar en Program.cs**) | Consola / stdout del contenedor |
| Frontend | `console.*` del navegador | DevTools |
| Móvil | `console.*` | Expo Go / Metro bundler |
| PostgreSQL | Logs del contenedor | `docker compose logs postgres` |
| Liquibase | Salida del contenedor one-shot | `docker compose logs liquibase` |

> **Hallazgo:** Serilog está instalado (`Serilog.AspNetCore` 8.0.3) pero **no está configurado** en `Program.cs` — los logs usan el provider por defecto de ASP.NET Core.

### 15.2 Comandos de diagnóstico

```bash
# Estado de contenedores
docker compose ps

# Logs del backend (tiempo real)
docker compose logs -f backend

# Logs de postgres
docker compose logs -f postgres

# Conectar a PostgreSQL
docker compose exec postgres psql -U postgres -d ecoRuteando_db

# Ver esquemas
docker compose exec postgres psql -U postgres -d ecoRuteando_db -c "\dn"

# Ver tablas de un esquema
docker compose exec postgres psql -U postgres -d ecoRuteando_db -c "\dt security.*"

# Ver cambiosets Liquibase aplicados
docker compose exec postgres psql -U postgres -d ecoRuteando_db -c "SELECT id, author, filename FROM databasechangelog ORDER BY orderexecuted DESC LIMIT 10;"

# Health check del backend
curl http://localhost:5124/api/test/public
```

### 15.3 Tareas de mantenimiento programadas

| Tarea | Mecanismo | Intervalo |
|-------|-----------|-----------|
| Limpieza de refresh tokens expirados | `BackgroundJobs:ExpiredTokensCleanup` | 60 min |
| Purga de API cache expirada | `POST /api/integrations/cache/purge-expired` | Manual / job |
| Purga de audit logs antiguos | `sp_cleanup_old_audit_logs` | Manual |

### 15.4 Backup de base de datos

```bash
# Backup completo
docker compose exec postgres pg_dump -U postgres ecoRuteando_db > backup_$(date +%Y%m%d).sql

# Restaurar
docker compose exec -T postgres psql -U postgres ecoRuteando_db < backup_20261013.sql
```

> **Recomendación:** Configurar backups automáticos en Render PostgreSQL (feature disponible en planes de pago).

---

## 16. Solución de problemas frecuentes

### 16.1 Backend no arranca

| Síntoma | Causa probable | Solución |
|---------|---------------|----------|
| `Connection refused` a PostgreSQL | postgres aún arrancando | Esperar healthcheck; `docker compose up -d postgres` y reintentar |
| `password authentication failed` | Credenciales incorrectas en `.env` | Verificar `ConnectionStrings__DefaultConnection` |
| `relation does not exist` | Liquibase no corrió | `docker compose up liquibase` y verificar logs |
| Puerto 5124 en uso | Otro proceso | Cambiar puerto o terminar proceso |

### 16.2 Frontend no carga datos

| Síntoma | Causa | Solución |
|---------|-------|----------|
| Página en blanco | Error de JS en consola | Abrir DevTools, revisar `console` |
| `Failed to fetch` | Backend caído o CORS | Verificar backend; revisar nginx proxy |
| Mapa no renderiza | API key inválida | Verificar `VITE_GOOGLE_MAPS_API_KEY` |
| Datos stale tras rebuild | Cache de Docker | `docker compose build --no-cache frontend` |

### 16.3 Móvil no conecta

| Síntoma | Causa | Solución |
|---------|-------|----------|
| `Network request failed` | URL incorrecta | Verificar `EXPO_PUBLIC_API_URL` |
| No funciona en dispositivo físico | Backend en localhost | `adb reverse tcp:5124 tcp:5124` o usar IP local |
| Avatar no persiste | SecureStore por usuario | Verificar que `userId` esté en SecureStore antes de montar AvatarContext |

### 16.4 SMTP / correos

| Síntoma | Causa | Solución |
|---------|-------|----------|
| No llegan correos de verificación | SMTP mal configurado en Docker | Aplicar fix de variables de entorno SMTP en docker-compose |
| `Invalid login` Gmail | Contraseña de app incorrecta | Generar contraseña de aplicación de 16 caracteres en Google Account |
| Usuarios no verificados | Falta fix de verificación | SQL: `UPDATE security.users SET email_verified = true WHERE email = '<email>';` |

### 16.5 Errores de autenticación

| Síntoma | Causa | Solución |
|---------|-------|----------|
| `401 Unauthorized` | Token expirado | Refrescar con `/api/auth/refresh` |
| `403 Forbidden` | Permiso faltante | Verificar `role_permissions` del usuario |
| Rol incorrecto | `primary_role_id` no coincide | Actualizar en `security.users` Y `security.user_roles` |

### 16.6 Errores de base de datos

| Síntoma | Causa | Solución |
|---------|-------|----------|
| `column does not exist` | Cambio no migrado | Aplicar cambioset Liquibase nuevo |
| `type does not exist` | ENUM no creado | Verificar `CREATE TYPE` en cambiosets |
| `extension postgis does not exist` | PostGIS no habilitado | Verificar `CREATE EXTENSION IF NOT EXISTS postgis` |
| Liquibase falla con "already exists" | Cambios manuales previos | Reset completo: `docker compose down -v && docker compose up -d` |
