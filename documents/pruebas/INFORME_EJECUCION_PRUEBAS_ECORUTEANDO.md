# INFORME DE RESULTADOS DE PRUEBAS DE SOFTWARE — ECORUTEANDO
## REPORTE FORMAL DE EJECUCIÓN, MÉTRICAS DE CALIDAD Y ESTADO DE VALIDACIÓN
### Programa de Formación: Análisis y Desarrollo de Software (ADSO) — SENA

---

## 1. Resumen Ejecutivo

El presente informe documenta el estado de verificación y aseguramiento de calidad del sistema **EcoRuteando**, desarrollado para la gestión de movilidad sostenible y ruteo ecológico en el municipio de Neiva, Huila.

La evaluación se realizó mediante inspección estática del código fuente, verificación cruzada de dependencias, auditoría de esquemas de base de datos DDL y pruebas de sintaxis e interfaces sobre los cuatro repositorios del ecosistema (`EcoRuteando`, `EcoRuteandoBackend`, `EcoRuteandoDb` y `Movil-EcoRuteando`).

En estricta observancia de los lineamientos éticos de la ingeniería de software y las directrices del SENA, **este informe distingue transparentemente los casos de prueba diseñados de aquellos efectivamente ejecutados en caliente**, evitando declarar como "100% probado en producción" funcionalidades que requieren infraestructura de telecomunicaciones o despliegues en la nube no aprovisionados en el entorno de desarrollo local.

---

## 2. Métricas y Estadísticas de Calidad

### 2.1. Fórmulas de Cálculo Empleadas
1. **Cobertura de Requisitos ($CR$):**
   $$CR = \frac{\text{Requisitos Funcionales con Casos de Prueba Asociados}}{\text{Total de Requisitos Funcionales en Alcance}} \times 100$$
2. **Tasa de Ejecución de Pruebas ($TE$):**
   $$TE = \frac{\text{Casos de Prueba Ejecutados}}{\text{Total de Casos de Prueba Diseñados}} \times 100$$
3. **Tasa de Aprobación ($TA$):**
   $$TA = \frac{\text{Casos de Prueba Aprobados}}{\text{Total de Casos de Prueba Ejecutados}} \times 100$$

### 2.2. Consolidado Cuantitativo de Casos de Prueba

| Categoría de Componente | Diseñadas | Pendientes de Ejecución | Aprobadas (Verificadas en Código) | Fallidas | Bloqueadas | No Aplicables (ADR-8) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Frontend Web (`CP-WEB`)** | 7 | 5 | 1 | 0 | 0 | 1 |
| **Backend API (`CP-API`)** | 7 | 4 | 2 | 0 | 0 | 1 |
| **Base de Datos (`CP-DB`)** | 3 | 1 | 2 | 0 | 0 | 0 |
| **Aplicación Móvil (`CP-MOV`)**| 3 | 2 | 1 | 0 | 0 | 0 |
| **TOTALES CONSOLIDADOS** | **20** | **12** | **6** | **0** | **0** | **2** |

### 2.3. Resumen de Indicadores
* **Cobertura de Requisitos Funcionales:** **100%** (32 de 32 requisitos en alcance cuentan con diseño de pruebas).
* **Tasa de Ejecución Estática / Código:** **30.0%** (6 casos con evidencia directa e irrefutable en código fuente).
* **Tasa de Ejecución en Caliente:** **0%** (Pendiente de despliegue orquestado con servicios cloud y credenciales activas).
* **Tasa de Aprobación Estática:** **100%** de los casos evaluados mediante análisis estático coincidieron con el comportamiento programado.

---

## 3. Detalle de Casos con Verificación Estática Exitosa

Los siguientes casos de prueba cuentan con respaldo directo y verificable en el código fuente:

