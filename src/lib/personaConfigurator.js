import { generatePersonaImage } from './avatarGenerator';

// Einkommensschätzung basierend auf Beruf, Alter und Region
const estimateIncome = (jobTitle, age, location, employmentType, industry) => {
  // Basis-Gehälter nach Berufsgruppen (Jahresbrutto in EUR)
  const baseSalaries = {
    // IT & Software
    'Software-Entwickler/in': 55000,
    'IT-Projektleiter/in': 75000,
    'System-Administrator/in': 50000,
    'UX/UI Designer/in': 48000,
    'Data Scientist': 65000,
    'IT-Berater/in': 60000,
    
    // Gesundheitswesen
    'Arzt/Ärztin': 80000,
    'Krankenpfleger/in': 38000,
    'Physiotherapeut/in': 35000,
    'Apotheker/in': 55000,
    'Medizinische/r Fachangestellte/r': 28000,
    
    // Bildung
    'Lehrer/in': 45000,
    'Professor/in': 65000,
    'Erzieher/in': 32000,
    'Ausbilder/in': 40000,
    'Bildungsberater/in': 42000,
    
    // Einzelhandel
    'Verkäufer/in': 25000,
    'Filialleiter/in': 40000,
    'Einzelhandelskaufmann/frau': 28000,
    'Visual Merchandiser/in': 32000,
    
    // Finanzdienstleistungen
    'Bankkaufmann/frau': 42000,
    'Versicherungskaufmann/frau': 40000,
    'Finanzberater/in': 55000,
    'Steuerberater/in': 60000,
    'Wirtschaftsprüfer/in': 70000,
    
    // Default
    'Angestellte/r': 38000,
    'Sachbearbeiter/in': 35000,
    'Teamleiter/in': 50000,
    'Geschäftsführer/in': 85000,
    'Selbstständige/r': 45000
  };

  // Custom job handling
  let cleanJobTitle = jobTitle;
  if (jobTitle.startsWith('custom:')) {
    cleanJobTitle = jobTitle.slice(7);
    // Estimate based on industry for custom jobs
    const industryAverages = {
      'IT & Software': 55000,
      'Gesundheitswesen': 45000,
      'Bildung': 40000,
      'Einzelhandel': 30000,
      'Finanzdienstleistungen': 50000,
      'Automobil': 55000,
      'Maschinenbau': 52000,
      'Beratung': 60000,
      'Öffentlicher Dienst': 42000
    };
    
    baseSalaries[cleanJobTitle] = industryAverages[industry] || 40000;
  }

  let baseSalary = baseSalaries[cleanJobTitle] || baseSalaries['Angestellte/r'];

  // Altersanpassung (Berufserfahrung)
  const ageMultiplier = age < 25 ? 0.8 : 
                       age < 30 ? 0.9 : 
                       age < 40 ? 1.0 : 
                       age < 50 ? 1.15 : 
                       age < 60 ? 1.2 : 1.1;

  // Regionale Anpassung (vereinfacht)
  const highCostCities = ['München', 'Frankfurt am Main', 'Stuttgart', 'Düsseldorf'];
  const mediumCostCities = ['Berlin', 'Hamburg', 'Köln', 'Hannover', 'Bremen'];
  
  const locationMultiplier = highCostCities.includes(location) ? 1.15 :
                            mediumCostCities.includes(location) ? 1.05 : 0.95;

  // Beschäftigungstyp-Anpassung
  const employmentMultiplier = {
    'fulltime': 1.0,
    'parttime': 0.6,
    'freelance': 1.1,
    'student': 0.3,
    'retired': 0.4,
    'unemployed': 0.1,
    'parental_leave': 0.2
  };

  const finalSalary = baseSalary * ageMultiplier * locationMultiplier * 
                     (employmentMultiplier[employmentType] || 1.0);

  // Mindest- und Höchstgrenzen
  return Math.max(12000, Math.min(200000, Math.round(finalSalary)));
};

