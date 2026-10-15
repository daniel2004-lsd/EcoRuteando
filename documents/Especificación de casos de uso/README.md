# Especificación de Casos de Uso y Modelado de Arquitectura — EcoRuteando

Este directorio contiene la suite completa y modularizada de análisis, diseño y arquitectura de software para el sistema **EcoRuteando**, cubriendo el 100% de los 34 Requisitos Funcionales del documento SRS y respetando el alcance del proyecto (vehículo particular eficiente y desplazamientos a pie; sin transporte público ni bicicletas).

---

## 🌐 Visor Web General Integrado
Puedes abrir directamente en el navegador el visualizador interactivo local y offline ubicado en esta misma carpeta:
👉 **[`visor-casos-de-uso.html`](visor-casos-de-uso.html)**
*(Incluye selector dinámico para Casos de Uso Macro, Casos de Uso Desglosados, Diagramas de Secuencia, Transición de Estados y Matriz de Trazabilidad).*

---

## 📚 Documentos Maestros de Arquitectura y Diseño (UML 2.5)

1. 🏛️ **[DIAGRAMAS-CASOS-DE-USO.md](DIAGRAMAS-CASOS-DE-USO.md)**:
   - Diagrama General de Límites del Sistema.
   - 5 Diagramas de Subsistemas.
   - Catálogo con los **28 Diagramas Individuales Desglosados** (CU01 al CU28).
2. ⚡ **[diagramas-de-secuencia/](diagramas-de-secuencia/)** · **[DIAGRAMAS-DE-SECUENCIA.md](DIAGRAMAS-DE-SECUENCIA.md)**:
   - Colección exhaustiva de **12 Diagramas de Secuencia individuales (DS01 al DS12)**:
     - DS01: Registro con Argon2id y OTP · DS02: Login y JWT · DS03: Recuperación de clave · DS04: Ruta vehicular y CO₂
     - DS05: Modo peatonal cero emisiones · DS06: Navegación GPS y Voz TTS · DS07: Búsqueda POIs · DS08: Reporte GPS
     - DS09: Validación comunitaria por votos · DS10: Calificación de rutas · DS11: Exportación PDF/Excel · DS12: Gestión admin y auditoría
3. 🔄 **[diagramas-de-transicion/](diagramas-de-transicion/)** · **[DIAGRAMAS-DE-TRANSICION-DE-ESTADOS.md](DIAGRAMAS-DE-TRANSICION-DE-ESTADOS.md)**:
   - Colección formal de **8 Diagramas de Transición de Estados (TE01 al TE08)**:
     - TE01: Ciclo de vida de ruta vehicular · TE02: Ciclo de vida de trayecto peatonal · TE03: Ciclo de reporte ciudadano
     - TE04: Ciclo de vida de cuenta de usuario · TE05: Ciclo de sesión y token JWT · TE06: Ciclo de ticket de soporte
     - TE07: Ciclo de notificación push del sistema · TE08: Ciclo de parámetros operativos del sistema
4. 🛡️ **[RNF-requisitos-no-funcionales.md](RNF-requisitos-no-funcionales.md)**:
   - Especificación formal de los **12 Requisitos No Funcionales** (Rendimiento, Seguridad Argon2id, WCAG 2.1, PostGIS, Respaldo, etc.).


---

## 📑 Índice Maestro de los 28 Casos de Uso (CU01 al CU28)

Cada archivo `.md` es **autocontenido**: incluye sus metadatos, actores, precondiciones, **diagrama UML individual en Mermaid**, secuencia normal de eventos, flujos alternos y postcondiciones.

