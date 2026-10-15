# PLAN DE PRUEBAS DE SOFTWARE — SISTEMA ECORUTEANDO
## ESTRATEGIA DE ASEGURAMIENTO DE CALIDAD, ALCANCE Y GESTIÓN DE PRUEBAS
### Programa de Formación: Análisis y Desarrollo de Software (ADSO) — SENA

---

## 1. Identificación del Proyecto e Información Institucional

| Campo | Especificación |
| :--- | :--- |
| **Nombre del Sistema** | **EcoRuteando** — Plataforma Multiplataforma de Movilidad Sostenible y Rutas Ecológicas |
| **Tipo de Documento** | Plan Maestro de Pruebas de Software (Master Test Plan - MTP) |
| **Versión del Documento** | 1.0.0 (Línea Base Técnica ADSO) |
| **Fecha de Emisión** | Octubre 2026 |
| **Línea de Formación** | Tecnologías de la Información y las Comunicaciones (TIC) |
| **Programa de Formación** | Análisis y Desarrollo de Software (ADSO) |
| **Número de Ficha** | *[Dato institucional pendiente de confirmar por el aprendiz]* |
| **Centro de Formación** | *[Centro de Formación / Regional SENA pendiente de confirmar]* |
| **Equipo de QA y Desarrollo** | *[Nombres y Apellidos de los Aprendices]* |
| **Instructor Técnico Evaluador** | *[Nombre del Instructor Técnico Asignado]* |

---

## 2. Objetivos del Plan de Pruebas

### 2.1. Objetivo General
Establecer el marco metodológico, los criterios de aceptación, los entornos de ejecución y las técnicas de aseguramiento de calidad requeridas para verificar y validar las funcionalidades del sistema **EcoRuteando** (Web, Móvil, Backend y Base de Datos), garantizando que cumpla con los 34 Requisitos Funcionales del SRS, los 12 Requisitos No Funcionales y los lineamientos de calidad del SENA.

### 2.2. Objetivos Específicos
1. Validar el flujo de autenticación, autorización basada en roles (RBAC) y cifrado de contraseñas mediante **BCrypt.Net (costo 12)** en el módulo de seguridad.
2. Comprobar la integración del backend con **Google Maps Platform** para el trazado de rutas de **automóvil particular** y **caminata peatonal**, verificando la exclusión definitiva de buses y bicicletas conforme al **ADR-8**.
3. Evaluar la exactitud del cálculo de ahorro de emisiones de $CO_2$ ejecutado por el servicio de sostenibilidad a partir de los factores registrados en `admin.transport_factors`.
4. Verificar la integridad referencial y las operaciones espaciales sobre tipos geométricos **PostGIS (SRID 4326)** en los seis esquemas de base de datos.
5. Comprobar la experiencia de usuario y la telemetría asistida por voz (**Text-to-Speech con Haversine**) en la aplicación móvil React Native / Expo.
6. Proporcionar guías de prueba reproducibles para ejecución manual y peticiones HTTP automatizables, documentando transparentemente el estado real de cada caso de prueba.

---

## 3. Alcance de las Pruebas

### 3.1. Funcionalidades Incluidas en el Alcance
* **Módulo de Seguridad (`Security`):**
  * Registro de usuarios con validación de contraseña robusta.
  * Verificación de cuenta mediante código OTP enviado por correo electrónico.
  * Inicio de sesión, emisión y renovación de tokens JWT.
  * Recuperación y restablecimiento de contraseña.
  * Gestión de perfil, cambio de contraseña y cierre de sesión.
  * Autorización basada en roles (`Admin`, `User`, `Guest`).
* **Módulo de Movilidad y Rutas (`Mobility`):**
  * Cálculo de rutas para **automóvil** (`driving`) y **caminata** (`walking`) mediante Google Directions API.
  * Geocodificación directa e inversa de direcciones en Neiva, Huila.
  * Estimación de emisiones y ahorro de $CO_2$ ($g/km$ emitidos y evitados).
  * Gestión de puntos de interés (`points_of_interest`) georreferenciados.
  * Almacenamiento y consulta de rutas favoritas e historial de trayectos.
  * Calificación y retroalimentación de rutas transitadas.
* **Módulo Comunitario (`Community`):**
  * Creación de reportes de obstáculos en vía con coordenadas GPS y evidencia fotográfica.
  * Validación comunitaria de reportes mediante sistema de votación (útil / no útil).
