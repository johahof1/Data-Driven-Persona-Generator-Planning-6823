import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDatabase, FiHardDrive, FiWifi, FiWifiOff, FiRefreshCw, FiCheck, FiX } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import hybridStorage from '../lib/hybridStorage';

const ConnectionStatus = () => {
  const [status, setStatus] = useState({
    supabase: false,
    localStorage: true,
    lastSync: null,
    syncInProgress: false
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      setStatus(hybridStorage.getConnectionStatus());
    };

    updateStatus();
    
    // Update status every 30 seconds
    const interval = setInterval(updateStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await hybridStorage.syncPersonas();
      setStatus(hybridStorage.getConnectionStatus());
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* Status Indicator */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center p-3 hover:bg-gray-50 transition-colors w-full text-left"
        >
          <div className="flex items-center space-x-2">
            <div className="relative">
              <SafeIcon 
                icon={status.supabase ? FiDatabase : FiHardDrive} 
                className={`h-5 w-5 ${status.supabase ? 'text-green-500' : 'text-yellow-500'}`} 
              />
              <div className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${
                status.supabase ? 'bg-green-400' : 'bg-yellow-400'
              }`}></div>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {status.supabase ? 'Cloud' : 'Lokal'}
            </span>
            <SafeIcon 
              icon={isExpanded ? FiX : FiWifi} 
              className="h-4 w-4 text-gray-400" 
            />
          </div>
        </button>

        {/* Expanded Status */}
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 p-4 min-w-[280px]"
          >
            <h3 className="font-medium text-gray-800 mb-3">Verbindungsstatus</h3>
            
            <div className="space-y-3">
              {/* Supabase Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiDatabase} className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Supabase Cloud</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon 
                    icon={status.supabase ? FiCheck : FiX} 
                    className={`h-4 w-4 ${status.supabase ? 'text-green-500' : 'text-red-500'}`} 
                  />
                  <span className={`text-xs font-medium ${
                    status.supabase ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {status.supabase ? 'Verbunden' : 'Offline'}
                  </span>
                </div>
              </div>

              {/* LocalStorage Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiHardDrive} className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Local Storage</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon 
                    icon={FiCheck} 
                    className="h-4 w-4 text-green-500" 
                  />
                  <span className="text-xs font-medium text-green-600">
                    Aktiv
                  </span>
                </div>
              </div>

              {/* Sync Status */}
              {status.supabase && (
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Synchronisation</span>
                    <button
                      onClick={handleSync}
                      disabled={isSyncing || status.syncInProgress}
                      className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 disabled:opacity-50"
                    >
                      <SafeIcon 
                        icon={FiRefreshCw} 
                        className={`h-3 w-3 ${(isSyncing || status.syncInProgress) ? 'animate-spin' : ''}`} 
                      />
                      <span>{(isSyncing || status.syncInProgress) ? 'Syncing...' : 'Sync'}</span>
                    </button>
                  </div>
                  
                  {status.lastSync && (
                    <p className="text-xs text-gray-500">
                      Letzte Sync: {new Date(status.lastSync).toLocaleString('de-DE')}
                    </p>
                  )}
                </div>
              )}

              {/* Info Text */}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  {status.supabase 
                    ? 'Daten werden in der Cloud gespeichert und automatisch synchronisiert.'
                    : 'Daten werden lokal gespeichert. Cloud-Sync nicht verfügbar.'
                  }
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatus;