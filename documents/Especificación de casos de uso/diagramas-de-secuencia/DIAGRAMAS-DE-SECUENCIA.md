# Suite Maestra de Diagramas de Secuencia UML — EcoRuteando

Este documento recopila la modelación dinámica temporal completa mediante **12 Diagramas de Secuencia UML 2.5** para el proyecto **EcoRuteando**, cubriendo de extremo a extremo todas las interacciones críticas de la plataforma.

---

## Índice General de Diagramas de Secuencia

| ID | Flujo del Sistema | Casos de Uso Vinculados | Requisitos Funcionales |
| :---: | :--- | :--- | :--- |
| **DS01** | Registro de Usuario con Hash Argon2id y Envío OTP | CU01, CU15 | RF01, RF04, RF08 |
| **DS02** | Inicio de Sesión y Emisión de Token JWT | CU05 | RF02, RF04, RF24 |
| **DS03** | Recuperación de Contraseña Criptográfica | CU02 | RF03, RF04 |
| **DS04** | Planificación de Ruta en Auto y Cálculo de CO₂ | CU03, CU06, CU16, CU27 | RF09, RF10, RF11, RF13, RF26, RF27 |
| **DS05** | Desplazamiento Peatonal Cero Emisiones | CU03, CU06, CU16 | RF09, RF10, RF11 |
| **DS06** | Asistencia de Navegación por Voz (TTS) y GPS | CU25 | RF25, RF28 |
| **DS07** | Consulta Geoespacial de Puntos de Interés (POIs) | CU17 | RF15 |
| **DS08** | Registro de Reporte Ciudadano con Captura GPS | CU07, CU18 | RF17, RF18, RF25 |
| **DS09** | Validación Comunitaria por Votos y Auto-Cierre | CU22 | RF18, RF22 |
| **DS10** | Calificación y Retroalimentación de Trayectos | CU09, CU11 | RF14, RF16 |
| **DS11** | Exportación de Historial y Reportes (PDF/Excel) | CU08, CU19 | RF20, RF22, RF29 |
| **DS12** | Gestión Administrativa y Auditoría de Seguridad | CU24, CU28 | RF21, RF23, RF24 |

---

### DS01: Registro de Nuevo Usuario con Hash Argon2id y Envío de Correo OTP
- **Casos de Uso:** `CU01, CU15` | **Requisitos:** `RF01, RF04, RF08`
- **Descripción:** Modela el flujo de registro, validación de contraseña robusta, aplicación de hash con salt mediante Argon2id, almacenamiento seguro y despacho de código de verificación vía SMTP.

```mermaid
sequenceDiagram
    autonumber
    actor V as 👤 Visitante
    participant UI as 📱 App Móvil / Web
    participant AuthCtrl as 🚪 AuthController (.NET)
    participant SecSvc as 🛡️ SecurityService
    participant HashEngine as 🔒 Argon2id Hash Engine
    participant DB as 💾 PostgreSQL (Usuarios)
    participant SMTP as 📧 Servicio SMTP (Email)

    V->>UI: Ingresa datos personales, credenciales y acepta Términos (CU15)
    activate UI
    UI->>UI: Validar coincidencia de passwords y formato RFC de correo
    UI->>AuthCtrl: POST /api/v1/auth/register (nombre, email, password)
    activate AuthCtrl
    AuthCtrl->>SecSvc: RegistrarNuevoUsuarioAsync(dto)
    activate SecSvc
    SecSvc->>DB: SELECT id FROM usuarios WHERE email = @email
    activate DB
    DB-->>SecSvc: NULL (Correo disponible)
    deactivate DB
    SecSvc->>HashEngine: GenerarSaltYHash(password, memoria=64MB, iteraciones=3)
    activate HashEngine
    HashEngine-->>SecSvc: Retorna (hash_argon2id, salt)
    deactivate HashEngine
    SecSvc->>DB: INSERT INTO usuarios (email, hash, salt, estado='PENDIENTE_OTP')
    activate DB
    DB-->>SecSvc: ID de usuario generado
    deactivate DB
    SecSvc->>SMTP: EnviarCodigoOTP(email, codigo_6_digitos, exp=15min)
    activate SMTP
    SMTP-->>SecSvc: 200 OK (Email encolado)
    deactivate SMTP
    SecSvc-->>AuthCtrl: RegistroExitosoDTO
    deactivate SecSvc
    AuthCtrl-->>UI: 201 Created (Token temporal para validación OTP)
    deactivate AuthCtrl
    UI-->>V: Muestra pantalla: "Ingrese código enviado a su correo"
    deactivate UI
```

