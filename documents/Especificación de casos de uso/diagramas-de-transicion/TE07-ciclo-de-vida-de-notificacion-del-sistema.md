# TE07: Ciclo de Vida de una Notificación del Sistema (Push / In-App)

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | TE07 |
| **Nombre** | TE07: Ciclo de Vida de una Notificación del Sistema (Push / In-App) |
| **Requisitos Funcionales** | RF25 |

---

### Descripción de la Máquina de Estados
Ciclo de comunicaciones del sistema: redacción administrativa, programación horaria, encolado en Firebase Cloud Messaging, entrega al dispositivo móvil y lectura por el destinatario.

---

### Diagrama de Transición de Estados UML (Statechart)

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
