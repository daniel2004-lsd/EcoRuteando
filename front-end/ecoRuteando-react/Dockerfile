# Etapa 1: construir React
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# Etapa 2: servir React con Nginx sin privilegios de root (H-22)
FROM nginxinc/nginx-unprivileged:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Configuración para React Router y proxy hacia backend
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Puerto no privilegiado estándar
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
