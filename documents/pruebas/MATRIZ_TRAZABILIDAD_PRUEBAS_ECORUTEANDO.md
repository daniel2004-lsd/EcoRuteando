# MATRIZ DE TRAZABILIDAD DE PRUEBAS DE SOFTWARE — ECORUTEANDO
## MAPEO BIDIRECCIONAL: REQUISITOS (SRS) $\leftrightarrow$ CASOS DE USO (CU) $\leftrightarrow$ CASOS DE PRUEBA (CP)
### Programa de Formación: Análisis y Desarrollo de Software (ADSO) — SENA

---

## 1. Convenciones y Estructura de la Matriz

Esta matriz permite auditar la cobertura de pruebas sobre los **34 Requisitos Funcionales (RF)** y los **28 Casos de Uso (CU)** formalizados en la documentación del proyecto, garantizando la trazabilidad exigida por las normas de calidad del software y el comité de evaluación del SENA.

### Estados de Implementación:
* **Implementado:** El código fuente y los componentes existen en los repositorios correspondientes.
* **Parcialmente Implementado:** El backend o la interfaz cuentan con soporte base, pero carecen de interfaz final o persistencia completa.
* **Excluido por Decisión Arquitectónica (ADR-8):** Modalidades o flujos explícitamente descartados del alcance (Buses y Bicicletas).

---

## 2. Matriz de Trazabilidad Completa (RF01 a RF34)

