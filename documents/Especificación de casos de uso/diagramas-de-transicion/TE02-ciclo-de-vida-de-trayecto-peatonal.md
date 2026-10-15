# TE02: Ciclo de Vida del Trayecto Peatonal / Caminata a Pie

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | TE02 |
| **Nombre** | TE02: Ciclo de Vida del Trayecto Peatonal / Caminata a Pie |
| **Requisitos Funcionales** | RF09, RF10, RF11, RF12 |

---

### Descripción de la Máquina de Estados
Ciclo de estados para desplazamientos a pie: cálculo de andenes peatonales, métrica de 0 g CO₂ emitidos, pausa de caminata y consolidación en el podio ecológico.

---

### Diagrama de Transición de Estados UML (Statechart)

```mermaid
stateDiagram-v2
    [*] --> PlanificandoCaminata: Usuario selecciona modo "A pie"
    PlanificandoCaminata --> TrazadoResuelto: Algoritmo peatonal asigna sendero seguro
    
    TrazadoResuelto --> CaminandoActivo: Pulsa "Comenzar Caminata"
    TrazadoResuelto --> Cancelado: Descarta itinerario

    state CaminandoActivo {
        [*] --> Cronometrando: Contador de pasos y tiempo en marcha
        Cronometrando --> Pausado: Usuario pulsa botón de pausa temporal
        Pausado --> Cronometrando: Reanuda desplazamiento
    }

    CaminandoActivo --> CaminataFinalizada: Arriba a destino peatonal
    CaminandoActivo --> Interrumpido: Usuario detiene registro antes de llegar

    CaminataFinalizada --> ConsolidadoEcologico: Se registra 100% CO₂ evitado vs auto
    Interrumpido --> ConsolidadoEcologico: Se computa el tramo parcial caminado

    ConsolidadoEcologico --> GuardadoHistorial: Persistido en perfil para métricas de salud
    GuardadoHistorial --> [*]
    Cancelado --> [*]
```
