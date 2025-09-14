# frontend/Dockerfile

# --- Fase 1: Build ---
FROM node:22-alpine AS builder

WORKDIR /app

ARG FIREBASE_API_KEY
ARG FIREBASE_AUTH_DOMAIN
ARG FIREBASE_PROJECT_ID
ARG FIREBASE_STORAGE_BUCKET
ARG FIREBASE_MESSAGING_SENDER_ID
ARG FIREBASE_APP_ID
ARG FIREBASE_MEASUREMENT_ID

ENV FIREBASE_API_KEY=$FIREBASE_API_KEY
ENV FIREBASE_AUTH_DOMAIN=$FIREBASE_AUTH_DOMAIN
ENV FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID
ENV FIREBASE_STORAGE_BUCKET=$FIREBASE_STORAGE_BUCKET
ENV FIREBASE_MESSAGING_SENDER_ID=$FIREBASE_MESSAGING_SENDER_ID
ENV FIREBASE_APP_ID=$FIREBASE_APP_ID
ENV FIREBASE_MEASUREMENT_ID=$FIREBASE_MEASUREMENT_ID

COPY package*.json ./
RUN npm install

COPY . .

RUN sed -i "s/process.env\['FIREBASE_API_KEY'\]/'$FIREBASE_API_KEY'/g" src/environments/environments.ts && \
    sed -i "s/process.env\['FIREBASE_AUTH_DOMAIN'\]/'$FIREBASE_AUTH_DOMAIN'/g" src/environments/environments.ts && \
    sed -i "s/process.env\['FIREBASE_PROJECT_ID'\]/'$FIREBASE_PROJECT_ID'/g" src/environments/environments.ts && \
    sed -i "s/process.env\['FIREBASE_STORAGE_BUCKET'\]/'$FIREBASE_STORAGE_BUCKET'/g" src/environments/environments.ts && \
    sed -i "s/process.env\['FIREBASE_MESSAGING_SENDER_ID'\]/'$FIREBASE_MESSAGING_SENDER_ID'/g" src/environments/environments.ts && \
    sed -i "s/process.env\['FIREBASE_APP_ID'\]/'$FIREBASE_APP_ID'/g" src/environments/environments.ts && \
    sed -i "s/process.env\['FIREBASE_MEASUREMENT_ID'\]/'$FIREBASE_MEASUREMENT_ID'/g" src/environments/environments.ts



RUN npm run build -- --configuration production

# --- Fase 2: Esecuzione ---
FROM nginx:1.25-alpine

COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
