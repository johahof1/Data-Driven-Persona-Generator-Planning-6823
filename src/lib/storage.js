// Lokale Speicher-Utilities
export class PersonaStorage {
  constructor() {
    this.storageKey = 'persona-generator-data';
    this.cacheKey = 'persona-generator-cache';
  }

  // Personas speichern
  savePersonas(personas) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(personas));
      return true;
    } catch (error) {
      console.error('Fehler beim Speichern der Personas:', error);
      return false;
    }
  }

  // Personas laden
  loadPersonas() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Fehler beim Laden der Personas:', error);
      return [];
    }
  }

  // Cache speichern
  saveCache(cacheData) {
    try {
      const dataToStore = {
        data: cacheData,
        timestamp: Date.now()
      };
      localStorage.setItem(this.cacheKey, JSON.stringify(dataToStore));
      return true;
    } catch (error) {
      console.error('Fehler beim Speichern des Cache:', error);
      return false;
    }
  }

  // Cache laden
  loadCache() {
    try {
      const data = localStorage.getItem(this.cacheKey);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      const ageInHours = (Date.now() - parsed.timestamp) / (1000 * 60 * 60);
      
      // Cache ist 24 Stunden gültig
      if (ageInHours > 24) {
        this.clearCache();
        return null;
      }
      
      return parsed.data;
    } catch (error) {
      console.error('Fehler beim Laden des Cache:', error);
      return null;
    }
  }

  // Cache löschen
  clearCache() {
    localStorage.removeItem(this.cacheKey);
  }

  // Alle Daten löschen
  clearAll() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.cacheKey);
  }

  // Export-Funktionen
  exportPersonas() {
    const personas = this.loadPersonas();
    const dataStr = JSON.stringify(personas, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `personas-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // Import-Funktionen
  async importPersonas(file) {
    try {
      const text = await file.text();
      const personas = JSON.parse(text);
      
      // Validierung
      if (!Array.isArray(personas)) {
        throw new Error('Ungültiges Datenformat');
      }
      
      this.savePersonas(personas);
      return personas;
    } catch (error) {
      console.error('Fehler beim Importieren:', error);
      throw error;
    }
  }
}

export default new PersonaStorage();