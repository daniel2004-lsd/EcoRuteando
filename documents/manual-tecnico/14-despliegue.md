---

## 14. Despliegue

### 14.1 Infraestructura actual (verificada)

| Componente | Plataforma | URL / Detalle | Estado |
|-----------|-----------|--------------|--------|
| Frontend Web | **Vercel** | Proyecto `ecoRuteando-react` | ✅ Verificado (`vercel.json`) |
| Backend API | **Render** | `https://ecoruteando-backend.onrender.com` | ⚠️ Inferido (config referenciada, dashboard no inspeccionado) |
| Base de Datos | **Render PostgreSQL** | URL en variable de entorno del backend | ⚠️ Inferido |
| Móvil | **EAS Build (Expo)** | `eas.json` con perfiles development/preview/production | ✅ Verificado |

### 14.2 Configuración Vercel (frontend)

**Archivo:** `front-end/ecoRuteando-react/vercel.json`

```json
{
  "rewrites": [
    { "source": "/api/:match*", "destination": "https://ecoruteando-backend.onrender.com/api/:match*" },
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
```

- Las llamadas a `/api/*` se reescriben al backend en Render
- El resto es SPA catch-all (react-router)

### 14.3 Configuración Render (backend)

> **No existe `render.yaml`** en el repositorio — la configuración es dashboard-side y no fue inspeccionada.

**Configuración inferida de `eas.json` y `vercel.json`:**

| Parámetro | Valor |
|-----------|-------|
| Build Command | `dotnet publish src/Api/EcoRuteando.Api -c Release -o ./output` |
| Start Command | `./output/EcoRuteando.Api` |
| Puerto | `5124` |
| Variables de entorno | Todas las de la sección 10.1 |

### 14.4 Configuración EAS (móvil)

**Archivo:** `Movil-EcoRuteando/eas.json`

```json
{
  "build": {
    "development": {
      "env": { "EXPO_PUBLIC_API_URL": "http://localhost:5124" },
      "developmentClient": true
    },
    "preview": {
      "env": { "EXPO_PUBLIC_API_URL": "https://ecoruteando-backend.onrender.com" },
      "distribution": "internal"
    },
    "production": {
      "env": { "EXPO_PUBLIC_API_URL": "https://ecoruteando-backend.onrender.com" }
    }
  },
  "submit": {
    "production": {}
  }
}
```

- **`submit` está vacío** → no hay configuración de publicación en Play Store/App Store
- Los builds `preview` generan APK internos instalables

### 14.5 CI/CD

| Repositorio | Pipeline | Estado |
|------------|----------|--------|
| EcoRuteandoBackend | GitHub Actions u otro | ❌ No encontrado |
| EcoRuteando | GitHub Actions u otro | ❌ No encontrado |
| Movil-EcoRuteando | GitHub Actions u otro | ❌ No encontrado |
| EcoRuteandoDb | GitHub Actions u otro | ❌ No encontrado |

> **Hallazgo:** No existe integración continua automatizada. Los despliegues son manuales.

### 14.6 Flujo de despliegue manual recomendado

```
1. Merge a develop (vía PR)
2. Merge develop → qa (vía PR) + DB-XX-qa → qa
3. Validar en ambiente QA
4. Merge qa → main (vía PR)
5. Vercel despliega automáticamente (si está conectado a main)
6. Render: redeploy manual o auto-deploy desde main
7. EAS: eas build --profile production
```

### 14.7 Checklist pre-despliegue

- [ ] `git status` limpio en los 4 repos
- [ ] Rama correcta (`main` para producción)
- [ ] Sin secretos en los commits (`git diff` revisado)
- [ ] Migraciones Liquibase verificadas en staging
- [ ] Variables de entorno actualizadas en Render/Vercel/EAS
- [ ] `.env.example` actualizado si se agregaron variables nuevas
- [ ] Smoke test manual: login → ruta → guardar → favorito
