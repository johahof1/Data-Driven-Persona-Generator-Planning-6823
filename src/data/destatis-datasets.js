// Erweiterte Destatis-Datensätze mit mehreren Tabellencodes
export const DESTATIS_DATASETS = {
  // Priorität 1: Verifiziert funktionierende Tabellen
  verified: {
    householdEquipment: {
      code: '63111-0003',
      name: 'Ausstattung privater Haushalte',
      url: 'https://www-genesis.destatis.de/genesisWS/rest/2020/data/tablefile',
      params: {
        name: '63111-0003',
        area: 'all',
        format: 'json',
        compress: 'false',
        language: 'de'
      },
      description: 'Ausstattung privater Haushalte mit Gebrauchsgütern (VERIFIZIERT FUNKTIONSFÄHIG)',
      status: 'verified'
    }
  },

  // Priorität 2: Haushalts-Tabellen (63111-Serie) - wahrscheinlich verfügbar
  households: {
    income: {
      code: '63111-0001',
      name: 'Haushaltsbruttoeinkommen',
      params: {
        name: '63111-0001',
        area: 'all',
        format: 'json',
        compress: 'false',
        language: 'de'
      },
      description: 'Einkommensverteilung privater Haushalte'
    },
    netIncome: {
      code: '63111-0002',
      name: 'Haushaltsnettoeinkommen',
      params: {
        name: '63111-0002',
        area: 'all',
        format: 'json',
        compress: 'false',
        language: 'de'
      },
      description: 'Nettoeinkommen privater Haushalte'
    },
    consumption: {
      code: '63111-0004',
      name: 'Konsumausgaben nach Verwendungszweck',
      params: {
        name: '63111-0004',
        area: 'all',
        format: 'json',
        compress: 'false',
        language: 'de'
      },
      description: 'Ausgabenmuster der Haushalte'
    },
    housing: {
      code: '63111-0005',
      name: 'Ausgaben für Wohnen',
      params: {
        name: '63111-0005',
        area: 'all',
        format: 'json',
        compress: 'false',
        language: 'de'
      },
      description: 'Wohnungsausgaben privater Haushalte'
    }
  },

  // Priorität 3: Bevölkerungs-Tabellen (12411-Serie)
  demographics: {
    populationByGender: {
      code: '12411-0001',
      name: 'Bevölkerung nach Geschlecht',
      params: {
        name: '12411-0001',
        area: 'all',
        format: 'json',
        compress: 'false',
        language: 'de'
      },
      description: 'Bevölkerungsverteilung nach Geschlecht'
    },
    populationByAge: {
      code: '12411-0002',
      name: 'Bevölkerung nach Alter',
      params: {
        name: '12411-0002',
        area: 'all',
        format: 'json',
        compress: 'false',
        language: 'de'
      },
      description: 'Bevölkerungsverteilung nach Altersjahren'
    },
    populationByAgeGender: {
      code: '12411-0012',
      name: 'Bevölkerung nach Alter und Geschlecht',
      params: {
        name: '12411-0012',
        area: 'all',
        format: 'json',
        compress: 'false',
        language: 'de'
      },
      description: 'Bevölkerungsverteilung nach Altersjahren und Geschlecht'
    }
  },

  // Priorität 4: Haushalts-Struktur (12211-Serie)
  householdStructure: {
    householdsByType: {
      code: '12211-0100',
      name: 'Haushalte nach Haushaltstyp',
      params: {
        name: '12211-0100',
        area: 'all',
        format: 'json',
        compress: 'false',
        language: 'de'
      },
      description: 'Haushaltstypen-Verteilung (Single, Paare, Familien)'
    },
    householdsBySize: {
      code: '12211-0200',
      name: 'Haushalte nach Größe',
      params: {
        name: '12211-0200',
        area: 'all',
        format: 'json',
        compress: 'false',
        language: 'de'
      },
      description: 'Haushalte nach Anzahl der Personen'
    }
  },

  // Priorität 5: Wohnungs-Tabellen (31231-Serie)
  housing: {
    housingBySize: {
      code: '31231-0001',
      name: 'Wohnungen nach Größe',
      params: {
        name: '31231-0001',
        area: 'all',
        format: 'json',
        compress: 'false',
        language: 'de'
      },
      description: 'Wohnungsgrößen-Verteilung'
    },
    housingByOwnership: {
      code: '31231-0003',
      name: 'Wohnungen nach Eigentumsform',
      params: {
        name: '31231-0003',
        area: 'all',
        format: 'json',
        compress: 'false',
        language: 'de'
      },
      description: 'Eigentümer vs. Mieter-Verhältnis'
    }
  }
};

