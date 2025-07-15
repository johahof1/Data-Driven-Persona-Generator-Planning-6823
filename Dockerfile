FROM node:18-alpine

WORKDIR /app

# Abhängigkeiten installieren
COPY package.json package-lock.json* ./
RUN npm ci

# Anwendungsdateien kopieren
COPY . .

# Umgebungsvariablen für die Produktion konfigurieren
ENV NODE_ENV=production
ENV VITE_DESTATIS_API_KEY=
ENV VITE_DESTATIS_PASSWORD=
ENV VITE_EUROSTAT_API_KEY=

# Build der Anwendung
RUN npm run build

# Expose port
EXPOSE 8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/ || exit 1

# Anwendung starten
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "8080"]