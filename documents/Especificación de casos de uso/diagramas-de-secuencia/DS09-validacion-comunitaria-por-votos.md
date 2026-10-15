# DS09: Validación Comunitaria de Incidentes por Votación en Tiempo Real y Auto-Cierre

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | DS09 |
| **Nombre** | DS09: Validación Comunitaria de Incidentes por Votación en Tiempo Real y Auto-Cierre |
| **Casos de Uso Vinculados** | CU22 |
| **Requisitos Funcionales** | RF18, RF22 |

---

### Descripción del Flujo
Ciclo colaborativo de votación donde conductores cercanos confirman o descartan reportes, automatizando el archivo o retiro del marcador sin intervención humana.

---

### Diagrama de Secuencia UML

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