| Archivo | N° | Caso de Uso | RF Asociado | Actor Principal | Subsistema / Módulo |
| :--- | :---: | :--- | :--- | :--- | :--- |
| [CU01-registro-del-usuario.md](CU01-registro-del-usuario.md) | 01 | Registro de usuario | RF01, RF04 | Visitante | Autenticación y Perfil |
| [CU02-recuperacion-de-contrasena.md](CU02-recuperacion-de-contrasena.md) | 02 | Recuperación de contraseña | RF03 | Usuario / Visitante | Autenticación y Perfil |
| [CU03-gestion-de-rutas.md](CU03-gestion-de-rutas.md) | 03 | Planificación y gestión de rutas | RF09, RF26, RF27 | Ciudadano / Conductor | Rutas y Movilidad |
| [CU04-historial-de-trayectos.md](CU04-historial-de-trayectos.md) | 04 | Historial de trayectos | RF12 | Usuario registrado | Rutas y Movilidad |
| [CU05-inicio-sesion.md](CU05-inicio-sesion.md) | 05 | Inicio de sesión | RF02, RF04 | Usuario registrado | Autenticación y Perfil |
| [CU06-visualizacion-de-rutas-ecologicas.md](CU06-visualizacion-de-rutas-ecologicas.md) | 06 | Visualización de rutas ecológicas | RF10 | Ciudadano / Conductor | Rutas y Movilidad |
| [CU07-reporte-ciudadano-de-obstaculos.md](CU07-reporte-ciudadano-de-obstaculos.md) | 07 | Reporte ciudadano de obstáculos | RF17 | Ciudadano | Reportes y Comunidad |
| [CU08-portal-de-estadisticas.md](CU08-portal-de-estadisticas.md) | 08 | Portal de estadísticas y analítica | RF20 | Administrador | Administración y Analítica |
| [CU09-calificar-rutas.md](CU09-calificar-rutas.md) | 09 | Calificar y retroalimentar rutas | RF16 | Ciudadano | Soporte y Preferencias |
| [CU10-envio-de-notificaciones.md](CU10-envio-de-notificaciones.md) | 10 | Envío de notificaciones del sistema | RF25 | Administrador | Administración y Analítica |
| [CU11-gestion-de-rutas-favoritas.md](CU11-gestion-de-rutas-favoritas.md) | 11 | Gestión de rutas favoritas | RF14 | Usuario registrado | Rutas y Movilidad |
| [CU12-edicion-de-perfil.md](CU12-edicion-de-perfil.md) | 12 | Edición de perfil de usuario | RF05 | Usuario registrado | Autenticación y Perfil |
| [CU13-eliminacion-de-cuenta.md](CU13-eliminacion-de-cuenta.md) | 13 | Eliminación voluntaria de cuenta | RF06, RF21 | Usuario registrado | Autenticación y Perfil |
| [CU14-modo-invitado.md](CU14-modo-invitado.md) | 14 | Navegación en modo invitado | RF07 | Visitante | Autenticación y Perfil |
| [CU15-consulta-y-aceptacion-de-terminos.md](CU15-consulta-y-aceptacion-de-terminos.md) | 15 | Consulta y aceptación de términos | RF08 | Visitante / Ciudadano | Autenticación y Perfil |
| [CU16-estimacion-de-tiempo-y-co2.md](CU16-estimacion-de-tiempo-y-co2.md) | 16 | Estimación de tiempo y ahorro de CO₂ | RF11 | Ciudadano / Sistema | Rutas y Movilidad |
| [CU17-consulta-de-puntos-de-interes.md](CU17-consulta-de-puntos-de-interes.md) | 17 | Consulta de puntos de interés (POIs) | RF15 | Ciudadano / Conductor | Rutas y Movilidad |
| [CU18-alertas-climaticas.md](CU18-alertas-climaticas.md) | 18 | Consulta de alertas climáticas | RF19 | Ciudadano / Sistema | Reportes y Comunidad |
| [CU19-exportacion-de-historial.md](CU19-exportacion-de-historial.md) | 19 | Exportación de historial y reportes | RF22, RF29 | Usuario / Administrador | Administración y Analítica |
| [CU20-compartir-recorridos.md](CU20-compartir-recorridos.md) | 20 | Compartir recorridos | RF32 | Usuario registrado | Soporte y Preferencias |
| [CU21-configuracion-de-idioma.md](CU21-configuracion-de-idioma.md) | 21 | Configuración de idioma de interfaz | RF34 | Todos los usuarios | Soporte y Preferencias |
| [CU22-validacion-comunitaria-de-reportes.md](CU22-validacion-comunitaria-de-reportes.md) | 22 | Validación comunitaria de reportes | RF18 | Comunidad / Admin | Reportes y Comunidad |
| [CU23-soporte-tecnico-y-mesa-de-ayuda.md](CU23-soporte-tecnico-y-mesa-de-ayuda.md) | 23 | Soporte técnico y mesa de ayuda | RF30 | Ciudadano / Soporte | Soporte y Preferencias |
| [CU24-gestion-administrativa-de-usuarios-y-auditoria.md](CU24-gestion-administrativa-de-usuarios-y-auditoria.md) | 24 | Gestión de usuarios y auditoría | RF21, RF24 | Administrador | Administración y Analítica |
| [CU25-asistencia-de-navegacion-por-voz.md](CU25-asistencia-de-navegacion-por-voz.md) | 25 | Asistencia de navegación por voz (TTS) | RF28 | Conductor / Ciudadano | Rutas y Movilidad |
| [CU26-personalizacion-de-tema-visual.md](CU26-personalizacion-de-tema-visual.md) | 26 | Personalización de tema visual | RF33 | Todos los usuarios | Soporte y Preferencias |
| [CU27-gestion-de-direcciones-frecuentes.md](CU27-gestion-de-direcciones-frecuentes.md) | 27 | Gestión de direcciones frecuentes | RF13 | Ciudadano / Conductor | Rutas y Movilidad |
| [CU28-configuracion-general-del-sistema.md](CU28-configuracion-general-del-sistema.md) | 28 | Configuración general del sistema | RF23 | Administrador | Administración y Analítica |
