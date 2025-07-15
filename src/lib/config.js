const config = {
  destatis: {
    apiKey: import.meta.env.VITE_DESTATIS_API_KEY,
    password: import.meta.env.VITE_DESTATIS_PASSWORD
  },
  eurostat: {
    apiKey: import.meta.env.VITE_EUROSTAT_API_KEY
  }
};

export default config;