# ADR-005: Restricción de Reporte de Obstáculos e Incidencias Exclusivamente a la App Móvil

## Estado
**Aceptado**

## Fecha
Octubre de 2026

---

## Contexto
El Módulo 3 contempla el registro de reportes ciudadanos de obstáculos e incidencias viales (huecos, derrumbes, vías cerradas, peligros en el trayecto - RF17).

Originalmente, existía la opción de "Reportar problema" tanto en el Dashboard de la versión web (`/user/reporter-problem`) como en la aplicación móvil.

## Problema
1. **Falta de Veracidad y Coordenadas Reales en la Web**: En un navegador web de escritorio, la geolocalización es imprecisa (frecuentemente aproximada por dirección IP del proveedor de internet o fija en el domicilio). Permitir reportes desde computadores de escritorio provocaba falsos positivos, reportes descontextualizados o incidencias registradas lejos del lugar real de los hechos.
2. **Naturaleza del Reporte en Vía**: Un obstáculo o daño en la infraestructura vial ocurre en tiempo real en la calle. El ciudadano en movimiento es quien tiene la capacidad física y visual de levantar el reporte georreferenciado con el sensor GPS nativo del teléfono.
3. **Consistencia de la Información**: La presencia del módulo en la web confundía el flujo de los usuarios y generaba dispersión en la moderación administrativa.

## Decisión
Se decidió **retirar de forma definitiva el módulo de "Reportar problema" de la plataforma Web, dejándolo como una función 100% exclusiva de la Aplicación Móvil**:
1. En el frontend web (`UserDashboard.jsx`), se eliminó la tarjeta y el acceso al módulo de reportes.
2. La ruta `/user/reporter-problem` fue redirigida automáticamente al panel principal `/dashboard`.
3. La aplicación móvil conserva y prioriza la capacidad de reportar incidencias con coordenadas GPS de alta precisión en sitio.

## Consecuencias

### Positivas
- **Mayor Calidad y Fiabilidad de Datos**: Todos los reportes generados cuentan con geolocalización satelital precisa de usuarios presentes físicamente en el lugar.
- **Simplificación del Dashboard Web**: La interfaz de usuario web queda enfocada en sus fortalezas: planificación de rutas, visualización de estadísticas y gestión de cuenta.
- **Reducción de Spam y Reportes Falsos**: Desalienta el registro masivo no fundamentado de incidencias desde navegadores web.

### Negativas
- Un usuario sin la app móvil instalada no puede reportar un obstáculo desde su computador de escritorio.
