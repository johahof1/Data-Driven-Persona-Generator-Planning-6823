// German demographic data based on EU-SILC and other statistical sources

export const ageGroups = [
  { id: 'young_adults', label: '18-25', percentage: 0.11 },
  { id: 'adults', label: '26-35', percentage: 0.16 },
  { id: 'middle_age', label: '36-50', percentage: 0.24 },
  { id: 'senior', label: '51-65', percentage: 0.28 },
  { id: 'elderly', label: 'Über 65', percentage: 0.21 },
];

export const genderDistribution = [
  { id: 'male', label: 'Männlich', percentage: 0.49 },
  { id: 'female', label: 'Weiblich', percentage: 0.51 },
];

export const householdTypes = [
  { id: 'single', label: 'Alleinlebende', percentage: 0.22, avgSize: 1 },
  { id: 'couple_no_children', label: 'Zwei Erwachsene ohne Kind(er)', percentage: 0.29, avgSize: 2 },
  { id: 'adults_no_children', label: 'Drei oder mehr Erwachsene ohne Kind(er)', percentage: 0.09, avgSize: 3.2 },
  { id: 'single_parent', label: 'Alleinerziehende', percentage: 0.06, avgSize: 2.3 },
  { id: 'couple_with_children', label: 'Zwei Erwachsene mit Kind(ern)', percentage: 0.25, avgSize: 3.5 },
  { id: 'adults_with_children', label: 'Drei oder mehr Erwachsene mit Kind(ern)', percentage: 0.09, avgSize: 4.2 },
];

export const housingTypes = [
  { id: 'owner', label: 'Eigentümerhaushalt', percentage: 0.46 },
  { id: 'renter', label: 'Mieterhaushalt', percentage: 0.54 },
];

export const incomeQuintiles = [
  { id: 'lowest', label: 'Unteres Quintil', percentage: 0.2, rangeEuro: '< 22.000 €' },
  { id: 'lower_middle', label: 'Unteres Mittelquintil', percentage: 0.2, rangeEuro: '22.000 € - 35.000 €' },
  { id: 'middle', label: 'Mittleres Quintil', percentage: 0.2, rangeEuro: '35.000 € - 50.000 €' },
  { id: 'upper_middle', label: 'Oberes Mittelquintil', percentage: 0.2, rangeEuro: '50.000 € - 72.000 €' },
  { id: 'highest', label: 'Oberes Quintil', percentage: 0.2, rangeEuro: '> 72.000 €' },
];

export const consumerGoods = [
  { id: 'car', label: 'Personenkraftwagen', ownershipRate: 0.776, priceIndex: 125.5 },
  { id: 'new_car', label: 'Neuer PKW', ownershipRate: 0.15, priceIndex: 119.6 },
  { id: 'used_car', label: 'Gebrauchter PKW', ownershipRate: 0.62, priceIndex: 142.7 },
  { id: 'motorcycle', label: 'Krafträder', ownershipRate: 0.12, priceIndex: 114.3 },
  { id: 'bicycle', label: 'Fahrräder', ownershipRate: 0.76, priceIndex: 113.1 },
  { id: 'smartphone', label: 'Smartphone', ownershipRate: 0.94, priceIndex: 108.2 },
  { id: 'laptop', label: 'Laptop/PC', ownershipRate: 0.87, priceIndex: 110.5 },
  { id: 'smart_tv', label: 'Smart TV', ownershipRate: 0.82, priceIndex: 102.3 },
];

// Consumer spending patterns based on household type
export const spendingPatterns = {
  'single': {
    housing: 0.38,
    food: 0.15,
    transport: 0.12,
    leisure: 0.09,
    health: 0.06,
    communication: 0.05,
    clothing: 0.04,
    other: 0.11,
  },
  'couple_no_children': {
    housing: 0.32,
    food: 0.16,
    transport: 0.14,
    leisure: 0.12,
    health: 0.07,
    communication: 0.04,
    clothing: 0.05,
    other: 0.10,
  },
  // Additional household types and their spending patterns
};

// Correlations between demographic factors
export const correlations = {
  'single': {
    ageGroups: ['young_adults', 'elderly'],
    incomeQuintiles: ['lowest', 'lower_middle'],
    housingTypes: ['renter'],
    consumerGoods: ['bicycle', 'smartphone'],
  },
  'couple_with_children': {
    ageGroups: ['adults', 'middle_age'],
    incomeQuintiles: ['middle', 'upper_middle', 'highest'],
    housingTypes: ['owner'],
    consumerGoods: ['car', 'new_car', 'bicycle', 'smart_tv'],
  },
  // Additional correlations
};