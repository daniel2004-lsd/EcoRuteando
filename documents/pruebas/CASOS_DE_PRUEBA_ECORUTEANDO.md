# CATÁLOGO DE CASOS DE PRUEBA DE SOFTWARE — ECORUTEANDO
## ESPECIFICACIÓN DETALLADA DE CASOS DE PRUEBA POR COMPONENTE
### Programa de Formación: Análisis y Desarrollo de Software (ADSO) — SENA

---

## 1. Convención de Identificadores y Estados

### 1.1. Nomenclatura de Casos de Prueba
* `CP-WEB-xxx`: Casos de prueba de la interfaz de usuario web (Frontend SPA en React 18).
* `CP-API-xxx`: Casos de prueba de los servicios web REST (.NET 9 Web API).
* `CP-DB-xxx`: Casos de prueba de persistencia y objetos espaciales (PostgreSQL 16 / PostGIS 3.5).
* `CP-MOV-xxx`: Casos de prueba del cliente móvil (React Native 0.86 / Expo SDK 57).

### 1.2. Clasificación Oficial de Estados
* **Diseñada:** El caso de prueba está formalmente documentado, con precondiciones, pasos y resultado esperado definido, pendiente de ejecución en el entorno objetivo.
* **Pendiente de ejecución:** Requiere el aprovisionamiento de un entorno en caliente, credenciales externas de Google Maps o dispositivos físicos específicos.
* **Aprobada:** Se ejecutó en el entorno de desarrollo y el resultado observado coincidió con el resultado esperado.
* **Fallida:** Se ejecutó y el resultado observado difirió del esperado (genera un registro de defecto `DEF-xxx`).
* **Bloqueada:** No puede ejecutarse debido a una dependencia previa insatisfecha o caída de servicio.
* **No aplicable:** Excluida formalmente por decisión arquitectónica del proyecto (ej. pruebas de buses o bicicletas).

---

## 2. Casos de Prueba — Frontend Web (`CP-WEB`)

### CP-WEB-001: Registro de nuevo usuario con validación de contraseña
* **Componente:** Frontend Web (`features/auth/components/Register.jsx`)
* **Requisito Asociado:** RF01, RF04 | **Caso de Uso:** CU01
* **Objetivo:** Verificar que el formulario de registro valide los campos obligatorios, la robustez de la contraseña y muestre el mensaje de verificación de correo.
* **Precondiciones:** El frontend web debe estar en ejecución en el navegador (`http://localhost:5173` o URL de Vercel) y no debe haber una sesión activa.
* **Datos de Entrada:**
  * Nombre: `Carlos` | Apellido: `Mendoza`
  * Correo: `carlos.mendoza.test@ecoruteando.local`
  * Contraseña: `ClaveSegura2026*!` | Confirmación: `ClaveSegura2026*!`
* **Pasos de Ejecución:**
  1. Navegar a la vista de registro (`/register`).
  2. Diligenciar el formulario con los datos de entrada indicados.
  3. Hacer clic en el botón *"Crear cuenta"*.
* **Resultado Esperado:** El sistema envía la petición al backend, muestra una alerta de confirmación *"Código de verificación enviado a tu correo"* y redirige a la vista de ingreso de código OTP (`/verify-code`).
* **Estado:** **Diseñada**
* **Observaciones:** En pruebas sin servidor SMTP activo, el código OTP se puede consultar directamente en la base de datos o en la consola de Serilog.

---

### CP-WEB-002: Inicio de sesión exitoso y almacenamiento de token JWT
* **Componente:** Frontend Web (`features/auth/components/Login.jsx`, `AuthContext.jsx`)
* **Requisito Asociado:** RF02, RF04 | **Caso de Uso:** CU05
* **Objetivo:** Comprobar que un usuario registrado y verificado pueda autenticarse y ser redirigido al panel principal.
* **Precondiciones:** Usuario existente y activo en la base de datos con contraseña válida.
* **Datos de Entrada:**
  * Correo: `carlos.mendoza.test@ecoruteando.local`
  * Contraseña: `ClaveSegura2026*!`
* **Pasos de Ejecución:**
  1. Acceder a `/login`.
  2. Introducir correo y contraseña válidos.
  3. Hacer clic en *"Iniciar sesión"*.
* **Resultado Esperado:** La API responde HTTP 200 con el token JWT; el frontend almacena el token en `localStorage`, actualiza el contexto de autenticación y redirige a `/dashboard` o `/home`.
* **Estado:** **Diseñada**
* **Observaciones:** Requiere el backend operativo en el puerto 5124 o vía proxy.

---

