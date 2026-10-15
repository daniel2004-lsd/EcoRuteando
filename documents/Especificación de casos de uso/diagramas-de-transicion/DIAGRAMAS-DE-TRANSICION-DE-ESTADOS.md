# Suite Maestra de Diagramas de Transición de Estados — EcoRuteando

Este documento recopila la modelación formal mediante **8 Diagramas de Transición de Estados UML 2.5 (Statecharts)** para las entidades y subsistemas del proyecto **EcoRuteando**.

---

## Índice General de Diagramas de Transición

| ID | Entidad o Subsistema Modelado | Requisitos Funcionales |
| :---: | :--- | :--- |
| **TE01** | Ciclo de Vida de una Ruta en Vehículo Particular | RF09, RF10, RF11, RF12, RF14, RF28 |
| **TE02** | Ciclo de Vida de un Trayecto Peatonal / Caminata a Pie | RF09, RF10, RF11, RF12 |
| **TE03** | Ciclo de Vida del Reporte Ciudadano de Obstáculo | RF17, RF18, RF24 |
| **TE04** | Ciclo de Vida de la Cuenta de Usuario | RF01, RF02, RF04, RF06, RF07 |
| **TE05** | Ciclo de Vida de la Sesión y Token JWT (TTL 24h) | RF02, RF04 |
| **TE06** | Ciclo de Vida de un Ticket de Soporte Técnico | RF30 |
| **TE07** | Ciclo de Vida de una Notificación del Sistema | RF25 |
| **TE08** | Ciclo de Vida de Parámetros Operativos del Sistema | RF23, RF24 |

---

### TE01: Ciclo de Vida de una Ruta / Trayecto en Vehículo Particular
- **Requisitos:** `RF09, RF10, RF11, RF12, RF14, RF28`
- **Descripción:** Estados formales por los que transita una ruta en automóvil eficiente: desde su formulación inicial hasta su ejecución asistida por voz y almacenamiento histórico para balances ambientales.

```mermaid
stateDiagram-v2
    [*] --> Borrador: Usuario ingresa origen y destino
    
    Borrador --> SolicitandoCalculo: Pulsa "Calcular Ruta"
    SolicitandoCalculo --> Calculada: API ORS responde + Cálculo CO₂ completado
    SolicitandoCalculo --> ErrorCalculo: Timeout de red / Coordenadas inalcanzables
    ErrorCalculo --> Borrador: Reintentar con nuevos puntos

    Calculada --> EnNavegacion: Conductor pulsa "Iniciar Recorrido"
    Calculada --> Descartada: Usuario cancela antes de iniciar

    state EnNavegacion {
        [*] --> GuiadoActivo: Conectar GPS y encender motor TTS
        GuiadoActivo --> Recalculando: Desvío detectado > 50m
        Recalculando --> GuiadoActivo: Nuevo trazado sincronizado
        GuiadoActivo --> ManiobraProxima: Distancia a giro < 40m
        ManiobraProxima --> GuiadoActivo: Locución TTS reproducida
    }

    EnNavegacion --> Completada: Conductor arriba al punto de destino
    EnNavegacion --> Cancelada: Conductor interrumpe el viaje manualmente

    Cancelada --> GuardadaHistorial: Guardar tramo parcial recorrido
    Completada --> GuardadaHistorial: Persistir trayecto final + CO₂ en PostgreSQL

    state GuardadaHistorial {
        [*] --> NoCalificada
        NoCalificada --> Calificada: Usuario califica con estrellas (CU09)
        NoCalificada --> MarcadaFavorita: Usuario pulsa "Añadir a Favoritas" (CU11)
        Calificada --> MarcadaFavorita: Usuario pulsa "Añadir a Favoritas" (CU11)
    }

    GuardadaHistorial --> Exportada: Usuario exporta a PDF o Excel (CU19)
    Descartada --> [*]
    Exportada --> [*]
```

---

