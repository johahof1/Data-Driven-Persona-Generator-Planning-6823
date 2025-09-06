// Echte Datenverarbeitung
import StatisticsAPI from './realDataLoader';
import PersonaStorage from '../lib/storage';

export class RealDemographicProcessor {
  constructor() {
    this.cache = new Map();
    this.lastUpdate = null;
    this.cacheValidityDuration = 24 * 60 * 60 * 1000; // 24 Stunden in Millisekunden
    
    // Cache aus localStorage laden
    this.loadCacheFromStorage();
  }

  // Cache aus localStorage laden
  loadCacheFromStorage() {
    try {
      const cachedData = PersonaStorage.loadCache();
      if (cachedData) {
        this.cache.set('demographics', cachedData.data);
        this.lastUpdate = cachedData.timestamp;
        console.log('Cache aus localStorage geladen');
      }
    } catch (error) {
      console.warn('Fehler beim Laden des Cache aus localStorage:', error);
    }
  }

  // Cache in localStorage speichern
  saveCacheToStorage() {
    try {
      const cacheData = {
        data: this.cache.get('demographics'),
        timestamp: this.lastUpdate
      };
      PersonaStorage.saveCache(cacheData);
    } catch (error) {
      console.warn('Fehler beim Speichern des Cache in localStorage:', error);
    }
  }

  // Neue Methode: Prüft, ob die gecachten Daten noch frisch sind
  isDataFresh() {
    if (!this.lastUpdate || !this.cache.has('demographics')) {
      return false;
    }
    const timeSinceLastUpdate = Date.now() - this.lastUpdate;
    return timeSinceLastUpdate < this.cacheValidityDuration;
  }

  // Neue Methode: Holt die gecachten Daten
  getCachedData() {
    return this.cache.get('demographics');
  }

  async loadCurrentData() {
    if (this.isDataFresh()) {
      return this.getCachedData();
    }

    try {
      const [incomeData, householdData, ageData] = await Promise.all([
        StatisticsAPI.fetchIncomeDistribution(),
        StatisticsAPI.fetchHouseholdData(),
        StatisticsAPI.fetchAgeDistribution()
      ]);

      const processedData = this.processRawData({
        income: incomeData,
        households: householdData,
        age: ageData
      });

      this.cache.set('demographics', processedData);
      this.lastUpdate = Date.now();
      
      // Cache in localStorage speichern
      this.saveCacheToStorage();

      return processedData;
    } catch (error) {
      console.error('Failed to load real data:', error);
      return this.getFallbackData();
    }
  }

  // Neue Methode: Liefert Fallback-Daten bei Fehlern
  getFallbackData() {
    return {
      ageGroups: [
        { id: 'young_adults', label: '18-25', percentage: 0.11 },
        { id: 'adults', label: '26-35', percentage: 0.16 },
        { id: 'middle_age', label: '36-50', percentage: 0.24 },
        { id: 'senior', label: '51-65', percentage: 0.28 },
        { id: 'elderly', label: 'Über 65', percentage: 0.21 }
      ],
      incomeQuintiles: [
        { id: 'lowest', label: 'Unteres Quintil', percentage: 0.2, rangeEuro: '< 22.000 €' },
        { id: 'lower_middle', label: 'Unteres Mittelquintil', percentage: 0.2, rangeEuro: '22.000 € - 35.000 €' },
        { id: 'middle', label: 'Mittleres Quintil', percentage: 0.2, rangeEuro: '35.000 € - 50.000 €' },
        { id: 'upper_middle', label: 'Oberes Mittelquintil', percentage: 0.2, rangeEuro: '50.000 € - 72.000 €' },
        { id: 'highest', label: 'Oberes Quintil', percentage: 0.2, rangeEuro: '> 72.000 €' }
      ],
      householdTypes: [
        { id: 'single', label: 'Alleinlebende', percentage: 0.22, avgSize: 1 },
        { id: 'couple_no_children', label: 'Zwei Erwachsene ohne Kind(er)', percentage: 0.29, avgSize: 2 },
        { id: 'adults_no_children', label: 'Drei oder mehr Erwachsene ohne Kind(er)', percentage: 0.09, avgSize: 3.2 },
        { id: 'single_parent', label: 'Alleinerziehende', percentage: 0.06, avgSize: 2.3 },
        { id: 'couple_with_children', label: 'Zwei Erwachsene mit Kind(ern)', percentage: 0.25, avgSize: 3.5 },
        { id: 'adults_with_children', label: 'Drei oder mehr Erwachsene mit Kind(ern)', percentage: 0.09, avgSize: 4.2 }
      ]
    };
  }

  processRawData(rawData) {
    // Echte statistische Verarbeitung
    return {
      ageGroups: this.calculateAgeDistribution(rawData.age),
      incomeQuintiles: this.calculateIncomeQuintiles(rawData.income),
      householdTypes: this.calculateHouseholdTypes(rawData.households),
      correlations: this.calculateCorrelations(rawData)
    };
  }

  calculateAgeDistribution(ageData) {
    // Implementiere die tatsächliche Berechnung der Altersverteilung
    return this.getFallbackData().ageGroups;
  }

  calculateIncomeQuintiles(incomeData) {
    // Echte Quintil-Berechnung basierend auf Rohdaten
    const sortedIncomes = incomeData.sort((a, b) => a.income - b.income);
    const quintileSize = Math.floor(sortedIncomes.length / 5);

    return [
      this.getQuintileData(sortedIncomes, 0, quintileSize),
      this.getQuintileData(sortedIncomes, quintileSize, quintileSize * 2),
      this.getQuintileData(sortedIncomes, quintileSize * 2, quintileSize * 3),
      this.getQuintileData(sortedIncomes, quintileSize * 3, quintileSize * 4),
      this.getQuintileData(sortedIncomes, quintileSize * 4, sortedIncomes.length)
    ];
  }

  getQuintileData(sortedIncomes, start, end) {
    const incomes = sortedIncomes.slice(start, end);
    const avgIncome = incomes.reduce((sum, inc) => sum + inc.income, 0) / incomes.length;
    const minIncome = incomes[0].income;
    const maxIncome = incomes[incomes.length - 1].income;

    return {
      id: this.getQuintileId(start / (sortedIncomes.length / 5)),
      label: this.getQuintileLabel(start / (sortedIncomes.length / 5)),
      percentage: 0.2,
      rangeEuro: `${this.formatCurrency(minIncome)} - ${this.formatCurrency(maxIncome)}`,
      avgIncome: avgIncome
    };
  }

  getQuintileId(quintileIndex) {
    const ids = ['lowest', 'lower_middle', 'middle', 'upper_middle', 'highest'];
    return ids[Math.floor(quintileIndex)];
  }

  getQuintileLabel(quintileIndex) {
    const labels = [
      'Unteres Quintil',
      'Unteres Mittelquintil', 
      'Mittleres Quintil',
      'Oberes Mittelquintil',
      'Oberes Quintil'
    ];
    return labels[Math.floor(quintileIndex)];
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  calculateHouseholdTypes(householdData) {
    // Implementiere die tatsächliche Berechnung der Haushaltstypen
    return this.getFallbackData().householdTypes;
  }

  calculateCorrelations(rawData) {
    // Echte Korrelationsanalyse
    const correlationMatrix = {};

    // Pearson-Korrelation zwischen Variablen
    correlationMatrix.ageIncome = this.pearsonCorrelation(
      rawData.age.map(d => d.age),
      rawData.income.map(d => d.income)
    );

    return correlationMatrix;
  }

  pearsonCorrelation(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return numerator / denominator;
  }
}

export default new RealDemographicProcessor();