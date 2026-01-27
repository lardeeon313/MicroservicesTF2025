# Etapa 1: Build del frontend
FROM node:18-alpine AS builder

RUN apk add --no-cache python3 make g++

WORKDIR /app

# 👇 Declaramos argumento de build
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package*.json ./
RUN npm install --force

COPY . .

RUN npm rebuild esbuild

# 👇 Vite va a leer VITE_API_BASE_URL en este momento
RUN npx expo export --platform web

# Etapa 2: Servir con nginx
FROM nginx:alpine

# Copiar el resultado del build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada si la tienes
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

