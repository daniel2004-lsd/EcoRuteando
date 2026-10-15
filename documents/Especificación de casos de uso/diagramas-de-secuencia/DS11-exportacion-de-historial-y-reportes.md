# DS11: Generación y Exportación de Historial y Reportes Estadísticos en PDF y Excel

| Campo | Especificación |
| :--- | :--- |
| **Identificador** | DS11 |
| **Nombre** | DS11: Generación y Exportación de Historial y Reportes Estadísticos en PDF y Excel |
| **Casos de Uso Vinculados** | CU08, CU19 |
| **Requisitos Funcionales** | RF20, RF22, RF29 |

---

### Descripción del Flujo
Procesamiento de consultas complejas de trayectos por rango temporal, agregación de métricas de CO₂ y compilación de archivos descargables en formatos PDF y Excel (.xlsx).

---

### Diagrama de Secuencia UML

```mermaid
sequenceDiagram
    autonumber
    actor A as 🛡️ Administrador / Usuario
    participant UI as 💻 Portal Web / App
    participant ExportCtrl as 📄 ExportController (.NET)
    participant ReportEngine as 📊 ReportService (QuestPDF / ClosedXML)
    participant DB as 💾 PostgreSQL (Vistas Materializadas)

    A->>UI: Selecciona rango de fechas (01/01 a 31/01) y formato "Excel (.xlsx)"
    activate UI
    UI->>ExportCtrl: GET /api/v1/reports/export?from=...&to=...&format=xlsx [Bearer JWT]
    activate ExportCtrl
    ExportCtrl->>DB: SELECT * FROM view_historial_consolidado WHERE fecha BETWEEN @from AND @to
    activate DB
    DB-->>ExportCtrl: Colección de 1,500 registros con métricas de CO₂
    deactivate DB
    ExportCtrl->>ReportEngine: GenerarLibroExcelAsync(registros, metricas_resumen)
    activate ReportEngine
    ReportEngine->>ReportEngine: Formatear celdas, gráficos de torta y balances de emisiones
    ReportEngine-->>ExportCtrl: MemoryStream (bytes del archivo .xlsx)
    deactivate ReportEngine
    ExportCtrl-->>UI: 200 OK (Content-Type: application/vnd.openxmlformats-officedocument..., file_bytes)
    deactivate ExportCtrl
    UI->>UI: Disparar descarga en navegador: "EcoRuteando_Reporte_2026.xlsx"
    UI-->>A: Notifica: "Archivo descargado con éxito"
    deactivate UI
```
