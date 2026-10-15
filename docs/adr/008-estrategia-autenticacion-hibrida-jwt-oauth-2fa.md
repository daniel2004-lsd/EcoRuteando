# ADR-008: Estrategia de Autenticación Híbrida: JWT, OAuth2 (Google) y Doble Factor (2FA)

## Estado
**Aceptado**

## Fecha
Septiembre de 2025

---

## Contexto
El sistema gestiona datos de ciudadanos, trayectos frecuentes, domicilios favoritos e información administrativa. Se requiere garantizar la seguridad de acceso sin degradar la conversión de nuevos usuarios.

## Problema
- Un esquema que solo admita registro con correo y contraseña genera fricción de onboarding y mayor vulnerabilidad a contraseñas débiles.
- Depender exclusivamente de OAuth2 deja por fuera a usuarios sin cuentas de Google o en entornos institucionales cerrados.
- Las cuentas con privilegios administrativos o datos sensibles requieren una capa extra de protección contra compromiso de credenciales.

## Decisión
Se decidió implementar un **modelo de autenticación híbrido multicapa**:
1. **Tokens JWT Stateless con Refresh Tokens**:
   - `AccessToken` de corta duración (15-60 min) firmado criptográficamente con algoritmo HMAC-SHA256.
   - `RefreshToken` persistido en base de datos de rotación segura para extender sesiones en clientes móviles y web.
2. **Federación OAuth2 / OpenID Connect con Google**:
   - Soporte nativo para inicio de sesión en un clic tanto en web (`@react-oauth/google`) como en móvil (`expo-web-browser` / `expo-crypto` con flujo PKCE).
3. **Autenticación en Dos Pasos (2FA - TOTP)**:
   - Soporte para códigos de un solo uso basados en tiempo (RFC 6238) compatibles con Google Authenticator y Microsoft Authenticator.
   - Verificación de dispositivos de confianza (`TrustedDeviceService`) para equilibrar seguridad y conveniencia.

## Consecuencias

### Positivas
- **Flexibilidad Máxima**: El usuario elige entre registro tradicional rápido, inicio con Google o autenticación robusta con 2FA.
- **Seguridad Robusta**: Protección contra ataques de repetición y secuestro de sesión mediante refresh tokens rotativos.

### Negativas
- Mayor complejidad en el backend para gestionar múltiples flujos de emisión y validación de tokens.
