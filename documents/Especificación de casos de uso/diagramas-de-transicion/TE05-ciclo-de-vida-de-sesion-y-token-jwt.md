# TE05: Ciclo de Vida de la Sesión y Token de Autenticación (JWT y Refresh Token)

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | TE05 |
| **Nombre** | TE05: Ciclo de Vida de la Sesión y Token de Autenticación (JWT y Refresh Token) |
| **Requisitos Funcionales** | RF02, RF04 |

---

### Descripción de la Máquina de Estados
Estados temporales de tokens de acceso: emisión inicial con claims de rol, estado activo durante 24 horas, renovación en segundo plano con refresh token y expiración o revocación definitiva.

---

### Diagrama de Transición de Estados UML (Statechart)

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
