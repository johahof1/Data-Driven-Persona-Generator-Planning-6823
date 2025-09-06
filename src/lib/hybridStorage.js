import PersonaStorage from './storage';
import supabasePersonaService from './supabasePersonaService';

/**
 * Hybrid Storage Service
 * Verwendet Supabase als primären Speicher mit localStorage als Fallback
 */
export class HybridPersonaStorage {
  constructor() {
    this.localStorage = PersonaStorage;
    this.supabaseService = supabasePersonaService;
    this.syncInProgress = false;
    this.lastSyncTime = null;
  }

  // Prüft ob Supabase verfügbar ist
  async isSupabaseAvailable() {
    return this.supabaseService.isAvailable;
  }

  // Personas speichern
  async savePersona(persona) {
    try {
      // Versuche zuerst Supabase
      if (await this.isSupabaseAvailable()) {
        const savedPersona = await this.supabaseService.savePersona(persona);
        
        // Synchronisiere mit localStorage als Backup
        const localPersonas = this.localStorage.loadPersonas();
        const updatedPersonas = [...localPersonas.filter(p => p.id !== persona.id), savedPersona];
        this.localStorage.savePersonas(updatedPersonas);
        
        return savedPersona;
      } else {
        // Fallback auf localStorage
        const localPersonas = this.localStorage.loadPersonas();
        const updatedPersonas = [...localPersonas.filter(p => p.id !== persona.id), persona];
        this.localStorage.savePersonas(updatedPersonas);
        
        return persona;
      }
    } catch (error) {
      console.warn('Supabase save failed, using localStorage:', error);
      
      // Fallback auf localStorage
      const localPersonas = this.localStorage.loadPersonas();
      const updatedPersonas = [...localPersonas.filter(p => p.id !== persona.id), persona];
      this.localStorage.savePersonas(updatedPersonas);
      
      return persona;
    }
  }

  // Alle Personas laden
  async loadPersonas() {
    try {
      if (await this.isSupabaseAvailable()) {
        const supabasePersonas = await this.supabaseService.loadPersonas();
        
        // Backup in localStorage speichern
        this.localStorage.savePersonas(supabasePersonas);
        
        return supabasePersonas;
      } else {
        // Fallback auf localStorage
        return this.localStorage.loadPersonas();
      }
    } catch (error) {
      console.warn('Supabase load failed, using localStorage:', error);
      return this.localStorage.loadPersonas();
    }
  }

  // Persona nach ID laden
  async getPersonaById(id) {
    try {
      if (await this.isSupabaseAvailable()) {
        return await this.supabaseService.getPersonaById(id);
      } else {
        const localPersonas = this.localStorage.loadPersonas();
        return localPersonas.find(p => p.id === id);
      }
    } catch (error) {
      console.warn('Supabase get failed, using localStorage:', error);
      const localPersonas = this.localStorage.loadPersonas();
      return localPersonas.find(p => p.id === id);
    }
  }

  // Persona aktualisieren
  async updatePersona(persona) {
    try {
      if (await this.isSupabaseAvailable()) {
        const updatedPersona = await this.supabaseService.updatePersona(persona);
        
        // Synchronisiere mit localStorage
        const localPersonas = this.localStorage.loadPersonas();
        const updatedPersonas = localPersonas.map(p => p.id === persona.id ? updatedPersona : p);
        this.localStorage.savePersonas(updatedPersonas);
        
        return updatedPersona;
      } else {
        // Fallback auf localStorage
        const localPersonas = this.localStorage.loadPersonas();
        const updatedPersonas = localPersonas.map(p => p.id === persona.id ? persona : p);
        this.localStorage.savePersonas(updatedPersonas);
        
        return persona;
      }
    } catch (error) {
      console.warn('Supabase update failed, using localStorage:', error);
      
      const localPersonas = this.localStorage.loadPersonas();
      const updatedPersonas = localPersonas.map(p => p.id === persona.id ? persona : p);
      this.localStorage.savePersonas(updatedPersonas);
      
      return persona;
    }
  }

  // Persona löschen
  async deletePersona(id) {
    try {
      if (await this.isSupabaseAvailable()) {
        await this.supabaseService.deletePersona(id);
      }
      
      // Immer auch aus localStorage entfernen
      const localPersonas = this.localStorage.loadPersonas();
      const filteredPersonas = localPersonas.filter(p => p.id !== id);
      this.localStorage.savePersonas(filteredPersonas);
      
      return true;
    } catch (error) {
      console.warn('Supabase delete failed, deleting from localStorage only:', error);
      
      const localPersonas = this.localStorage.loadPersonas();
      const filteredPersonas = localPersonas.filter(p => p.id !== id);
      this.localStorage.savePersonas(filteredPersonas);
      
      return true;
    }
  }

  // Alle Personas löschen
  async clearAllPersonas() {
    try {
      if (await this.isSupabaseAvailable()) {
        await this.supabaseService.clearAllPersonas();
      }
      
      // Immer auch localStorage leeren
      this.localStorage.clearAll();
      
      return true;
    } catch (error) {
      console.warn('Supabase clear failed, clearing localStorage only:', error);
      this.localStorage.clearAll();
      return true;
    }
  }

  // Personas mit Filtern suchen
  async searchPersonas(filters = {}) {
    try {
      if (await this.isSupabaseAvailable()) {
        return await this.supabaseService.searchPersonas(filters);
      } else {
        // Lokale Filterung
        const localPersonas = this.localStorage.loadPersonas();
        return this.filterPersonasLocally(localPersonas, filters);
      }
    } catch (error) {
      console.warn('Supabase search failed, using local search:', error);
      const localPersonas = this.localStorage.loadPersonas();
      return this.filterPersonasLocally(localPersonas, filters);
    }
  }

  // Lokale Filterung
  filterPersonasLocally(personas, filters) {
    return personas.filter(persona => {
      if (filters.gender && persona.gender !== filters.gender) return false;
      if (filters.ageGroup && persona.ageGroup !== filters.ageGroup) return false;
      if (filters.incomeQuintile && persona.incomeQuintile !== filters.incomeQuintile) return false;
      if (filters.householdType && persona.householdType !== filters.householdType) return false;
      if (filters.housingType && persona.housingType !== filters.housingType) return false;
      if (filters.location && !persona.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.minAge && persona.age < filters.minAge) return false;
      if (filters.maxAge && persona.age > filters.maxAge) return false;
      if (filters.minIncome && persona.annualIncome < filters.minIncome) return false;
      if (filters.maxIncome && persona.annualIncome > filters.maxIncome) return false;
      return true;
    });
  }

  // Synchronisation zwischen localStorage und Supabase
  async syncPersonas() {
    if (this.syncInProgress || !(await this.isSupabaseAvailable())) {
      return false;
    }

    this.syncInProgress = true;
    
    try {
      console.log('🔄 Starting persona sync...');
      
      const localPersonas = this.localStorage.loadPersonas();
      const supabasePersonas = await this.supabaseService.loadPersonas();
      
      // Finde Personas, die nur lokal existieren
      const localOnlyPersonas = localPersonas.filter(local => 
        !supabasePersonas.some(remote => remote.id === local.id)
      );
      
      // Lade lokale Personas zu Supabase hoch
      if (localOnlyPersonas.length > 0) {
        console.log(`⬆️ Uploading ${localOnlyPersonas.length} local personas to Supabase`);
        await this.supabaseService.savePersonas(localOnlyPersonas);
      }
      
      // Aktualisiere localStorage mit den neuesten Daten von Supabase
      const allPersonas = await this.supabaseService.loadPersonas();
      this.localStorage.savePersonas(allPersonas);
      
      this.lastSyncTime = new Date();
      console.log('✅ Persona sync completed successfully');
      
      return true;
    } catch (error) {
      console.error('❌ Persona sync failed:', error);
      return false;
    } finally {
      this.syncInProgress = false;
    }
  }

  // Export-Funktionen (erweitert)
  async exportPersonas() {
    try {
      const personas = await this.loadPersonas();
      const dataStr = JSON.stringify(personas, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `personas-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Export failed:', error);
      return false;
    }
  }

  // Import-Funktionen (erweitert)
  async importPersonas(file) {
    try {
      const text = await file.text();
      const personas = JSON.parse(text);
      
      if (!Array.isArray(personas)) {
        throw new Error('Invalid data format');
      }
      
      // Speichere importierte Personas
      if (await this.isSupabaseAvailable()) {
        await this.supabaseService.savePersonas(personas);
      }
      
      // Backup in localStorage
      const existingPersonas = this.localStorage.loadPersonas();
      const allPersonas = [...existingPersonas, ...personas];
      this.localStorage.savePersonas(allPersonas);
      
      return personas;
    } catch (error) {
      console.error('Import failed:', error);
      throw error;
    }
  }

  // Statistiken
  async getStats() {
    try {
      if (await this.isSupabaseAvailable()) {
        return await this.supabaseService.getPersonaStats();
      } else {
        const personas = this.localStorage.loadPersonas();
        return this.calculateLocalStats(personas);
      }
    } catch (error) {
      console.warn('Supabase stats failed, using local stats:', error);
      const personas = this.localStorage.loadPersonas();
      return this.calculateLocalStats(personas);
    }
  }

  calculateLocalStats(personas) {
    const stats = {
      total: personas.length,
      byGender: {},
      byAgeGroup: {},
      byIncomeQuintile: {}
    };

    personas.forEach(persona => {
      // Geschlecht
      stats.byGender[persona.gender] = (stats.byGender[persona.gender] || 0) + 1;
      
      // Altersgruppe
      stats.byAgeGroup[persona.ageGroup] = (stats.byAgeGroup[persona.ageGroup] || 0) + 1;
      
      // Einkommensgruppe
      stats.byIncomeQuintile[persona.incomeQuintile] = (stats.byIncomeQuintile[persona.incomeQuintile] || 0) + 1;
    });

    return stats;
  }

  // Cache-Funktionen
  async saveCache(key, data, expirationHours = 24) {
    try {
      if (await this.isSupabaseAvailable()) {
        await this.supabaseService.saveCache(key, data, expirationHours);
      }
      
      // Backup in localStorage
      this.localStorage.saveCache({ [key]: { data, timestamp: Date.now() } });
      
      return true;
    } catch (error) {
      console.warn('Supabase cache save failed, using localStorage only:', error);
      this.localStorage.saveCache({ [key]: { data, timestamp: Date.now() } });
      return true;
    }
  }

  async loadCache(key) {
    try {
      if (await this.isSupabaseAvailable()) {
        const data = await this.supabaseService.loadCache(key);
        if (data) return data;
      }
      
      // Fallback auf localStorage
      const localCache = this.localStorage.loadCache();
      return localCache?.[key]?.data || null;
    } catch (error) {
      console.warn('Supabase cache load failed, using localStorage:', error);
      const localCache = this.localStorage.loadCache();
      return localCache?.[key]?.data || null;
    }
  }

  // Status-Informationen
  getConnectionStatus() {
    return {
      supabase: this.supabaseService.isAvailable,
      localStorage: true, // localStorage ist immer verfügbar
      lastSync: this.lastSyncTime,
      syncInProgress: this.syncInProgress
    };
  }
}

export default new HybridPersonaStorage();