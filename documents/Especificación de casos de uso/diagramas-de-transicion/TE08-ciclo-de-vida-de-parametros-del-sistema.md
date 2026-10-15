# TE08: Ciclo de Vida de Parámetros Operativos del Sistema

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | TE08 |
| **Nombre** | TE08: Ciclo de Vida de Parámetros Operativos del Sistema |
| **Requisitos Funcionales** | RF23, RF24 |

---

### Descripción de la Máquina de Estados
Manejo de variables globales de entorno: factores de cálculo de CO₂, límites geográficos, valores por defecto de fábrica, validación de rangos numéricos y propagación en caliente en caché.

---

### Diagrama de Transición de Estados UML (Statechart)

```mermaid
stateDiagram-v2
    [*] --> ValorPredeterminado: Inicialización de fábrica en base de datos
    
    ValorPredeterminado --> EnEdicion: Administrador modifica variable en panel web (CU28)
    
    state EnEdicion {
        [*] --> ValidandoSintaxis: Chequeo de tipo de dato y no nulo
        ValidandoSintaxis --> ValidandoRango: Chequeo de límites físicos (ej. CO₂ > 0)
    }

    EnEdicion --> InvalidoRechazado: Valor fuera de rango permitido (Error visual)
    InvalidoRechazado --> EnEdicion: Administrador corrige el número ingresado

    EnEdicion --> ConfirmadoSeguridad: Administrador valida en modal de confirmación
    ConfirmadoSeguridad --> PersistidoEnBD: Transacción UPDATE en tabla configuracion_sistema
    
    PersistidoEnBD --> PropagadoEnMemoria: Backend invalida caché IMemoryCache y recarga variables
    PersistidoEnBD --> Auditado: Registro automático en tabla auditoria_seguridad (RF24)

    PropagadoEnMemoria --> OperativoEnProduccion: Variable activa para todas las peticiones móviles
    
    OperativoEnProduccion --> EnEdicion: Nueva modificación solicitada
    OperativoEnProduccion --> RestaurandoFabrica: Administrador pulsa "Restablecer Valores por Defecto"
    RestaurandoFabrica --> ValorPredeterminado: Variables sobreescritas a línea base inicial
```