---

### DS02: Inicio de Sesión, Validación de Credenciales y Emisión de Token JWT
- **Casos de Uso:** `CU05` | **Requisitos:** `RF02, RF04, RF24`
- **Descripción:** Verificación criptográfica de credenciales, protección contra ataques de fuerza bruta mediante bloqueo temporal tras 5 intentos y expedición de token JWT con expiración controlada.

```mermaid
sequenceDiagram
    autonumber
    actor U as 👤 Usuario / Conductor
    participant UI as 📱 Interfaz de Usuario
    participant AuthCtrl as 🚪 AuthController (.NET)
    participant SecSvc as 🛡️ SecurityService
    participant HashEngine as 🔒 Argon2id Engine
    participant DB as 💾 PostgreSQL (Usuarios)
    participant AuditLog as 📝 AuditLogger

    U->>UI: Ingresa email y contraseña
    activate UI
    UI->>AuthCtrl: POST /api/v1/auth/login (email, password)
    activate AuthCtrl
    AuthCtrl->>SecSvc: ValidarCredencialesAsync(email, password)
    activate SecSvc
    SecSvc->>DB: SELECT id, hash, salt, intentos_fallidos, estado, rol FROM usuarios WHERE email = @email
    activate DB
    DB-->>SecSvc: Registro de usuario
    deactivate DB
    alt Usuario bloqueado temporalmente
        SecSvc-->>AuthCtrl: Error: Cuenta temporalmente suspendida
        AuthCtrl-->>UI: 403 Forbidden ("Espere 15 min")
    else Cuenta activa
        SecSvc->>HashEngine: Verify(password, hash, salt)
        activate HashEngine
        HashEngine-->>SecSvc: Resultado Booleano (isValid)
        deactivate HashEngine
        alt Contraseña Errónea
            SecSvc->>DB: UPDATE usuarios SET intentos_fallidos = intentos_fallidos + 1
            opt Intentos fallidos >= 5
                SecSvc->>DB: UPDATE usuarios SET estado = 'BLOQUEADO_TEMPORAL'
                SecSvc->>AuditLog: LogBloqueoSeguridad(email, ip)
            end
            SecSvc-->>AuthCtrl: Error 401 Credenciales Inválidas
            AuthCtrl-->>UI: 401 Unauthorized
        else Contraseña Válida
            SecSvc->>DB: UPDATE usuarios SET intentos_fallidos = 0, ultimo_login = NOW()
            SecSvc->>SecSvc: GenerarJWT(userId, rol, exp=24h)
            SecSvc->>AuditLog: LogAccesoExitoso(userId, ip)
            SecSvc-->>AuthCtrl: AuthResultDTO (token_jwt, user_info)
            deactivate SecSvc
            AuthCtrl-->>UI: 200 OK (Token JWT)
            deactivate AuthCtrl
            UI->>UI: Guardar JWT en almacenamiento seguro
            UI-->>U: Redirecciona al Mapa Principal
        end
    end
    deactivate UI
```

---

### DS03: Recuperación de Contraseña con Token Temporal Criptográfico
- **Casos de Uso:** `CU02` | **Requisitos:** `RF03, RF04`
- **Descripción:** Generación de token firmado de restablecimiento con expiración corta, envío por SMTP y actualización de contraseña previa verificación.

