# ADR-004: Exclusividad del Módulo Administrativo y de Auditoría en la Plataforma Web

## Estado
**Aceptado**

## Fecha
Septiembre de 2025

---

## Contexto
El Módulo 4 de EcoRuteando contempla la administración central del sistema:
- Gestión y bloqueo de usuarios y roles (RF21).
- Panel estadístico global y métricas de impacto municipal (RF20).
- Validación y moderación de reportes comunitarios recibidos (RF18).
- Auditoría de eventos de seguridad y transacciones críticas (RF24).
- Exportación masiva de reportes en formatos Excel (.xlsx) y PDF (RF22).

Existía la interrogante de si este panel administrativo debía incluirse también dentro de la aplicación móvil para permitir administración desde teléfonos celulares.

## Problema
1. **Seguridad y Superficie de Ataque**: El instalador móvil (APK) se distribuye ampliamente entre usuarios generales. Empaquetar rutas administrativas, endpoints de gestión de usuarios y componentes de auditoría en la app móvil incrementa significativamente el riesgo de descompilación, ingeniería inversa y ataques de fuerza bruta.
2. **Ergonomía y Visualización de Datos Complejos**: Las tablas con decenas de columnas, filtros combinados de auditoría, trazabilidad de eventos y dashboards comparativos de métricas urbanas son inapropiados para pantallas de teléfonos móviles de 6 pulgadas.
3. **Flujo de Trabajo Operativo**: Los gestores municipales y administradores del sistema desempeñan sus funciones en estaciones de trabajo y escritorios institucionales, donde cuentan con conexiones seguras a la red y periféricos adecuados (teclado, ratón, pantallas de alta resolución).

## Decisión
Se decidió **restringir de forma exclusiva el Módulo de Administración al Portal Web**:
1. La aplicación móvil carece por completo de vistas, rutas o componentes administrativos. Cualquier usuario, incluso con rol `Administrador`, que inicie sesión en la app móvil accederá a la experiencia ciudadana estándar de rutas y movilidad.
2. Toda la gestión institucional, moderación de reportes, bloqueo de cuentas, consulta de logs y generación de reportes se concentra únicamente en el portal web (`/admin/*`), protegido por middleware de autorización RBAC (`HasPermission("admin.*")`).

## Consecuencias

### Positivas
- **Máxima Reducción de Riesgo**: Cero exposición de código administrativo en los APKs distribuidos a la ciudadanía.
- **Experiencia de Usuario Optimizada**: La app móvil permanece ligera, rápida y libre de sobrecarga visual.
- **Cumplimiento de Seguridad**: Garantiza que las auditorías y exportaciones de datos sensibles ocurran en entornos de escritorio controlados.

### Negativas
- El administrador no puede gestionar usuarios ni moderar reportes directamente desde su teléfono móvil nativo sin abrir el navegador web de escritorio.
