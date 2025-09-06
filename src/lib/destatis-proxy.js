// Destatis API Proxy-Lösung für CORS-Problem
import config from './config';

export class DestAtisProxy {
  constructor() {
    this.apiKey = config.destatis.apiKey;
    this.proxyEndpoints = [
      'https://cors-anywhere.herokuapp.com/',
      'https://api.allorigins.win/raw?url=',
      'https://corsproxy.io/?'
    ];
    this.directEndpoint = 'https://www-genesis.destatis.de/genesisWS/rest/2020';
  }

  // Versuche verschiedene CORS-Umgehungsstrategien
  async fetchWithCorsWorkaround(endpoint, options = {}) {
    const strategies = [
      () => this.fetchDirect(endpoint, options),
      () => this.fetchWithProxy(endpoint, options, 0),
      () => this.fetchWithProxy(endpoint, options, 1),
      () => this.fetchWithServerSideProxy(endpoint, options)
    ];

    for (let i = 0; i < strategies.length; i++) {
      try {
        console.log(`🔄 Trying strategy ${i + 1}...`);
        const result = await strategies[i]();
        console.log(`✅ Strategy ${i + 1} succeeded`);
        return result;
      } catch (error) {
        console.warn(`❌ Strategy ${i + 1} failed:`, error.message);
        if (i === strategies.length - 1) {
          throw new Error(`All CORS workaround strategies failed. Original error: ${error.message}`);
        }
      }
    }
  }

  // Strategie 1: Direkter Aufruf (funktioniert nur wenn CORS aktiviert)
  async fetchDirect(endpoint, options) {
    const url = `${this.directEndpoint}${endpoint}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'auth-user': 'apitoken',
        'auth-password': this.apiKey,
        ...options.headers
      },
      body: options.body,
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  }

  // Strategie 2: CORS-Proxy verwenden
  async fetchWithProxy(endpoint, options, proxyIndex) {
    if (!this.proxyEndpoints[proxyIndex]) {
      throw new Error(`Proxy ${proxyIndex} not available`);
    }

    const proxyUrl = this.proxyEndpoints[proxyIndex];
    const targetUrl = `${this.directEndpoint}${endpoint}`;
    const url = `${proxyUrl}${encodeURIComponent(targetUrl)}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers
      },
      body: options.body
    });

    if (!response.ok) {
      throw new Error(`Proxy request failed: HTTP ${response.status}`);
    }

    return response;
  }

  // Strategie 3: Server-Side Proxy (falls verfügbar)
  async fetchWithServerSideProxy(endpoint, options) {
    // Diese Strategie würde einen eigenen Server-Side Proxy verwenden
    // Für jetzt werfen wir einen Fehler, um zu zeigen, dass diese Option existiert
    throw new Error('Server-side proxy not implemented yet');
  }

  // Hauptmethode für Destatis API Aufrufe
  async callDestAtisAPI(endpoint, params = {}) {
    try {
      const formData = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const options = {
        body: formData.toString(),
        headers: {
          'auth-user': 'apitoken',
          'auth-password': this.apiKey
        }
      };

      const response = await this.fetchWithCorsWorkaround(endpoint, options);
      
      // Versuche JSON zu parsen
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        // Falls es kein JSON ist, gib den Text zurück
        return await response.text();
      }

    } catch (error) {
      console.error('❌ Destatis API call failed:', error);
      throw new Error(`Destatis API Error: ${error.message}`);
    }
  }

  // Spezielle Methode für Tabellendaten
  async fetchTableData(tableCode, format = 'json') {
    const params = {
      name: tableCode,
      area: 'all',
      format: format,
      compress: 'false',
      language: 'de'
    };

    return await this.callDestAtisAPI('/data/tablefile', params);
  }
}

export default new DestAtisProxy();