```mermaid
sequenceDiagram
    autonumber
    actor U as 👤 Usuario
    participant UI as 📱 App Móvil / Web
    participant AuthCtrl as 🚪 AuthController (.NET)
    participant TokenSvc as 🔑 TokenService
    participant DB as 💾 PostgreSQL (Tokens / Usuarios)
    participant SMTP as 📧 Servicio SMTP

    U->>UI: Solicita "Olvidé mi contraseña" e ingresa correo
    activate UI
    UI->>AuthCtrl: POST /api/v1/auth/forgot-password (email)
    activate AuthCtrl
    AuthCtrl->>TokenSvc: GenerarTokenRestablecimiento(email)
    activate TokenSvc
    TokenSvc->>DB: INSERT INTO reset_tokens (user_id, token_hash, exp=1h, usado=false)
    activate DB
    DB-->>TokenSvc: Token persistido
    deactivate DB
    TokenSvc->>SMTP: EnviarEmailRecuperacion(email, reset_link_con_token)
    activate SMTP
    SMTP-->>TokenSvc: Email despachado
    deactivate SMTP
    TokenSvc-->>AuthCtrl: Proceso completado
    deactivate TokenSvc
    AuthCtrl-->>UI: 200 OK ("Si el correo existe, recibirá instrucciones")
    deactivate AuthCtrl
    UI-->>U: Aviso visual informativo

    Note over U, UI: El usuario abre el enlace recibido en su correo
    U->>UI: Ingresa nueva contraseña y token
    UI->>AuthCtrl: POST /api/v1/auth/reset-password (token, new_password)
    activate AuthCtrl
    AuthCtrl->>DB: Validar token no expirado y no usado
    activate DB
    DB-->>AuthCtrl: Token válido
    AuthCtrl->>DB: UPDATE usuarios SET hash = nuevo_hash, salt = nuevo_salt; UPDATE reset_tokens SET usado=true
    deactivate DB
    AuthCtrl-->>UI: 200 OK ("Contraseña actualizada exitosamente")
    deactivate AuthCtrl
    UI-->>U: Notifica éxito y redirige a Iniciar Sesión
    deactivate UI
```

---

### DS04: Planificación de Ruta Óptima en Auto Particular, Cálculo de CO₂ y Respaldo PostGIS
- **Casos de Uso:** `CU03, CU06, CU16, CU27` | **Requisitos:** `RF09, RF10, RF11, RF13, RF26, RF27`
- **Descripción:** Cálculo de trayectos vehiculares eficientes, consulta a la API GIS, estimación de combustible y CO₂ evitado vs. promedio de la ciudad y persistencia en base de datos geoespacial.

```mermaid
sequenceDiagram
    autonumber
    actor C as 🧑‍💼 Conductor
    participant UI as 📱 App Móvil
    participant RutasCtrl as 🌐 RutasController (.NET)
    participant RoutingSvc as ⚙️ RoutingService
    participant ORS as 🗺️ OpenRouteService API
    participant EcoEngine as 🌿 EcoMetricEngine
    participant PostGIS as 💾 PostgreSQL / PostGIS

    C->>UI: Define origen y destino en Neiva (o dirección frecuente CU27)
    activate UI
    UI->>RutasCtrl: POST /api/v1/routes/plan (origen, destino, modo='vehiculo_eco')
    activate RutasCtrl
    RutasCtrl->>RoutingSvc: CalcularRutaOptimaAsync(coords)
    activate RoutingSvc
    RoutingSvc->>ORS: GET /v2/directions/driving-car (coords, avoid_poligonos_obras)
    activate ORS
    ORS-->>RoutingSvc: GeoJSON LineString (trazado, distancia_km, duracion_s)
    deactivate ORS
    RoutingSvc->>EcoEngine: EstimarImpactoCO2(distancia_km, modo='auto_gasolina_eficiente')
    activate EcoEngine
    Note over EcoEngine: Emisión calculada = dist * 138 g/km.<br/>CO₂ evitado vs ruta congestionada.
    EcoEngine-->>RoutingSvc: DTO MetricasCO2 (emitido_g, evitado_g)
    deactivate EcoEngine
    RoutingSvc->>PostGIS: INSERT INTO rutas_consultadas (geom, distancia, tiempo, co2_g)
    activate PostGIS
    PostGIS-->>RoutingSvc: RutaID persistido
    deactivate PostGIS
    RoutingSvc-->>RutasCtrl: RutaCalculadaDTO
    deactivate RoutingSvc
    RutasCtrl-->>UI: 200 OK (Geometría vectorial, maniobras, métricas ambientales)
    deactivate RutasCtrl
    UI->>UI: Renderizar capa vectorial sobre mapa y tarjeta de ahorro CO₂
    UI-->>C: Visualiza ruta ecológica en pantalla
    deactivate UI
```

---

