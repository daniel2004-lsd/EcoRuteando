# REGISTRO DE DEFECTOS Y DISCREPANCIAS TÉCNICAS — ECORUTEANDO
## CONTROL DE ANOMALÍAS, SEVERIDAD Y ACCIONES CORRECTIVAS
### Programa de Formación: Análisis y Desarrollo de Software (ADSO) — SENA

---

## 1. Convenciones y Clasificación de Severidad

* **Severidad Crítica (Bloqueante):** Impide la compilación, despliegue o ejecución del sistema; no existe mecanismo de contingencia.
* **Severidad Mayor:** Falla funcional relevante en un componente que afecta la experiencia de usuario o la persistencia.
* **Severidad Menor:** Discrepancia técnica, error de configuración o inconsistencia documental que no detiene la operación.
* **Severidad Trivial:** Detalle estético, advertencia no bloqueante o ajuste menor de etiquetado.

### Estados del Defecto:
* `Identificado` $\rightarrow$ `En Análisis` $\rightarrow$ `Corrección Propuesta` $\rightarrow$ `Corregido en Documentación / Configuración` $\rightarrow$ `Cerrado`.

---

## 2. Registro de Defectos y Discrepancias Identificadas

### DEF-001: Faltante de proyectos de módulos en la etapa de compilación del Dockerfile del Backend
* **Caso de Prueba Relacionado:** Procedimiento de compilación Docker / Despliegue Backend
* **Componente Afectado:** `EcoRuteandoBackend/dockerfile`
* **Descripción del Problema:** La etapa de `build` del `dockerfile` original solo copiaba los archivos `.csproj` de `Security`, `Mobility` y `Api`. Al ejecutar `dotnet restore EcoRuteando.sln`, el proceso abortaba con error `MSB3202: Project file not found` debido a que la solución y `EcoRuteando.Api.csproj` tienen dependencias obligatorias hacia `Notifications`, `Admin` e `Integrations`.
* **Pasos para Reproducir:**
  1. Situarse en `EcoRuteandoBackend`.
  2. Ejecutar `docker build -t ecoruteando-api .`.
  3. Observar la salida en el paso de restauración de NuGet.
* **Resultado Esperado:** Restauración exitosa de todos los proyectos de la solución.
* **Resultado Obtenido:** Falla con código de error MSB3202 por archivos de proyecto no encontrados en el contexto del contenedor.
* **Severidad / Prioridad:** **Mayor / Alta**
* **Estado:** **Corrección Propuesta / En revisión de autorización**
* **Corrección Aplicada:** Se redactaron las sentencias `COPY` de los proyectos faltantes en el `dockerfile`. Se encuentra pendiente de autorización formal para su commit definitivo.

---

### DEF-002: Ausencia de driver JDBC en la imagen oficial genérica de Liquibase
* **Caso de Prueba Relacionado:** `CP-DB-001` (Inicialización de Base de Datos)
* **Componente Afectado:** `EcoRuteandoDb/docker/liquibase/Dockerfile`
* **Descripción del Problema:** Al ejecutar el contenedor de Liquibase con la imagen estándar de Docker Hub (`liquibase/liquibase:5.0.2`), la migración fallaba con `java.lang.ClassNotFoundException: org.postgresql.Driver` debido a que el driver JDBC de PostgreSQL no viene precargado.
* **Pasos para Reproducir:**
  1. Levantar Liquibase directamente apuntando a la imagen oficial sin empaquetar el JAR.
* **Resultado Esperado:** Conexión JDBC limpia al puerto 5432 y aplicación de changelogs.
* **Resultado Obtenido:** Excepción Java de clase controladora no encontrada.
* **Severidad / Prioridad:** **Mayor / Alta**
* **Estado:** **Corregido y Documentado**
* **Corrección Aplicada:** El repositorio `EcoRuteandoDb` dispone de un Dockerfile propio que descarga `postgresql-42.7.8.jar` y fija la variable `LIQUIBASE_CLASSPATH=/liquibase/lib/postgresql.jar`. Se documentó en el manual técnico que debe usarse la compilación local (`docker compose up --build`).

---