// Haushaltstyp bestimmen
const determineHouseholdType = (maritalStatus, numberOfChildren, householdSize) => {
  const children = parseInt(numberOfChildren) || 0;
  const size = parseInt(householdSize) || 1;

  if (size === 1) {
    return {
      type: 'single',
      label: 'Alleinlebende'
    };
  }

  if (children === 0) {
    if (size === 2) {
      return {
        type: 'couple_no_children',
        label: 'Zwei Erwachsene ohne Kind(er)'
      };
    } else {
      return {
        type: 'adults_no_children',
        label: 'Drei oder mehr Erwachsene ohne Kind(er)'
      };
    }
  } else {
    if (maritalStatus === 'single' || maritalStatus === 'divorced' || maritalStatus === 'widowed') {
      return {
        type: 'single_parent',
        label: 'Alleinerziehende'
      };
    } else if (size === 2 + children) {
      return {
        type: 'couple_with_children',
        label: 'Zwei Erwachsene mit Kind(ern)'
      };
    } else {
      return {
        type: 'adults_with_children',
        label: 'Drei oder mehr Erwachsene mit Kind(ern)'
      };
    }
  }
};

// Einkommensgruppe bestimmen
const determineIncomeQuintile = (income) => {
  if (income < 22000) {
    return {
      quintile: 'lowest',
      label: 'Unteres Quintil'
    };
  } else if (income < 35000) {
    return {
      quintile: 'lower_middle',
      label: 'Unteres Mittelquintil'
    };
  } else if (income < 50000) {
    return {
      quintile: 'middle',
      label: 'Mittleres Quintil'
    };
  } else if (income < 72000) {
    return {
      quintile: 'upper_middle',
      label: 'Oberes Mittelquintil'
    };
  } else {
    return {
      quintile: 'highest',
      label: 'Oberes Quintil'
    };
  }
};

// Altersgruppe bestimmen
const determineAgeGroup = (age) => {
  if (age <= 25) {
    return {
      group: 'young_adults',
      label: '18-25'
    };
  } else if (age <= 35) {
    return {
      group: 'adults',
      label: '26-35'
    };
  } else if (age <= 50) {
    return {
      group: 'middle_age',
      label: '36-50'
    };
  } else if (age <= 65) {
    return {
      group: 'senior',
      label: '51-65'
    };
  } else {
    return {
      group: 'elderly',
      label: 'Über 65'
    };
  }
};

// Ausgabenmuster generieren
const generateSpendingHabits = (householdType, incomeQuintile, lifestyle) => {
  // Basis-Ausgabenmuster nach Haushaltstyp
  const basePatterns = {
    'single': {
      housing: 0.38,
      food: 0.15,
      transport: 0.12,
      leisure: 0.09,
      health: 0.06,
      communication: 0.05,
      clothing: 0.04,
      other: 0.11
    },
    'couple_no_children': {
      housing: 0.32,
      food: 0.16,
      transport: 0.14,
      leisure: 0.12,
      health: 0.07,
      communication: 0.04,
      clothing: 0.05,
      other: 0.10
    },
    'couple_with_children': {
      housing: 0.28,
      food: 0.20,
      transport: 0.15,
      leisure: 0.08,
      health: 0.08,
      communication: 0.04,
      clothing: 0.07,
      other: 0.10
    },
    'single_parent': {
      housing: 0.35,
      food: 0.18,
      transport: 0.12,
      leisure: 0.06,
      health: 0.08,
      communication: 0.05,
      clothing: 0.06,
      other: 0.10
    }
  };

  let pattern = basePatterns[householdType] || basePatterns['single'];

  // Einkommensanpassungen
  const adjustments = {
    'lowest': {
      housing: 1.1,
      food: 1.1,
      leisure: 0.7,
      other: 0.8
    },
    'highest': {
      housing: 0.9,
      food: 0.9,
      leisure: 1.4,
      other: 1.3
    }
  };

  const adjustment = adjustments[incomeQuintile] || {};
  
  // Lifestyle-Anpassungen
  const lifestyleAdjustments = {
    'luxury': {
      leisure: 1.3,
      clothing: 1.5,
      other: 1.2
    },
    'sustainable': {
      transport: 0.9,
      food: 1.1,
      other: 1.1
    },
    'minimalist': {
      clothing: 0.7,
      other: 0.8,
      housing: 0.95
    }
  };

  const lifestyleAdj = lifestyleAdjustments[lifestyle] || {};

  // Anpassungen anwenden
  Object.keys(pattern).forEach(category => {
    pattern[category] *= (adjustment[category] || 1.0);
    pattern[category] *= (lifestyleAdj[category] || 1.0);
  });

  // Normalisieren auf 100%
  const sum = Object.values(pattern).reduce((acc, val) => acc + val, 0);
  Object.keys(pattern).forEach(category => {
    pattern[category] = pattern[category] / sum;
  });

  return pattern;
};

