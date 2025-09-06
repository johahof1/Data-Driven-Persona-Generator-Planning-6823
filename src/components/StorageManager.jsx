import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiUpload, FiTrash2, FiDatabase, FiAlertTriangle, FiCloud, FiHardDrive, FiRefreshCw } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import PersonaStorage from '../lib/storage';
import supabaseStorage from '../lib/supabaseStorage';

const StorageManager = ({ personas, onImport, onClearAll, user, useSupabase }) => {
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [importError, setImportError] = useState('');
  const [migrating, setMigrating] = useState(false);

  const handleExport = async () => {
    try {
      if (useSupabase && user) {
        await supabaseStorage.exportPersonas();
      } else {
        PersonaStorage.exportPersonas();
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setImportError('');
      let importedPersonas;
      
      if (useSupabase && user) {
        importedPersonas = await supabaseStorage.importPersonas(file);
      } else {
        importedPersonas = await PersonaStorage.importPersonas(file);
      }
      
      onImport(importedPersonas);
    } catch (error) {
      setImportError(`Import fehlgeschlagen: ${error.message}`);
    }

    // Reset file input
    event.target.value = '';
  };

  const handleClearAll = () => {
    if (showConfirmClear) {
      onClearAll();
      setShowConfirmClear(false);
    } else {
      setShowConfirmClear(true);
    }
  };

  const handleMigrateToCloud = async () => {
    if (!user) return;
    
    setMigrating(true);
    try {
      // Get local personas
      const localPersonas = PersonaStorage.loadPersonas();
      
      if (localPersonas.length > 0) {
        // Save to Supabase
        await supabaseStorage.savePersonas(localPersonas);
        
        // Clear local storage after successful migration
        PersonaStorage.clearAll();
        
        // Refresh the app to load from Supabase
        window.location.reload();
      }
    } catch (error) {
      console.error('Migration failed:', error);
      setImportError(`Migration fehlgeschlagen: ${error.message}`);
    } finally {
      setMigrating(false);
    }
  };

  const getStorageInfo = () => {
    try {
      const jsonString = JSON.stringify(personas);
      const sizeInBytes = new Blob([jsonString]).size;
      const sizeInKB = (sizeInBytes / 1024).toFixed(1);
      return { count: personas.length, size: sizeInKB };
    } catch (error) {
      return { count: 0, size: '0' };
    }
  };

  const storageInfo = getStorageInfo();
  const localPersonas = PersonaStorage.loadPersonas();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <SafeIcon 
          icon={useSupabase ? FiCloud : FiHardDrive} 
          className={`mr-2 ${useSupabase ? 'text-green-600' : 'text-blue-600'}`} 
        />
        <h2 className="text-xl font-semibold text-gray-800">
          Datenverwaltung {useSupabase ? '(Cloud)' : '(Lokal)'}
        </h2>
      </div>

      {/* Storage Info */}
      <div className={`p-4 rounded-lg mb-6 ${useSupabase ? 'bg-green-50' : 'bg-blue-50'}`}>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${useSupabase ? 'text-green-600' : 'text-blue-600'}`}>
              {storageInfo.count}
            </div>
            <div className="text-sm text-gray-600">Gespeicherte Personas</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${useSupabase ? 'text-green-600' : 'text-blue-600'}`}>
              {storageInfo.size} KB
            </div>
            <div className="text-sm text-gray-600">Speicherverbrauch</div>
          </div>
        </div>

        {useSupabase && (
          <div className="mt-4 p-3 bg-green-100 rounded-md">
            <div className="flex items-center">
              <SafeIcon icon={FiCloud} className="mr-2 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Cloud-Speicher aktiv</p>
                <p className="text-xs text-green-700">
                  Ihre Daten werden sicher in der Cloud gespeichert und synchronisiert
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Migration section */}
      {user && !useSupabase && localPersonas.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start">
            <SafeIcon icon={FiAlertTriangle} className="mr-2 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                Lokale Daten gefunden
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Sie haben {localPersonas.length} Personas lokal gespeichert. 
                Möchten Sie diese in die Cloud migrieren?
              </p>
              <button
                onClick={handleMigrateToCloud}
                disabled={migrating}
                className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
              >
                <SafeIcon icon={migrating ? FiRefreshCw : FiCloud} className={`mr-1 h-3 w-3 ${migrating ? 'animate-spin' : ''}`} />
                {migrating ? 'Migriere...' : 'Zu Cloud migrieren'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-4">
        {/* Export */}
        <button
          onClick={handleExport}
          disabled={personas.length === 0}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SafeIcon icon={FiDownload} className="mr-2 -ml-1 h-5 w-5" />
          Personas exportieren ({personas.length})
        </button>

        {/* Import */}
        <div className="relative">
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <SafeIcon icon={FiUpload} className="mr-2 -ml-1 h-5 w-5" />
            Personas importieren
          </button>
        </div>

        {/* Import Error */}
        {importError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 p-3 rounded-md"
          >
            <div className="flex items-center">
              <SafeIcon icon={FiAlertTriangle} className="mr-2 text-red-500" />
              <span className="text-sm text-red-700">{importError}</span>
            </div>
          </motion.div>
        )}

        {/* Clear All */}
        <div className="pt-4 border-t border-gray-200">
          {showConfirmClear ? (
            <div className="space-y-3">
              <div className="bg-red-50 p-3 rounded-md">
                <div className="flex items-center">
                  <SafeIcon icon={FiAlertTriangle} className="mr-2 text-red-500" />
                  <span className="text-sm text-red-700">
                    Alle {personas.length} Personas werden unwiderruflich gelöscht!
                  </span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleClearAll}
                  className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Ja, alle löschen
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleClearAll}
              disabled={personas.length === 0}
              className="w-full flex items-center justify-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SafeIcon icon={FiTrash2} className="mr-2 -ml-1 h-5 w-5" />
              Alle Personas löschen
            </button>
          )}
        </div>
      </div>

      {/* Storage Note */}
      <div className="mt-6 p-3 bg-blue-50 rounded-md">
        <p className="text-xs text-blue-700">
          <strong>Hinweis:</strong> {useSupabase 
            ? 'Daten werden sicher in der Supabase-Cloud gespeichert und zwischen Geräten synchronisiert.'
            : 'Daten werden lokal im Browser gespeichert (localStorage). Bei Löschen der Browser-Daten gehen die Personas verloren.'
          }
        </p>
      </div>
    </div>
  );
};

export default StorageManager;