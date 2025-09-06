import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiWifi, FiWifiOff, FiRefreshCw, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const NetworkPingTest = () => {
  const [pingResults, setPingResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  const endpoints = [
    {
      name: 'Destatis API',
      url: 'https://www-genesis.destatis.de',
      description: 'Hauptdomain der Destatis Genesis API'
    },
    {
      name: 'Destatis API Endpoint',
      url: 'https://www-genesis.destatis.de/genesisWS/rest/2020/helloworld/whoami',
      description: 'Authentifizierungs-Endpoint'
    },
    {
      name: 'Google DNS',
      url: 'https://dns.google',
      description: 'Test der allgemeinen Internetverbindung'
    },
    {
      name: 'Cloudflare',
      url: 'https://cloudflare.com',
      description: 'Alternativer Konnektivitätstest'
    }
  ];

  const pingEndpoint = async (endpoint) => {
    const startTime = performance.now();
    try {
      // Verwende fetch mit AbortController für Timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(endpoint.url, {
        method: 'HEAD', // Nur Header, keine Daten
        mode: 'no-cors', // Umgeht CORS für einfachen Konnektivitätstest
        signal: controller.signal,
        cache: 'no-cache'
      });

      clearTimeout(timeoutId);
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);

      return {
        success: true,
        responseTime,
        status: 'Erreichbar',
        error: null
      };

    } catch (error) {
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);

      let errorMessage = 'Unbekannter Fehler';
      let status = 'Fehler';

      if (error.name === 'AbortError') {
        errorMessage = 'Timeout (mehr als 10s)';
        status = 'Timeout';
      } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        errorMessage = 'Netzwerkfehler - Server nicht erreichbar';
        status = 'Nicht erreichbar';
      } else {
        errorMessage = error.message;
      }

      return {
        success: false,
        responseTime,
        status,
        error: errorMessage
      };
    }
  };

  const runPingTests = async () => {
    setIsRunning(true);
    setPingResults({});

    console.log('🏓 Starte Ping-Tests für Destatis API Konnektivität...');

    for (const endpoint of endpoints) {
      console.log(`📡 Teste: ${endpoint.name} (${endpoint.url})`);

      // Zeige "läuft" Status
      setPingResults(prev => ({
        ...prev,
        [endpoint.name]: {
          status: 'Läuft...',
          success: null
        }
      }));

      const result = await pingEndpoint(endpoint);

      console.log(`${result.success ? '✅' : '❌'} ${endpoint.name}: ${result.status} (${result.responseTime}ms)`);

      setPingResults(prev => ({
        ...prev,
        [endpoint.name]: result
      }));

      // Kurze Pause zwischen Tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
    console.log('🏁 Ping-Tests abgeschlossen');
  };

  const getStatusIcon = (result) => {
    if (!result) return FiWifi;
    if (result.status === 'Läuft...') return FiRefreshCw;
    if (result.success) return FiCheck;
    if (result.status === 'Timeout') return FiAlertCircle;
    return FiX;
  };

  const getStatusColor = (result) => {
    if (!result) return 'text-gray-500';
    if (result.status === 'Läuft...') return 'text-blue-500';
    if (result.success) return 'text-green-500';
    if (result.status === 'Timeout') return 'text-yellow-500';
    return 'text-red-500';
  };

  const getOverallStatus = () => {
    const results = Object.values(pingResults);
    if (results.length === 0) return null;

    const destatisPing = pingResults['Destatis API'];
    const internetPing = pingResults['Google DNS'] || pingResults['Cloudflare'];

    if (!destatisPing?.success && !internetPing?.success) {
      return {
        status: 'Keine Internetverbindung',
        color: 'text-red-600',
        bg: 'bg-red-50',
        icon: FiWifiOff,
        advice: 'Prüfen Sie Ihre Internetverbindung und Firewall-Einstellungen.'
      };
    }

    if (!destatisPing?.success && internetPing?.success) {
      return {
        status: 'Destatis API nicht erreichbar',
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        icon: FiAlertCircle,
        advice: 'Internet funktioniert, aber Destatis API ist blockiert oder nicht verfügbar. Möglicherweise Firewall oder VPN-Problem.'
      };
    }

    if (destatisPing?.success) {
      return {
        status: 'Destatis API erreichbar',
        color: 'text-green-600',
        bg: 'bg-green-50',
        icon: FiCheck,
        advice: 'Netzwerkverbindung zur Destatis API funktioniert. Authentifizierungsprobleme sind wahrscheinlich API-Token-bezogen.'
      };
    }

    return null;
  };

  const overallStatus = getOverallStatus();

  // Helper function to safely get connection info
  const getConnectionType = () => {
    try {
      return navigator.connection?.effectiveType || 'Unbekannt';
    } catch (error) {
      return 'Unbekannt';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Netzwerk-Konnektivitätstest
        </h2>
        <button
          onClick={runPingTests}
          disabled={isRunning}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <SafeIcon icon={isRunning ? FiRefreshCw : FiWifi} className={`mr-2 h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? 'Teste Verbindungen...' : 'Ping-Test starten'}
        </button>
      </div>

      {/* Gesamtstatus */}
      {overallStatus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg mb-6 ${overallStatus.bg}`}
        >
          <div className="flex items-center">
            <SafeIcon icon={overallStatus.icon} className={`mr-3 h-5 w-5 ${overallStatus.color}`} />
            <div>
              <h3 className={`font-medium ${overallStatus.color}`}>
                {overallStatus.status}
              </h3>
              <p className={`text-sm ${overallStatus.color} mt-1`}>
                {overallStatus.advice}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Ping-Ergebnisse */}
      <div className="space-y-3">
        {endpoints.map((endpoint) => {
          const result = pingResults[endpoint.name];
          return (
            <motion.div
              key={endpoint.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center flex-1">
                <SafeIcon
                  icon={getStatusIcon(result)}
                  className={`mr-3 h-5 w-5 ${getStatusColor(result)} ${result?.status === 'Läuft...' ? 'animate-spin' : ''}`}
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{endpoint.name}</h4>
                  <p className="text-sm text-gray-600">{endpoint.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{endpoint.url}</p>
                </div>
              </div>
              <div className="text-right">
                {result && (
                  <>
                    <div className={`font-medium text-sm ${getStatusColor(result)}`}>
                      {result.status}
                    </div>
                    {result.responseTime && (
                      <div className="text-xs text-gray-500">
                        {result.responseTime}ms
                      </div>
                    )}
                    {result.error && (
                      <div className="text-xs text-red-600 mt-1 max-w-48">
                        {result.error}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Diagnose-Hilfen */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Diagnose-Hilfen</h3>
        <div className="text-sm text-blue-700 space-y-2">
          <div>
            <strong>Alle Tests fehlschlagen:</strong>
            <ul className="ml-4 mt-1 list-disc">
              <li>Internetverbindung prüfen</li>
              <li>Firewall-Einstellungen kontrollieren</li>
              <li>VPN deaktivieren und erneut testen</li>
            </ul>
          </div>
          <div>
            <strong>Nur Destatis API fehlschlägt:</strong>
            <ul className="ml-4 mt-1 list-disc">
              <li>Corporate Firewall blockiert möglicherweise die Domain</li>
              <li>DNS-Probleme mit destatis.de</li>
              <li>Temporäre Wartungsarbeiten bei Destatis</li>
            </ul>
          </div>
          <div>
            <strong>Lange Antwortzeiten (über 5000ms):</strong>
            <ul className="ml-4 mt-1 list-disc">
              <li>Langsame Internetverbindung</li>
              <li>Server-Überlastung</li>
              <li>Routing-Probleme</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Browser-Informationen */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-2">Browser & Umgebung</h3>
        <div className="text-sm text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>User Agent: {navigator.userAgent.split(' ').slice(0, 3).join(' ')}...</div>
          <div>Online: {navigator.onLine ? 'Ja' : 'Nein'}</div>
          <div>Verbindung: {getConnectionType()}</div>
          <div>Protokoll: {location.protocol}</div>
        </div>
      </div>
    </div>
  );
};

export default NetworkPingTest;