### TE02: Ciclo de Vida del Trayecto Peatonal / Caminata a Pie
- **Requisitos:** `RF09, RF10, RF11, RF12`
- **Descripción:** Ciclo de estados para desplazamientos a pie: cálculo de andenes peatonales, métrica de 0 g CO₂ emitidos, pausa de caminata y consolidación en el podio ecológico.

```mermaid
stateDiagram-v2
    [*] --> PlanificandoCaminata: Usuario selecciona modo "A pie"
    PlanificandoCaminata --> TrazadoResuelto: Algoritmo peatonal asigna sendero seguro
    
    TrazadoResuelto --> CaminandoActivo: Pulsa "Comenzar Caminata"
    TrazadoResuelto --> Cancelado: Descarta itinerario

    state CaminandoActivo {
        [*] --> Cronometrando: Contador de pasos y tiempo en marcha
        Cronometrando --> Pausado: Usuario pulsa botón de pausa temporal
        Pausado --> Cronometrando: Reanuda desplazamiento
    }

    CaminandoActivo --> CaminataFinalizada: Arriba a destino peatonal
    CaminandoActivo --> Interrumpido: Usuario detiene registro antes de llegar

    CaminataFinalizada --> ConsolidadoEcologico: Se registra 100% CO₂ evitado vs auto
    Interrumpido --> ConsolidadoEcologico: Se computa el tramo parcial caminado

    ConsolidadoEcologico --> GuardadoHistorial: Persistido en perfil para métricas de salud
    GuardadoHistorial --> [*]
    Cancelado --> [*]
```

---

### TE03: Ciclo de Vida del Reporte Ciudadano de Obstáculo / Incidente
- **Requisitos:** `RF17, RF18, RF24`
- **Descripción:** Estados de los reportes viales: desde su creación georreferenciada con GPS, su confirmación por consenso de otros conductores y su retiro o archivado por expiración temporal.

```mermaid
stateDiagram-v2
    [*] --> CapturandoGPS: Usuario pulsa "Reportar Obstáculo"
    CapturandoGPS --> BorradorReporte: Coordenadas fijadas + Foto opcional
    
    BorradorReporte --> PendienteValidacion: Usuario confirma y envía reporte
    BorradorReporte --> Cancelado: Usuario aborta envío

    state PendienteValidacion {
        [*] --> VisibleLocal: Visible con pin amarillo de precaución
        VisibleLocal --> RecibiendoVotos: Notificación push despachada a zona
    }

    PendienteValidacion --> ConfirmadoComunidad: Votos "Confirmar" >= 3
    PendienteValidacion --> VerificadoOficial: Administrador valida reporte (CU24)
    PendienteValidacion --> DescartadoFalso: Votos "Descartar" >= 3 o Reporte Spam

    state ConfirmadoComunidad {
        [*] --> MarcadorRojo: Marcador visual de alta severidad en mapa
        MarcadorRojo --> VotoResolucion: Conductor reporta "Ya no está / Despejado"
    }

    ConfirmadoComunidad --> ResueltoComunidad: Votos "Despejado" >= 3
    ConfirmadoComunidad --> ExpiradoTemporal: Tiempo sin actividad > 24 horas
    VerificadoOficial --> CerradoAdmin: Moderador marca vía despejada

    ResueltoComunidad --> Archivado: Ocultar de mapa y preservar para estadísticas
    ExpiradoTemporal --> Archivado: Marcar inactivo
    CerradoAdmin --> Archivado: Marcar verificado y cerrado
    DescartadoFalso --> [*]
    Cancelado --> [*]
    Archivado --> [*]
```

---

### TE04: Ciclo de Vida de la Cuenta de Usuario
- **Requisitos:** `RF01, RF02, RF04, RF06, RF07`
- **Descripción:** Ciclo completo de identidad digital: modo invitado local, registro con verificación OTP, sesión activa con token JWT, congelamiento preventivo por ataques de fuerza bruta y baja definitiva.

