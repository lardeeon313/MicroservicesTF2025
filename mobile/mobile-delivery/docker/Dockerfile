# Etapa 1: Build
FROM node:18-alpine AS builder

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

# Build web correcto (único válido hoy)
RUN npx expo export --platform web


# Etapa 2: Nginx
FROM nginx:alpine

# Copiar output de Expo (expo export genera /dist)
COPY --from=builder /app/dist /usr/share/nginx/html

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

