# Caso de Uso N° 14 — Modo invitado

> Requisito asociado: **RF17** · SRS EcoRuteando, sección 4.2

**Descripción:** Permite consultar rutas ecológicas sin necesidad de tener una cuenta registrada, con funcionalidades limitadas.

| Campo | Descripción |
|---|---|
| **Nombre** | Modo invitado |
| **Prioridad** | Baja |
| **Precondición** | Ninguna. No requiere cuenta ni inicio de sesión. |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El usuario abre la aplicación sin iniciar sesión | El sistema ofrece el modo invitado. |
| 2 | El usuario selecciona “Continuar como invitado” | El sistema otorga acceso con funciones limitadas (RF17.2). |
| 3 | El usuario consulta rutas en el mapa | El sistema permite visualizar rutas ecológicas normalmente. |
| 4 | El usuario intenta usar funciones exclusivas (favoritos, historial) | El sistema solicita registrarse o iniciar sesión. |

## Postcondición

El usuario navega en modo limitado sin que se almacenen datos personales (RF17.1).

## Excepciones (flujo alterno)

| Paso | Condición | Respuesta del sistema |
|:---:|---|---|
| E1 | Intento de acceso a función exclusiva (favoritos, historial, reportes). | Redirige al formulario de registro/login con “Regístrate para usar esta función”. |
| E2 | Fallo de servicio de mapas o clima mientras está en modo invitado. | Muestra “Servicio temporalmente no disponible” pero mantiene el modo invitado activo. |
| E3 | El usuario cierra el navegador sin registrarse. | No persiste ningún dato; al reingresar se ofrece nuevamente modo invitado. |
| E4 | Límite de cuota de API externa excedido en modo invitado. | Muestra “Límite temporal alcanzado, intente más tarde” con degradación elegante. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario (invitado) |
| **Comentarios** | Las acciones protegidas deben redirigir siempre al registro, nunca fallar silenciosamente. Trazabilidad: RF17 → CU14 (RF17.1 Navegación sin registro, RF17.2 Funciones limitadas). |
