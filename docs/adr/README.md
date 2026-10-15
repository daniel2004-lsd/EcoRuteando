# Índice de Registros de Decisiones de Arquitectura (ADR) — EcoRuteando

Este repositorio documental compila formalmente las decisiones arquitectónicas, tecnológicas, de diseño y de seguridad adoptadas durante la evolución del proyecto **EcoRuteando**.

Cada registro sigue el estándar de Michael Nygard y documenta el contexto, el problema, las opciones evaluadas, la decisión tomada y sus consecuencias técnicas y operacionales.

---

## Listado de Decisiones de Arquitectura

| ADR | Título | Estado | Fecha | Ámbito |
| :--- | :--- | :---: | :---: | :--- |
| [ADR-001](./001-adopcion-ddd-arquitectura-hexagonal-y-clean-architecture.md) | Adopción de Domain-Driven Design (DDD), Arquitectura Hexagonal y Clean Architecture (.NET 9) | **Aceptado** | 2025-08 | Backend / Arquitectura General |
| [ADR-002](./002-migracion-postgresql-a-postgis-geoespacial.md) | Adopción de PostgreSQL con Extensión Espacial PostGIS | **Aceptado** | 2025-08 | Base de Datos / GIS |
| [ADR-003](./003-desacoplamiento-plataformas-web-react-y-movil-react-native.md) | Segregación de Clientes: React SPA (Web) y React Native Expo (Móvil) | **Aceptado** | 2025-09 | Frontend / Mobile |
| [ADR-004](./004-exclusividad-modulo-administracion-en-web.md) | Exclusividad del Módulo Administrativo y de Auditoría en la Plataforma Web | **Aceptado** | 2025-09 | Seguridad / Gobernanza |
| [ADR-005](./005-estrategia-reporte-problemas-obstaculos-solo-movil.md) | Restricción de Reporte de Obstáculos e Incidencias Exclusivamente a la App Móvil | **Aceptado** | 2026-10 | UX / Integridad de Datos |
| [ADR-006](./006-simplificacion-edicion-perfil-sin-clave-actual.md) | Flexibilización en la Actualización de Datos de Perfil sin Exigencia de Contraseña Actual | **Aceptado** | 2026-10 | UX / Seguridad de Perfil |
| [ADR-007](./007-unificacion-paleta-modo-oscuro-web-y-movil.md) | Unificación de la Paleta Cromática de Modo Oscuro entre Web y App Móvil | **Aceptado** | 2026-10 | UI / Design System |
| [ADR-008](./008-estrategia-autenticacion-hibrida-jwt-oauth-2fa.md) | Estrategia de Autenticación Híbrida: JWT, OAuth2 (Google) y Doble Factor (2FA) | **Aceptado** | 2025-09 | Seguridad / Autenticación |
| [ADR-009](./009-integracion-servicios-externos-google-maps-tts-clima.md) | Estrategia de Integración con Servicios Externos: Google Maps Platform, TTS y Clima | **Aceptado** | 2025-09 | Integraciones / APIs |
| [ADR-010](./010-contenedorizacion-docker-y-control-migraciones-liquibase.md) | Contenedorización con Docker Compose y Gestión de Esquema con Liquibase | **Aceptado** | 2025-09 | DevOps / Infraestructura |