### DS05: Desplazamiento a Pie (Modo Peatonal Cero Emisiones) y Comparativa Ambiental
- **Casos de Uso:** `CU03, CU06, CU16` | **Requisitos:** `RF09, RF10, RF11`
- **Descripción:** Resolución de rutas a pie priorizando andenes y zonas seguras peatonales de Neiva, computando 0 gramos de CO₂ emitidos y calculando el 100% de emisiones evitadas.

```mermaid
sequenceDiagram
    autonumber
    actor P as 🚶 Ciudadano Peatón
    participant UI as 📱 App Móvil
    participant RutasCtrl as 🌐 RutasController
    participant RoutingSvc as ⚙️ RoutingService
    participant ORS as 🗺️ OpenRouteService (Foot-Walking)
    participant EcoEngine as 🌿 EcoMetricEngine

    P->>UI: Selecciona modo "A pie / Caminata" e ingresa destino
    activate UI
    UI->>RutasCtrl: POST /api/v1/routes/plan (origen, destino, modo='caminata')
    activate RutasCtrl
    RutasCtrl->>RoutingSvc: ResolverRutaPeatonalAsync(coords)
    activate RoutingSvc
    RoutingSvc->>ORS: GET /v2/directions/foot-walking (coords)
    activate ORS
    ORS-->>RoutingSvc: GeoJSON Peatonal (distancia_km, duracion_caminata_s, pasos_aprox)
    deactivate ORS
    RoutingSvc->>EcoEngine: CalcularAhorroCeroEmisiones(distancia_km)
    activate EcoEngine
    Note over EcoEngine: Emisión propia = 0 g CO₂.<br/>Ahorro directo = 100% de la emisión vehicular.
    EcoEngine-->>RoutingSvc: MetricasPeatonales (co2_emitido=0, co2_ahorrado=dist*142g, calorias)
    deactivate EcoEngine
    RoutingSvc-->>RutasCtrl: RutaPeatonalDTO
    deactivate RoutingSvc
    RutasCtrl-->>UI: 200 OK (Trazado peatonal y felicitación ecológica)
    deactivate RutasCtrl
    UI->>UI: Mostrar ruta peatonal y badge: "¡100% libre de emisiones!"
    UI-->>P: Despliega itinerario de caminata
    deactivate UI
```

---

### DS06: Navegación Guiada por GPS con Asistencia Auditiva Text-to-Speech (TTS)
- **Casos de Uso:** `CU25` | **Requisitos:** `RF25, RF28`
- **Descripción:** Ciclo continuo de telemetría GPS, seguimiento de la posición en tiempo real, detección de proximidad a maniobras de giro y síntesis auditiva en cabina mediante el motor TTS nativo.

```mermaid
sequenceDiagram
    autonumber
    actor C as 🧑‍💼 Conductor
    participant UI as 📱 App Móvil (React Native)
    participant GPS as 📡 Módulo GPS Dispositivo
    participant NavEngine as 🧭 NavigationEngine Local
    participant TTS as 🔊 Motor TTS Nativo (expo-speech)

    C->>UI: Pulsa "Iniciar Navegación Guiada"
    activate UI
    UI->>GPS: Iniciar rastreo continuo (intervalo=1s, exactitud='alta')
    activate GPS
    UI->>TTS: SpeakAsync("Iniciando recorrido. Avance 200 metros por Calle 8")
    activate TTS
    TTS-->>C: Audio de bienvenida
    deactivate TTS

    loop Telemetría GPS en Tránsito
        GPS-->>NavEngine: Emitir posición actual (lat, lng, rumbo, velocidad)
        NavEngine->>NavEngine: Proyectar posición sobre el LineString de la ruta
        alt Desvío de ruta detectado (> 50 metros)
            NavEngine->>UI: Notificar evento "Ruta Desviada"
            UI->>TTS: SpeakAsync("Recalculando ruta...")
            UI->>UI: Solicitar nuevo trazado al backend en segundo plano
        else En curso normal
            NavEngine->>NavEngine: Medir distancia a siguiente maniobra
            alt Distancia al giro <= 40 metros y no anunciada
                NavEngine->>TTS: SpeakAsync("En 40 metros, gire a la derecha")
                activate TTS
                TTS-->>C: Indicación auditiva clara
                deactivate TTS
            end
        end
    end

    NavEngine->>NavEngine: Distancia al destino < 10 metros
    NavEngine->>TTS: SpeakAsync("Ha llegado a su destino. Recorrido completado")
    UI->>GPS: Detener rastreo continuo
    deactivate GPS
    UI-->>C: Muestra resumen final del viaje y ahorro ambiental
    deactivate UI
```

