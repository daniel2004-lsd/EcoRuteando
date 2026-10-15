# TE01: Ciclo de Vida de una Ruta / Trayecto en Vehículo Particular

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | TE01 |
| **Nombre** | TE01: Ciclo de Vida de una Ruta / Trayecto en Vehículo Particular |
| **Requisitos Funcionales** | RF09, RF10, RF11, RF12, RF14, RF28 |

---

### Descripción de la Máquina de Estados
Estados formales por los que transita una ruta en automóvil eficiente: desde su formulación inicial hasta su ejecución asistida por voz y almacenamiento histórico para balances ambientales.

---

### Diagrama de Transición de Estados UML (Statechart)

```mermaid
stateDiagram-v2
    [*] --> Borrador: Usuario ingresa origen y destino
    
    Borrador --> SolicitandoCalculo: Pulsa "Calcular Ruta"
    SolicitandoCalculo --> Calculada: API ORS responde + Cálculo CO₂ completado
    SolicitandoCalculo --> ErrorCalculo: Timeout de red / Coordenadas inalcanzables
    ErrorCalculo --> Borrador: Reintentar con nuevos puntos

    Calculada --> EnNavegacion: Conductor pulsa "Iniciar Recorrido"
    Calculada --> Descartada: Usuario cancela antes de iniciar

    state EnNavegacion {
        [*] --> GuiadoActivo: Conectar GPS y encender motor TTS
        GuiadoActivo --> Recalculando: Desvío detectado > 50m
        Recalculando --> GuiadoActivo: Nuevo trazado sincronizado
        GuiadoActivo --> ManiobraProxima: Distancia a giro < 40m
        ManiobraProxima --> GuiadoActivo: Locución TTS reproducida
    }

    EnNavegacion --> Completada: Conductor arriba al punto de destino
    EnNavegacion --> Cancelada: Conductor interrumpe el viaje manualmente

    Cancelada --> GuardadaHistorial: Guardar tramo parcial recorrido
    Completada --> GuardadaHistorial: Persistir trayecto final + CO₂ en PostgreSQL

    state GuardadaHistorial {
        [*] --> NoCalificada
        NoCalificada --> Calificada: Usuario califica con estrellas (CU09)
        NoCalificada --> MarcadaFavorita: Usuario pulsa "Añadir a Favoritas" (CU11)
        Calificada --> MarcadaFavorita: Usuario pulsa "Añadir a Favoritas" (CU11)
    }

    GuardadaHistorial --> Exportada: Usuario exporta a PDF o Excel (CU19)
    Descartada --> [*]
    Exportada --> [*]
```