### CP-WEB-003: Planificación de ruta vehicular y visualización de ahorro de CO₂
* **Componente:** Frontend Web (`features/home/pages/PlanRoute.jsx`, `MapView.jsx`)
* **Requisito Asociado:** RF09, RF10, RF11 | **Caso de Uso:** CU03, CU06, CU16
* **Objetivo:** Validar que al seleccionar origen, destino y modo "automóvil", el mapa trace la polilínea y presente la tarjeta de métricas de $CO_2$.
* **Precondiciones:** Sesión iniciada; clave de Google Maps configurada en `VITE_GOOGLE_MAPS_API_KEY`.
* **Datos de Entrada:**
  * Origen: `Parque Santander, Neiva` (`2.9273, -75.2819`)
  * Destino: `Centro Comercial San Pedro Plaza, Neiva` (`2.9450, -75.2980`)
  * Modo de transporte: `Automóvil`
* **Pasos de Ejecución:**
  1. Ingresar a la sección *"Planificar Ruta"* (`/plan-route`).
  2. Ingresar las direcciones de origen y destino en los campos de autocompletado.
  3. Seleccionar el modo de desplazamiento vehicular.
  4. Presionar el botón *"Calcular Ruta Ecológica"*.
* **Resultado Esperado:** El mapa de Google Maps renderiza la polilínea azul del trayecto; se despliega una tarjeta flotante con la distancia estimada en kilómetros, el tiempo de viaje y la huella de $CO_2$ en gramos.
* **Estado:** **Diseñada**
* **Observaciones:** Respaldado por el cálculo en `EstimateSustainabilityHandler`.

---

### CP-WEB-004: Planificación de ruta a pie con balance cero emisiones
* **Componente:** Frontend Web (`features/home/pages/PlanRoute.jsx`)
* **Requisito Asociado:** RF10, RF11 | **Caso de Uso:** CU06, CU16
* **Objetivo:** Verificar que el trazado a pie calcule $0\text{ g}$ de $CO_2$ emitido y el 100% de emisiones evitadas en comparación con el automóvil.
* **Precondiciones:** Sesión activa en el frontend web.
* **Datos de Entrada:**
  * Origen: `Catedral de Neiva` | Destino: `Malecón del Río Magdalena`
  * Modo: `Caminata (A pie)`
* **Pasos de Ejecución:**
  1. En `/plan-route`, seleccionar modo peatonal.
  2. Solicitar el cálculo del itinerario.
* **Resultado Esperado:** Se dibuja la ruta peatonal; la métrica de $CO_2$ emitido marca $0\text{ g } CO_2$ y se resalta el mensaje de *"Trayecto 100% sostenible (Cero Emisiones)"*.
* **Estado:** **Diseñada**

---

### CP-WEB-005: Rechazo operativo de modos no soportados (Buses y Bicicletas - ADR-8)
* **Componente:** Frontend Web / Backend API
* **Requisito Asociado:** Decisión ADR-8 | **Caso de Uso:** CU03
* **Objetivo:** Constatar que el sistema no permita seleccionar o, en su defecto, no genere rutas válidas para buses o bicicletas, informando la limitación.
* **Precondiciones:** Vista de planificación de rutas abierta.
* **Datos de Entrada:** Solicitud con modo de transporte no admitido operativamente (`transit` o `bicycling`).
* **Pasos de Ejecución:**
  1. Intentar forzar la consulta de ruta en transporte público o bicicleta hacia el backend.
* **Resultado Esperado:** La interfaz o el backend responden informando que dichos modos no están disponibles en Neiva, sugiriendo desplazarse a pie o en automóvil. No se genera ninguna polilínea errónea.
* **Estado:** **Diseñada**

---

### CP-WEB-006: Alternancia dinámica de tema visual (Claro / Oscuro)
* **Componente:** Frontend Web (`src/app/context/ThemeContext.jsx`)
* **Requisito Asociado:** RF26, RNF02 | **Caso de Uso:** CU26
* **Objetivo:** Validar que el botón de tema visual aplique las clases de Tailwind y estilos correspondientes a toda la aplicación.
* **Precondiciones:** Acceso a cualquier vista del sistema web.
* **Datos de Entrada:** Clic sobre el icono de luna/sol en la barra de navegación.
* **Pasos de Ejecución:**
  1. Hacer clic en el interruptor de tema visual.
  2. Observar el fondo de pantalla y los contenedores de tarjetas.
  3. Recargar la página en el navegador.
* **Resultado Esperado:** La interfaz conmuta fluidamente entre paleta clara y oscura; el estado se preserva en `localStorage` tras la recarga.
* **Estado:** **Diseñada**

---

