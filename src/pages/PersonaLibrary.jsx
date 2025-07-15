import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiUser, FiDollarSign, FiHome } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import PersonaCard from '../components/PersonaCard';

const PersonaLibrary = ({ personas }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  
  const filteredPersonas = useMemo(() => {
    return personas.filter(persona => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = `${persona.firstName} ${persona.lastName}`.toLowerCase().includes(searchLower);
        const locationMatch = persona.location.toLowerCase().includes(searchLower);
        const jobMatch = persona.jobTitle.toLowerCase().includes(searchLower);
        
        if (!(nameMatch || locationMatch || jobMatch)) {
          return false;
        }
      }
      
      // Demographic filters
      if (filters.gender && persona.gender !== filters.gender) {
        return false;
      }
      
      if (filters.ageGroup && persona.ageGroup !== filters.ageGroup) {
        return false;
      }
      
      if (filters.incomeQuintile && persona.incomeQuintile !== filters.incomeQuintile) {
        return false;
      }
      
      if (filters.householdType && persona.householdType !== filters.householdType) {
        return false;
      }
      
      if (filters.housingType && persona.housingType !== filters.housingType) {
        return false;
      }
      
      return true;
    });
  }, [personas, searchTerm, filters]);
  
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
    setSearchTerm('');
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Persona-Bibliothek</h1>
        <p className="text-gray-600">
          Durchsuchen und verwalten Sie Ihre gespeicherten Personas.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="w-full md:w-auto flex-1">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiSearch} className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Suche nach Namen, Ort oder Beruf..."
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <SafeIcon icon={FiFilter} className="mr-2 -ml-1 h-5 w-5" />
              Filter {showFilters ? 'ausblenden' : 'anzeigen'}
            </button>
            
            <Link
              to="/generator"
              className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Neue Persona erstellen
            </Link>
          </div>
        </div>
        
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-700">Filter</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Alle Filter zurücksetzen
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <SafeIcon icon={FiUser} className="mr-1 text-gray-500" />
                    <span>Demografische Filter</span>
                  </div>
                  
                  <div className="space-y-3">
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
                        <option value="male">Männlich</option>
                        <option value="female">Weiblich</option>
                      </select>
                    </div>
                    
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
                        <option value="young_adults">18-25</option>
                        <option value="adults">26-35</option>
                        <option value="middle_age">36-50</option>
                        <option value="senior">51-65</option>
                        <option value="elderly">Über 65</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <SafeIcon icon={FiHome} className="mr-1 text-gray-500" />
                    <span>Haushalt & Wohnen</span>
                  </div>
                  
                  <div className="space-y-3">
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
                        <option value="single">Alleinlebende</option>
                        <option value="couple_no_children">Zwei Erwachsene ohne Kind(er)</option>
                        <option value="adults_no_children">Drei+ Erwachsene ohne Kind(er)</option>
                        <option value="single_parent">Alleinerziehende</option>
                        <option value="couple_with_children">Zwei Erwachsene mit Kind(ern)</option>
                        <option value="adults_with_children">Drei+ Erwachsene mit Kind(ern)</option>
                      </select>
                    </div>
                    
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
                        <option value="owner">Eigentümerhaushalt</option>
                        <option value="renter">Mieterhaushalt</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <SafeIcon icon={FiDollarSign} className="mr-1 text-gray-500" />
                    <span>Einkommenssituation</span>
                  </div>
                  
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
                      <option value="lowest">Unteres Quintil (&lt; 22.000 €)</option>
                      <option value="lower_middle">Unteres Mittelquintil (22.000 € - 35.000 €)</option>
                      <option value="middle">Mittleres Quintil (35.000 € - 50.000 €)</option>
                      <option value="upper_middle">Oberes Mittelquintil (50.000 € - 72.000 €)</option>
                      <option value="highest">Oberes Quintil (&gt; 72.000 €)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {Object.keys(filters).length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm">
                  <p className="font-medium mb-1 text-blue-700">Aktive Filter:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(filters).map(([key, value]) => {
                      let label;
                      
                      switch (key) {
                        case 'gender':
                          label = value === 'male' ? 'Männlich' : 'Weiblich';
                          break;
                        case 'ageGroup':
                          label = {
                            'young_adults': '18-25',
                            'adults': '26-35',
                            'middle_age': '36-50',
                            'senior': '51-65',
                            'elderly': 'Über 65',
                          }[value];
                          break;
                        case 'householdType':
                          label = {
                            'single': 'Alleinlebende',
                            'couple_no_children': 'Zwei Erwachsene ohne Kind(er)',
                            'adults_no_children': 'Drei+ Erwachsene ohne Kind(er)',
                            'single_parent': 'Alleinerziehende',
                            'couple_with_children': 'Zwei Erwachsene mit Kind(ern)',
                            'adults_with_children': 'Drei+ Erwachsene mit Kind(ern)',
                          }[value];
                          break;
                        case 'housingType':
                          label = value === 'owner' ? 'Eigentümerhaushalt' : 'Mieterhaushalt';
                          break;
                        case 'incomeQuintile':
                          label = {
                            'lowest': 'Unteres Quintil',
                            'lower_middle': 'Unteres Mittelquintil',
                            'middle': 'Mittleres Quintil',
                            'upper_middle': 'Oberes Mittelquintil',
                            'highest': 'Oberes Quintil',
                          }[value];
                          break;
                        default:
                          label = value;
                      }
                      
                      return (
                        <span 
                          key={key}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {label}
                          <button
                            type="button"
                            className="ml-1 inline-flex text-blue-500 hover:text-blue-700"
                            onClick={() => handleFilterChange(key, '')}
                          >
                            <span className="sr-only">Remove filter</span>
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        <div>
          <p className="text-sm text-gray-500 mb-2">
            {filteredPersonas.length} {filteredPersonas.length === 1 ? 'Persona' : 'Personas'} gefunden
          </p>
        </div>
      </div>
      
      {filteredPersonas.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <SafeIcon icon={FiUser} className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-medium text-gray-800 mb-2">Keine Personas gefunden</h2>
          <p className="text-gray-600 mb-4">
            {personas.length === 0 
              ? 'Sie haben noch keine Personas erstellt.'
              : 'Keine Personas entsprechen Ihren Filterkriterien.'}
          </p>
          {personas.length === 0 ? (
            <Link
              to="/generator"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Erste Persona erstellen
            </Link>
          ) : (
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Filter zurücksetzen
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPersonas.map(persona => (
            <Link key={persona.id} to={`/persona/${persona.id}`}>
              <PersonaCard 
                persona={persona} 
                onSave={() => {}} 
                showSaveButton={false}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonaLibrary;