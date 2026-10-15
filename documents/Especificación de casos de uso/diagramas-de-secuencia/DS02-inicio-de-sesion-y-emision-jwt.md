# DS02: Inicio de Sesión, Validación de Credenciales y Emisión de Token JWT

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | DS02 |
| **Nombre** | DS02: Inicio de Sesión, Validación de Credenciales y Emisión de Token JWT |
| **Casos de Uso Vinculados** | CU05 |
| **Requisitos Funcionales** | RF02, RF04, RF24 |

---

### Descripción del Flujo
Verificación criptográfica de credenciales, protección contra ataques de fuerza bruta mediante bloqueo temporal tras 5 intentos y expedición de token JWT con expiración controlada.

---

### Diagrama de Secuencia UML

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
