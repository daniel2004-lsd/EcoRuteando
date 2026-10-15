# DS10: Consulta, Calificación y Retroalimentación de Trayecto con Estrellas

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | DS10 |
| **Nombre** | DS10: Consulta, Calificación y Retroalimentación de Trayecto con Estrellas |
| **Casos de Uso Vinculados** | CU09, CU11 |
| **Requisitos Funcionales** | RF14, RF16 |

---

### Descripción del Flujo
Al finalizar un recorrido, el usuario califica el estado de la vía de 1 a 5 estrellas, redacta observaciones de seguridad y opcionalmente guarda el trayecto como favorito con un alias.

---

### Diagrama de Secuencia UML

```mermaid
sequenceDiagram
    autonumber
    actor U as 🧑‍💼 Usuario Registrado
    participant UI as 📱 App Móvil
    participant RutasCtrl as 🌐 RutasController
    participant FavCtrl as ⭐ FavoritasController
    participant DB as 💾 PostgreSQL

    U->>UI: Finaliza trayecto y accede a la tarjeta de retroalimentación
    activate UI
    U->>UI: Asigna 5 estrellas y redacta comentario: "Vía rápida, poco tráfico"
    UI->>RutasCtrl: POST /api/v1/routes/{id}/rate (rating=5, comentario="...") [Bearer JWT]
    activate RutasCtrl
    RutasCtrl->>DB: INSERT INTO calificaciones (ruta_id, user_id, rating, comentario, fecha)
    activate DB
    DB-->>RutasCtrl: 201 Created
    deactivate DB
    RutasCtrl-->>UI: 200 OK (Calificación guardada)
    deactivate RutasCtrl

    opt Usuario decide marcarla como favorita
        U->>UI: Pulsa "Guardar en Favoritas" y asigna alias: "Ruta Casa - Trabajo"
        UI->>FavCtrl: POST /api/v1/routes/favorites (ruta_id, alias="Ruta Casa - Trabajo")
        activate FavCtrl
        FavCtrl->>DB: INSERT INTO rutas_favoritas (user_id, ruta_id, alias)
        activate DB
        DB-->>FavCtrl: Favorita persistida
        deactivate DB
        FavCtrl-->>UI: 200 OK (Favorita agregada)
        deactivate FavCtrl
    end
    UI-->>U: Notifica éxito y regresa al menú principal
    deactivate UI
```
