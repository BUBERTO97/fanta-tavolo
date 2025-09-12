# backend/Dockerfile

# Per ora, questa immagine non farà nulla di attivo.
# Serve solo a contenere i file di configurazione del nostro backend.
# In futuro, potremmo usarla per eseguire Cloud Functions localmente o per altri script.
FROM alpine:latest

# Copiamo le regole di Firestore nell'immagine
COPY firestore.rules /app/firestore.rules

WORKDIR /app

# Comando che non fa nulla, solo per far partire il container
CMD ["tail", "-f", "/dev/null"]