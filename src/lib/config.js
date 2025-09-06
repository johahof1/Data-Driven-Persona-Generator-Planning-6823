const config = {
  destatis: {
    apiKey: import.meta.env.VITE_DESTATIS_API_KEY,
    // Destatis benötigt kein Passwort, nur den API-Token als Username
  },
  eurostat: {
    apiKey: import.meta.env.VITE_EUROSTAT_API_KEY
  }
};

export default config;