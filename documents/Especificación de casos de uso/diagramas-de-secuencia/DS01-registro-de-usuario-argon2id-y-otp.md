# DS01: Registro de Nuevo Usuario con Hash Argon2id y Envío de Correo OTP

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | DS01 |
| **Nombre** | DS01: Registro de Nuevo Usuario con Hash Argon2id y Envío de Correo OTP |
| **Casos de Uso Vinculados** | CU01, CU15 |
| **Requisitos Funcionales** | RF01, RF04, RF08 |

---

### Descripción del Flujo
Modela el flujo de registro, validación de contraseña robusta, aplicación de hash con salt mediante Argon2id, almacenamiento seguro y despacho de código de verificación vía SMTP.

---

### Diagrama de Secuencia UML

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