* **Módulo Administrativo y Analítica (`Admin`):**
  * Panel de administración con métricas de usuarios y uso de la plataforma.
  * Gestión de factores de transporte en `admin.transport_factors`.
  * Configuración de parámetros globales del sistema.
  * Gestión de tickets de soporte y auditoría inmutable de eventos.
* **Módulo de Notificaciones e Integraciones (`Notifications` & `Integrations`):**
  * Generación de alertas climáticas y calidad del aire.
  * Plantillas de notificación y despacho por correo/push.

### 3.2. Funcionalidades Excluidas Expresamente (Decisión Inalterable ADR-8)
* **Transporte Público (Buses):** Excluido formalmente del alcance del software. No existen datos de tránsito masivo (GTFS) en Neiva. Cualquier solicitud al backend para modo `transit` genera una respuesta 404 controlada.
* **Rutas de Bicicletas (Ciclorrutas):** Excluidas formalmente del alcance del software por ausencia de cartografía de ciclorrutas georreferenciadas en Google Maps para Neiva.
* **Telemetría vehicular OBD-II en tiempo real:** El cálculo de combustible y $CO_2$ es una estimación matemática basada en distancia y factores normativos, no una medición por hardware vehicular.

---

## 4. Tipos de Pruebas Aplicables

De acuerdo con el ciclo de desarrollo y la arquitectura del sistema, se definen los siguientes tipos de prueba:

| Tipo de Prueba | Nivel | Objetivo Técnico | Herramienta / Método |
| :--- | :--- | :--- | :--- |
| **Pruebas Funcionales (Caja Negra)** | Sistema / UI | Verificar que las interfaces web y móviles respondan a las acciones del usuario conforme a los casos de uso. | Navegador Web (Chrome/Firefox), Emulador Android / Expo Go, Pruebas manuales estructuradas |
| **Pruebas de API REST** | Integración | Validar contratos JSON, códigos de estado HTTP, validaciones de entrada, autenticación Bearer y manejo de errores. | Swagger UI (`/swagger`), cURL, Postman |
| **Pruebas de Base de Datos** | Persistencia | Comprobar integridad referencial (FK), restricciones de unicidad, tipos PostGIS `geometry(Point, 4326)` y disparadores DDL. | `psql`, pgAdmin, Scripts SQL de aserción |
| **Pruebas de Validación y Seguridad** | Componente | Constatar que las contraseñas se almacenen hasheadas con BCrypt ($2a$12$), que los endpoints protegidos rechacen tokens inválidos (401) y que no haya inyección SQL. | Inspección de base de datos, cURL con cabeceras alteradas |
| **Pruebas de Integración de Servicios** | Integración | Verificar la comunicación entre el backend y Google Maps API, SMTP de Gmail y el proxy de Vercel. | Logs de Serilog en backend, análisis de respuestas salientes |
| **Pruebas de Usabilidad y Multi-idioma** | Sistema | Comprobar el cambio dinámico de idioma (Español, Inglés, Francés) y la alternancia de tema visual (Claro/Oscuro). | Interfaz Web React con `i18next` y `ThemeContext` |

---

## 5. Entornos y Configuraciones de Prueba

### 5.1. Entorno de Pruebas Local (Ambiente Primario)
* **Sistema Operativo del Host:** Linux (Ubuntu/Debian x86_64).
* **Motor de Base de Datos:** PostgreSQL 16 con extensión PostGIS 3.5 en contenedor Docker (`postgis/postgis:16-3.5`), expuesto en el puerto `5450:5432` o `5432:5432`.
* **Herramienta de Migración:** Liquibase compilado con `postgresql-42.7.8.jar`.
* **Servidor Backend:** .NET 9 SDK (`dotnet run` o imagen Docker en puerto `5124`).
* **Servidor Web Frontend:** Node.js 20+ con Vite en desarrollo (`npm run dev` en puerto `5173`) o Nginx (`puerto 3007`).
* **Cliente Móvil:** Expo CLI 57 en emulador Android o dispositivo físico en la misma red LAN.

### 5.2. Entorno Staging / Producción Cloud (Ambiente Secundario)
* **Frontend Web:** Vercel Edge Hosting con `vercel.json` (proxy hacia Render).
* **Backend API:** Render Web Service (Docker container .NET 9).
* **Base de Datos Cloud:** PostgreSQL con PostGIS nativo (Supabase / Neon / Aiven).

---

## 6. Datos de Prueba y Cuentas Preconfiguradas

Para garantizar la reproducibilidad de las pruebas, se establecen los siguientes datos de control:

| Rol / Tipo de Dato | Identificador / Correo | Contraseña / Formato | Propósito en Pruebas |
| :--- | :--- | :--- | :--- |
| **Superadministrador** | `admin@ecoruteando.local` | `Admin2026*!` | Validación del panel administrativo, gestión de usuarios y parámetros globales. |
| **Usuario Ciudadano A** | `ciudadano.prueba@ecoruteando.local` | `Ciudadano2026*!` | Validación de ruteo, guardado de favoritas, reportes y calificación. |
| **Usuario Ciudadano B** | `validador.comunidad@ecoruteando.local` | `Validador2026*!` | Validación comunitaria de reportes creados por otros usuarios. |
| **Coordenadas Origen Neiva** | `2.9273, -75.2819` | Latitud / Longitud | Parque Santander (Centro de Neiva). |
| **Coordenadas Destino Neiva**| `2.9450, -75.2980` | Latitud / Longitud | Centro Comercial San Pedro Plaza (Norte de Neiva). |
| **Coordenadas POI Prueba** | `2.9315, -75.2860` | Point (SRID 4326) | Estación de recarga / Punto de interés ecológico. |

---

## 7. Criterios de Entrada, Suspensión y Salida

### 7.1. Criterios de Entrada (Entry Criteria)
1. Los repositorios locales deben encontrarse sin conflictos de Git.
2. La base de datos debe contener los 6 esquemas inicializados mediante los changelogs de Liquibase.
3. El backend debe compilar sin errores en .NET 9 (`dotnet build`).
4. Las variables de entorno de base de datos y Google Maps deben estar configuradas.

### 7.2. Criterios de Suspensión y Reanudación
* **Suspensión:** La ejecución de pruebas se suspenderá si la base de datos se vuelve inaccesible, si se agota la cuota de la API de Google Maps o si el backend arroja errores críticos no controlados (500) en el arranque.
* **Reanudación:** Se reanudará una vez restablecida la conectividad del servicio o ajustada la configuración local.

### 7.3. Criterios de Salida (Exit Criteria)
1. El 100% de los casos de prueba diseñados deben estar documentados con pasos reproducibles y resultados esperados claros.
2. Los casos de prueba evaluados en el entorno deben tener su estado registrado transparentemente (Aprobada, Fallida, Bloqueada o Pendiente de Ejecución).
3. Todo defecto detectado debe contar con un registro formal (`DEF-xxx`) con severidad y pasos de reproducción.
4. La matriz de trazabilidad debe vincular la totalidad de los requisitos funcionales con los casos de prueba correspondientes.

---

## 8. Gestión de Defectos y Ciclo de Vida

Los defectos reportados durante las pruebas se clasificarán según su severidad:

* **Crítica (Bloqueante):** Impide el funcionamiento esencial del sistema (ej. caída del backend, imposibilidad de iniciar sesión, corrupción de datos).
* **Mayor:** Una funcionalidad clave falla o entrega datos incorrectos (ej. cálculo de $CO_2$ arroja valores negativos, error en el guardado de rutas).
* **Menor:** Defecto en flujos secundarios o validaciones no críticas (ej. mensaje de error poco claro, desfase visual en un componente).
* **Trivial:** Inconsistencias estéticas menores o faltas ortográficas en traducciones.

**Flujo del Defecto:**  
`Nuevo` $\rightarrow$ `En Análisis` $\rightarrow$ `Asignado para Corrección` $\rightarrow$ `Corregido` $\rightarrow$ `Re-probado` $\rightarrow$ `Cerrado`.

---

## 9. Responsables del Proceso de Calidad

| Rol en Pruebas | Responsabilidades Principales | Responsable Asignado |
| :--- | :--- | :--- |
| **Líder de QA / Auditor** | Diseño del plan de pruebas, redacción de casos, supervisión de la matriz de trazabilidad y emisión del informe. | *[Aprendiz Líder de QA / Equipo ADSO]* |
| **Tester de Backend / API** | Verificación de controladores, autenticación JWT, Swagger y validación de endpoints. | *[Aprendiz Desarrollador Backend]* |
| **Tester de Frontend Web** | Ejecución de casos de prueba de interfaz, validación de formularios, mapas y navegación SPA. | *[Aprendiz Desarrollador Frontend]* |
| **Tester de Aplicación Móvil** | Pruebas de usabilidad en emulador/dispositivo, permisos GPS y asistencia por voz. | *[Aprendiz Desarrollador Móvil]* |
| **Instructor Evaluador** | Revisión y dictamen de la documentación técnica y las evidencias de prueba para el SENA. | *[Nombre del Instructor Asignado]* |
