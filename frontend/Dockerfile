# frontend/Dockerfile

# --- Fase 1: Build ---
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build -- --configuration production

# --- Fase 2: Esecuzione ---
FROM nginx:1.25-alpine

COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
