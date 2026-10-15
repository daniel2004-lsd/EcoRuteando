# DS05: Desplazamiento a Pie (Modo Peatonal Cero Emisiones) y Comparativa Ambiental

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | DS05 |
| **Nombre** | DS05: Desplazamiento a Pie (Modo Peatonal Cero Emisiones) y Comparativa Ambiental |
| **Casos de Uso Vinculados** | CU03, CU06, CU16 |
| **Requisitos Funcionales** | RF09, RF10, RF11 |

---

### Descripción del Flujo
Resolución de rutas a pie priorizando andenes y zonas seguras peatonales de Neiva, computando 0 gramos de CO₂ emitidos y calculando el 100% de emisiones evitadas.

---

### Diagrama de Secuencia UML

```mermaid
sequenceDiagram
    autonumber
    actor P as 🚶 Ciudadano Peatón
    participant UI as 📱 App Móvil
    participant RutasCtrl as 🌐 RutasController
    participant RoutingSvc as ⚙️ RoutingService
    participant ORS as 🗺️ OpenRouteService (Foot-Walking)
    participant EcoEngine as 🌿 EcoMetricEngine

    P->>UI: Selecciona modo "A pie / Caminata" e ingresa destino
    activate UI
    UI->>RutasCtrl: POST /api/v1/routes/plan (origen, destino, modo='caminata')
    activate RutasCtrl
    RutasCtrl->>RoutingSvc: ResolverRutaPeatonalAsync(coords)
    activate RoutingSvc
    RoutingSvc->>ORS: GET /v2/directions/foot-walking (coords)
    activate ORS
    ORS-->>RoutingSvc: GeoJSON Peatonal (distancia_km, duracion_caminata_s, pasos_aprox)
    deactivate ORS
    RoutingSvc->>EcoEngine: CalcularAhorroCeroEmisiones(distancia_km)
    activate EcoEngine
    Note over EcoEngine: Emisión propia = 0 g CO₂.<br/>Ahorro directo = 100% de la emisión vehicular.
    EcoEngine-->>RoutingSvc: MetricasPeatonales (co2_emitido=0, co2_ahorrado=dist*142g, calorias)
    deactivate EcoEngine
    RoutingSvc-->>RutasCtrl: RutaPeatonalDTO
    deactivate RoutingSvc
    RutasCtrl-->>UI: 200 OK (Trazado peatonal y felicitación ecológica)
    deactivate RutasCtrl
    UI->>UI: Mostrar ruta peatonal y badge: "¡100% libre de emisiones!"
    UI-->>P: Despliega itinerario de caminata
    deactivate UI
```
