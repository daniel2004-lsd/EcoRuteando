# Especificación de Requisitos No Funcionales (RNF) - EcoRuteando

Este documento recopila la especificación formal de los **12 Requisitos No Funcionales (RNF)** del sistema EcoRuteando, los cuales definen los atributos de calidad, rendimiento, seguridad, interoperabilidad y arquitectura de la plataforma.

---

## Índice de Requisitos No Funcionales

| ID | Nombre del Atributo | Tipo | Criticidad | Prioridad |
| :--- | :--- | :--- | :--- | :--- |
| **RNF01** | Rendimiento y Tiempo de Respuesta | Necesario | Sí | Alta |
| **RNF02** | Usabilidad y Facilidad de Aprendizaje | Deseable | Sí | Alta |
| **RNF03** | Compatibilidad Multiplataforma | Necesario | Sí | Media |
| **RNF04** | Seguridad, Hashing y Protección de Datos | Crítico | Sí | Muy Alta |
| **RNF05** | Escalabilidad de Infraestructura | Necesario | No inmediato | Media |
| **RNF06** | Disponibilidad y Continuidad Operativa | Necesario | Sí | Alta |
| **RNF07** | Accesibilidad (WCAG 2.1) | Necesario | Sí | Alta |
| **RNF08** | Interoperabilidad de APIs y Servicios | Necesario | Sí | Alta |
| **RNF09** | Mantenibilidad y Calidad de Código | Necesario | Sí | Media |
| **RNF10** | Respaldo y Recuperación ante Desastres | Necesario | Sí | Alta |
| **RNF11** | Escalabilidad de Datos Geoespaciales | Necesario | Sí | Alta |
| **RNF12** | Monitoreo, Logs y Métricas en Tiempo Real | Necesario | Sí | Alta |

---

### RNF01: Rendimiento y Tiempo de Respuesta

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | RNF01 |
| **Nombre** | Rendimiento y Tiempo de Respuesta |
| **Tipo** | Necesario |
| **¿Crítico?** | Sí |
| **Prioridad de desarrollo** | Alta |
| **Documentos asociados** | No aplica |
| **Entrada** | Peticiones concurrentes de cálculo de rutas, consultas y autenticación |
| **Salida** | Respuestas HTTP y renders de interfaz dentro del umbral objetivo |
| **Descripción** | Capacidad del backend y frontend de responder oportunamente sin degradación apreciable bajo condiciones estándar de carga. |
| **Manejo de situaciones anormales** | Notificar al usuario mediante aviso no bloqueante si la solicitud excede los 5 segundos por latencia de red; mecanismos de reintento controlado con retroceso exponencial. |
| **Criterios de aceptación** | 1. El 95% de las solicitudes REST responden en $\le 5$ segundos.<br>2. Carga inicial de vistas principales en $\le 3$ segundos bajo conexión 4G o banda ancha. |

---

### RNF02: Usabilidad y Facilidad de Aprendizaje

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | RNF02 |
| **Nombre** | Usabilidad y Facilidad de Aprendizaje |
| **Tipo** | Deseable |
| **¿Crítico?** | Sí |
| **Prioridad de desarrollo** | Alta |
| **Documentos asociados** | Guías de Diseño UI/UX EcoRuteando |
| **Entrada** | Interacción táctil y de navegación del usuario |
| **Salida** | Experiencia de usuario fluida, comprensible y sin fricciones |
| **Descripción** | La interfaz debe presentar una disposición limpia, botones táctiles adecuados (área mínima de toque de 48x48 dp) e iconografía intuitiva. |
| **Manejo de situaciones anormales** | Presentación de tooltips contextuales, mensajes de error explicativos y estados vacíos (*empty states*) descriptivos. |
| **Criterios de aceptación** | 1. Acceso a las acciones primarias (calcular ruta, reportar incidente) en máximo 3 toques o clics.<br>2. El 90% de los usuarios evalúa la interfaz como clara y fácil de operar sin inducción previa. |

---

### RNF03: Compatibilidad Multiplataforma

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | RNF03 |
| **Nombre** | Compatibilidad Multiplataforma |
| **Tipo** | Necesario |
| **¿Crítico?** | Sí |
| **Prioridad de desarrollo** | Media |
| **Documentos asociados** | Matriz de compatibilidad de navegadores y SO |
| **Entrada** | Conexión desde dispositivos móviles (Android / iOS) y navegadores web modernos |
| **Salida** | Ejecución visual y funcional consistente en todas las plataformas soportadas |
| **Descripción** | La aplicación móvil debe operar de manera estable en Android (API 26+) e iOS (14+); el portal web administrativo debe funcionar en Chrome, Firefox, Edge y Safari. |
| **Manejo de situaciones anormales** | Detección de navegador desactualizado con advertencia amistosa recomendando actualización. |
| **Criterios de aceptación** | Correcta renderización del mapa y componentes reactivos en los navegadores y sistemas operativos de la matriz objetivo. |

---

### RNF04: Seguridad, Hashing y Protección de Datos

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | RNF04 |
| **Nombre** | Seguridad, Hashing y Protección de Datos |
| **Tipo** | Crítico |
| **¿Crítico?** | Sí |
| **Prioridad de desarrollo** | Muy Alta |
| **Documentos asociados** | Política de Seguridad de la Información y Protección de Datos Personales |
| **Entrada** | Credenciales de acceso, tokens JWT y coordenadas de geolocalización |
| **Salida** | Canales cifrados (HTTPS/TLS 1.3), almacenamiento seguro de credenciales |
| **Descripción** | Las contraseñas de los usuarios deben procesarse exclusivamente mediante algoritmos robustos de hash criptográfico (Argon2id o bcrypt) con salt individual, impidiendo su almacenamiento en texto plano. Todas las comunicaciones cliente-servidor viajan cifradas con TLS. |
| **Manejo de situaciones anormales** | Bloqueo temporal por tasa de intentos fallidos excesivos (*rate limiting* / brute-force protection). |
| **Criterios de aceptación** | 1. Ninguna contraseña o secreto se almacena en texto legible.<br>2. Tokens de sesión firmados con tiempo de expiración y revocabilidad.<br>3. Coordenadas de reportes tratadas bajo principios de minimización de datos. |

---

### RNF05: Escalabilidad de Infraestructura

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | RNF05 |
| **Nombre** | Escalabilidad de Infraestructura |
| **Tipo** | Necesario |
| **¿Crítico?** | No inmediato |
| **Prioridad de desarrollo** | Media |
| **Documentos asociados** | Arquitectura de Despliegue en Contenedores |
| **Entrada** | Incremento sostenido en la concurrencia de usuarios y peticiones por segundo |
| **Salida** | Asignación elástica de instancias sin caída de servicio |
| **Descripción** | La arquitectura backend debe ser sin estado (*stateless*) para permitir escalabilidad horizontal mediante contenedores y balanceo de carga. |
| **Manejo de situaciones anormales** | Activación de réplicas en clúster ante saturación de CPU/memoria sobre el 80%. |
| **Criterios de aceptación** | Capacidad de duplicar la concurrencia de usuarios sin duplicar linealmente los tiempos de respuesta. |

---

### RNF06: Disponibilidad y Continuidad Operativa

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | RNF06 |
| **Nombre** | Disponibilidad y Continuidad Operativa |
| **Tipo** | Necesario |
| **¿Crítico?** | Sí |
| **Prioridad de desarrollo** | Alta |
| **Documentos asociados** | Plan de Contingencia y Recuperación |
| **Entrada** | Solicitudes de servicio continuas durante las 24 horas del día |
| **Salida** | Disponibilidad de endpoints y servicios de cartografía |
| **Descripción** | El sistema establece como meta operativa una disponibilidad del 99.9% en horario de operación general (excluyendo ventanas programadas de mantenimiento). |
| **Manejo de situaciones anormales** | Conmutación por error (*failover*) de base de datos y páginas de mantenimiento informativo. |
| **Criterios de aceptación** | Uptime mensual medido $\ge 99.5\%$ en entorno de producción. |

---

### RNF07: Accesibilidad (WCAG 2.1)

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | RNF07 |
| **Nombre** | Accesibilidad (WCAG 2.1) |
| **Tipo** | Necesario |
| **¿Crítico?** | Sí |
| **Prioridad de desarrollo** | Alta |
| **Documentos asociados** | Estándar WCAG 2.1 Nivel AA |
| **Entrada** | Navegación con tecnologías de asistencia (TalkBack, VoiceOver) |
| **Salida** | Etiquetas semánticas legibles por sintetizador de pantalla |
| **Descripción** | Los elementos interactivos deben contar con etiquetas descriptivas (`accessibilityLabel`), contraste cromático mínimo de 4.5:1 para texto normal y compatibilidad con redimensionamiento de texto del sistema operativo. |
| **Manejo de situaciones anormales** | Adaptación responsiva para evitar cortes de texto al agrandar la fuente del dispositivo. |
| **Criterios de aceptación** | Superación de validaciones automáticas de contraste y lectura de botones por lectores de pantalla nativos. |

---

