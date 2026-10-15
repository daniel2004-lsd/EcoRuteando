# ADR-003: Segregación de Clientes: React SPA (Web) y React Native Expo (Móvil)

## Estado
**Aceptado**

## Fecha
Septiembre de 2025

---

## Contexto
El proyecto EcoRuteando debe llegar tanto a usuarios que consultan desde navegadores de escritorio como a peatones y conductores que transitan por la ciudad con sus teléfonos celulares.

Se evaluaron tres enfoques arquitectónicos:
1. Una única aplicación Web Progresiva (PWA).
2. Un desarrollo móvil híbrido multiplataforma desacoplado de la web.
3. Dos aplicaciones nativas separadas (Kotlin para Android y Swift para iOS) más la web.

## Problema
- Una PWA no proporciona acceso fiable en segundo plano al GPS, síntesis auditiva nativa con el teléfono bloqueado ni integración óptima con las capacidades nativas de Android.
- El desarrollo en tecnologías nativas separadas (Kotlin / Swift) duplicaba el esfuerzo de desarrollo y requería conocimientos especializados fuera del alcance temporal del proyecto.

## Decisión
Se decidió implementar **dos clientes especializados desacoplados que consumen la misma API REST unificada**:
1. **Portal Web**: Desarrollado con **React (Vite) + TailwindCSS**. Orientado a visualización en pantallas amplias, consulta estadística detallada, gestión de perfil y centro de administración.
2. **Aplicación Móvil**: Desarrollada con **React Native + Expo (TypeScript)**, empaquetada como APK Android. Orientada al uso en territorio, aprovechamiento de sensores del teléfono, navegación guiada, alertas y reporte ciudadano en tiempo real.

## Consecuencias

### Positivas
- Código compartido conceptualmente en modelos de datos y endpoints de la API REST.
- La aplicación móvil accede al hardware nativo (ubicación precisa con expo-location, almacenamiento cifrado con SecureStore, síntesis de voz nativa con expo-speech, cámara y galería).
- El portal web aprovecha el rendimiento de renderizado en navegadores y librerías estadísticas pesadas (Chart.js).

### Negativas
- Mantenimiento de dos bases de código front-end (`ecoRuteando-react` y `Movil-EcoRuteando`).
- Necesidad de coordinar los contratos de API y traducción i18n entre ambos clientes.
