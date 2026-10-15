# DS08: Registro de Reporte Ciudadano con Captura Satelital GPS y Notificación Push

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | DS08 |
| **Nombre** | DS08: Registro de Reporte Ciudadano con Captura Satelital GPS y Notificación Push |
| **Casos de Uso Vinculados** | CU07, CU18 |
| **Requisitos Funcionales** | RF17, RF18, RF25 |

---

### Descripción del Flujo
Georreferenciación de obstáculos en vía, validación de polígono urbano, almacenamiento en PostGIS y difusión push inmediata a conductores que transiten a menos de 3 km.

---

### Diagrama de Secuencia UML

```mermaid
sequenceDiagram
    autonumber
    actor R as 🧑‍💼 Reportero en Vía
    participant UI as 📱 App Móvil
    participant GPS as 📡 GPS del Dispositivo
    participant IncCtrl as 🌐 IncidentesController (.NET)
    participant PostGIS as 💾 Base de Datos PostGIS
    participant PushHub as 📲 Push Notification Hub (FCM)
    actor Otros as 👥 Conductores en Zona

    R->>UI: Pulsa botón "Reportar Obstáculo"
    activate UI
    UI->>GPS: Obtener coordenadas precisas actuales
    GPS-->>UI: (lat, lng, precision=4m)
    R->>UI: Selecciona tipo ("Hueco severo", "Vía inundada") y añade foto opcional
    UI->>IncCtrl: POST /api/v1/incidents (tipo, coords, descripcion, foto) [Bearer JWT]
    activate IncCtrl
    IncCtrl->>IncCtrl: Verificar que coordenadas pertenezcan al perímetro de Neiva
    IncCtrl->>PostGIS: INSERT INTO incidentes (geom, tipo, estado='PENDIENTE_VALIDACION', votos_confirmar=1)
    activate PostGIS
    PostGIS-->>IncCtrl: IncidenteID generado
    deactivate PostGIS
    IncCtrl->>PushHub: EnviarAlertaPerimetral(coords, radio_km=3, "Nuevo incidente reportado")
    activate PushHub
    PushHub-->>Otros: Notificación push con icono de alerta vial
    deactivate PushHub
    IncCtrl-->>UI: 201 Created (IncidenteDTO)
    deactivate IncCtrl
    UI-->>R: Notificación en pantalla: "¡Reporte publicado! Gracias por colaborar"
    deactivate UI
```
