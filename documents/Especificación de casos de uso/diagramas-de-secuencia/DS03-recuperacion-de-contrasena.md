# DS03: Recuperación de Contraseña con Token Temporal Criptográfico

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | DS03 |
| **Nombre** | DS03: Recuperación de Contraseña con Token Temporal Criptográfico |
| **Casos de Uso Vinculados** | CU02 |
| **Requisitos Funcionales** | RF03, RF04 |

---

### Descripción del Flujo
Generación de token firmado de restablecimiento con expiración corta, envío por SMTP y actualización de contraseña previa verificación.

---

### Diagrama de Secuencia UML

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
