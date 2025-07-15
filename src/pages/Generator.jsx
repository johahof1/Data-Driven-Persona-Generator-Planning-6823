import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiFilter, FiRefreshCw, FiSave, FiDatabase } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import generatePersona from '../lib/personaGenerator';
import dataIntegration from '../lib/dataIntegration';
import PersonaCard from '../components/PersonaCard';
import FilterPanel from '../components/FilterPanel';

const Generator = ({ addPersona }) => {
  const navigate = useNavigate();
  const [personas, setPersonas] = useState([]);
  const [count, setCount] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [useRealData, setUseRealData] = useState(false);
  const [dataStatus, setDataStatus] = useState({ isLoaded: false, isLoading: false, error: null });

  useEffect(() => {
    // Prüfe den Datenstatus beim Laden der Komponente
    setDataStatus(dataIntegration.getDataSourceStatus());
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      let newPersonas;
      
      if (useRealData) {
        // Verwende echte Daten für die Generierung
        newPersonas = await dataIntegration.generateRealisticPersona(count, filters);
        // Aktualisiere den Datenstatus nach der Generierung
        setDataStatus(dataIntegration.getDataSourceStatus());
      } else {
        // Verwende lokale Daten für die Generierung
        newPersonas = generatePersona(count, filters);
      }
      
      setPersonas(Array.isArray(newPersonas) ? newPersonas : [newPersonas]);
    } catch (error) {
      console.error('Fehler bei der Persona-Generierung:', error);
      // Fallback auf lokale Daten bei Fehler
      const newPersonas = generatePersona(count, filters);
      setPersonas(Array.isArray(newPersonas) ? newPersonas : [newPersonas]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = (persona) => {
    addPersona(persona);
    navigate(`/persona/${persona.id}`);
  };

  const handleSaveAll = () => {
    personas.forEach(persona => addPersona(persona));
    navigate('/personas');
  };

  const toggleDataSource = async () => {
    const newState = !useRealData;
    setUseRealData(newState);
    
    // Wenn wir auf echte Daten umschalten und diese noch nicht geladen sind, lade sie
    if (newState && !dataStatus.isLoaded && !dataStatus.isLoading) {
      try {
        setDataStatus({ ...dataStatus, isLoading: true });
        await dataIntegration.loadRealData();
        setDataStatus(dataIntegration.getDataSourceStatus());
      } catch (error) {
        console.error('Fehler beim Laden der Echtdaten:', error);
        setDataStatus({ 
          isLoaded: false, 
          isLoading: false, 
          error: `Fehler beim Laden der Echtdaten: ${error.message}`
        });
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Persona Generator</h1>
        <p className="text-gray-600">
          Erstellen Sie realistische Konsumenten-Personas basierend auf deutschen demografischen und wirtschaftlichen Daten.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div>
              <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-1">
                Anzahl der Personas
              </label>
              <select
                id="count"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                {[1, 3, 5, 10].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <SafeIcon icon={FiFilter} className="mr-2 -ml-1 h-5 w-5" />
              Filter {showFilters ? 'ausblenden' : 'anzeigen'}
            </button>
            <button
              onClick={toggleDataSource}
              className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                useRealData 
                  ? 'text-white bg-green-600 hover:bg-green-700 border-transparent' 
                  : 'text-gray-700 bg-white hover:bg-gray-50 border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              disabled={dataStatus.isLoading}
            >
              <SafeIcon 
                icon={FiDatabase} 
                className={`mr-2 -ml-1 h-5 w-5 ${dataStatus.isLoading ? 'animate-pulse' : ''}`} 
              />
              {dataStatus.isLoading 
                ? 'Daten laden...' 
                : useRealData 
                  ? 'Echte Daten aktiv' 
                  : 'Simulierte Daten'}
            </button>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <SafeIcon
              icon={isGenerating ? FiRefreshCw : FiUsers}
              className={`mr-2 -ml-1 h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`}
            />
            {isGenerating ? 'Generiere...' : 'Personas generieren'}
          </button>
        </div>

        {dataStatus.error && (
          <div className="bg-red-50 p-3 rounded-md text-sm text-red-700 mb-4">
            <p className="font-medium">Fehler bei Datenquelle:</p>
            <p>{dataStatus.error}</p>
            <p className="mt-1">Simulierte Daten werden als Fallback verwendet.</p>
          </div>
        )}

        {useRealData && dataStatus.isLoaded && (
          <div className="bg-green-50 p-3 rounded-md text-sm text-green-700 mb-4">
            <p className="font-medium">Echtdaten aktiv</p>
            <p>Personas werden mit aktuellen statistischen Daten generiert.</p>
            <p className="text-xs mt-1">Letzte Aktualisierung: {new Date(dataStatus.lastUpdate).toLocaleString()}</p>
          </div>
        )}

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FilterPanel filters={filters} setFilters={setFilters} />
          </motion.div>
        )}
      </div>

      {personas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Generierte Personas ({personas.length})
            </h2>
            {personas.length > 1 && (
              <button
                onClick={handleSaveAll}
                className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <SafeIcon icon={FiSave} className="mr-2 -ml-1 h-4 w-4" />
                Alle speichern
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personas.map(persona => (
              <PersonaCard
                key={persona.id}
                persona={persona}
                onSave={() => handleSave(persona)}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Generator;