### CP-WEB-007: Internacionalización y cambio de idioma dinámico
* **Componente:** Frontend Web (`src/locales/`, `LanguageContext.jsx`)
* **Requisito Asociado:** RF21 | **Caso de Uso:** CU21
* **Objetivo:** Comprobar que los textos de la interfaz cambien a Inglés (`en`) o Francés (`fr`) sin necesidad de recargar la aplicación.
* **Precondiciones:** Visualización de la página principal.
* **Datos de Entrada:** Selección de `EN` o `FR` en el menú desplegable de idiomas.
* **Pasos de Ejecución:**
  1. Desplegar el selector de idioma en la barra superior.
  2. Seleccionar *"English"*.
* **Resultado Esperado:** Todos los títulos, etiquetas de botones y descripciones se traducen al inglés según los diccionarios `translation.json`.
* **Estado:** **Diseñada**

---

## 3. Casos de Prueba — Backend y API REST (`CP-API`)

### CP-API-001: Registro de usuario y encriptación de contraseña (POST `/api/auth/register`)
* **Componente:** Backend API (`EcoRuteando.Modules.Security.Presentation/Controllers/AuthController.cs`)
* **Requisito Asociado:** RF01, RNF04 | **Caso de Uso:** CU01
* **Objetivo:** Validar que el endpoint registre un usuario, cree un registro en `security.users` y hashee la contraseña con BCrypt ($2a$12$).
* **Precondiciones:** Base de datos activa; correo no registrado previamente.
* **Datos de Entrada (HTTP Request):**
  ```json
  POST /api/auth/register
  Content-Type: application/json
  {
    "firstName": "Prueba",
    "lastName": "QA",
    "email": "tester.api@ecoruteando.local",
    "password": "PasswordQA2026*!",
    "confirmPassword": "PasswordQA2026*!"
  }
  ```
* **Pasos de Ejecución:**
  1. Enviar la petición POST mediante cURL o Swagger.
* **Resultado Esperado:** HTTP 200/201 con mensaje de éxito; en base de datos el campo `password_hash` inicia con `$2a$12$`.
* **Estado:** **Diseñada**

---

### CP-API-002: Autenticación y generación de JWT (POST `/api/auth/login`)
* **Componente:** Backend API (`AuthController.cs`, `IJwtTokenGenerator`)
* **Requisito Asociado:** RF02, RNF04 | **Caso de Uso:** CU05
* **Objetivo:** Validar que credenciales válidas retornen un Bearer Token con los claims correctos (`sub`, `email`, `role`).
* **Precondiciones:** Usuario registrado y con `is_email_verified = true`.
* **Datos de Entrada:**
  ```json
  POST /api/auth/login
  Content-Type: application/json
  {
    "email": "tester.api@ecoruteando.local",
    "password": "PasswordQA2026*!"
  }
  ```
* **Pasos de Ejecución:**
  1. Ejecutar la petición POST.
* **Resultado Esperado:** HTTP 200 OK con payload JSON `{ "accessToken": "eyJ...", "expiresIn": 3600 }`.
* **Estado:** **Diseñada**

---

### CP-API-003: Rechazo de autenticación con contraseña errónea
* **Componente:** Backend API (`AuthController.cs`)
* **Requisito Asociado:** RF02, RNF04 | **Caso de Uso:** CU05
* **Objetivo:** Verificar que el sistema rechace intentos de acceso con contraseñas inválidas sin revelar información del usuario.
* **Precondiciones:** Usuario existente.
* **Datos de Entrada:** Correo válido y contraseña incorrecta (`ClaveInvalida123`).
* **Pasos de Ejecución:**
  1. Enviar petición POST a `/api/auth/login`.
* **Resultado Esperado:** HTTP 401 Unauthorized o 400 Bad Request con mensaje genérico: *"Credenciales inválidas"*.
* **Estado:** **Diseñada**

---

### CP-API-004: Cálculo de ruta vehicular contra Google Maps (GET `/api/maps/directions`)
* **Componente:** Backend API (`EcoRuteando.Modules.Mobility.Presentation/Controllers/GoogleMapsController.cs`)
* **Requisito Asociado:** RF09, RF10 | **Caso de Uso:** CU03
* **Objetivo:** Verificar que el endpoint invoque Google Directions API y devuelva la geometría, distancia y tiempo de viaje.
* **Precondiciones:** Clave `GoogleMaps:ApiKey` configurada y válida.
* **Datos de Entrada:**
  ```
  GET /api/maps/directions?originLat=2.9273&originLng=-75.2819&destinationLat=2.9450&destinationLng=-75.2980&travelMode=driving
  ```
* **Pasos de Ejecución:**
  1. Realizar la petición GET autenticada o pública.
* **Resultado Esperado:** HTTP 200 OK conteniendo `routes` con polilínea codificada (`overview_polyline`), distancia en metros y duración en segundos.
* **Estado:** **Diseñada**

---

### CP-API-005: Respuesta controlada ante modo no soportado en Neiva (Buses)
* **Componente:** Backend API (`GoogleMapsController.cs` L67-81)
* **Requisito Asociado:** Decisión ADR-8 | **Caso de Uso:** CU03
* **Objetivo:** Confirmar que solicitar `travelMode=transit` en Neiva devuelve HTTP 404 con sugerencia de contingencia.
* **Precondiciones:** Backend en ejecución.
* **Datos de Entrada:**
  ```
  GET /api/maps/directions?originLat=2.9273&originLng=-75.2819&destinationLat=2.9450&destinationLng=-75.2980&travelMode=transit
  ```
* **Pasos de Ejecución:**
  1. Enviar la solicitud GET con `travelMode=transit`.
* **Resultado Esperado:** HTTP 404 Not Found con JSON `{ "message": "No existe una ruta en transporte público entre el origen y el destino. En Neiva puede que no haya rutas de bus disponibles para este trayecto. Intenta a pie o en automóvil." }`.
* **Estado:** **Diseñada**
* **Observaciones:** Comportamiento verificado en código en `GoogleMapsController.cs`.

---

### CP-API-006: Estimación de sostenibilidad y cálculo de CO₂ (POST `/api/sustainability/estimate`)
* **Componente:** Backend API (`SustainabilityController.cs`, `EstimateSustainabilityQueryHandler.cs`)
* **Requisito Asociado:** RF11 | **Caso de Uso:** CU16
* **Objetivo:** Validar que el cálculo matemático aplique la fórmula $d_{km} \times f_{emisión}$ usando los factores de `admin.transport_factors`.
* **Precondiciones:** Factores de transporte insertados en la base de datos.
* **Datos de Entrada:**
  ```json
  POST /api/sustainability/estimate
  Content-Type: application/json
  {
    "distanceMeters": 5000,
    "travelMode": "driving"
  }
  ```
* **Pasos de Ejecución:**
  1. Enviar solicitud de estimación.
* **Resultado Esperado:** HTTP 200 OK con `co2EmittedKg`, `co2SavedKg` y porcentaje de ahorro comparativo.
* **Estado:** **Diseñada**

---

### CP-API-007: Creación de reporte de obstáculo comunitario (POST `/api/obstacle-reports`)
* **Componente:** Backend API (`ObstacleReportsController.cs`)
* **Requisito Asociado:** RF17 | **Caso de Uso:** CU07
* **Objetivo:** Validar la persistencia de un reporte ciudadano con coordenadas espaciales.
* **Precondiciones:** Usuario autenticado con token JWT.
* **Datos de Entrada:**
  ```json
  POST /api/obstacle-reports
  Authorization: Bearer <TOKEN>
  Content-Type: application/json
  {
    "title": "Bache profundo en vía",
    "description": "Hueco en el carril derecho frente a la estación",
    "latitude": 2.9320,
    "longitude": -75.2840,
    "obstacleType": "pothole"
  }
  ```
* **Pasos de Ejecución:**
  1. Enviar petición POST autenticada.
* **Resultado Esperado:** HTTP 201 Created con el ID del reporte generado y estado inicial `pending_validation`.
* **Estado:** **Diseñada**

---

## 4. Casos de Prueba — Base de Datos y Persistencia (`CP-DB`)

### CP-DB-001: Verificación de los 6 esquemas DDL y extensión PostGIS
* **Componente:** Base de Datos (`EcoRuteandoDb`)
* **Requisito Asociado:** RNF11 | **Caso de Uso:** Arquitectura de Datos
* **Objetivo:** Constatar que la base de datos contenga los 6 esquemas físicos y la extensión PostGIS activa.
* **Precondiciones:** Contenedor de base de datos en ejecución.
* **Pasos de Ejecución:**
  1. Conectarse a `ecoRuteando_db` mediante `psql`.
  2. Ejecutar:
     ```sql
     SELECT schema_name FROM information_schema.schemata 
     WHERE schema_name IN ('security', 'mobility', 'community', 'admin', 'notifications', 'integrations');
     SELECT extname, extversion FROM pg_extension WHERE extname = 'postgis';
     ```
* **Resultado Esperado:** Se listan los 6 esquemas y la extensión `postgis` con versión 3.4 o 3.5.
* **Estado:** **Diseñada**

---

### CP-DB-002: Integridad de tabla física `admin.transport_factors`
* **Componente:** Base de Datos (`001_admin_module/005_create_table_transport_factors.sql`)
* **Requisito Asociado:** RF11 | **Caso de Uso:** CU16
* **Objetivo:** Comprobar que la tabla de factores contenga las columnas normativas y registros de factores para automóvil y peatón.
* **Precondiciones:** Migraciones de Liquibase ejecutadas.
* **Pasos de Ejecución:**
  ```sql
  SELECT transport_type, co2_factor_kg_km, calorie_factor_km FROM admin.transport_factors;
  ```
* **Resultado Esperado:** Existen registros con `transport_type = 'driving'` ($> 0\text{ kg } CO_2$) y `walking` ($= 0\text{ kg } CO_2$).
* **Estado:** **Diseñada**

---

### CP-DB-003: Almacenamiento geoespacial y tipo de geometría en `mobility.points_of_interest`
* **Componente:** Base de Datos (`004_mobility__module/001_create_table_points_of_interest.sql`)
* **Requisito Asociado:** RF15, RNF11 | **Caso de Uso:** CU17
* **Objetivo:** Validar que la columna `geom` almacene datos `geometry(Point, 4326)` con índice espacial GiST.
* **Pasos de Ejecución:**
  ```sql
  SELECT column_name, udt_name FROM information_schema.columns 
  WHERE table_schema = 'mobility' AND table_name = 'points_of_interest' AND column_name = 'geom';
  ```
* **Resultado Esperado:** La columna es de tipo geométrico y responde a funciones espaciales `ST_AsText(geom)`.
* **Estado:** **Diseñada**

---

## 5. Casos de Prueba — Aplicación Móvil (`CP-MOV`)

### CP-MOV-001: Navegación por pestañas (Tabs Layout en Expo Router)
* **Componente:** Móvil (`app/(tabs)/_layout.tsx`)
* **Requisito Asociado:** RF07, RNF03 | **Caso de Uso:** Navegación Móvil
* **Objetivo:** Verificar que el usuario pueda alternar entre las 5 pestañas de la app sin bloqueos.
* **Precondiciones:** Aplicación ejecutándose en Expo Go o emulador Android.
* **Pasos de Ejecución:**
  1. Abrir la aplicación.
  2. Pulsar sobre las pestañas: *Inicio*, *Rutas*, *Reportes*, *Historial* y *Perfil*.
* **Resultado Esperado:** Cada pantalla carga sus componentes respectivos de manera fluida y el indicador de pestaña activa cambia de color.
* **Estado:** **Diseñada**

---

### CP-MOV-002: Solicitud y manejo de permisos de geolocalización (GPS)
* **Componente:** Móvil (`app/(tabs)/plan-route.tsx`, `expo-location`)
* **Requisito Asociado:** RF09, RNF03 | **Caso de Uso:** CU03
* **Objetivo:** Verificar que la app solicite permisos de ubicación en primer plano y centre el mapa en la posición real del dispositivo.
* **Precondiciones:** Primera apertura de la pantalla de rutas.
* **Pasos de Ejecución:**
  1. Abrir la pestaña *"Planificar Ruta"*.
  2. Otorgar permiso *"Mientras la app está en uso"* en el diálogo nativo de Android.
* **Resultado Esperado:** El mapa obtiene las coordenadas del sensor GPS y posiciona el marcador del usuario en Neiva.
* **Estado:** **Diseñada**

---

### CP-MOV-003: Telemetría de maniobra y pre-alertas de voz con Text-to-Speech
* **Componente:** Móvil (`src/utils/geo.ts`, `plan-route.tsx` L643)
* **Requisito Asociado:** RF25, RNF01 | **Caso de Uso:** CU25
* **Objetivo:** Validar que al encontrarse a una distancia entre 40m y 80m de un giro (calculada con `haversineM`), se dispare la voz en español con `expo-speech`.
* **Precondiciones:** Ruta vehicular activa; volumen del dispositivo activado.
* **Datos de Entrada:** Simulación de movimiento del usuario acercándose al punto de maniobra ($< 80\text{ m}$).
* **Pasos de Ejecución:**
  1. Iniciar la navegación asistida en la app móvil.
  2. Simular el avance del vehículo hacia la coordenada de giro.
* **Resultado Esperado:** El motor de síntesis de voz pronuncia la instrucción en español (`es-ES`, rate 1.05); al llegar a $< 40\text{ m}$ del destino anuncia *"Has llegado a tu destino"*.
* **Estado:** **Diseñada**
* **Observaciones:** Código implementado en `plan-route.tsx`.
