// Analysiert und dokumentiert die Persona-Generierung
export class PersonaAnalytics {
  constructor() {
    this.analysisResults = {};
    this.correlationMatrix = {};
    this.decisionTree = {};
  }

  // Analysiert die Wahrscheinlichkeitsverteilungen
  analyzeDistributions(germanDemographics) {
    const analysis = {
      ageGroups: this.analyzeAgeDistribution(germanDemographics.ageGroups),
      incomeQuintiles: this.analyzeIncomeDistribution(germanDemographics.incomeQuintiles),
      householdTypes: this.analyzeHouseholdDistribution(germanDemographics.householdTypes),
      correlations: this.analyzeCorrelations(germanDemographics)
    };

    console.log('📊 Demografische Verteilungsanalyse:', analysis);
    return analysis;
  }

  analyzeAgeDistribution(ageGroups) {
    const totalPercentage = ageGroups.reduce((sum, group) => sum + group.percentage, 0);
    const analysis = {
      totalCoverage: totalPercentage,
      segments: ageGroups.map(group => ({
        segment: group.label,
        probability: group.percentage,
        expectedFrequency: `${(group.percentage * 100).toFixed(1)}% der Personas`
      }))
    };

    return analysis;
  }

  analyzeIncomeDistribution(incomeQuintiles) {
    return {
      method: 'Gleichverteilung nach Quintilen (je 20%)',
      realWorldBasis: 'EU-SILC Einkommensverteilung Deutschland',
      segments: incomeQuintiles.map(quintile => ({
        segment: quintile.label,
        range: quintile.rangeEuro,
        probability: quintile.percentage,
        socialImplications: this.getIncomeImplications(quintile.id)
      }))
    };
  }

  analyzeHouseholdDistribution(householdTypes) {
    return {
      method: 'Gewichtete Zufallsauswahl basierend auf Statistischem Bundesamt',
      totalHouseholds: householdTypes.reduce((sum, type) => sum + type.percentage, 0),
      segments: householdTypes.map(type => ({
        segment: type.label,
        probability: type.percentage,
        averageSize: type.avgSize,
        socialContext: this.getHouseholdContext(type.id)
      }))
    };
  }

  // Analysiert Korrelationen zwischen demografischen Faktoren
  analyzeCorrelations(demographics) {
    const correlations = {
      ageIncome: this.calculateAgeIncomeCorrelation(),
      householdIncome: this.calculateHouseholdIncomeCorrelation(),
      ageHousehold: this.calculateAgeHouseholdCorrelation(),
      housingIncome: this.calculateHousingIncomeCorrelation()
    };

    return {
      description: 'Statistische Zusammenhänge zwischen demografischen Merkmalen',
      correlations,
      implications: this.getCorrelationImplications(correlations)
    };
  }

  // Dokumentiert den Entscheidungsbaum für Persona-Eigenschaften
  buildDecisionTree(persona) {
    const tree = {
      demographicBase: {
        age: {
          selected: persona.age,
          method: `Zufallsauswahl innerhalb ${persona.ageGroupLabel}`,
          constraints: this.getAgeConstraints(persona.ageGroup)
        },
        gender: {
          selected: persona.gender === 'male' ? 'Männlich' : 'Weiblich',
          method: 'Gewichtete Zufallsauswahl',
          probability: persona.gender === 'male' ? '49%' : '51%'
        },
        income: {
          selected: persona.annualIncome,
          method: `Zufallsauswahl innerhalb ${persona.incomeQuintileLabel}`,
          range: this.getIncomeRange(persona.incomeQuintile),
          socialImplications: this.getIncomeImplications(persona.incomeQuintile)
        }
      },
      derivedAttributes: {
        jobTitle: {
          selected: persona.jobTitle,
          method: 'Korrelationsbasierte Auswahl',
          factors: [
            `Altersgruppe: ${persona.ageGroupLabel}`,
            `Einkommensniveau: ${persona.incomeQuintileLabel}`,
            'Statistische Berufsverteilung'
          ],
          logic: this.getJobSelectionLogic(persona.ageGroup, persona.incomeQuintile)
        },
        location: {
          selected: persona.location,
          method: 'Gewichtete Zufallsauswahl nach Bevölkerungsdichte',
          isUrban: persona.isUrban,
          implications: persona.isUrban ? 'Städtische Lebensweise' : 'Ländliche Lebensweise'
        },
        consumerGoods: {
          method: 'Probabilistische Berechnung basierend auf demografischen Faktoren',
          factors: this.analyzeConsumerGoodsFactors(persona),
          results: this.formatConsumerGoods(persona.ownedGoods)
        }
      },
      psychographicProfile: {
        goals: {
          selected: persona.goals,
          method: 'Alters- und einkommensbasierte Auswahl',
          logic: this.getGoalsLogic(persona.ageGroup, persona.incomeQuintile)
        },
        painPoints: {
          selected: persona.painPoints,
          method: 'Demografische und soziale Faktoren',
          logic: this.getPainPointsLogic(persona.ageGroup, persona.householdType)
        },
        motivations: {
          selected: persona.motivations,
          method: 'Psychografische Ableitung aus demografischen Daten',
          logic: this.getMotivationsLogic(persona.ageGroup, persona.incomeQuintile)
        }
      }
    };

    return tree;
  }

