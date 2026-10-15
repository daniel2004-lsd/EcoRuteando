# DS12: Gestión Administrativa de Usuarios, Modificación de Roles y Log de Auditoría

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | DS12 |
| **Nombre** | DS12: Gestión Administrativa de Usuarios, Modificación de Roles y Log de Auditoría |
| **Casos de Uso Vinculados** | CU24, CU28 |
| **Requisitos Funcionales** | RF21, RF23, RF24 |

---

### Descripción del Flujo
Supervisión administrativa de usuarios, revocación o asignación de privilegios de moderador/administrador y registro inmutable en bitácora de auditoría de seguridad.

---

### Diagrama de Secuencia UML

```mermaid
sequenceDiagram
    autonumber
    actor SuperAdmin as 🛡️ Super Administrador
    participant WebUI as 💻 Portal Web Admin
    participant AdminCtrl as ⚙️ AdminUsersController
    participant SecSvc as 🛡️ SecurityService
    participant DB as 💾 PostgreSQL (Usuarios & Roles)
    participant AuditLog as 📝 AuditLogger (Tabla auditoria_seguridad)

    SuperAdmin->>WebUI: Accede a "Gestión de Usuarios", busca usuario por correo y selecciona "Asignar Rol: Moderador"
    activate WebUI
    WebUI->>AdminCtrl: PUT /api/v1/admin/users/{id}/role (new_role='MODERADOR') [Bearer JWT SuperAdmin]
    activate AdminCtrl
    AdminCtrl->>SecSvc: ValidarPermisosSuperAdmin(callerId)
    activate SecSvc
    SecSvc-->>AdminCtrl: Permisos confirmados
    deactivate SecSvc
    AdminCtrl->>DB: UPDATE usuarios SET rol = 'MODERADOR' WHERE id = @id
    activate DB
    DB-->>AdminCtrl: 1 fila afectada
    deactivate DB
    AdminCtrl->>AuditLog: RegistrarAccionCritica(superAdminId, "CAMBIO_ROL", targetUserId, "MODERADOR", ip_origen)
    activate AuditLog
    AuditLog->>DB: INSERT INTO auditoria_seguridad (actor_id, accion, target_id, detalle, fecha)
    deactivate AuditLog
    AdminCtrl-->>WebUI: 200 OK ("Rol actualizado exitosamente")
    deactivate AdminCtrl
    WebUI-->>SuperAdmin: Muestra confirmación y actualiza tabla de padrón en vivo
    deactivate WebUI
```
