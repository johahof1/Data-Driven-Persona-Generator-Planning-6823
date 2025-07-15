import React from 'react';
import { motion } from 'framer-motion';
import { FiDatabase, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const DataSourceInfo = ({ status }) => {
  const { isLoaded, isLoading, error, lastUpdate } = status || { 
    isLoaded: false, 
    isLoading: false, 
    error: null 
  };

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 p-4 rounded-lg mb-4"
      >
        <div className="flex items-center">
          <div className="mr-3 flex-shrink-0">
            <SafeIcon icon={FiDatabase} className="h-5 w-5 text-blue-500 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-800">Daten werden geladen</h3>
            <p className="text-sm text-blue-700">
              Aktuelle demografische Daten werden abgerufen...
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 p-4 rounded-lg mb-4"
      >
        <div className="flex items-center">
          <div className="mr-3 flex-shrink-0">
            <SafeIcon icon={FiAlertCircle} className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-red-800">Fehler beim Datenabruf</h3>
            <p className="text-sm text-red-700">
              {error}
            </p>
            <p className="text-xs text-red-700 mt-1">
              Es werden simulierte Daten als Fallback verwendet.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (isLoaded) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-50 p-4 rounded-lg mb-4"
      >
        <div className="flex items-center">
          <div className="mr-3 flex-shrink-0">
            <SafeIcon icon={FiCheckCircle} className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-green-800">Echte demografische Daten aktiv</h3>
            <p className="text-sm text-green-700">
              Die Personas werden mit aktuellen statistischen Daten generiert.
            </p>
            {lastUpdate && (
              <p className="text-xs text-green-600 mt-1">
                Letzte Aktualisierung: {new Date(lastUpdate).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
};

export default DataSourceInfo;