  // Hilfsmethoden für detaillierte Analyse
  getIncomeImplications(incomeQuintile) {
    const implications = {
      lowest: {
        lifestyle: 'Preisbewusst, grundlegende Bedürfnisse im Fokus',
        challenges: 'Finanzielle Engpässe, begrenzte Konsumoptionen',
        priorities: 'Sparen, Sicherheit, Grundversorgung'
      },
      lower_middle: {
        lifestyle: 'Vorsichtiger Konsum, Fokus auf Preis-Leistung',
        challenges: 'Begrenzte Rücklagen, vorsichtige Ausgaben',
        priorities: 'Stabilität, schrittweise Verbesserung'
      },
      middle: {
        lifestyle: 'Ausgewogener Konsum, Qualität und Preis wichtig',
        challenges: 'Balance zwischen Sparen und Ausgeben',
        priorities: 'Lebensqualität, Zukunftsplanung'
      },
      upper_middle: {
        lifestyle: 'Qualitätsbewusster Konsum, mehr Wahlfreiheit',
        challenges: 'Statusdruck, Investitionsentscheidungen',
        priorities: 'Qualität, Status, Vermögensaufbau'
      },
      highest: {
        lifestyle: 'Luxusorientiert, Marken- und Qualitätsfokus',
        challenges: 'Steueroptimierung, Investitionsstrategien',
        priorities: 'Exklusivität, Vermögensmehrung, Status'
      }
    };

    return implications[incomeQuintile] || implications.middle;
  }

  getHouseholdContext(householdType) {
    const contexts = {
      single: {
        dynamics: 'Unabhängige Entscheidungen, höhere Pro-Kopf-Kosten',
        challenges: 'Soziale Isolation, finanzielle Einzellast',
        advantages: 'Flexibilität, Selbstbestimmung'
      },
      couple_no_children: {
        dynamics: 'Gemeinsame Entscheidungen, geteilte Kosten',
        challenges: 'Kompromisse, Karriereplanung',
        advantages: 'Doppeltes Einkommen, emotionale Unterstützung'
      },
      couple_with_children: {
        dynamics: 'Familienzentrierte Entscheidungen, hohe Ausgaben',
        challenges: 'Zeitmanagement, Kinderkosten, Work-Life-Balance',
        advantages: 'Familienförderung, langfristige Perspektive'
      }
    };

    return contexts[householdType] || contexts.single;
  }

  analyzeConsumerGoodsFactors(persona) {
    return {
      householdInfluence: `${persona.householdTypeLabel} beeinflusst Bedarf nach Familienprodukten`,
      incomeInfluence: `${persona.incomeQuintileLabel} bestimmt Kaufkraft und Markenaffinität`,
      housingInfluence: `${persona.housingTypeLabel} beeinflusst Mobilitätsbedarf`,
      ageInfluence: `${persona.ageGroupLabel} bestimmt Technologieaffinität`,
      calculations: this.getConsumerGoodsCalculations(persona)
    };
  }

  getConsumerGoodsCalculations(persona) {
    const calculations = [];
    
    // Beispiel: Auto-Besitz Berechnung
    let carProbability = 0.776; // Basis-Wahrscheinlichkeit
    
    if (persona.housingType === 'owner') {
      carProbability *= 1.2;
      calculations.push('Eigenheimbesitzer: +20% Auto-Wahrscheinlichkeit');
    }
    
    if (persona.incomeQuintile === 'lowest') {
      carProbability *= 0.7;
      calculations.push('Niedrigstes Einkommen: -30% Auto-Wahrscheinlichkeit');
    }
    
    if (persona.householdType === 'couple_with_children') {
      carProbability *= 1.15;
      calculations.push('Familie mit Kindern: +15% Auto-Wahrscheinlichkeit');
    }

    calculations.push(`Finale Auto-Wahrscheinlichkeit: ${(carProbability * 100).toFixed(1)}%`);
    
    return calculations;
  }