---

### DS07: Consulta Geoespacial de Puntos de Interés (POIs) e Inserción como Parada
- **Casos de Uso:** `CU17` | **Requisitos:** `RF15`
- **Descripción:** Filtrado espacial por categoría y radio de proximidad utilizando funciones ST_DWithin de PostGIS, permitiendo agregar talleres o parqueaderos como paradas intermedias en la ruta.

```mermaid
sequenceDiagram
    autonumber
    actor C as 🧑‍💼 Ciudadano / Conductor
    participant UI as 📱 App Móvil
    participant PoisCtrl as 🌐 PoisController (.NET)
    participant PostGIS as 🗺️ PostGIS (Tabla POIs)
    participant RoutingSvc as ⚙️ RoutingService

    C->>UI: Abre panel "Puntos de Interés" y selecciona filtro: "Talleres / Parqueaderos"
    activate UI
    UI->>PoisCtrl: GET /api/v1/pois/nearby (lat, lng, radio_m=3000, categoria='TALLER')
    activate PoisCtrl
    PoisCtrl->>PostGIS: SELECT id, nombre, geom, ST_Distance(geom, @punto) FROM pois WHERE categoria=@cat AND ST_DWithin(geom, @punto, 3000)
    activate PostGIS
    PostGIS-->>PoisCtrl: Listado ordenado por proximidad
    deactivate PostGIS
    PoisCtrl-->>UI: 200 OK (PoisDTO[])
    deactivate PoisCtrl
    UI->>UI: Dibujar pines temáticos en el mapa
    C->>UI: Toca un POI y pulsa "Añadir como parada en mi ruta"
    UI->>RoutingSvc: Recalcular ruta con waypoint intermedio
    UI-->>C: Actualiza trazado de viaje incluyendo la parada seleccionada
    deactivate UI
```

---

### DS08: Registro de Reporte Ciudadano con Captura Satelital GPS y Notificación Push
- **Casos de Uso:** `CU07, CU18` | **Requisitos:** `RF17, RF18, RF25`
- **Descripción:** Georreferenciación de obstáculos en vía, validación de polígono urbano, almacenamiento en PostGIS y difusión push inmediata a conductores que transiten a menos de 3 km.

```mermaid
sequenceDiagram
    autonumber
    actor R as 🧑‍💼 Reportero en Vía
    participant UI as 📱 App Móvil
    participant GPS as 📡 GPS del Dispositivo
    participant IncCtrl as 🌐 IncidentesController (.NET)
    participant PostGIS as 💾 Base de Datos PostGIS
    participant PushHub as 📲 Push Notification Hub (FCM)
    actor Otros as 👥 Conductores en Zona

    R->>UI: Pulsa botón "Reportar Obstáculo"
    activate UI
    UI->>GPS: Obtener coordenadas precisas actuales
    GPS-->>UI: (lat, lng, precision=4m)
    R->>UI: Selecciona tipo ("Hueco severo", "Vía inundada") y añade foto opcional
    UI->>IncCtrl: POST /api/v1/incidents (tipo, coords, descripcion, foto) [Bearer JWT]
    activate IncCtrl
    IncCtrl->>IncCtrl: Verificar que coordenadas pertenezcan al perímetro de Neiva
    IncCtrl->>PostGIS: INSERT INTO incidentes (geom, tipo, estado='PENDIENTE_VALIDACION', votos_confirmar=1)
    activate PostGIS
    PostGIS-->>IncCtrl: IncidenteID generado
    deactivate PostGIS
    IncCtrl->>PushHub: EnviarAlertaPerimetral(coords, radio_km=3, "Nuevo incidente reportado")
    activate PushHub
    PushHub-->>Otros: Notificación push con icono de alerta vial
    deactivate PushHub
    IncCtrl-->>UI: 201 Created (IncidenteDTO)
    deactivate IncCtrl
    UI-->>R: Notificación en pantalla: "¡Reporte publicado! Gracias por colaborar"
    deactivate UI
```

---

