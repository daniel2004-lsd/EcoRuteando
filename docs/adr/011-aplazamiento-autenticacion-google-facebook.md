# ADR-011: Aplazamiento de autenticación con Google y Facebook

## Estado
**Aceptada**

## Fecha
Octubre de 2026

---

## Contexto
La versión actual de EcoRuteando prioriza el acceso mediante correo electrónico y contraseña. Los flujos de inicio de sesión y registro con proveedores externos (Google y Facebook) no forman parte del alcance funcional de esta entrega y deben retirarse de las interfaces web y móvil.

La implementación OAuth existente en el backend se conserva sin cambios como base para una integración futura.

## Decisión
Google y Facebook no estarán disponibles como opciones de inicio de sesión ni de registro en las interfaces web y móvil de la versión actual. Se retiran los botones, separadores, iconos, manejadores, rutas de callback y dependencias de frontend asociadas exclusivamente a esos proveedores.

El inicio de sesión y el registro convencionales mediante correo electrónico y contraseña se mantienen disponibles en ambas aplicaciones.

## Alcance
Esta decisión afecta únicamente a las interfaces de usuario de web y móvil. No elimina, deshabilita ni modifica:

- Los endpoints OAuth del backend.
- Los DTO, servicios, controladores, configuraciones de seguridad o migraciones del backend.
- Los proveedores OAuth configurados en el servidor.

La implementación OAuth existente en el backend se conserva sin cambios. Por tanto, esta ADR no debe interpretarse como una desactivación de OAuth en todo el sistema.

## Motivo
Reducir el alcance de la versión actual y posponer la integración de proveedores externos, concentrando el esfuerzo de validación y soporte en el flujo de correo electrónico y contraseña.

## Trabajo futuro
Diseñar, implementar y probar la integración OAuth con Google y Facebook en una versión posterior, incluyendo la habilitación coordinada de los botones en web y móvil.

## Consecuencias

### Positivas
- Menor superficie de interfaz y de pruebas para la versión actual.
- Menor dependencia de configuraciones de terceros durante el despliegue.
- El backend conserva la capacidad de autenticación OAuth para una futura habilitación.

### Negativas
- Los usuarios no podrán autenticarse con Google o Facebook desde la interfaz.
- El código y la configuración OAuth del backend quedan sin uso desde los clientes actuales.

## Relación con otras ADR
La [ADR-008](./008-estrategia-autenticacion-hibrida-jwt-oauth-2fa.md) mantiene vigente la estrategia de autenticación híbrida a nivel de backend. Esta ADR-011 aplaza únicamente la disponibilidad de OAuth en las interfaces web y móvil.

## Criterios para retomarlo
Antes de reactivar los botones y flujos OAuth deberán cumplirse y revisarse, como mínimo:

1. Contrato frontend/backend documentado y versionado.
2. Protección CSRF y de replay del parámetro `state`, con almacenamiento adecuado para múltiples instancias.
3. HTTPS obligatorio y política de cookies seguras (`Secure`, `HttpOnly`, `SameSite`).
4. Compatibilidad del flujo en web y móvil, incluida la gestión de sesiones y deep links.
5. Pruebas de seguridad y de extremo a extremo del flujo completo con cada proveedor.
6. Revisión y aprobación del flujo completo por parte del equipo de seguridad.