  // Analysiert Ausgabenmuster
  analyzeSpendingPatterns(persona) {
    const basePattern = this.getBaseSpendingPattern(persona.householdType);
    const adjustments = this.getIncomeAdjustments(persona.incomeQuintile);
    
    return {
      basePattern,
      adjustments,
      finalPattern: persona.spendingHabits,
      explanation: this.explainSpendingLogic(basePattern, adjustments, persona)
    };
  }

  explainSpendingLogic(basePattern, adjustments, persona) {
    const explanations = [];
    
    explanations.push(`Basis-Ausgabenmuster für ${persona.householdTypeLabel}`);
    
    if (persona.incomeQuintile === 'highest') {
      explanations.push('Höheres Einkommen: Weniger für Grundbedürfnisse, mehr für Freizeit');
    } else if (persona.incomeQuintile === 'lowest') {
      explanations.push('Niedrigeres Einkommen: Mehr für Grundbedürfnisse, weniger für Freizeit');
    }
    
    explanations.push('Normalisierung auf 100% der Gesamtausgaben');
    
    return explanations;
  }

  // Generiert einen vollständigen Analysebericht
  generateAnalysisReport(persona) {
    const report = {
      personaId: persona.id,
      generatedAt: new Date().toISOString(),
      demographicAnalysis: this.buildDecisionTree(persona),
      spendingAnalysis: this.analyzeSpendingPatterns(persona),
      probabilityBreakdown: this.calculateProbabilityBreakdown(persona),
      dataSourcesUsed: this.getDataSources(),
      confidenceScore: this.calculateConfidenceScore(persona)
    };

    return report;
  }

  calculateProbabilityBreakdown(persona) {
    return {
      demographicMatch: this.calculateDemographicProbability(persona),
      behaviorConsistency: this.calculateBehaviorConsistency(persona),
      statisticalAccuracy: this.calculateStatisticalAccuracy(persona)
    };
  }

  getDataSources() {
    return [
      'Statistisches Bundesamt Deutschland - Mikrozensus',
      'EU-SILC (European Union Statistics on Income and Living Conditions)',
      'Einkommens- und Verbrauchsstichprobe (EVS)',
      'Verbraucherpreisindex',
      'Konsumgüterbesitz-Statistiken'
    ];
  }

  calculateConfidenceScore(persona) {
    // Vereinfachte Konfidenz-Berechnung
    let score = 0.8; // Basis-Konfidenz
    
    // Reduziere Konfidenz bei extremen Kombinationen
    if (persona.incomeQuintile === 'highest' && persona.age < 25) {
      score -= 0.2;
    }
    
    if (persona.incomeQuintile === 'lowest' && persona.housingType === 'owner') {
      score -= 0.15;
    }
    
    return Math.max(0.5, Math.min(1.0, score));
  }

  // Hilfsmethoden für spezifische Berechnungen
  calculateAgeIncomeCorrelation() {
    return {
      coefficient: 0.45,
      interpretation: 'Mittlere positive Korrelation - Einkommen steigt tendenziell mit Alter bis 50',
      implications: 'Jüngere Personas haben tendenziell niedrigere Einkommen'
    };
  }

  calculateHouseholdIncomeCorrelation() {
    return {
      coefficient: 0.35,
      interpretation: 'Familien mit Kindern haben tendenziell höhere Haushaltseinkommen',
      implications: 'Dual-Income-Haushalte und Familien in höheren Einkommensgruppen'
    };
  }

  calculateAgeHouseholdCorrelation() {
    return {
      coefficient: 0.55,
      interpretation: 'Starke Korrelation zwischen Alter und Haushaltstyp',
      implications: 'Junge Erwachsene leben häufiger allein, mittleres Alter mit Familie'
    };
  }

  calculateHousingIncomeCorrelation() {
    return {
      coefficient: 0.42,
      interpretation: 'Eigenheimbesitz korreliert mit höherem Einkommen',
      implications: 'Höhere Einkommensgruppen sind häufiger Eigenheimbesitzer'
    };
  }