### DS09: Validación Comunitaria de Incidentes por Votación en Tiempo Real y Auto-Cierre
- **Casos de Uso:** `CU22` | **Requisitos:** `RF18, RF22`
- **Descripción:** Ciclo colaborativo de votación donde conductores cercanos confirman o descartan reportes, automatizando el archivo o retiro del marcador sin intervención humana.

```mermaid
sequenceDiagram
    autonumber
    actor C as 👥 Conductor de la Comunidad
    participant UI as 📱 App Móvil
    participant IncCtrl as 🌐 IncidentesController
    participant VoteSvc as ⚖️ VotingService
    participant PostGIS as 💾 PostGIS

    C->>UI: Se aproxima a la zona del reporte marcado en el mapa
    activate UI
    UI->>UI: Detecta proximidad (< 50 metros del marcador)
    UI-->>C: Prompt emergente: "¿El obstáculo sigue presente en la vía?"
    C->>UI: Pulsa "Ya no está / Despejado" (Voto Descartar)
    UI->>IncCtrl: POST /api/v1/incidents/{id}/vote (tipo_voto='DESPEJADO') [Bearer JWT]
    activate IncCtrl
    IncCtrl->>VoteSvc: ProcesarVotoComunitarioAsync(incidenteId, userId, 'DESPEJADO')
    activate VoteSvc
    VoteSvc->>PostGIS: UPDATE incidentes SET votos_despejado = votos_despejado + 1 WHERE id = @id
    activate PostGIS
    PostGIS-->>VoteSvc: Totales actualizados (votos_confirmar=1, votos_despejado=3)
    deactivate PostGIS
    alt Votos despejado >= Umbral del sistema (3 votos)
        VoteSvc->>PostGIS: UPDATE incidentes SET estado = 'RESUELTO_COMUNITARIO', fecha_cierre = NOW()
        VoteSvc-->>IncCtrl: Incidente resuelto y archivado
        IncCtrl-->>UI: 200 OK (Incidente cerrado)
        UI->>UI: Remover marcador del mapa en todos los clientes
    else Aún no alcanza umbral
        VoteSvc-->>IncCtrl: Voto computado
        IncCtrl-->>UI: 200 OK (Voto registrado)
    end
    deactivate VoteSvc
    deactivate IncCtrl
    UI-->>C: Agradecimiento: "Tu aporte mantiene el mapa actualizado"
    deactivate UI
```

---

### DS10: Consulta, Calificación y Retroalimentación de Trayecto con Estrellas
- **Casos de Uso:** `CU09, CU11` | **Requisitos:** `RF14, RF16`
- **Descripción:** Al finalizar un recorrido, el usuario califica el estado de la vía de 1 a 5 estrellas, redacta observaciones de seguridad y opcionalmente guarda el trayecto como favorito con un alias.

```mermaid
sequenceDiagram
    autonumber
    actor U as 🧑‍💼 Usuario Registrado
    participant UI as 📱 App Móvil
    participant RutasCtrl as 🌐 RutasController
    participant FavCtrl as ⭐ FavoritasController
    participant DB as 💾 PostgreSQL

    U->>UI: Finaliza trayecto y accede a la tarjeta de retroalimentación
    activate UI
    U->>UI: Asigna 5 estrellas y redacta comentario: "Vía rápida, poco tráfico"
    UI->>RutasCtrl: POST /api/v1/routes/{id}/rate (rating=5, comentario="...") [Bearer JWT]
    activate RutasCtrl
    RutasCtrl->>DB: INSERT INTO calificaciones (ruta_id, user_id, rating, comentario, fecha)
    activate DB
    DB-->>RutasCtrl: 201 Created
    deactivate DB
    RutasCtrl-->>UI: 200 OK (Calificación guardada)
    deactivate RutasCtrl

    opt Usuario decide marcarla como favorita
        U->>UI: Pulsa "Guardar en Favoritas" y asigna alias: "Ruta Casa - Trabajo"
        UI->>FavCtrl: POST /api/v1/routes/favorites (ruta_id, alias="Ruta Casa - Trabajo")
        activate FavCtrl
        FavCtrl->>DB: INSERT INTO rutas_favoritas (user_id, ruta_id, alias)
        activate DB
        DB-->>FavCtrl: Favorita persistida
        deactivate DB
        FavCtrl-->>UI: 200 OK (Favorita agregada)
        deactivate FavCtrl
    end
    UI-->>U: Notifica éxito y regresa al menú principal
    deactivate UI
```