```mermaid
stateDiagram-v2
    [*] --> Invitado: Abre app sin iniciar sesión (CU14)
    
    Invitado --> Registrando: Pulsa "Crear Cuenta"
    Registrando --> PendienteVerificacion: Formulario enviado + Hash Argon2id
    
    PendienteVerificacion --> Activo: Ingresa código OTP de correo exitosamente
    PendienteVerificacion --> ExpiradoRegistro: Código vence tras 15 minutos sin verificar
    ExpiradoRegistro --> Registrando: Solicitar reenvío de código

    state Activo {
        [*] --> Operativo
        Operativo --> PerfilModificado: Actualiza datos o avatar (CU12)
        PerfilModificado --> Operativo
    }

    Activo --> BloqueadoTemporal: 5 intentos fallidos consecutivos de contraseña
    BloqueadoTemporal --> Activo: Transcurren 15 minutos de enfriamiento
    BloqueadoTemporal --> RestableciendoClave: Solicita recuperación por email (CU02)
    RestableciendoClave --> Activo: Clave redefinida exitosamente

    Activo --> Eliminado: Usuario solicita baja voluntaria (CU13)
    Eliminado --> [*]: Credenciales destruidas y datos anonimizados para CO₂ global
```

---

### TE05: Ciclo de Vida de la Sesión y Token de Autenticación (JWT y Refresh Token)
- **Requisitos:** `RF02, RF04`
- **Descripción:** Estados temporales de tokens de acceso: emisión inicial con claims de rol, estado activo durante 24 horas, renovación en segundo plano con refresh token y expiración o revocación definitiva.

```mermaid
stateDiagram-v2
    [*] --> NoAutenticado: Inicio de la aplicación
    
    NoAutenticado --> Autenticando: Envío de credenciales de acceso
    Autenticando --> NoAutenticado: Fallo de credenciales (401)
    Autenticando --> TokenEmitido: Credenciales verificadas con Argon2id

    state TokenEmitido {
        [*] --> TokenActivo: JWT almacenado en SecureStore (TTL 24h)
        TokenActivo --> TokenPorExpirar: Tiempo restante < 1 hora
        TokenPorExpirar --> RenovandoToken: Petición interceptada con Refresh Token
        RenovandoToken --> TokenActivo: Nuevo Access Token emitido sin desloguear
        RenovandoToken --> TokenExpirado: Refresh Token inválido o revocado
    }

    TokenActivo --> SesionCerrada: Usuario presiona "Cerrar Sesión"
    TokenActivo --> TokenRevocado: Administrador invalida sesiones por seguridad
    TokenPorExpirar --> TokenExpirado: Cumple 24h sin renovación

    SesionCerrada --> NoAutenticado: Token borrado de memoria local
    TokenRevocado --> NoAutenticado: Forzar pantalla de login
    TokenExpirado --> NoAutenticado: Redirección inmediata a autenticación
    NoAutenticado --> [*]
```

---

### TE06: Ciclo de Vida de un Ticket de Soporte Técnico y Mesa de Ayuda
- **Requisitos:** `RF30`
- **Descripción:** Gestión formal de incidencias técnicas: radicación ciudadana, asignación al equipo de soporte, fase de investigación, respuesta al usuario y cierre con encuesta de satisfacción.

```mermaid
stateDiagram-v2
    [*] --> RadicandoTicket: Usuario redacta solicitud de ayuda (CU23)
    RadicandoTicket --> AbiertoPendiente: Ticket registrado con código único de seguimiento
    
    AbiertoPendiente --> EnAtencion: Asignado a agente de soporte técnico
    
    state EnAtencion {
        [*] --> InvestigandoFallo: Revisión de logs y capturas adjuntas
        InvestigandoFallo --> EsperandoRespuestaUsuario: Agente solicita más información
        EsperandoRespuestaUsuario --> InvestigandoFallo: Usuario aporta datos requeridos
    }

    EnAtencion --> Resuelto: Agente remite solución o corrección del sistema
    
    Resuelto --> CerradoConforme: Usuario valida y acepta solución
    Resuelto --> Reabierto: Usuario indica persistencia del problema
    Reabierto --> EnAtencion: Reingresa al ciclo de análisis

    Resuelto --> CerradoAutomatico: 5 días sin réplica tras emitir respuesta
    CerradoConforme --> [*]
    CerradoAutomatico --> [*]
```