// Konsumgüterbesitz generieren
const generateOwnedGoods = (householdType, housingType, incomeQuintile, age, lifestyle) => {
  // Basis-Wahrscheinlichkeiten
  const baseOwnership = {
    car: 0.776,
    new_car: 0.15,
    used_car: 0.62,
    motorcycle: 0.12,
    bicycle: 0.76,
    smartphone: 0.94,
    laptop: 0.87,
    smart_tv: 0.82
  };

  const ownership = { ...baseOwnership };

  // Haushaltsanpassungen
  if (householdType.includes('children')) {
    ownership.car *= 1.2;
    ownership.bicycle *= 1.3;
    ownership.smart_tv *= 1.1;
  }

  // Wohnform-Anpassungen
  if (housingType === 'owner') {
    ownership.car *= 1.15;
    ownership.new_car *= 1.3;
  }

  // Einkommensanpassungen
  const incomeMultipliers = {
    'lowest': { car: 0.6, new_car: 0.3, smartphone: 0.9 },
    'lower_middle': { car: 0.8, new_car: 0.5 },
    'upper_middle': { new_car: 1.4, smart_tv: 1.1 },
    'highest': { new_car: 2.0, motorcycle: 1.5, smart_tv: 1.2 }
  };

  const incomeAdj = incomeMultipliers[incomeQuintile] || {};
  Object.keys(incomeAdj).forEach(good => {
    if (ownership[good]) {
      ownership[good] *= incomeAdj[good];
    }
  });

  // Altersanpassungen
  if (age < 30) {
    ownership.smartphone *= 1.05;
    ownership.laptop *= 1.1;
    ownership.motorcycle *= 1.2;
  } else if (age > 60) {
    ownership.smartphone *= 0.9;
    ownership.laptop *= 0.8;
    ownership.motorcycle *= 0.5;
  }

  // Lifestyle-Anpassungen
  const lifestyleAdj = {
    'tech-savvy': { smartphone: 1.05, laptop: 1.2, smart_tv: 1.15 },
    'sustainable': { bicycle: 1.3, car: 0.8, new_car: 0.6 },
    'luxury': { new_car: 1.5, motorcycle: 1.3 },
    'minimalist': { car: 0.9, motorcycle: 0.7 }
  };

  const styleAdj = lifestyleAdj[lifestyle] || {};
  Object.keys(styleAdj).forEach(good => {
    if (ownership[good]) {
      ownership[good] *= styleAdj[good];
    }
  });

  // Wahrscheinlichkeiten in Besitz umwandeln
  const ownedGoods = {};
  Object.keys(ownership).forEach(good => {
    const probability = Math.min(1.0, ownership[good]);
    ownedGoods[good] = Math.random() < probability;
  });

  return ownedGoods;
};

// Ziele generieren
const generateGoals = (ageGroup, incomeQuintile, householdType, lifestyle) => {
  const goalsByAge = {
    'young_adults': [
      'Karriereeinstieg meistern',
      'Erste eigene Wohnung',
      'Studienabschluss erreichen',
      'Reisen und Erfahrungen sammeln',
      'Finanzielle Unabhängigkeit'
    ],
    'adults': [
      'Berufliche Weiterentwicklung',
      'Eigenheim erwerben',
      'Familie gründen',
      'Work-Life-Balance finden',
      'Netzwerk aufbauen'
    ],
    'middle_age': [
      'Altersvorsorge aufbauen',
      'Kinder gut erziehen',
      'Karrierehöhepunkt erreichen',
      'Vermögen aufbauen',
      'Gesundheit erhalten'
    ],
    'senior': [
      'Rente vorbereiten',
      'Gesundheit im Alter',
      'Familie unterstützen',
      'Hobbys entwickeln',
      'Wissen weitergeben'
    ],
    'elderly': [
      'Gesundheit erhalten',
      'Lebensqualität sichern',
      'Kontakt zur Familie',
      'Reisen unternehmen',
      'Erfahrungen teilen'
    ]
  };

  const commonGoals = [
    'Finanziell abgesichert sein',
    'Gesund bleiben',
    'Glücklich sein',
    'Zeit mit Familie verbringen'
  ];

  const ageSpecificGoals = goalsByAge[ageGroup] || goalsByAge['adults'];
  
  // 2-3 altersspezifische + 1-2 allgemeine Ziele
  const selectedGoals = [];
  
  // Altersspezifische Ziele hinzufügen
  const shuffledAgeGoals = [...ageSpecificGoals].sort(() => 0.5 - Math.random());
  selectedGoals.push(...shuffledAgeGoals.slice(0, Math.floor(Math.random() * 2) + 2));
  
  // Allgemeine Ziele hinzufügen
  const shuffledCommonGoals = [...commonGoals].sort(() => 0.5 - Math.random());
  selectedGoals.push(...shuffledCommonGoals.slice(0, Math.floor(Math.random() * 2) + 1));

  return selectedGoals.slice(0, 5); // Maximal 5 Ziele
};