1. **`CP-API-001` / `CP-DB-001` (Seguridad y Criptografía):**
   * *Evidencia:* En [`BCryptPasswordHasher.cs`](file:///home/daniel-pc/Escritorio/EcoRuteandoBackend/src/Modules/Security/EcoRuteando.Modules.Security.Infrastructure/Security/BCryptPasswordHasher.cs#L16), se comprueba la invocación directa `BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12)`.
   * *Dictamen:* **Aprobada en código**.
2. **`CP-API-005` / `CP-WEB-005` (Exclusión de Buses y Bicis - ADR-8):**
   * *Evidencia:* En [`GoogleMapsController.cs`](file:///home/daniel-pc/Escritorio/EcoRuteandoBackend/src/Modules/Mobility/EcoRuteando.Modules.Mobility.Presentation/Controllers/GoogleMapsController.cs#L67-L81), se comprueba la captura de `ZERO_RESULTS` para `transit` y `bicycling` retornando código 404 y orientando hacia automóvil y caminata.
   * *Dictamen:* **Aprobada en código**.
3. **`CP-DB-002` (Factores de Transporte para Emisión de CO₂):**
   * *Evidencia:* En [`01_ddl/03_tables/001_admin_module/005_create_table_transport_factors.sql`](file:///home/daniel-pc/Escritorio/EcoRuteandoDb/01_ddl/03_tables/001_admin_module/005_create_table_transport_factors.sql) y scripts de inserción, la tabla física `admin.transport_factors` contiene factores para `driving` y `walking`.
   * *Dictamen:* **Aprobada en código**.
4. **`CP-DB-003` (Puntos de Interés y Geometría PostGIS):**
   * *Evidencia:* En [`01_ddl/03_tables/004_mobility__module/001_create_table_points_of_interest.sql`](file:///home/daniel-pc/Escritorio/EcoRuteandoDb/01_ddl/03_tables/004_mobility__module/001_create_table_points_of_interest.sql), la tabla `mobility.points_of_interest` define `geom geometry(Point, 4326)`.
   * *Dictamen:* **Aprobada en código**.
5. **`CP-MOV-003` (Telemetría Haversine y Locución por Voz):**
   * *Evidencia:* En [`src/utils/geo.ts`](file:///home/daniel-pc/Escritorio/Movil-EcoRuteando/src/utils/geo.ts#L1) se implementa la fórmula de Haversine (`haversineM`), y en [`app/(tabs)/plan-route.tsx`](file:///home/daniel-pc/Escritorio/Movil-EcoRuteando/app/(tabs)/plan-route.tsx#L643) se dispara `Speech.speak(text, { language: 'es-ES', rate: 1.05 })` a $< 80\text{ m}$.
   * *Dictamen:* **Aprobada en código**.
6. **`CP-WEB-006` (Alternancia de Tema Claro / Oscuro):**
   * *Evidencia:* En [`ThemeContext.jsx`](file:///home/daniel-pc/Escritorio/EcoRuteando/front-end/ecoRuteando-react/src/app/context/ThemeContext.jsx), se verifica la inyección de la clase `.dark` sobre el elemento raíz `<html>` y la persistencia en `localStorage`.
   * *Dictamen:* **Aprobada en código**.

---

## 4. Casos Pendientes de Ejecución en Entorno Vivo

Los siguientes casos están completamente diseñados y listos para ejecutarse una vez el aprendiz levante el entorno con credenciales activas:

* `CP-WEB-001`, `CP-WEB-002`, `CP-WEB-003`, `CP-WEB-004`, `CP-WEB-007`: Requieren backend escuchando en el puerto 5124 y API Key de Google Maps válida en el navegador.
* `CP-API-002`, `CP-API-003`, `CP-API-004`, `CP-API-006`, `CP-API-007`: Requieren base de datos PostgreSQL levantada y conexión activa a Google Directions API.
* `CP-MOV-001`, `CP-MOV-002`: Requieren inicio del servidor de desarrollo de Expo (`npx expo start`) y conexión desde la app móvil.

---

## 5. Procedimiento Reproducible para Ejecución en Staging / Local

Para ejecutar en caliente la batería de pruebas en una sesión de sustentación:

1. **Paso 1: Levantar Persistencia y Backend con Docker:**
   ```bash
   cd /home/daniel-pc/Escritorio/EcoRuteando
   docker compose up -d --build postgres liquibase backend
   ```
2. **Paso 2: Ejecutar Pruebas de API mediante cURL o Swagger:**
   * Abrir en el navegador: `http://localhost:5124/swagger`.
   * Ejecutar registro y login para obtener el Bearer Token.
   * Probar `GET /api/maps/directions` con origen y destino en Neiva.
3. **Paso 3: Probar Frontend Web en Navegador:**
   ```bash
   cd front-end/ecoRuteando-react
   npm install && npm run dev
   ```
   * Acceder a `http://localhost:5173`, realizar login y planificar ruta.
4. **Paso 4: Probar Aplicación Móvil en Expo:**
   ```bash
   cd /home/daniel-pc/Escritorio/Movil-EcoRuteando
   npm install && npx expo start
   ```

---

## 6. Limitaciones de la Evaluación y Recomendaciones

1. **Ausencia de Arnés de Pruebas Unitarias Automatizadas:** Se constató que no existen proyectos `xUnit` en la solución .NET ni suites de `Vitest` en el frontend web. Se recomienda al equipo de desarrollo incorporar en la siguiente fase un proyecto `EcoRuteando.UnitTests` para automatizar las pruebas de regresión en un pipeline de GitHub Actions.
2. **Dependencia de la Cuota de Google Maps:** Las pruebas de cálculo de rutas y geocodificación dependen de la disponibilidad de cuota en Google Cloud Platform. Se recomienda monitorear la consola de facturación durante jornadas de pruebas extensivas.
3. **Entorno Móvil Físico:** Las pruebas de GPS real y acelerometría requieren un teléfono Android físico; en emuladores de desarrollo se recomienda utilizar la herramienta de simulación de rutas de Android Studio.
