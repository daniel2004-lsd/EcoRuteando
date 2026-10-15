# DS04: Planificación de Ruta Óptima en Auto Particular, Cálculo de CO₂ y Respaldo PostGIS

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | DS04 |
| **Nombre** | DS04: Planificación de Ruta Óptima en Auto Particular, Cálculo de CO₂ y Respaldo PostGIS |
| **Casos de Uso Vinculados** | CU03, CU06, CU16, CU27 |
| **Requisitos Funcionales** | RF09, RF10, RF11, RF13, RF26, RF27 |

---

### Descripción del Flujo
Cálculo de trayectos vehiculares eficientes, consulta a la API GIS, estimación de combustible y CO₂ evitado vs. promedio de la ciudad y persistencia en base de datos geoespacial.

---

### Diagrama de Secuencia UML

```mermaid
sequenceDiagram
    autonumber
    actor C as 🧑‍💼 Conductor
    participant UI as 📱 App Móvil
    participant RutasCtrl as 🌐 RutasController (.NET)
    participant RoutingSvc as ⚙️ RoutingService
    participant ORS as 🗺️ OpenRouteService API
    participant EcoEngine as 🌿 EcoMetricEngine
    participant PostGIS as 💾 PostgreSQL / PostGIS

    C->>UI: Define origen y destino en Neiva (o dirección frecuente CU27)
    activate UI
    UI->>RutasCtrl: POST /api/v1/routes/plan (origen, destino, modo='vehiculo_eco')
    activate RutasCtrl
    RutasCtrl->>RoutingSvc: CalcularRutaOptimaAsync(coords)
    activate RoutingSvc
    RoutingSvc->>ORS: GET /v2/directions/driving-car (coords, avoid_poligonos_obras)
    activate ORS
    ORS-->>RoutingSvc: GeoJSON LineString (trazado, distancia_km, duracion_s)
    deactivate ORS
    RoutingSvc->>EcoEngine: EstimarImpactoCO2(distancia_km, modo='auto_gasolina_eficiente')
    activate EcoEngine
    Note over EcoEngine: Emisión calculada = dist * 138 g/km.<br/>CO₂ evitado vs ruta congestionada.
    EcoEngine-->>RoutingSvc: DTO MetricasCO2 (emitido_g, evitado_g)
    deactivate EcoEngine
    RoutingSvc->>PostGIS: INSERT INTO rutas_consultadas (geom, distancia, tiempo, co2_g)
    activate PostGIS
    PostGIS-->>RoutingSvc: RutaID persistido
    deactivate PostGIS
    RoutingSvc-->>RutasCtrl: RutaCalculadaDTO
    deactivate RoutingSvc
    RutasCtrl-->>UI: 200 OK (Geometría vectorial, maniobras, métricas ambientales)
    deactivate RutasCtrl
    UI->>UI: Renderizar capa vectorial sobre mapa y tarjeta de ahorro CO₂
    UI-->>C: Visualiza ruta ecológica en pantalla
    deactivate UI
```