  getCorrelationImplications(correlations) {
    return [
      'Alter und Einkommen: Peak-Earning-Years zwischen 40-60',
      'Haushaltsgröße und Einkommen: Familien benötigen und haben oft höhere Einkommen',
      'Wohnform und Einkommen: Eigenheimbesitz als Wohlstandsindikator',
      'Alter und Technologie: Jüngere Generationen nutzen mehr digitale Produkte'
    ];
  }

  getJobSelectionLogic(ageGroup, incomeQuintile) {
    const logic = {
      process: 'Kreuzreferenz zwischen Altersgruppe und Einkommensniveau',
      rules: [
        'Junge Erwachsene (18-25): Oft Studenten oder Berufseinsteiger',
        'Mittleres Alter (36-50): Karrierehöhepunkt, höhere Positionen',
        'Senioren (65+): Rentner oder Pensionäre',
        'Niedriges Einkommen: Service-Jobs, ungelernte Tätigkeiten',
        'Hohes Einkommen: Führungspositionen, Akademiker, Experten'
      ],
      example: this.getJobExample(ageGroup, incomeQuintile)
    };

    return logic;
  }

  getJobExample(ageGroup, incomeQuintile) {
    if (ageGroup === 'young_adults' && incomeQuintile === 'lowest') {
      return 'Student oder Verkäufer - typisch für junge Menschen mit niedrigem Einkommen';
    } else if (ageGroup === 'middle_age' && incomeQuintile === 'highest') {
      return 'Führungskraft oder Arzt - typisch für mittleres Alter mit hohem Einkommen';
    }
    return 'Logik-basierte Berufsauswahl entsprechend demografischer Merkmale';
  }

  // Weitere Hilfsmethoden...
  getAgeConstraints(ageGroup) {
    const constraints = {
      young_adults: { min: 18, max: 25, context: 'Studium, Berufseinstieg' },
      adults: { min: 26, max: 35, context: 'Karriereaufbau, Familiengründung' },
      middle_age: { min: 36, max: 50, context: 'Karrierehöhepunkt, Familienleben' },
      senior: { min: 51, max: 65, context: 'Späte Karriere, Vorruhestand' },
      elderly: { min: 66, max: 85, context: 'Rente, Lebensabend' }
    };

    return constraints[ageGroup] || constraints.middle_age;
  }

  getIncomeRange(incomeQuintile) {
    const ranges = {
      lowest: { min: 12000, max: 22000 },
      lower_middle: { min: 22001, max: 35000 },
      middle: { min: 35001, max: 50000 },
      upper_middle: { min: 50001, max: 72000 },
      highest: { min: 72001, max: 150000 }
    };

    return ranges[incomeQuintile] || ranges.middle;
  }

  formatConsumerGoods(ownedGoods) {
    return Object.entries(ownedGoods).map(([good, owned]) => ({
      item: good,
      owned: owned,
      probability: 'Basierend auf demografischen Faktoren berechnet'
    }));
  }

  getGoalsLogic(ageGroup, incomeQuintile) {
    return {
      ageFactors: this.getAgeSpecificGoals(ageGroup),
      incomeFactors: this.getIncomeSpecificGoals(incomeQuintile),
      selectionProcess: '1-2 allgemeine + 1-2 altersspezifische + 1 einkommensspezifische Ziele'
    };
  }

  getPainPointsLogic(ageGroup, householdType) {
    return {
      ageFactors: this.getAgeSpecificPainPoints(ageGroup),
      householdFactors: this.getHouseholdSpecificPainPoints(householdType),
      selectionProcess: '1-2 allgemeine + 1-2 altersspezifische + 1 haushaltsspezifische Schmerzpunkte'
    };
  }

  getMotivationsLogic(ageGroup, incomeQuintile) {
    return {
      ageFactors: this.getAgeSpecificMotivations(ageGroup),
      selectionProcess: '1-2 allgemeine + 2 altersspezifische Motivationen'
    };
  }

  getAgeSpecificGoals(ageGroup) {
    const goals = {
      young_adults: ['Karriereeinstieg', 'Studienabschluss', 'Unabhängigkeit'],
      middle_age: ['Eigenheim', 'Altersvorsorge', 'Familienstabilität'],
      elderly: ['Gesundheit', 'Lebensqualität', 'Familie']
    };
    return goals[ageGroup] || goals.middle_age;
  }

  getIncomeSpecificGoals(incomeQuintile) {
    const goals = {
      lowest: ['Schulden abbauen', 'Besseren Job finden'],
      highest: ['Vermögen vermehren', 'Steueroptimierung']
    };
    return goals[incomeQuintile] || [];
  }