---

### TE07: Ciclo de Vida de una Notificación del Sistema (Push / In-App)
- **Requisitos:** `RF25`
- **Descripción:** Ciclo de comunicaciones del sistema: redacción administrativa, programación horaria, encolado en Firebase Cloud Messaging, entrega al dispositivo móvil y lectura por el destinatario.

```mermaid
stateDiagram-v2
    [*] --> RedactandoNotificacion: Admin prepara título, mensaje y audiencia objetivo
    RedactandoNotificacion --> Descartada: Cancela antes de guardar
    
    RedactandoNotificacion --> Programada: Fecha de despacho configurada a futuro
    RedactandoNotificacion --> EnColaEnvio: Despacho instantáneo solicitado

    Programada --> EnColaEnvio: El temporizador del servidor alcanza la hora fijada
    
    state EnColaEnvio {
        [*] --> ProcesandoSegmento: Filtro de tokens FCM por ciudad o rol
        ProcesandoSegmento --> EnviandoPush: Despacho a servidores de Google / Apple
    }

    EnColaEnvio --> EntregadaAlDispositivo: Handshake exitoso con el sistema operativo
    EnColaEnvio --> ErrorDespacho: Falla de red en API de notificaciones
    ErrorDespacho --> EnColaEnvio: Reintento controlado (máx 3)

    EntregadaAlDispositivo --> NoLeida: Notificación visible en bandeja del teléfono
    NoLeida --> Leida: Usuario toca la notificación y abre la app
    NoLeida --> ExpiradaBandeja: Transcurren 30 días sin interacción

    Leida --> Archivada: Guardada en historial de alertas
    ExpiradaBandeja --> Archivada
    Archivada --> [*]
    Descartada --> [*]
```

---

### TE08: Ciclo de Vida de Parámetros Operativos del Sistema
- **Requisitos:** `RF23, RF24`
- **Descripción:** Manejo de variables globales de entorno: factores de cálculo de CO₂, límites geográficos, valores por defecto de fábrica, validación de rangos numéricos y propagación en caliente en caché.

```mermaid
stateDiagram-v2
    [*] --> ValorPredeterminado: Inicialización de fábrica en base de datos
    
    ValorPredeterminado --> EnEdicion: Administrador modifica variable en panel web (CU28)
    
    state EnEdicion {
        [*] --> ValidandoSintaxis: Chequeo de tipo de dato y no nulo
        ValidandoSintaxis --> ValidandoRango: Chequeo de límites físicos (ej. CO₂ > 0)
    }

    EnEdicion --> InvalidoRechazado: Valor fuera de rango permitido (Error visual)
    InvalidoRechazado --> EnEdicion: Administrador corrige el número ingresado

    EnEdicion --> ConfirmadoSeguridad: Administrador valida en modal de confirmación
    ConfirmadoSeguridad --> PersistidoEnBD: Transacción UPDATE en tabla configuracion_sistema
    
    PersistidoEnBD --> PropagadoEnMemoria: Backend invalida caché IMemoryCache y recarga variables
    PersistidoEnBD --> Auditado: Registro automático en tabla auditoria_seguridad (RF24)

    PropagadoEnMemoria --> OperativoEnProduccion: Variable activa para todas las peticiones móviles
    
    OperativoEnProduccion --> EnEdicion: Nueva modificación solicitada
    OperativoEnProduccion --> RestaurandoFabrica: Administrador pulsa "Restablecer Valores por Defecto"
    RestaurandoFabrica --> ValorPredeterminado: Variables sobreescritas a línea base inicial
```

---
