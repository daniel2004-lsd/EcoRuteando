# ADR-007: Unificación de la Paleta Cromática de Modo Oscuro entre Web y App Móvil

## Estado
**Aceptado**

## Fecha
Octubre de 2026

---

## Contexto
El sistema EcoRuteando dispone de soporte para temas Claro y Oscuro tanto en el cliente Web como en la Aplicación Móvil.

Inicialmente, el modo oscuro en la web utilizaba clases genéricas de TailwindCSS (`bg-gray-900`, `bg-gray-950`, `bg-slate-900`), mientras que la aplicación móvil (`theme.ts`) implementaba una paleta ecológica personalizada con tonos carbón profundo y verdes azulados esmeralda.

## Problema
- Disparidad estética notable entre ambas plataformas: la versión web se percibía grisácea y plana, mientras que la versión móvil presentaba un acabado oscuro premium y consistente con la identidad ecológica del producto.
- Falta de coherencia en el Design System del proyecto, dificultando la transición del usuario entre el teléfono celular y el computador.

## Decisión
Se decidió **estandarizar e igualar la paleta de modo oscuro en la plataforma Web con los tokens exactos de la aplicación móvil**:
1. **Tokens de Color Establecidos**:
   - Fondo Principal (`darkBg`): `#0B1215` (Carbón profundo con matiz esmeralda)
   - Contenedores y Tarjetas (`darkCard`): `#162329`
   - Superficies Secundarias (`darkSurface`): `#111C20`
   - Bordes y Divisores (`darkBorder`): `#26383D`
   - Acentos Verdes Activos (`darkAccent`): `#34D399` y `#059669`
   - Texto Principal (`darkText`): `#e2e8f0`
   - Texto Secundario y Muted (`darkTextSec`): `#94a3b8`
2. **Aplicación en Web**:
   - Ajuste de `index.css` con variables CSS para el selector `.dark`.
   - Reemplazo de tonalidades de grises por los valores hexadecimales exactos en la Landing Page (`HomePage.jsx`), Dashboard y componentes visuales.

## Consecuencias

### Positivas
- **Identidad Visual 100% Homogénea**: Misma atmósfera visual inmersiva en navegadores web y en dispositivos Android.
- **Mayor Contraste y Eficiencia Energética**: El tono `#0B1215` ofrece un contraste óptimo con los acentos esmeralda `#34D399` y reduce la fatiga visual.

### Negativas
- Requiere mantener la sincronización manual de tokens si en el futuro se modifican los colores del tema móvil.
