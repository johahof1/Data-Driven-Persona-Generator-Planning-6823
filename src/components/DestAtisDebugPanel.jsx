import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiDownload, FiRefreshCw, FiCheck, FiX, FiAlertTriangle, FiInfo } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import DestAtisDebugger from '../lib/destatis-debug';

const DestAtisDebugPanel = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [currentTest, setCurrentTest] = useState('');

  const runDiagnostic = async () => {
    setIsRunning(true);
    setResults(null);
    setCurrentTest('Starte Diagnose...');

    try {
      // Run step by step for better UX
      setCurrentTest('Teste Konnektivität...');
      await new Promise(resolve => setTimeout(resolve, 500));

      setCurrentTest('Teste Authentifizierung...');
      await new Promise(resolve => setTimeout(resolve, 500));

      setCurrentTest('Teste Datenabfrage...');
      await new Promise(resolve => setTimeout(resolve, 500));

      setCurrentTest('Führe vollständige Diagnose durch...');
      const diagnosticResults = await DestAtisDebugger.runFullDiagnostic();
      
      setResults(diagnosticResults);
      setCurrentTest('Diagnose abgeschlossen');
    } catch (error) {
      console.error('Diagnostic failed:', error);
      setResults({
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsRunning(false);
    }
  };

  const exportResults = () => {
    if (!results) return;

    const report = DestAtisDebugger.getFormattedReport(results);
    const dataBlob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `destatis-diagnostic-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportDebugLog = () => {
    DestAtisDebugger.exportDebugLog();
  };

  const getTestStatus = (testResult) => {
    if (!testResult) return 'pending';
    if (testResult.error) return 'error';
    if (testResult.success) return 'success';
    return 'warning';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return FiCheck;
      case 'error': return FiX;
      case 'warning': return FiAlertTriangle;
      default: return FiInfo;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'success': return 'bg-green-50';
      case 'error': return 'bg-red-50';
      case 'warning': return 'bg-yellow-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Destatis API Debug Panel
        </h2>
        <div className="flex space-x-2">
          {results && (
            <>
              <button
                onClick={exportResults}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <SafeIcon icon={FiDownload} className="mr-2 h-4 w-4" />
                Report exportieren
              </button>
              <button
                onClick={exportDebugLog}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <SafeIcon icon={FiDownload} className="mr-2 h-4 w-4" />
                Debug Log
              </button>
            </>
          )}
          <button
            onClick={runDiagnostic}
            disabled={isRunning}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <SafeIcon 
              icon={isRunning ? FiRefreshCw : FiPlay} 
              className={`mr-2 h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} 
            />
            {isRunning ? 'Läuft...' : 'Volldiagnose starten'}
          </button>
        </div>
      </div>

      {/* Current Test Status */}
      {isRunning && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 p-4 rounded-lg mb-6"
        >
          <div className="flex items-center">
            <SafeIcon icon={FiRefreshCw} className="mr-3 h-5 w-5 text-blue-600 animate-spin" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Diagnose läuft</h3>
              <p className="text-sm text-blue-700">{currentTest}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* API Key Status */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Konfigurationsstatus</h3>
        <div className="flex items-center">
          <SafeIcon 
            icon={import.meta.env.VITE_DESTATIS_API_KEY ? FiCheck : FiX} 
            className={`mr-2 h-4 w-4 ${import.meta.env.VITE_DESTATIS_API_KEY ? 'text-green-600' : 'text-red-600'}`} 
          />
          <span className="text-sm">
            API Token: {import.meta.env.VITE_DESTATIS_API_KEY ? 
              `Konfiguriert (${import.meta.env.VITE_DESTATIS_API_KEY.substring(0, 8)}...)` : 
              'Nicht konfiguriert'
            }
          </span>
        </div>
      </div>

      {/* Results */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-medium text-gray-700 mb-4">Testergebnisse</h3>
          
          {results.error ? (
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center">
                <SafeIcon icon={FiX} className="mr-2 h-5 w-5 text-red-600" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">Diagnose fehlgeschlagen</h4>
                  <p className="text-sm text-red-700">{results.error}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Test Summary */}
              {results.tests && Object.entries(results.tests).map(([testName, testResult]) => {
                const status = getTestStatus(testResult);
                const StatusIcon = getStatusIcon(status);
                
                return (
                  <div key={testName} className={`p-4 rounded-lg ${getStatusBg(status)}`}>
                    <div className="flex items-start">
                      <SafeIcon 
                        icon={StatusIcon} 
                        className={`mr-3 h-5 w-5 mt-0.5 ${getStatusColor(status)}`} 
                      />
                      <div className="flex-1">
                        <h4 className={`font-medium ${getStatusColor(status)}`}>
                          {testName.charAt(0).toUpperCase() + testName.slice(1)}
                        </h4>
                        
                        {Array.isArray(testResult) ? (
                          <div className="mt-2 space-y-1">
                            {testResult.map((result, index) => (
                              <div key={index} className="text-sm">
                                <span className="font-medium">{result.endpoint}:</span>
                                <span className={`ml-2 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                                  {result.success ? '✅ Erfolgreich' : '❌ Fehlgeschlagen'}
                                </span>
                                {result.status && (
                                  <span className="ml-2 text-gray-600">({result.status})</span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-2 text-sm">
                            {testResult.success ? (
                              <span className="text-green-700">✅ Test erfolgreich</span>
                            ) : (
                              <span className="text-red-700">❌ Test fehlgeschlagen</span>
                            )}
                            {testResult.status && (
                              <div className="mt-1">
                                <span className="font-medium">Status:</span> {testResult.status} {testResult.statusText}
                              </div>
                            )}
                            {testResult.error && (
                              <div className="mt-1">
                                <span className="font-medium">Fehler:</span> {testResult.error}
                              </div>
                            )}
                            {testResult.bodyPreview && (
                              <div className="mt-1">
                                <span className="font-medium">Response Preview:</span>
                                <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                                  {testResult.bodyPreview}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Raw Server Response Details */}
              {results.tests?.dataRequest && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Server Response Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Status:</span> {results.tests.dataRequest.status} {results.tests.dataRequest.statusText}
                    </div>
                    <div>
                      <span className="font-medium">Response Type:</span> {results.tests.dataRequest.responseType}
                    </div>
                    <div>
                      <span className="font-medium">Body Length:</span> {results.tests.dataRequest.bodyLength} bytes
                    </div>
                    {results.tests.dataRequest.headers && (
                      <div>
                        <span className="font-medium">Headers:</span>
                        <pre className="mt-1 text-xs bg-white p-2 rounded border overflow-x-auto">
                          {JSON.stringify(results.tests.dataRequest.headers, null, 2)}
                        </pre>
                      </div>
                    )}
                    {results.tests.dataRequest.body && (
                      <div>
                        <span className="font-medium">Response Body (first 1000 chars):</span>
                        <pre className="mt-1 text-xs bg-white p-2 rounded border overflow-x-auto max-h-40">
                          {results.tests.dataRequest.body.substring(0, 1000)}
                          {results.tests.dataRequest.body.length > 1000 && '... [truncated]'}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Diagnose-Hilfe</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>Diese Diagnose zeigt Ihnen:</strong></p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Ob die Destatis API erreichbar ist</li>
            <li>Ob Ihr API-Token gültig ist</li>
            <li>Welche Antworten der Server sendet</li>
            <li>Ob spezifische Tabellen verfügbar sind</li>
            <li>Details zu Fehlermeldungen</li>
          </ul>
          <p className="mt-2"><strong>Bei Problemen:</strong> Exportieren Sie den Report und senden Sie ihn zur Analyse.</p>
        </div>
      </div>
    </div>
  );
};

export default DestAtisDebugPanel;