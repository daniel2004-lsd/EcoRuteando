# TE06: Ciclo de Vida de un Ticket de Soporte Técnico y Mesa de Ayuda

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | TE06 |
| **Nombre** | TE06: Ciclo de Vida de un Ticket de Soporte Técnico y Mesa de Ayuda |
| **Requisitos Funcionales** | RF30 |

---

### Descripción de la Máquina de Estados
Gestión formal de incidencias técnicas: radicación ciudadana, asignación al equipo de soporte, fase de investigación, respuesta al usuario y cierre con encuesta de satisfacción.

---

### Diagrama de Transición de Estados UML (Statechart)

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