---

### DS11: Generación y Exportación de Historial y Reportes Estadísticos en PDF y Excel
- **Casos de Uso:** `CU08, CU19` | **Requisitos:** `RF20, RF22, RF29`
- **Descripción:** Procesamiento de consultas complejas de trayectos por rango temporal, agregación de métricas de CO₂ y compilación de archivos descargables en formatos PDF y Excel (.xlsx).

```mermaid
sequenceDiagram
    autonumber
    actor A as 🛡️ Administrador / Usuario
    participant UI as 💻 Portal Web / App
    participant ExportCtrl as 📄 ExportController (.NET)
    participant ReportEngine as 📊 ReportService (QuestPDF / ClosedXML)
    participant DB as 💾 PostgreSQL (Vistas Materializadas)

    A->>UI: Selecciona rango de fechas (01/01 a 31/01) y formato "Excel (.xlsx)"
    activate UI
    UI->>ExportCtrl: GET /api/v1/reports/export?from=...&to=...&format=xlsx [Bearer JWT]
    activate ExportCtrl
    ExportCtrl->>DB: SELECT * FROM view_historial_consolidado WHERE fecha BETWEEN @from AND @to
    activate DB
    DB-->>ExportCtrl: Colección de 1,500 registros con métricas de CO₂
    deactivate DB
    ExportCtrl->>ReportEngine: GenerarLibroExcelAsync(registros, metricas_resumen)
    activate ReportEngine
    ReportEngine->>ReportEngine: Formatear celdas, gráficos de torta y balances de emisiones
    ReportEngine-->>ExportCtrl: MemoryStream (bytes del archivo .xlsx)
    deactivate ReportEngine
    ExportCtrl-->>UI: 200 OK (Content-Type: application/vnd.openxmlformats-officedocument..., file_bytes)
    deactivate ExportCtrl
    UI->>UI: Disparar descarga en navegador: "EcoRuteando_Reporte_2026.xlsx"
    UI-->>A: Notifica: "Archivo descargado con éxito"
    deactivate UI
```

---

### DS12: Gestión Administrativa de Usuarios, Modificación de Roles y Log de Auditoría
- **Casos de Uso:** `CU24, CU28` | **Requisitos:** `RF21, RF23, RF24`
- **Descripción:** Supervisión administrativa de usuarios, revocación o asignación de privilegios de moderador/administrador y registro inmutable en bitácora de auditoría de seguridad.

```mermaid
sequenceDiagram
    autonumber
    actor SuperAdmin as 🛡️ Super Administrador
    participant WebUI as 💻 Portal Web Admin
    participant AdminCtrl as ⚙️ AdminUsersController
    participant SecSvc as 🛡️ SecurityService
    participant DB as 💾 PostgreSQL (Usuarios & Roles)
    participant AuditLog as 📝 AuditLogger (Tabla auditoria_seguridad)

    SuperAdmin->>WebUI: Accede a "Gestión de Usuarios", busca usuario por correo y selecciona "Asignar Rol: Moderador"
    activate WebUI
    WebUI->>AdminCtrl: PUT /api/v1/admin/users/{id}/role (new_role='MODERADOR') [Bearer JWT SuperAdmin]
    activate AdminCtrl
    AdminCtrl->>SecSvc: ValidarPermisosSuperAdmin(callerId)
    activate SecSvc
    SecSvc-->>AdminCtrl: Permisos confirmados
    deactivate SecSvc
    AdminCtrl->>DB: UPDATE usuarios SET rol = 'MODERADOR' WHERE id = @id
    activate DB
    DB-->>AdminCtrl: 1 fila afectada
    deactivate DB
    AdminCtrl->>AuditLog: RegistrarAccionCritica(superAdminId, "CAMBIO_ROL", targetUserId, "MODERADOR", ip_origen)
    activate AuditLog
    AuditLog->>DB: INSERT INTO auditoria_seguridad (actor_id, accion, target_id, detalle, fecha)
    deactivate AuditLog
    AdminCtrl-->>WebUI: 200 OK ("Rol actualizado exitosamente")
    deactivate AdminCtrl
    WebUI-->>SuperAdmin: Muestra confirmación y actualiza tabla de padrón en vivo
    deactivate WebUI
```

---
