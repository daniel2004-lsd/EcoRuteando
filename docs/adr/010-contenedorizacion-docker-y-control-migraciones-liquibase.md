# ADR-010: Contenedorización con Docker Compose y Gestión de Esquema con Liquibase

## Estado
**Aceptado**

## Fecha
Septiembre de 2025

---

## Contexto
El entorno de desarrollo y despliegue de EcoRuteando involucra múltiples componentes heterogéneos: servidor web React (Nginx), API REST (.NET 9), motor de base de datos relacional/espacial (PostgreSQL + PostGIS) y herramientas de inicialización de datos.

## Problema
- "En mi máquina sí funciona": Diferencias de versiones de dependencias (.NET SDK, NodeJS, extensiones de Postgres) entre los desarrolladores del equipo causaban errores frecuentes de configuración.
- Las migraciones automáticas tradicionales de Entity Framework Core (`dotnet ef database update`) pueden generar bloqueos, falta de trazabilidad en scripts SQL puros y dificultades al trabajar en bases de datos compartidas.

## Decisión
Se decidió implementar **orquestación completa mediante Docker Compose y control de versiones de esquema con Liquibase**:
1. **Contenedorización (`docker-compose.yml`)**:
   - `ecoruteando-postgres-1`: Contenedor de base de datos `postgis/postgis:16-3.5` con persistencia de volumen y healthchecks automáticos.
   - `ecoruteando-liquibase-1`: Contenedor efímero que ejecuta changelogs SQL antes de arrancar los servicios de aplicación.
   - `ecoruteando-backend`: Contenedor ASP.NET Core compilado en entorno release que expone los endpoints de la API.
   - `ecoruteando-frontend`: Contenedor Nginx de alto rendimiento que sirve los estáticos optimizados de la SPA React en el puerto 3007.
2. **Gestión de Esquema con Liquibase**:
   - Todo cambio en tablas, columnas o índices se escribe como un changelog versionado e inmutable.
   - Garantiza que cualquier miembro del equipo o entorno de pruebas levante la base de datos idéntica con `docker compose up -d`.

## Consecuencias

### Positivas
- **Reproducibilidad Total**: Un solo comando (`docker compose up -d`) levanta la infraestructura completa lista para producción o pruebas locales.
- **Trazabilidad y Rollback**: Historial riguroso de cambios de esquema en la tabla `databasechangelog`.

### Negativas
- Requiere recursos de hardware para ejecutar Docker Desktop / Docker Engine en el equipo de desarrollo.
