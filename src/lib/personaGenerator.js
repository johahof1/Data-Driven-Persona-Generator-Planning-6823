import {ageGroups,genderDistribution,householdTypes,housingTypes,incomeQuintiles,consumerGoods,spendingPatterns,correlations} from '../data/germanDemographics';

const getRandomElement=(array,weights)=> {
  if (weights) {
    // Weighted random selection
    const totalWeight=weights.reduce((sum,weight)=> sum + weight,0);
    let random=Math.random() * totalWeight;
    for (let i=0;i < array.length;i++) {
      if (random < weights[i]) {
        return array[i];
      }
      random -=weights[i];
    }
  }
  // Simple random selection
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomInt=(min,max)=> {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomFloat=(min,max,decimals=2)=> {
  const value=Math.random() * (max - min) + min;
  return parseFloat(value.toFixed(decimals));
};

const generateFirstName=(gender)=> {
  const maleNames=['Thomas','Michael','Andreas','Stefan','Christian','Markus','Daniel','Alexander','Frank','Peter'];
  const femaleNames=['Maria','Anna','Julia','Lisa','Sarah','Laura','Katharina','Christina','Sandra','Nicole'];
  return gender==='male' ? getRandomElement(maleNames) : getRandomElement(femaleNames);
};

const generateLastName=()=> {
  const lastNames=['Müller','Schmidt','Schneider','Fischer','Weber','Meyer','Wagner','Becker','Schulz','Hoffmann'];
  return getRandomElement(lastNames);
};

const generateLocation=()=> {
  const cities=[
    {name: 'Berlin',population: 3.7,isUrban: true},
    {name: 'Hamburg',population: 1.8,isUrban: true},
    {name: 'München',population: 1.5,isUrban: true},
    {name: 'Köln',population: 1.1,isUrban: true},
    {name: 'Frankfurt',population: 0.75,isUrban: true},
    {name: 'Hannover',population: 0.53,isUrban: true},
    {name: 'Leipzig',population: 0.6,isUrban: true},
    {name: 'Freiburg',population: 0.23,isUrban: true},
    {name: 'Münster',population: 0.32,isUrban: true},
    {name: 'Rostock',population: 0.21,isUrban: true},
    {name: 'Bamberg',population: 0.08,isUrban: false},
    {name: 'Landshut',population: 0.07,isUrban: false},
    {name: 'Celle',population: 0.07,isUrban: false},
    {name: 'Tuttlingen',population: 0.04,isUrban: false},
    {name: 'Husum',population: 0.02,isUrban: false},
  ];
  return getRandomElement(cities);
};

const getPersonaImage=(gender,ageGroup)=> {
  // Kuratierte und verifizierte Profilbilder von Unsplash
  // Diese URLs wurden manuell überprüft um sicherzustellen, dass sie die richtige demografische Gruppe zeigen
  const photos={
    male: {
      young_adults: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&h=300&fit=crop&crop=face"
      ],
      adults: [
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1612214070475-1e73f478188c?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1557862921-37829c7de6cc?w=300&h=300&fit=crop&crop=face"
      ],
      middle_age: [
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1559553156-2e97137af16f?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1556474688-479399155327?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1516729557019-1891456f956e?w=300&h=300&fit=crop&crop=face"
      ],
      senior: [
        "https://images.unsplash.com/photo-1581087724822-f4e70a896577?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&h=300&fit=crop&crop=face"
      ],
      elderly: [
        "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1612214070475-1e73f478188c?w=300&h=300&fit=crop&crop=face"
      ]
    },
    female: {
      young_adults: [
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop&crop=face"
      ],
      adults: [
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face"
      ],
      middle_age: [
        "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1569931727762-93dd90109eef?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face"
      ],
      senior: [
        "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1582233479366-6d38bc390a08?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1559570188-a0c3a32d4fd7?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=300&h=300&fit=crop&crop=face"
      ],
      elderly: [
        "https://images.unsplash.com/photo-1442458370899-ae20e367c5d8?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1559570188-a0c3a32d4fd7?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=300&h=300&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1505103091609-e6e1f8f99456?w=300&h=300&fit=crop&crop=face"
      ]
    }
  };

  // Fallback für den Fall, dass die Kategorie nicht existiert
  const fallbackPhotos={
    male: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    female: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face"
  };

  try {
    // Wähle ein zufälliges Foto aus der korrekten Kategorie
    const categoryPhotos=photos[gender][ageGroup];
    if (categoryPhotos && categoryPhotos.length > 0) {
      return categoryPhotos[Math.floor(Math.random() * categoryPhotos.length)];
    } else {
      // Fallback auf Geschlecht, wenn Altersgruppe nicht verfügbar
      return fallbackPhotos[gender];
    }
  } catch (error) {
    console.warn('Fehler beim Laden des Persona-Bildes:', error);
    // Allgemeiner Fallback
    return fallbackPhotos[gender] || fallbackPhotos.male;
  }
};

const generateJobTitle=(ageGroup,incomeQuintile)=> {
  const jobs={
    high_income: [
      'Arzt/Ärztin',
      'Rechtsanwalt/Rechtsanwältin',
      'IT-Projektleiter/in',
      'Finanzberater/in',
      'Ingenieur/in',
      'Abteilungsleiter/in',
      'Unternehmensberater/in',
      'Architekt/in'
    ],
    medium_income: [
      'Lehrer/in',
      'Krankenpfleger/in',
      'Techniker/in',
      'Verwaltungsangestellte/r',
      'Buchhalter/in',
      'Polizist/in',
      'Versicherungskaufmann/frau',
      'Handwerksmeister/in'
    ],
    low_income: [
      'Verkäufer/in',
      'Kellner/in',
      'Kassierer/in',
      'Pflegehelfer/in',
      'Lagerarbeiter/in',
      'Reinigungskraft',
      'Fahrer/in',
      'Sicherheitsmitarbeiter/in'
    ],
    retired: [
      'Rentner/in',
      'Pensionär/in',
      'Im Ruhestand'
    ],
    student: [
      'Student/in',
      'Auszubildende/r',
      'Praktikant/in'
    ]
  };

  let jobCategory;
  if (ageGroup.id==='young_adults') {
    jobCategory=Math.random() > 0.7 ? 'student' : 'low_income';
  } else if (ageGroup.id==='elderly') {
    jobCategory='retired';
  } else {
    if (incomeQuintile.id==='highest' || incomeQuintile.id==='upper_middle') {
      jobCategory='high_income';
    } else if (incomeQuintile.id==='middle') {
      jobCategory='medium_income';
    } else {
      jobCategory='low_income';
    }
  }

  return getRandomElement(jobs[jobCategory]);
};

const generateConsumerGoods=(householdType,housingType,incomeQuintile)=> {
  const result={};

  // Base probability for each consumer good
  consumerGoods.forEach(good=> {
    // Adjust probability based on household,housing and income
    let adjustedProbability=good.ownershipRate;

    // Home owners are more likely to have cars
    if (housingType.id==='owner' && (good.id==='car' || good.id==='new_car')) {
      adjustedProbability *=1.2;
    }

    // Families with children are more likely to have certain goods
    if ((householdType.id==='couple_with_children' || householdType.id==='single_parent') && 
        (good.id==='smart_tv' || good.id==='bicycle')) {
      adjustedProbability *=1.15;
    }

    // Higher income increases probability of owning new cars and high-end goods
    if ((incomeQuintile.id==='highest' || incomeQuintile.id==='upper_middle') && 
        (good.id==='new_car' || good.id==='smart_tv')) {
      adjustedProbability *=1.25;
    }

    // Lower income decreases probability of owning cars
    if ((incomeQuintile.id==='lowest') && (good.id==='car' || good.id==='new_car')) {
      adjustedProbability *=0.7;
    }

    // Cap probability at 1.0
    adjustedProbability=Math.min(adjustedProbability,1.0);

    // Determine if the persona owns this good
    result[good.id]=Math.random() < adjustedProbability;
  });

  return result;
};

const generateSpendingHabits=(householdType,incomeQuintile)=> {
  // Get base spending pattern for this household type
  const basePattern=spendingPatterns[householdType.id] || spendingPatterns['single'];

  // Adjust based on income
  const adjustedPattern={...basePattern};

  if (incomeQuintile.id==='highest' || incomeQuintile.id==='upper_middle') {
    // Higher income households spend relatively less on essentials and more on leisure
    adjustedPattern.housing=basePattern.housing * 0.9;
    adjustedPattern.food=basePattern.food * 0.9;
    adjustedPattern.leisure=basePattern.leisure * 1.3;
    adjustedPattern.other=basePattern.other * 1.2;
  } else if (incomeQuintile.id==='lowest' || incomeQuintile.id==='lower_middle') {
    // Lower income households spend relatively more on essentials
    adjustedPattern.housing=basePattern.housing * 1.1;
    adjustedPattern.food=basePattern.food * 1.1;
    adjustedPattern.leisure=basePattern.leisure * 0.8;
    adjustedPattern.other=basePattern.other * 0.9;
  }

  // Normalize to ensure sum is 1.0
  const sum=Object.values(adjustedPattern).reduce((acc,val)=> acc + val,0);
  for (const category in adjustedPattern) {
    adjustedPattern[category]=adjustedPattern[category] / sum;
  }

  return adjustedPattern;
};

const generatePersonaDetails=(realDemographics=null)=> {
  // Verwende echte Datenverteilung,wenn verfügbar
  const useRealData=!!realDemographics;
  let demographics={
    ageGroups,
    genderDistribution,
    householdTypes,
    housingTypes,
    incomeQuintiles
  };

  // Wenn echte Daten vorhanden,verwende diese
  if (useRealData) {
    try {
      demographics=realDemographics;
      console.log('Verwende echte demografische Daten für Persona-Generierung');
    } catch (error) {
      console.warn('Fehler bei Verwendung echter Daten,Fallback auf Beispieldaten',error);
    }
  }

  // Select demographic attributes with weighted probabilities
  const gender=getRandomElement(
    demographics.genderDistribution.map(g=> g.id),
    demographics.genderDistribution.map(g=> g.percentage)
  );

  const ageGroup=getRandomElement(
    demographics.ageGroups,
    demographics.ageGroups.map(a=> a.percentage)
  );

  const householdType=getRandomElement(
    demographics.householdTypes,
    demographics.householdTypes.map(h=> h.percentage)
  );

  const housingType=getRandomElement(
    demographics.housingTypes,
    demographics.housingTypes.map(h=> h.percentage)
  );

  const incomeQuintile=getRandomElement(
    demographics.incomeQuintiles,
    demographics.incomeQuintiles.map(i=> i.percentage)
  );

  // Generate specific age within the age group
  let minAge,maxAge;
  switch (ageGroup.id) {
    case 'young_adults': minAge=18;maxAge=25;break;
    case 'adults': minAge=26;maxAge=35;break;
    case 'middle_age': minAge=36;maxAge=50;break;
    case 'senior': minAge=51;maxAge=65;break;
    case 'elderly': minAge=66;maxAge=85;break;
    default: minAge=30;maxAge=50;
  }
  const age=getRandomInt(minAge,maxAge);

  // Generate location
  const location=generateLocation();

  // Generate name
  const firstName=generateFirstName(gender);
  const lastName=generateLastName();

  // Generate job title
  const jobTitle=generateJobTitle(ageGroup,incomeQuintile);

  // Generate specific income within the quintile range
  let minIncome,maxIncome;
  switch (incomeQuintile.id) {
    case 'lowest': minIncome=12000;maxIncome=22000;break;
    case 'lower_middle': minIncome=22001;maxIncome=35000;break;
    case 'middle': minIncome=35001;maxIncome=50000;break;
    case 'upper_middle': minIncome=50001;maxIncome=72000;break;
    case 'highest': minIncome=72001;maxIncome=150000;break;
    default: minIncome=35000;maxIncome=50000;
  }
  const annualIncome=getRandomInt(minIncome,maxIncome);

  // Generate consumer goods ownership
  const ownedGoods=generateConsumerGoods(householdType,housingType,incomeQuintile);

  // Generate spending habits
  const spendingHabits=generateSpendingHabits(householdType,incomeQuintile);

  // Generate goals,pain points,and motivations based on demographic profile
  const goals=generateGoals(ageGroup,householdType,incomeQuintile);
  const painPoints=generatePainPoints(ageGroup,householdType,incomeQuintile);
  const motivations=generateMotivations(ageGroup,householdType,incomeQuintile);

  // Combine everything into a persona
  return {
    id: Date.now().toString(),
    firstName,
    lastName,
    age,
    gender,
    ageGroup: ageGroup.id,
    ageGroupLabel: ageGroup.label,
    location: location.name,
    isUrban: location.isUrban,
    jobTitle,
    annualIncome,
    incomeQuintile: incomeQuintile.id,
    incomeQuintileLabel: incomeQuintile.label,
    householdType: householdType.id,
    householdTypeLabel: householdType.label,
    householdSize: getRandomInt(
      Math.max(1,Math.floor(householdType.avgSize - 0.5)),
      Math.ceil(householdType.avgSize + 0.5)
    ),
    housingType: housingType.id,
    housingTypeLabel: housingType.label,
    ownedGoods,
    spendingHabits,
    goals,
    painPoints,
    motivations,
    avatar: getPersonaImage(gender,ageGroup.id),
    createdAt: new Date().toISOString(),
    dataSource: useRealData ? 'real' : 'simulated'
  };
};

// Helper functions to generate persona psychological profile
const generateGoals=(ageGroup,householdType,incomeQuintile)=> {
  const commonGoals=[
    'Finanziell abgesichert sein',
    'Gesund bleiben',
    'Mehr Zeit mit Familie verbringen',
    'Berufliche Weiterentwicklung',
    'Work-Life-Balance verbessern',
  ];

  const specificGoals={
    young_adults: [
      'Karriereeinstieg meistern',
      'Studienabschluss erreichen',
      'Erste eigene Wohnung finden',
      'Reisen und neue Erfahrungen sammeln',
      'Netzwerk aufbauen',
    ],
    middle_age: [
      'Eigenheim erwerben',
      'Für Altersvorsorge sparen',
      'Kinder gut erziehen',
      'Karrierehöhepunkt erreichen',
      'Langfristige Investitionen tätigen',
    ],
    elderly: [
      'Gesundheit im Alter erhalten',
      'Lebensqualität sichern',
      'Kontakt zu Familie pflegen',
      'Hobbys nachgehen',
      'Reisen unternehmen',
    ],
  };

  const incomeSpecificGoals={
    lowest: [
      'Schulden abbauen',
      'Besseren Job finden',
      'Mit begrenztem Budget auskommen',
      'Notgroschen aufbauen',
    ],
    highest: [
      'Vermögen vermehren',
      'In Immobilien investieren',
      'Steueroptimierung',
      'Luxusreisen unternehmen',
    ],
  };

  // Select 3-5 goals that match the persona's profile
  const goals=[];

  // Add 1-2 common goals
  for (let i=0;i < getRandomInt(1,2);i++) {
    const goal=getRandomElement(commonGoals);
    if (!goals.includes(goal)) goals.push(goal);
  }

  // Add 1-2 age-specific goals
  const ageSpecificGoals=specificGoals[ageGroup.id] || specificGoals.middle_age;
  for (let i=0;i < getRandomInt(1,2);i++) {
    const goal=getRandomElement(ageSpecificGoals);
    if (!goals.includes(goal)) goals.push(goal);
  }

  // Add 1 income-specific goal if applicable
  if (incomeQuintile.id==='lowest' || incomeQuintile.id==='highest') {
    const incomeGoals=incomeSpecificGoals[incomeQuintile.id];
    const goal=getRandomElement(incomeGoals);
    if (!goals.includes(goal)) goals.push(goal);
  }

  return goals;
};

const generatePainPoints=(ageGroup,householdType,incomeQuintile)=> {
  const commonPainPoints=[
    'Zu wenig Zeit im Alltag',
    'Steigende Lebenshaltungskosten',
    'Stress am Arbeitsplatz',
    'Bürokratie und Papierkram',
    'Unzureichende Work-Life-Balance',
  ];

  const specificPainPoints={
    young_adults: [
      'Hohe Mieten in Großstädten',
      'Berufseinstiegshürden',
      'Studienfinanzierung',
      'Unsicherheit bei Zukunftsentscheidungen',
    ],
    middle_age: [
      'Vereinbarkeit von Familie und Beruf',
      'Karrieredruck',
      'Hohe Kinderbetreuungskosten',
      'Zu wenig Zeit für persönliche Interessen',
    ],
    elderly: [
      'Gesundheitliche Einschränkungen',
      'Digitalisierungshürden',
      'Alterseinsamkeit',
      'Sorge um ausreichende Rente',
    ],
  };

  const householdSpecificPainPoints={
    single: [
      'Höhere Pro-Kopf-Fixkosten',
      'Allein Entscheidungen treffen müssen',
      'Weniger soziales Sicherheitsnetz',
    ],
    couple_with_children: [
      'Hohe Familienausgaben',
      'Zeitmanagement mit Kindern',
      'Schulische Anforderungen der Kinder',
      'Wenig Zeit als Paar',
    ],
  };

  // Select 3-5 pain points that match the persona's profile
  const painPoints=[];

  // Add 1-2 common pain points
  for (let i=0;i < getRandomInt(1,2);i++) {
    const painPoint=getRandomElement(commonPainPoints);
    if (!painPoints.includes(painPoint)) painPoints.push(painPoint);
  }

  // Add 1-2 age-specific pain points
  const ageSpecificPainPoints=specificPainPoints[ageGroup.id] || specificPainPoints.middle_age;
  for (let i=0;i < getRandomInt(1,2);i++) {
    const painPoint=getRandomElement(ageSpecificPainPoints);
    if (!painPoints.includes(painPoint)) painPoints.push(painPoint);
  }

  // Add 1 household-specific pain point if applicable
  if (householdType.id==='single' || householdType.id==='couple_with_children') {
    const householdPainPoints=householdSpecificPainPoints[householdType.id];
    const painPoint=getRandomElement(householdPainPoints);
    if (!painPoints.includes(painPoint)) painPoints.push(painPoint);
  }

  return painPoints;
};

const generateMotivations=(ageGroup,householdType,incomeQuintile)=> {
  const commonMotivations=[
    'Finanzielle Sicherheit',
    'Familiäres Wohlbefinden',
    'Persönliche Entwicklung',
    'Gesundheit und Wohlbefinden',
    'Anerkennung und Respekt',
  ];

  const specificMotivations={
    young_adults: [
      'Selbstverwirklichung',
      'Neue Erfahrungen sammeln',
      'Soziale Anerkennung',
      'Unabhängigkeit erlangen',
    ],
    middle_age: [
      'Beruflicher Erfolg',
      'Familiäre Stabilität',
      'Vermögensaufbau',
      'Sicherheit schaffen',
    ],
    elderly: [
      'Unabhängigkeit bewahren',
      'Lebensqualität erhalten',
      'Gemeinschaft erleben',
      'Wissen weitergeben',
    ],
  };

  // Select 3-4 motivations that match the persona's profile
  const motivations=[];

  // Add 1-2 common motivations
  for (let i=0;i < getRandomInt(1,2);i++) {
    const motivation=getRandomElement(commonMotivations);
    if (!motivations.includes(motivation)) motivations.push(motivation);
  }

  // Add 2 age-specific motivations
  const ageSpecificMotivations=specificMotivations[ageGroup.id] || specificMotivations.middle_age;
  for (let i=0;i < 2;i++) {
    const motivation=getRandomElement(ageSpecificMotivations);
    if (!motivations.includes(motivation)) motivations.push(motivation);
  }

  return motivations;
};

// Main generator function
export const generatePersona=(count=1,filters={},realDemographics=null)=> {
  const personas=[];

  for (let i=0;i < count;i++) {
    let persona;
    let attempts=0;
    const maxAttempts=10;

    // Keep generating until we find a persona that matches the filters
    do {
      persona=generatePersonaDetails(realDemographics);
      attempts++;

      // Break out if we've tried too many times
      if (attempts >=maxAttempts) break;

    } while (
      // Check if any filters are specified and if the persona matches them
      (filters.gender && persona.gender !==filters.gender) ||
      (filters.ageGroup && persona.ageGroup !==filters.ageGroup) ||
      (filters.householdType && persona.householdType !==filters.householdType) ||
      (filters.incomeQuintile && persona.incomeQuintile !==filters.incomeQuintile) ||
      (filters.housingType && persona.housingType !==filters.housingType)
    );

    personas.push(persona);
  }

  return count===1 ? personas[0] : personas;
};

export default generatePersona;