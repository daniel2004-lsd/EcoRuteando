# ADR-002: Adopción de PostgreSQL con Extensión Espacial PostGIS

## Estado
**Aceptado**

## Fecha
Agosto de 2025

---

## Contexto
EcoRuteando requiere almacenar información espacial crítica para la movilidad sostenible:
- Trazado geométrico de rutas (polilíneas y caminos de desplazamiento).
- Ubicación de puntos de interés y paradas de transporte.
- Localización geográfica exacta de reportes ciudadanos y obstáculos en la vía.
- Radio de afectación y zonas de impacto de alertas ambientales o climáticas.

## Problema
Una base de datos relacional estándar (como PostgreSQL 16 convencional o MySQL sin extensiones espaciales avanzadas) solo permite almacenar coordenadas como campos numéricos (`latitude`, `longitude`). Esto impide ejecutar:
- Consultas de cercanía o proximidad indexadas en milisegundos (`ST_DWithin`, `ST_Distance`).
- Verificaciones de intersección espacial entre usuarios y alertas (`ST_Intersects`).
- Cálculos precisos de distancia sobre el esferoide terrestre (`GEOGRAPHY` vs `GEOMETRY`).

## Decisión
Se decidió utilizar la imagen oficial de base de datos **`postgis/postgis:16-3.5`**, integrando nativamente **PostgreSQL 16 con PostGIS 3.5**:
1. Los campos de coordenadas y áreas se modelan utilizando tipos espaciales `geography(Point, 4326)` y `geography(Polygon, 4326)`.
2. Se utilizan índices espaciales **GIST** para garantizar que las consultas de reportes cercanos y rutas se resuelvan en tiempo óptimo.
3. En el backend (.NET), se integra la librería **NetTopologySuite** para mapear los tipos espaciales directamente en Entity Framework Core.

## Consecuencias

### Positivas
- Soporte nativo para álgebra espacial y estándares de la OGC (Open Geospatial Consortium).
- Máxima eficiencia en consultas por radio (`bounding box` y buffers).
- Eliminación de algoritmos manuales en código de backend para calcular fórmulas haversine o intersecciones.

### Negativas
- Dependencia de imágenes específicas de Docker con PostGIS precompilado.
- Requiere cuidado en las migraciones de base de datos (Liquibase) para habilitar la extensión `CREATE EXTENSION IF NOT EXISTS postgis;`.
