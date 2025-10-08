# Multi-stage Dockerfile para Frontend
FROM node:20-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Runtime stage
FROM nginx:alpine

# Copiar archivos construidos
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puerto
EXPOSE 3000

# Comando para ejecutar nginx
CMD ["nginx", "-g", "daemon off;"]