// Schmerzpunkte generieren
const generatePainPoints = (ageGroup, incomeQuintile, householdType, employmentType) => {
  const painPointsByAge = {
    'young_adults': [
      'Hohe Mieten in Großstädten',
      'Berufseinstiegshürden',
      'Studienfinanzierung',
      'Unsicherheit über Zukunft'
    ],
    'adults': [
      'Work-Life-Balance',
      'Karrieredruck',
      'Hohe Lebenshaltungskosten',
      'Zeitmanagement'
    ],
    'middle_age': [
      'Vereinbarkeit Familie/Beruf',
      'Stress am Arbeitsplatz',
      'Hohe Kinderkosten',
      'Gesundheitliche Sorgen'
    ],
    'senior': [
      'Jobsicherheit im Alter',
      'Gesundheitsprobleme',
      'Altersvorsorge-Sorgen',
      'Digitalisierung'
    ],
    'elderly': [
      'Gesundheitliche Einschränkungen',
      'Einsamkeit',
      'Technische Hürden',
      'Finanzielle Sorgen'
    ]
  };

  const commonPainPoints = [
    'Zu wenig Zeit',
    'Steigende Kosten',
    'Bürokratie',
    'Stress im Alltag'
  ];

  const incomeSpecificPainPoints = {
    'lowest': ['Geldsorgen', 'Begrenzte Möglichkeiten'],
    'highest': ['Steuerbelastung', 'Zeitdruck']
  };

  const ageSpecificPainPoints = painPointsByAge[ageGroup] || painPointsByAge['adults'];
  
  const selectedPainPoints = [];
  
  // Altersspezifische Schmerzpunkte
  const shuffledAgePoints = [...ageSpecificPainPoints].sort(() => 0.5 - Math.random());
  selectedPainPoints.push(...shuffledAgePoints.slice(0, 2));
  
  // Allgemeine Schmerzpunkte
  const shuffledCommonPoints = [...commonPainPoints].sort(() => 0.5 - Math.random());
  selectedPainPoints.push(...shuffledCommonPoints.slice(0, 1));

  // Einkommensspezifische Schmerzpunkte
  const incomePoints = incomeSpecificPainPoints[incomeQuintile] || [];
  if (incomePoints.length > 0) {
    selectedPainPoints.push(incomePoints[Math.floor(Math.random() * incomePoints.length)]);
  }

  return selectedPainPoints.slice(0, 4);
};

