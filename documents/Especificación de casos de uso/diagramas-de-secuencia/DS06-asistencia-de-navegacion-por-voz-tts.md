# DS06: Navegación Guiada por GPS con Asistencia Auditiva Text-to-Speech (TTS)

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | DS06 |
| **Nombre** | DS06: Navegación Guiada por GPS con Asistencia Auditiva Text-to-Speech (TTS) |
| **Casos de Uso Vinculados** | CU25 |
| **Requisitos Funcionales** | RF25, RF28 |

---

### Descripción del Flujo
Ciclo continuo de telemetría GPS, seguimiento de la posición en tiempo real, detección de proximidad a maniobras de giro y síntesis auditiva en cabina mediante el motor TTS nativo.

---

### Diagrama de Secuencia UML

```mermaid
sequenceDiagram
    autonumber
    actor C as 🧑‍💼 Conductor
    participant UI as 📱 App Móvil (React Native)
    participant GPS as 📡 Módulo GPS Dispositivo
    participant NavEngine as 🧭 NavigationEngine Local
    participant TTS as 🔊 Motor TTS Nativo (expo-speech)

    C->>UI: Pulsa "Iniciar Navegación Guiada"
    activate UI
    UI->>GPS: Iniciar rastreo continuo (intervalo=1s, exactitud='alta')
    activate GPS
    UI->>TTS: SpeakAsync("Iniciando recorrido. Avance 200 metros por Calle 8")
    activate TTS
    TTS-->>C: Audio de bienvenida
    deactivate TTS

    loop Telemetría GPS en Tránsito
        GPS-->>NavEngine: Emitir posición actual (lat, lng, rumbo, velocidad)
        NavEngine->>NavEngine: Proyectar posición sobre el LineString de la ruta
        alt Desvío de ruta detectado (> 50 metros)
            NavEngine->>UI: Notificar evento "Ruta Desviada"
            UI->>TTS: SpeakAsync("Recalculando ruta...")
            UI->>UI: Solicitar nuevo trazado al backend en segundo plano
        else En curso normal
            NavEngine->>NavEngine: Medir distancia a siguiente maniobra
            alt Distancia al giro <= 40 metros y no anunciada
                NavEngine->>TTS: SpeakAsync("En 40 metros, gire a la derecha")
                activate TTS
                TTS-->>C: Indicación auditiva clara
                deactivate TTS
            end
        end
    end

    NavEngine->>NavEngine: Distancia al destino < 10 metros
    NavEngine->>TTS: SpeakAsync("Ha llegado a su destino. Recorrido completado")
    UI->>GPS: Detener rastreo continuo
    deactivate GPS
    UI-->>C: Muestra resumen final del viaje y ahorro ambiental
    deactivate UI
```