### RNF08: Interoperabilidad de APIs y Servicios

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | RNF08 |
| **Nombre** | Interoperabilidad de APIs y Servicios |
| **Tipo** | Necesario |
| **¿Crítico?** | Sí |
| **Prioridad de desarrollo** | Alta |
| **Documentos asociados** | Especificación OpenAPI / Swagger |
| **Entrada** | Peticiones a proveedores externos (servicios de enrutamiento, mapas base, síntesis de voz del SO) |
| **Salida** | Respuestas estandarizadas en formato JSON y ejecución de comandos nativos |
| **Descripción** | El sistema interactúa con motores de cálculo geoespacial (OpenRouteService, OSRM, Google Maps Platform) y sintetizadores de voz nativos del sistema operativo (TTS) empleando contratos de interfaz REST y JSON estrictamente tipados. |
| **Manejo de situaciones anormales** | Degradación elegante y mensajes explicativos ante indisponibilidad de proveedores externos. |
| **Criterios de aceptación** | Documentación de endpoints en OpenAPI/Swagger y tipado riguroso de payloads. |

---

### RNF09: Mantenibilidad y Calidad de Código

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | RNF09 |
| **Nombre** | Mantenibilidad y Calidad de Código |
| **Tipo** | Necesario |
| **¿Crítico?** | Sí |
| **Prioridad de desarrollo** | Media |
| **Documentos asociados** | Guías de Contribución y Estándares de Codificación |
| **Entrada** | Nuevas funcionalidades, refactorizaciones o parches de seguridad |
| **Salida** | Código limpio, testeable, modular y versionado en Git |
| **Descripción** | Arquitectura por capas (controlador, servicio, repositorio), separación de responsabilidades y cobertura de pruebas unitarias en módulos críticos. |
| **Manejo de situaciones anormales** | Bloqueo de integración continua (CI) ante fallos en pruebas automatizadas o linter. |
| **Criterios de aceptación** | Código con tipado estático, comentarios descriptivos en módulos clave y paso exitoso de análisis estático. |

---

### RNF10: Respaldo y Recuperación ante Desastres

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | RNF10 |
| **Nombre** | Respaldo y Recuperación ante Desastres |
| **Tipo** | Necesario |
| **¿Crítico?** | Sí |
| **Prioridad de desarrollo** | Alta |
| **Documentos asociados** | Procedimiento Operativo de Backups y Restauración |
| **Entrada** | Datos de producción en base de datos PostgreSQL / PostGIS |
| **Salida** | Copias de seguridad automáticas cifradas y verificadas |
| **Descripción** | Generación diaria automatizada de copias de respaldo (*pg_dump* o snapshots de volumen) almacenadas en almacenamiento secundario independiente. |
| **Manejo de situaciones anormales** | Alertas inmediatas al equipo de administración ante fallos en la tarea programada de backup. |
| **Criterios de aceptación** | Tiempo objetivo de recuperación (RTO) $\le 60$ minutos y punto objetivo de recuperación (RPO) $\le 24$ horas. |

---

### RNF11: Escalabilidad de Datos Geoespaciales

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | RNF11 |
| **Nombre** | Escalabilidad de Datos Geoespaciales |
| **Tipo** | Necesario |
| **¿Crítico?** | Sí |
| **Prioridad de desarrollo** | Alta |
| **Documentos asociados** | Esquema de Base de Datos y Diccionario de Datos |
| **Entrada** | Miles de registros de trayectos, geometrías LineString y puntos de incidentes |
| **Salida** | Consultas espaciales optimizadas sin degradación de velocidad |
| **Descripción** | Implementación de índices espaciales GiST en PostgreSQL/PostGIS para geometrías vectoriales y particionado lógico o paginación en el historial de trayectos. |
| **Manejo de situaciones anormales** | Monitoreo de consultas lentas (*slow queries*) con reindexación periódica. |
| **Criterios de aceptación** | Consultas espaciales de proximidad y recuperación de historial en $\le 500$ ms sobre conjuntos de datos de prueba de más de 100,000 registros. |

---

### RNF12: Monitoreo, Logs y Métricas en Tiempo Real

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | RNF12 |
| **Nombre** | Monitoreo, Logs y Métricas en Tiempo Real |
| **Tipo** | Necesario |
| **¿Crítico?** | Sí |
| **Prioridad de desarrollo** | Alta |
| **Documentos asociados** | Matriz de Eventos y Configuración de Logging |
| **Entrada** | Eventos del sistema, excepciones HTTP 5xx, tiempos de respuesta y peticiones |
| **Salida** | Registros estructurados en formato JSON y paneles de observación |
| **Descripción** | Registro estructurado de eventos en consola y archivos de log rotativos, protegiendo datos sensibles (sin registrar contraseñas ni tokens). |
| **Manejo de situaciones anormales** | Disparo de alertas ante tasa inusual de errores o indisponibilidad de base de datos. |
| **Criterios de aceptación** | Trazabilidad completa de errores con identificador de correlación (*traceId*) y nivel de severidad (INFO, WARN, ERROR). |
