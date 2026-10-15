# ADR-001: Adopción de Domain-Driven Design (DDD), Arquitectura Hexagonal (Puertos y Adaptadores) y Clean Architecture (.NET 9)

## Estado
**Aceptado**

## Fecha
Agosto de 2025

---

## Contexto
El sistema **EcoRuteando** gestiona múltiples contextos delimitados (*Bounded Contexts*) de negocio: seguridad e identidad de usuarios, cálculo de rutas ecológicas y mitigación de CO₂, reportes ciudadanos geoespaciales, notificaciones y administración centralizada.

Para asegurar un diseño de software mantenible, testeable y desacoplado de frameworks o tecnologías externas, se requería una estrategia arquitectónica que colocara las reglas del dominio en el centro del sistema.

## Problema
- Desarrollar un diseño acoplado a la base de datos o centrado en frameworks tecnológicos mezclaría las reglas de negocio con detalles de infraestructura (PostgreSQL, APIs externas, librerías de terceros).
- Se requería aislamiento riguroso entre dominios funcionales, con contratos e interfaces explícitos para permitir que la lógica de movilidad y seguridad evolucione sin verse afectada por cambios en persistencia o interfaces de usuario.

## Decisión
Se decidió adoptar un enfoque arquitectónico integral combinando **Domain-Driven Design (DDD)**, **Arquitectura Hexagonal (Puertos y Adaptadores)** y **Clean Architecture** sobre **.NET 9 / C#**:

1. **Contextos Delimitados (Bounded Contexts) como Módulos de Dominio**:
   - `EcoRuteando.Modules.Security`: Gestión de usuarios, autenticación, autorización y roles.
   - `EcoRuteando.Modules.Mobility`: Rutas, trayectos, cálculo de emisiones de CO₂ e incidencias viales.
   - `EcoRuteando.Modules.Integrations`: Adaptadores hacia servicios externos (Google Maps, clima).
   - `EcoRuteando.Modules.Notifications`: Envío de alertas y notificaciones.
   - `EcoRuteando.Modules.Admin`: Gestión institucional y analítica.

2. **Estructura Hexagonal y Clean Architecture en Cada Módulo**:
   - **Núcleo del Dominio (Domain Core)**:
     - Entidades de dominio ricas con encapsulamiento.
     - Objetos de valor (*Value Objects*).
     - Eventos de dominio (*Domain Events*) y excepciones de dominio.
     - Reglas de negocio puras, sin ninguna dependencia hacia frameworks, bases de datos o librerías externas.
   - **Capa de Aplicación (Puertos de Entrada / Casos de Uso)**:
     - Casos de uso implementados mediante el patrón CQRS (Commands & Queries) utilizando **MediatR**.
     - Define los *Puertos de Entrada* (interfaces de casos de uso) y los *Puertos de Salida* (interfaces de repositorios y servicios externos).
     - Validaciones de aplicación y coordinación de flujos.
   - **Capa de Infraestructura (Adaptadores de Salida)**:
     - Adaptadores secundarios que implementan las interfaces del dominio/aplicación.
     - Persistencia con Entity Framework Core, repositorios PostGIS y adaptadores de servicios de terceros.
   - **Capa de Presentación / API (Adaptadores de Entrada)**:
     - Controladores REST y endpoints HTTP que reciben peticiones de los clientes front-end y las envían a los casos de uso a través de los puertos de entrada.

3. **Host API Unificado**:
   - `EcoRuteando.Api`: Ensambla los módulos, registra los adaptadores mediante inyección de dependencias (`DependencyInjection`), configura el pipeline de middlewares HTTP y la autenticación JWT.

## Consecuencias

### Positivas
- **Independencia Tecnológica**: El núcleo de negocio (Dominio) no depende de la base de datos ni de frameworks externos; la infraestructura se enchufa como un adaptador secundario.
- **Alta Testabilidad**: Los casos de uso y las entidades pueden probarse unitariamente de forma aislada sin necesidad de levantar bases de datos ni servicios HTTP.
- **Claridad Conceptual (DDD)**: Cada módulo refleja fielmente el lenguaje ubicuo de su contexto de negocio (*Bounded Context*).
- **Separación de Responsabilidades**: Las reglas de cálculo de rutas y emisiones de CO₂ están estrictamente blindadas de cambios en la API web o en la interfaz móvil.

### Negativas
- Mayor número de proyectos e interfaces para representar puertos y adaptadores.
- Requiere mapeo explícito de modelos entre las capas de dominio, DTOs de aplicación y contratos de API.