// Vereinfachte Parameter-Templates (universell einsetzbar)
export const PARAMETER_TEMPLATES = {
  standard: {
    area: 'all',
    format: 'json',
    compress: 'false',
    language: 'de'
  },
  excel: {
    area: 'all',
    format: 'xlsx',
    compress: 'false',
    language: 'de'
  },
  csv: {
    area: 'all',
    format: 'csv',
    compress: 'false',
    language: 'de'
  }
};

// Erweiterte Tabellenliste für systematische Tests
export const TEST_TABLES = [
  // Haushalts-Serie (63111)
  '63111-0001', '63111-0002', '63111-0003', '63111-0004', '63111-0005',
  
  // Bevölkerungs-Serie (12411)
  '12411-0001', '12411-0002', '12411-0012',
  
  // Haushalts-Struktur (12211)
  '12211-0100', '12211-0200',
  
  // Wohnungs-Serie (31231)
  '31231-0001', '31231-0003',
  
  // Weitere mögliche Tabellen
  '12613-0001', // Mikrozensus
  '81000-0001', // Preise
  '61111-0001'  // Arbeit
];

// Mapping für Datenextraktion (erweitert)
export const DATA_MAPPINGS = {
  householdEquipment: {
    dataset: 'verified.householdEquipment',
    tableCode: '63111-0003',
    fields: {
      car: ['PKW', 'Personenkraftwagen', 'Auto'],
      smartphone: ['Smartphone', 'Mobiltelefon', 'Handy'],
      computer: ['PC', 'Computer', 'Laptop'],
      bicycle: ['Fahrrad', 'Rad'],
      tv: ['Fernseher', 'TV', 'Smart TV']
    }
  },
  householdIncome: {
    dataset: 'households.income',
    tableCode: '63111-0001',
    fields: {
      gross_income: ['Bruttoeinkommen', 'Einkommen brutto'],
      income_quintiles: ['Quintil', 'Einkommensgruppe']
    }
  },
  ageGroups: {
    dataset: 'demographics.populationByAgeGender',
    tableCode: '12411-0012',
    mapping: {
      '18-25': ['18', '19', '20', '21', '22', '23', '24', '25'],
      '26-35': ['26', '27', '28', '29', '30', '31', '32', '33', '34', '35'],
      '36-50': ['36-50'],
      '51-65': ['51-65'],
      '66+': ['66', '67', '68', '69', '70+']
    }
  },
  householdTypes: {
    dataset: 'householdStructure.householdsByType',
    tableCode: '12211-0100',
    mapping: {
      single: ['Einpersonenhaushalt', 'Alleinlebende'],
      couple: ['Paarhaushalt', 'Zwei Personen'],
      family: ['Familie', 'Familienhaushalt'],
      other: ['Sonstige', 'Mehrpersonenhaushalt']
    }
  }
};

// Hilfsfunktion: Alle verfügbaren Tabellencodes abrufen
export const getAllTableCodes = () => {
  const codes = [];
  
  Object.values(DESTATIS_DATASETS).forEach(category => {
    Object.values(category).forEach(dataset => {
      if (dataset.code) {
        codes.push(dataset.code);
      }
    });
  });
  
  return [...new Set(codes)]; // Duplikate entfernen
};

// Hilfsfunktion: Dataset-Info nach Tabellencode abrufen
export const getDatasetByCode = (tableCode) => {
  for (const [categoryName, category] of Object.entries(DESTATIS_DATASETS)) {
    for (const [datasetName, dataset] of Object.entries(category)) {
      if (dataset.code === tableCode) {
        return {
          ...dataset,
          categoryName,
          datasetName
        };
      }
    }
  }
  return null;
};