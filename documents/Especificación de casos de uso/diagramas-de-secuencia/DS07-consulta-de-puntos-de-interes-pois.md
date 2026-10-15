# DS07: Consulta Geoespacial de Puntos de Interés (POIs) e Inserción como Parada

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | DS07 |
| **Nombre** | DS07: Consulta Geoespacial de Puntos de Interés (POIs) e Inserción como Parada |
| **Casos de Uso Vinculados** | CU17 |
| **Requisitos Funcionales** | RF15 |

---

### Descripción del Flujo
Filtrado espacial por categoría y radio de proximidad utilizando funciones ST_DWithin de PostGIS, permitiendo agregar talleres o parqueaderos como paradas intermedias en la ruta.

---

### Diagrama de Secuencia UML

```mermaid
sequenceDiagram
    autonumber
    actor C as 🧑‍💼 Ciudadano / Conductor
    participant UI as 📱 App Móvil
    participant PoisCtrl as 🌐 PoisController (.NET)
    participant PostGIS as 🗺️ PostGIS (Tabla POIs)
    participant RoutingSvc as ⚙️ RoutingService

    C->>UI: Abre panel "Puntos de Interés" y selecciona filtro: "Talleres / Parqueaderos"
    activate UI
    UI->>PoisCtrl: GET /api/v1/pois/nearby (lat, lng, radio_m=3000, categoria='TALLER')
    activate PoisCtrl
    PoisCtrl->>PostGIS: SELECT id, nombre, geom, ST_Distance(geom, @punto) FROM pois WHERE categoria=@cat AND ST_DWithin(geom, @punto, 3000)
    activate PostGIS
    PostGIS-->>PoisCtrl: Listado ordenado por proximidad
    deactivate PostGIS
    PoisCtrl-->>UI: 200 OK (PoisDTO[])
    deactivate PoisCtrl
    UI->>UI: Dibujar pines temáticos en el mapa
    C->>UI: Toca un POI y pulsa "Añadir como parada en mi ruta"
    UI->>RoutingSvc: Recalcular ruta con waypoint intermedio
    UI-->>C: Actualiza trazado de viaje incluyendo la parada seleccionada
    deactivate UI
```
