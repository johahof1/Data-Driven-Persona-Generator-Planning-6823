import StatisticsAPI from '../data/realDataLoader';
import { RealDemographicProcessor } from '../data/realDemographics';
import generatePersona from './personaGenerator';

class DataIntegration {
  constructor() {
    this.demographicProcessor = new RealDemographicProcessor();
    this.isLoaded = false;
    this.isLoading = false;
    this.lastUpdate = null;
    this.error = null;
  }

  async loadRealData() {
    try {
      this.isLoading = true;
      this.error = null;
      
      // Lade echte Daten aus API oder fallback auf lokale Daten
      const data = await this.demographicProcessor.loadCurrentData();
      
      this.lastUpdate = new Date();
      this.isLoaded = true;
      this.isLoading = false;

      return data;
    } catch (error) {
      console.error('Fehler beim Laden der echten Daten:', error);
      this.error = error.message;
      this.isLoading = false;
      throw error;
    }
  }

  async generateRealisticPersona(count = 1, filters = {}) {
    // Wenn echte Daten nicht geladen sind, versuche sie zu laden
    if (!this.isLoaded && !this.isLoading) {
      try {
        await this.loadRealData();
      } catch (error) {
        console.warn('Verwende lokale Fallback-Daten für Persona-Generierung');
      }
    }

    // Erzeuge Personas mit echter Datenverteilung, wenn verfügbar
    return generatePersona(count, filters, this.isLoaded ? this.demographicProcessor : null);
  }

  getDataSourceStatus() {
    return {
      isLoaded: this.isLoaded,
      isLoading: this.isLoading,
      lastUpdate: this.lastUpdate,
      error: this.error
    };
  }
}

export default new DataIntegration();