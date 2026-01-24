# Etapa 1: Build del frontend
FROM node:18-alpine AS builder

# Instalar herramientas necesarias para esbuild y otros binarios
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar solo archivos de dependencias primero para aprovechar cache
COPY package*.json ./

# Instalar dependencias con `--force` para resolver conflictos de binarios
RUN npm install --force

# Copiar el resto del código
COPY . .

# 🔧 Recompilar esbuild para que el binario coincida con la plataforma
RUN npm rebuild esbuild

# Ejecutar el build de Vite
RUN npm run build

# Etapa 2: Servir con nginx
FROM nginx:alpine

# Copiar el resultado del build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada si la tienes
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

