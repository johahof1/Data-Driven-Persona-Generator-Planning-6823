import axios from 'axios';
import config from '../lib/config';

class GermanStatisticsAPI {
  constructor() {
    this.baseURL = 'https://www-genesis.destatis.de/genesisWS/rest/2020/data/';
    this.apiKey = config.destatis.apiKey;
    this.password = config.destatis.password;
    this.useOfflineData = !this.apiKey; // Fallback auf Offline-Daten, wenn kein API-Key vorhanden

    if (this.useOfflineData) {
      console.log('Keine API-Schlüssel gefunden - verwende Offline-Daten');
    }
  }

  // ... Rest der Klasse bleibt unverändert ...
}

export default new GermanStatisticsAPI();