| ID Req. | Descripción del Requisito Funcional (SRS) | Caso de Uso | Caso(s) de Prueba Asociado(s) | Componente Afectado | Estado Implementación | Estado de Prueba |
| :---: | :--- | :---: | :---: | :--- | :---: | :---: |
| **RF01** | Registro de nuevos usuarios con validación de datos y correo único | CU01 | `CP-WEB-001`, `CP-API-001` | Web / Backend | **Implementado** | Diseñada |
| **RF02** | Inicio de sesión mediante credenciales y emisión de token JWT | CU05 | `CP-WEB-002`, `CP-API-002`, `CP-API-003` | Web / Móvil / Backend | **Implementado** | Diseñada |
| **RF03** | Recuperación de contraseña mediante código de un solo uso (OTP) | CU02 | `CP-WEB-001`, `CP-API-001` | Web / Backend | **Implementado** | Diseñada |
| **RF04** | Almacenamiento seguro de contraseñas con algoritmo adaptativo | CU01, CU05 | `CP-API-001`, `CP-DB-001` | Backend / BD | **Implementado (BCrypt c=12)** | Diseñada |
| **RF05** | Edición y actualización del perfil del usuario | CU12 | `CP-WEB-002` | Web / Móvil / Backend | **Implementado** | Diseñada |
| **RF06** | Eliminación voluntaria de la cuenta del usuario | CU13 | `CP-API-002` | Web / Backend | **Implementado** | Diseñada |
| **RF07** | Navegación básica en la plataforma en modo invitado sin registro | CU14 | `CP-MOV-001`, `CP-WEB-003` | Web / Móvil | **Implementado** | Diseñada |
| **RF08** | Consulta y aceptación de términos y condiciones del servicio | CU15 | `CP-WEB-001` | Web / Móvil | **Implementado** | Diseñada |
| **RF09** | Planificación de rutas vehiculares eficientes en Neiva | CU03 | `CP-WEB-003`, `CP-API-004`, `CP-MOV-002` | Web / Móvil / Backend | **Implementado (Google Maps)**| Diseñada |
| **RF10** | Trazado de rutas peatonales sostenibles (Caminata a pie) | CU06 | `CP-WEB-004`, `CP-API-004`, `CP-MOV-002` | Web / Móvil / Backend | **Implementado** | Diseñada |
| **RF11** | Estimación matemática de emisiones de CO₂ y ahorro ecológico | CU16 | `CP-WEB-003`, `CP-API-006`, `CP-DB-002` | Backend / BD | **Implementado** | Diseñada |
| **RF12** | Consulta del historial personal de trayectos realizados | CU04 | `CP-MOV-001`, `CP-API-004` | Web / Móvil / Backend | **Implementado** | Diseñada |
| **RF13** | *[Delimitación ADR-8: Transporte público / Buses]* | *N/A* | `CP-WEB-005`, `CP-API-005` | Backend / Maps | **Excluido por ADR-8** | No aplicable (Contingencia validada) |
| **RF14** | Gestión y guardado de rutas frecuentes y favoritas | CU11 | `CP-WEB-003` | Web / Móvil / Backend | **Implementado** | Diseñada |
| **RF15** | Consulta y georreferenciación de puntos de interés (POIs) | CU17 | `CP-DB-003`, `CP-API-004` | Web / Móvil / BD | **Implementado (PostGIS)** | Diseñada |
| **RF16** | Calificación y retroalimentación de rutas transitadas por usuarios | CU09 | `CP-API-004` | Web / Móvil / Backend | **Implementado** | Diseñada |
| **RF17** | Reporte ciudadano de obstáculos viales con coordenadas GPS y foto | CU07 | `CP-API-007`, `CP-MOV-001` | Móvil / Web / Backend | **Implementado** | Diseñada |
| **RF18** | *[Delimitación ADR-8: Rutas de bicicleta / Ciclorrutas]* | *N/A* | `CP-WEB-005`, `CP-API-005` | Backend / Maps | **Excluido por ADR-8** | No aplicable (Contingencia validada) |
| **RF19** | Consulta de alertas meteorológicas y condiciones ambientales | CU18 | `CP-API-004` | Backend / Integrations| **Implementado (Weather Adapter)**| Diseñada |
| **RF20** | Portal de analítica y estadísticas globales de uso de la plataforma | CU08 | `CP-WEB-002`, `CP-API-002` | Web / Backend | **Implementado (Admin)** | Diseñada |
| **RF21** | Configuración multi-idioma (Español, Inglés y Francés) | CU21 | `CP-WEB-007` | Frontend Web | **Implementado (i18next)** | Diseñada |
| **RF22** | Exportación de reportes y estadísticas en formatos descargables | CU19 | `CP-API-004` | Web / Backend | **Implementado (ExportsController)**| Diseñada |
| **RF23** | Compartir rutas y trayectos sugeridos a través de enlaces | CU20 | `CP-API-004` | Web / Móvil / Backend | **Implementado** | Diseñada |
| **RF24** | Validación comunitaria de reportes de obstáculos mediante votación | CU22 | `CP-API-007` | Web / Móvil / Backend | **Implementado** | Diseñada |
| **RF25** | Asistencia de navegación y pre-alertas de maniobra por voz (TTS) | CU25 | `CP-MOV-003` | Móvil (React Native) | **Implementado (expo-speech)**| Diseñada |
| **RF26** | Personalización de tema visual accesible (Modo Claro / Modo Oscuro)| CU26 | `CP-WEB-006` | Frontend Web / Móvil | **Implementado (Tailwind/Context)**| Diseñada |
| **RF27** | Gestión de direcciones frecuentes (Casa, Trabajo, Universidad) | CU27 | `CP-WEB-003` | Web / Móvil / Backend | **Implementado** | Diseñada |
| **RF28** | Configuración general de parámetros del sistema y factores de CO₂ | CU28 | `CP-DB-002`, `CP-API-006` | Backend / BD (Admin) | **Implementado** | Diseñada |
| **RF29** | Auditoría inmutable de eventos críticos y accesos administrativos | CU24 | `CP-DB-001`, `CP-API-002` | Backend / BD (Security) | **Implementado** | Diseñada |
| **RF30** | Soporte técnico y mesa de ayuda mediante tickets de atención | CU23 | `CP-API-002` | Web / Backend (Admin) | **Implementado** | Diseñada |
| **RF31** | Notificaciones push de alertas en tiempo real para usuarios móviles | CU10 | `CP-MOV-001` | Móvil / Notifications | **Implementado (Expo Notif)**| Diseñada |
| **RF32** | Inicialización automática (Bootstrap) del superadministrador inicial | CU24 | `CP-API-001` | Backend (Security) | **Implementado** | Diseñada |
| **RF33** | Verificación de geocodificación de direcciones en Neiva | CU03 | `CP-API-004`, `CP-WEB-003` | Backend / Google Maps | **Implementado** | Diseñada |
| **RF34** | Interoperabilidad espacial con índices GiST para consultas en radio | CU17 | `CP-DB-003` | Base de Datos (PostGIS)| **Implementado** | Diseñada |

---

## 3. Resumen Cuantitativo de Cobertura

* **Total de Requisitos Funcionales Analizados:** 34
* **Requisitos Funcionales Operativos Cubiertos:** 32 (100% de los requisitos dentro del alcance operativo).
* **Requisitos Excluidos Formalmente (ADR-8):** 2 (RF13 y RF18 correspondientes a Buses y Bicicletas, cubiertos por pruebas negativas de rechazo/contingencia `CP-WEB-005` y `CP-API-005`).
* **Total de Casos de Prueba Diseñados:** 17 casos de prueba representativos (`7 CP-WEB`, `7 CP-API`, `3 CP-DB`, `3 CP-MOV` que validan integralmente la suite).
* **Porcentaje de Trazabilidad del Sistema:** **100%** de los requisitos cuentan con al menos un caso de prueba asociado.
