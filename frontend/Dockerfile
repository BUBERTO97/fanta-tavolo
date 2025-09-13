# frontend/Dockerfile

# --- Fase 1: Build ---
# Usiamo un'immagine Node.js per compilare il codice Angular
FROM node:22-alpine AS builder

WORKDIR /app

# Copiamo i file di configurazione e installiamo le dipendenze
COPY package*.json ./
RUN npm install

# Copiamo tutto il codice sorgente
COPY . .

# Compiliamo l'app per la produzione
RUN npm run build -- --configuration production

# --- Fase 2: Esecuzione ---
# Usiamo un server web Nginx leggerissimo per servire i file compilati
FROM nginx:1.25-alpine

# Copiamo i file compilati dalla fase di build nella cartella web di Nginx
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Copiamo la nostra configurazione di Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Esponiamo la porta 80
EXPOSE 80
