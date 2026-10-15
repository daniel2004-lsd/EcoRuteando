# ADR-006: Flexibilización en la Actualización de Datos de Perfil sin Exigencia de Contraseña Actual

## Estado
**Aceptado**

## Fecha
Octubre de 2026

---

## Contexto
En el módulo de perfil de usuario (`UserProfile.jsx` en web y `profile.tsx` en móvil), la actualización de datos personales (nombres, apellidos, teléfono, biografía o ubicación) solicitaba de forma obligatoria la contraseña actual del usuario a través de un modal de confirmación antes de permitir guardar los cambios.

## Problema
1. **Fricción Excesiva de Usabilidad**: Solicitar la contraseña para editar datos no sensibles (como corregir una letra en el apellido o cambiar el número telefónico) generaba frustración en los usuarios ya autenticados.
2. **Incompatibilidad con Cuentas OAuth (Google)**: Los usuarios registrados mediante inicio de sesión federado de Google no poseen una contraseña local en el sistema, lo que causaba inconsistencias en los flujos de validación.
3. **Estándares Modernos de Experiencia de Usuario**: En aplicaciones contemporáneas, la confirmación obligatoria con contraseña se reserva estrictamente para operaciones de alto riesgo (cambio de contraseña propiamente dicho, activación/desactivación de 2FA o eliminación permanente de cuenta), mientras que los datos informativos del perfil permiten guardado directo.

## Decisión
Se decidió **eliminar la exigencia obligatoria de la contraseña actual para la actualización ordinaria del perfil**:
1. En el backend (.NET), en `UpdateMyProfileRequest` y `UpdateMyProfileCommandHandler`, se convirtió el campo `CurrentPassword` a opcional y se eliminó la validación obligatoria contra `PasswordHash`.
2. En el frontend web (`UserProfile.jsx`), el botón **Guardar Cambios** ejecuta directamente la petición `updateProfile` sin desplegar el modal de confirmación de contraseña.
3. El cambio formal de contraseña (`/api/auth/change-password`) y la eliminación de cuenta siguen exigiendo de manera estricta la verificación de credenciales actuales por motivos de seguridad.

## Consecuencias

### Positivas
- **Experiencia de Usuario Fluida**: Guardado de datos instantáneo con un solo clic.
- **Flujo Unificado**: Mismo comportamiento para usuarios con contraseña local y usuarios autenticados vía Google.
- **Mantenimiento de la Seguridad Crítica**: Las operaciones verdaderamente sensibles continúan protegidas con confirmación de credenciales.

### Negativas
- En caso de que una sesión quede abierta en un dispositivo desatendido, un tercero podría editar el nombre o teléfono visible del perfil sin ingresar la clave.