// Motivationen generieren
const generateMotivations = (ageGroup, lifestyle, householdType) => {
  const motivationsByAge = {
    'young_adults': [
      'Selbstverwirklichung',
      'Abenteuer erleben',
      'Soziale Anerkennung',
      'Unabhängigkeit'
    ],
    'adults': [
      'Beruflicher Erfolg',
      'Sicherheit schaffen',
      'Familie versorgen',
      'Persönliches Wachstum'
    ],
    'middle_age': [
      'Stabilität',
      'Familiäres Wohlbefinden',
      'Vermögensaufbau',
      'Anerkennung'
    ],
    'senior': [
      'Ruhe und Gelassenheit',
      'Gesundheit',
      'Familie unterstützen',
      'Lebenserfahrung nutzen'
    ],
    'elderly': [
      'Lebensqualität',
      'Familie und Freunde',
      'Gesundheit erhalten',
      'Wissen weitergeben'
    ]
  };

  const lifestyleMotivations = {
    'luxury': ['Status und Prestige', 'Exklusivität'],
    'sustainable': ['Umweltschutz', 'Nachhaltigkeit'],
    'minimalist': ['Einfachheit', 'Bewusstes Leben'],
    'tech-savvy': ['Innovation', 'Effizienz']
  };

  const ageSpecificMotivations = motivationsByAge[ageGroup] || motivationsByAge['adults'];
  const styleMotivations = lifestyleMotivations[lifestyle] || [];
  
  const selectedMotivations = [];
  
  // Altersspezifische Motivationen
  const shuffledAgeMotivations = [...ageSpecificMotivations].sort(() => 0.5 - Math.random());
  selectedMotivations.push(...shuffledAgeMotivations.slice(0, 2));
  
  // Lifestyle-Motivationen
  if (styleMotivations.length > 0) {
    selectedMotivations.push(styleMotivations[Math.floor(Math.random() * styleMotivations.length)]);
  }

  // Allgemeine Motivationen
  const commonMotivations = ['Glück', 'Erfolg', 'Sicherheit', 'Freiheit'];
  const shuffledCommon = [...commonMotivations].sort(() => 0.5 - Math.random());
  selectedMotivations.push(...shuffledCommon.slice(0, 1));

  return selectedMotivations.slice(0, 4);
};

// Hauptfunktion zur Persona-Generierung
export const generatePersonaFromConfig = async (config) => {
  try {
    // Einkommen schätzen
    const annualIncome = estimateIncome(
      config.jobTitle,
      config.age,
      config.location,
      config.employmentType,
      config.industry
    );

    // Demografische Kategorien bestimmen
    const ageGroup = determineAgeGroup(config.age);
    const incomeQuintile = determineIncomeQuintile(annualIncome);
    const householdType = determineHouseholdType(
      config.maritalStatus,
      config.numberOfChildren,
      config.householdSize
    );

    // Stadt-Information ermitteln
    const isUrban = config.isUrban !== undefined ? config.isUrban : true;

    // Ausgabenmuster generieren
    const spendingHabits = generateSpendingHabits(
      householdType.type,
      incomeQuintile.quintile,
      config.lifestyle
    );

    // Konsumgüterbesitz generieren
    const ownedGoods = generateOwnedGoods(
      householdType.type,
      config.housingType,
      incomeQuintile.quintile,
      config.age,
      config.lifestyle
    );

    // Psychografisches Profil generieren
    const goals = generateGoals(
      ageGroup.group,
      incomeQuintile.quintile,
      householdType.type,
      config.lifestyle
    );

    const painPoints = generatePainPoints(
      ageGroup.group,
      incomeQuintile.quintile,
      householdType.type,
      config.employmentType
    );

    const motivations = generateMotivations(
      ageGroup.group,
      config.lifestyle,
      householdType.type
    );

    // Avatar generieren
    const avatar = generatePersonaImage(config.gender, ageGroup.group);

    // Berufstitel bereinigen
    let cleanJobTitle = config.jobTitle;
    if (config.jobTitle.startsWith('custom:')) {
      cleanJobTitle = config.jobTitle.slice(7);
    }

    // Wohnform-Label
    const housingTypeLabel = config.housingType === 'owner' 
      ? 'Eigentümerhaushalt' 
      : 'Mieterhaushalt';

    // Persona-Objekt zusammenstellen
    const persona = {
      id: crypto.randomUUID(),
      firstName: config.firstName,
      lastName: config.lastName,
      age: parseInt(config.age),
      gender: config.gender,
      ageGroup: ageGroup.group,
      ageGroupLabel: ageGroup.label,
      location: config.location,
      isUrban: isUrban,
      jobTitle: cleanJobTitle,
      annualIncome: annualIncome,
      incomeQuintile: incomeQuintile.quintile,
      incomeQuintileLabel: incomeQuintile.label,
      householdType: householdType.type,
      householdTypeLabel: householdType.label,
      householdSize: parseInt(config.householdSize),
      housingType: config.housingType,
      housingTypeLabel: housingTypeLabel,
      ownedGoods: ownedGoods,
      spendingHabits: spendingHabits,
      goals: goals,
      painPoints: painPoints,
      motivations: motivations,
      avatar: avatar,
      createdAt: new Date().toISOString(),
      dataSource: 'configured'
    };

    return persona;
  } catch (error) {
    console.error('Error generating persona from config:', error);
    throw error;
  }
};