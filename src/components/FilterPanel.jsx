import React from 'react';
import { 
  ageGroups, 
  genderDistribution, 
  householdTypes, 
  housingTypes, 
  incomeQuintiles 
} from '../data/germanDemographics';

const FilterPanel = ({ filters, setFilters }) => {
  const handleFilterChange = (category, value) => {
    if (value === '') {
      // Remove filter if empty value is selected
      const newFilters = { ...filters };
      delete newFilters[category];
      setFilters(newFilters);
    } else {
      // Add/update filter
      setFilters({ ...filters, [category]: value });
    }
  };
  
  const clearFilters = () => {
    setFilters({});
  };
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-700">Persona-Filter</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Alle zurücksetzen
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Gender Filter */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
            Geschlecht
          </label>
          <select
            id="gender"
            value={filters.gender || ''}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Alle</option>
            {genderDistribution.map(gender => (
              <option key={gender.id} value={gender.id}>
                {gender.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Age Group Filter */}
        <div>
          <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-700 mb-1">
            Altersgruppe
          </label>
          <select
            id="ageGroup"
            value={filters.ageGroup || ''}
            onChange={(e) => handleFilterChange('ageGroup', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Alle</option>
            {ageGroups.map(age => (
              <option key={age.id} value={age.id}>
                {age.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Household Type Filter */}
        <div>
          <label htmlFor="householdType" className="block text-sm font-medium text-gray-700 mb-1">
            Haushaltstyp
          </label>
          <select
            id="householdType"
            value={filters.householdType || ''}
            onChange={(e) => handleFilterChange('householdType', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Alle</option>
            {householdTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Housing Type Filter */}
        <div>
          <label htmlFor="housingType" className="block text-sm font-medium text-gray-700 mb-1">
            Wohnform
          </label>
          <select
            id="housingType"
            value={filters.housingType || ''}
            onChange={(e) => handleFilterChange('housingType', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Alle</option>
            {housingTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Income Quintile Filter */}
        <div>
          <label htmlFor="incomeQuintile" className="block text-sm font-medium text-gray-700 mb-1">
            Einkommensniveau
          </label>
          <select
            id="incomeQuintile"
            value={filters.incomeQuintile || ''}
            onChange={(e) => handleFilterChange('incomeQuintile', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Alle</option>
            {incomeQuintiles.map(income => (
              <option key={income.id} value={income.id}>
                {income.label} ({income.rangeEuro})
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {Object.keys(filters).length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm text-blue-700">
          <p className="font-medium mb-1">Aktive Filter:</p>
          <ul className="list-disc pl-5">
            {Object.entries(filters).map(([key, value]) => {
              let label, valueLabel;
              
              switch (key) {
                case 'gender':
                  label = 'Geschlecht';
                  valueLabel = genderDistribution.find(g => g.id === value)?.label;
                  break;
                case 'ageGroup':
                  label = 'Altersgruppe';
                  valueLabel = ageGroups.find(a => a.id === value)?.label;
                  break;
                case 'householdType':
                  label = 'Haushaltstyp';
                  valueLabel = householdTypes.find(h => h.id === value)?.label;
                  break;
                case 'housingType':
                  label = 'Wohnform';
                  valueLabel = housingTypes.find(h => h.id === value)?.label;
                  break;
                case 'incomeQuintile':
                  label = 'Einkommensniveau';
                  valueLabel = incomeQuintiles.find(i => i.id === value)?.label;
                  break;
                default:
                  label = key;
                  valueLabel = value;
              }
              
              return (
                <li key={key}>{label}: <span className="font-medium">{valueLabel}</span></li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;