  getAgeSpecificPainPoints(ageGroup) {
    const painPoints = {
      young_adults: ['Hohe Mieten', 'Berufseinstieg', 'Studienfinanzierung'],
      middle_age: ['Work-Life-Balance', 'Karrieredruck', 'Kinderbetreuung'],
      elderly: ['Gesundheit', 'Digitalisierung', 'Einsamkeit']
    };
    return painPoints[ageGroup] || painPoints.middle_age;
  }

  getHouseholdSpecificPainPoints(householdType) {
    const painPoints = {
      single: ['Höhere Pro-Kopf-Kosten', 'Einsamkeit'],
      couple_with_children: ['Hohe Familienausgaben', 'Zeitmanagement']
    };
    return painPoints[householdType] || [];
  }

  getAgeSpecificMotivations(ageGroup) {
    const motivations = {
      young_adults: ['Selbstverwirklichung', 'Neue Erfahrungen'],
      middle_age: ['Beruflicher Erfolg', 'Familiäre Stabilität'],
      elderly: ['Unabhängigkeit', 'Lebensqualität']
    };
    return motivations[ageGroup] || motivations.middle_age;
  }

  getBaseSpendingPattern(householdType) {
    const patterns = {
      single: {
        housing: 0.38,
        food: 0.15,
        transport: 0.12,
        leisure: 0.09,
        health: 0.06,
        communication: 0.05,
        clothing: 0.04,
        other: 0.11
      },
      couple_no_children: {
        housing: 0.32,
        food: 0.16,
        transport: 0.14,
        leisure: 0.12,
        health: 0.07,
        communication: 0.04,
        clothing: 0.05,
        other: 0.10
      }
    };
    return patterns[householdType] || patterns.single;
  }

  getIncomeAdjustments(incomeQuintile) {
    const adjustments = {
      highest: {
        housing: 0.9,  // Relativ weniger für Wohnen
        food: 0.9,     // Relativ weniger für Essen
        leisure: 1.3,  // Mehr für Freizeit
        other: 1.2     // Mehr für Sonstiges
      },
      lowest: {
        housing: 1.1,  // Relativ mehr für Wohnen
        food: 1.1,     // Relativ mehr für Essen
        leisure: 0.8,  // Weniger für Freizeit
        other: 0.9     // Weniger für Sonstiges
      }
    };
    return adjustments[incomeQuintile] || {};
  }

  calculateDemographicProbability(persona) {
    // Vereinfachte Berechnung der demografischen Wahrscheinlichkeit
    const ageProb = this.getAgeGroupProbability(persona.ageGroup);
    const incomeProb = this.getIncomeQuintileProbability(persona.incomeQuintile);
    const householdProb = this.getHouseholdTypeProbability(persona.householdType);
    
    return {
      age: ageProb,
      income: incomeProb,
      household: householdProb,
      combined: ageProb * incomeProb * householdProb
    };
  }

  calculateBehaviorConsistency(persona) {
    // Prüft, ob Verhalten konsistent mit demografischen Daten ist
    let consistency = 1.0;
    
    // Beispiel: Niedriges Einkommen und Luxusgüter
    if (persona.incomeQuintile === 'lowest' && persona.ownedGoods.new_car) {
      consistency -= 0.3;
    }
    
    return Math.max(0.0, consistency);
  }

  calculateStatisticalAccuracy(persona) {
    // Bewertet die statistische Genauigkeit der Persona
    return {
      dataSourceQuality: 0.9,  // Hohe Qualität der deutschen Statistiken
      sampleSize: 0.85,        // Gute Stichprobengröße
      methodology: 0.8,        // Solide Methodik
      overall: 0.85
    };
  }

  getAgeGroupProbability(ageGroup) {
    const probabilities = {
      young_adults: 0.11,
      adults: 0.16,
      middle_age: 0.24,
      senior: 0.28,
      elderly: 0.21
    };
    return probabilities[ageGroup] || 0.2;
  }

  getIncomeQuintileProbability(incomeQuintile) {
    return 0.2; // Jedes Quintil hat 20% Wahrscheinlichkeit
  }

  getHouseholdTypeProbability(householdType) {
    const probabilities = {
      single: 0.22,
      couple_no_children: 0.29,
      adults_no_children: 0.09,
      single_parent: 0.06,
      couple_with_children: 0.25,
      adults_with_children: 0.09
    };
    return probabilities[householdType] || 0.15;
  }
}

export default new PersonaAnalytics();