### DEF-003: Incompatibilidad de binarios PostGIS en PostgreSQL gratuito de Render
* **Caso de Prueba Relacionado:** `CP-DB-001`, Despliegue en Cloud
* **Componente Afectado:** Infraestructura de Persistencia Cloud
* **Descripción del Problema:** La oferta administrada gratuita de PostgreSQL en Render no compila los paquetes binarios de la extensión PostGIS. Ejecutar `CREATE EXTENSION postgis;` en Render Managed Postgres arroja error `extension "postgis" is not available`.
* **Pasos para Reproducir:**
  1. Crear una base de datos gratuita en Render.
  2. Ejecutar el changelog `01_ddl/01_extensions/001_create_extension_postgis.sql`.
* **Resultado Esperado:** Creación exitosa de la extensión espacial.
* **Resultado Obtenido:** Error de extensión no soportada.
* **Severidad / Prioridad:** **Mayor / Alta**
* **Estado:** **Corregido en Documentación y Mitigado**
* **Corrección Aplicada:** Se documentó formalmente en el manual y plan de pruebas que para despliegues cloud debe usarse un proveedor compatible con PostGIS nativo (Supabase / Neon) o una imagen de contenedor personalizada con PostGIS y disco persistente.

---

### DEF-004: Error HTTP 404 al recargar rutas profundas de la SPA en Vercel
* **Caso de Prueba Relacionado:** `CP-WEB-001`, `CP-WEB-003` (Enrutamiento del Frontend)
* **Componente Afectado:** `EcoRuteando/front-end/ecoRuteando-react`
* **Descripción del Problema:** Al desplegar una Single Page Application con React Router DOM en Vercel, cualquier intento de refrescar la página en rutas como `/login`, `/plan-route` o `/dashboard` arrojaba error `404: NOT_FOUND` debido a que el servidor web buscaba archivos físicos inexistentes en dichas rutas.
* **Pasos para Reproducir:**
  1. Cargar la app en Vercel.
  2. Navegar a `/plan-route`.
  3. Presionar F5 en el navegador.
* **Resultado Esperado:** La SPA intercepta la URL y renderiza el componente correspondiente.
* **Resultado Obtenido:** Página de error 404 de Vercel.
* **Severidad / Prioridad:** **Menor / Alta**
* **Estado:** **Corregido**
* **Corrección Aplicada:** Se preparó el archivo de configuración `front-end/ecoRuteando-react/vercel.json` con la regla de reescritura catch-all `/(.*) -> /index.html` y proxy de API `/api/:match*`.

---

### DEF-005: Discrepancia en documentación previa sobre el algoritmo de hashing
* **Caso de Prueba Relacionado:** `CP-API-001` (Seguridad y Hashing)
* **Componente Afectado:** Documentación Técnica de Casos de Uso
* **Descripción del Problema:** Varios documentos y diagramas antiguos citaban "Argon2id" como el mecanismo de hashing de contraseñas, cuando la implementación física real del backend en C# utiliza `BCrypt.Net` con factor de trabajo 12 (`workFactor: 12`).
* **Pasos para Reproducir:**
  1. Comparar el texto del manual antiguo contra [`BCryptPasswordHasher.cs`](file:///home/daniel-pc/Escritorio/EcoRuteandoBackend/src/Modules/Security/EcoRuteando.Modules.Security.Infrastructure/Security/BCryptPasswordHasher.cs#L16).
* **Resultado Esperado:** Coherencia total entre la documentación y el código fuente.
* **Resultado Obtenido:** Inconsistencia criptográfica entre la teoría y la práctica.
* **Severidad / Prioridad:** **Menor / Media**
* **Estado:** **Corregido en Documentación**
* **Corrección Aplicada:** Se auditó y corrigió el manual técnico y el catálogo de casos de prueba, estableciendo formalmente **BCrypt.Net factor 12** como la única verdad técnica.

---

## 3. Resumen del Estado de Defectos

| ID | Título del Defecto | Severidad | Componente | Estado Actual |
| :---: | :--- | :---: | :--- | :---: |
| **DEF-001** | Faltante de proyectos en build del Dockerfile Backend | Mayor | Backend Docker | En revisión de usuario |
| **DEF-002** | Falta de driver JDBC en imagen genérica de Liquibase | Mayor | Base de Datos | Corregido |
| **DEF-003** | Incompatibilidad de PostGIS en Render Managed Postgres | Mayor | Infraestructura DB | Corregido en arquitectura |
| **DEF-004** | Error 404 en recarga de rutas de la SPA en Vercel | Menor | Frontend Web | Corregido (`vercel.json`) |
| **DEF-005** | Discrepancia Argon2id vs BCrypt en documentación | Menor | Documentación / Seguridad | Corregido en documentos |
