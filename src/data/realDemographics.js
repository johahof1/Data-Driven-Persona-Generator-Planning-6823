// Echte Datenverarbeitung
import StatisticsAPI from './realDataLoader';

export class RealDemographicProcessor {
  constructor() {
    this.cache = new Map();
    this.lastUpdate = null;
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

      return processedData;
    } catch (error) {
      console.error('Failed to load real data:', error);
      return this.getFallbackData();
    }
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
    // Echte statistische Berechnung
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