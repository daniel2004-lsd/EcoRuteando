# ADR-009: Estrategia de Integración con Servicios Externos: Google Maps Platform, TTS y Clima

## Estado
**Aceptado**

## Fecha
Septiembre de 2025

---

## Contexto
EcoRuteando requiere capacidades geoespaciales avanzadas, cálculo de rutas óptimas, información meteorológica contextual y guía por voz accesible.

## Problema
- Desarrollar un motor de ruteo y mapas desde cero implicaría una complejidad prohibitiva para la escala del proyecto.
- Depender de servicios propietarios sin abstracción generaría fuerte acoplamiento (vendor lock-in) y riesgo de fallos si la API externa experimenta caídas.

## Decisión
Se decidió implementar una **estrategia de integración basada en el patrón Adapter / Gateway**:
1. **Google Maps Platform (Maps JavaScript API / Directions API / Places API)**:
   - Proveedor principal para renderizado de cartografía, cálculo de polilíneas de rutas a pie y en vehículo y autocompletado de direcciones.
   - En el backend se implementan estimaciones complementarias de reducción de CO₂ y tiempos basados en parámetros ecológicos propios.
2. **Asistencia por Voz (TTS - Text to Speech)**:
   - Implementado mediante la API de síntesis de voz nativa del dispositivo móvil (`expo-speech` / Web Speech API en navegadores compatibles).
   - Genera lectura audible giro a giro para garantizar inclusión y accesibilidad sin costos adicionales de licencias.
3. **Servicios Meteorológicos (OpenWeatherMap / Weather API)**:
   - Integración mediante clientes HTTP resilientes con políticas de fallback y caché en memoria para no exceder cuotas de uso y mantener alertas climáticas vigentes.

## Consecuencias

### Positivas
- **Alta Calidad y Confiabilidad**: Acceso a la base cartográfica más completa y actualizada del mundo.
- **Resiliencia**: El backend encapsula las llamadas y provee respuestas seguras si los servicios externos no responden.

### Negativas
- Dependencia de cuotas y claves de API de Google Cloud Platform.
- Requiere conexión a internet activa para el cálculo inicial del trayecto.
