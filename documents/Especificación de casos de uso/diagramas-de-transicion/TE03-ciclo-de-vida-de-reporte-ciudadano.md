# TE03: Ciclo de Vida del Reporte Ciudadano de Obstáculo / Incidente

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | TE03 |
| **Nombre** | TE03: Ciclo de Vida del Reporte Ciudadano de Obstáculo / Incidente |
| **Requisitos Funcionales** | RF17, RF18, RF24 |

---

### Descripción de la Máquina de Estados
Estados de los reportes viales: desde su creación georreferenciada con GPS, su confirmación por consenso de otros conductores y su retiro o archivado por expiración temporal.

---

### Diagrama de Transición de Estados UML (Statechart)

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
