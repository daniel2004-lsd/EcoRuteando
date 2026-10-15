# TE04: Ciclo de Vida de la Cuenta de Usuario

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | TE04 |
| **Nombre** | TE04: Ciclo de Vida de la Cuenta de Usuario |
| **Requisitos Funcionales** | RF01, RF02, RF04, RF06, RF07 |

---

### Descripción de la Máquina de Estados
Ciclo completo de identidad digital: modo invitado local, registro con verificación OTP, sesión activa con token JWT, congelamiento preventivo por ataques de fuerza bruta y baja definitiva.

---

### Diagrama de Transición de Estados UML (Statechart)

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
