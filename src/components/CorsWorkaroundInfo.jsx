import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiInfo, FiExternalLink, FiCode, FiServer } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const CorsWorkaroundInfo = () => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
      <div className="flex items-start">
        <SafeIcon icon={FiAlertTriangle} className="h-6 w-6 text-yellow-600 mr-3 mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">
            CORS-Problem erkannt
          </h3>
          <p className="text-yellow-700 mb-4">
            Ihr cURL-Befehl funktioniert perfekt, aber Browser haben CORS-Einschränkungen. 
            Die Destatis API erlaubt keine direkten Aufrufe von Webanwendungen.
          </p>
          
          <div className="bg-yellow-100 p-4 rounded-md mb-4">
            <h4 className="font-medium text-yellow-800 mb-2">✅ Was funktioniert:</h4>
            <code className="text-sm text-yellow-700 block bg-yellow-200 p-2 rounded">
              curl -X POST "https://www-genesis.destatis.de/genesisWS/rest/2020/data/tablefile" \<br/>
              &nbsp;&nbsp;-H "auth-user: apitoken" \<br/>
              &nbsp;&nbsp;-H "auth-password: 9ce3ff1522b84af5bc2824dc6524b16d" \<br/>
              &nbsp;&nbsp;-d "name=63111-0003&area=all&format=xlsx"
            </code>
          </div>

          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center px-3 py-2 border border-yellow-300 rounded-md text-sm font-medium text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
          >
            <SafeIcon icon={FiInfo} className="mr-2 h-4 w-4" />
            {showDetails ? 'Lösungen ausblenden' : 'Lösungsansätze anzeigen'}
          </button>

          {showDetails && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Lösung 1: Proxy Server */}
                <div className="bg-white p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center mb-2">
                    <SafeIcon icon={FiServer} className="h-5 w-5 text-blue-600 mr-2" />
                    <h5 className="font-medium text-gray-800">Proxy Server</h5>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Eigener Server leitet Anfragen an Destatis weiter
                  </p>
                  <div className="text-xs text-gray-500">
                    <div className="flex items-center text-green-600 mb-1">
                      ✅ Vollständige API-Unterstützung
                    </div>
                    <div className="flex items-center text-green-600 mb-1">
                      ✅ Sichere Authentifizierung
                    </div>
                    <div className="flex items-center text-red-600">
                      ❌ Erfordert eigenen Server
                    </div>
                  </div>
                </div>

                {/* Lösung 2: CORS Proxy */}
                <div className="bg-white p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center mb-2">
                    <SafeIcon icon={FiExternalLink} className="h-5 w-5 text-purple-600 mr-2" />
                    <h5 className="font-medium text-gray-800">CORS Proxy</h5>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Öffentliche Proxy-Dienste umgehen CORS
                  </p>
                  <div className="text-xs text-gray-500">
                    <div className="flex items-center text-green-600 mb-1">
                      ✅ Schnell implementiert
                    </div>
                    <div className="flex items-center text-yellow-600 mb-1">
                      ⚠️ Abhängig von Drittanbietern
                    </div>
                    <div className="flex items-center text-red-600">
                      ❌ Sicherheitsrisiko
                    </div>
                  </div>
                </div>

                {/* Lösung 3: Browser Extension */}
                <div className="bg-white p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center mb-2">
                    <SafeIcon icon={FiCode} className="h-5 w-5 text-green-600 mr-2" />
                    <h5 className="font-medium text-gray-800">Browser Extension</h5>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    CORS temporär deaktivieren für Tests
                  </p>
                  <div className="text-xs text-gray-500">
                    <div className="flex items-center text-green-600 mb-1">
                      ✅ Für Entwicklung/Tests
                    </div>
                    <div className="flex items-center text-yellow-600 mb-1">
                      ⚠️ Nur für Entwickler
                    </div>
                    <div className="flex items-center text-red-600">
                      ❌ Nicht für Produktion
                    </div>
                  </div>
                </div>
              </div>

              {/* Empfohlene Lösung */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h5 className="font-medium text-blue-800 mb-2">💡 Empfohlene Lösung für Ihre Anwendung:</h5>
                <p className="text-sm text-blue-700 mb-3">
                  Da Ihr cURL-Befehl funktioniert, implementieren Sie einen einfachen Node.js Proxy-Server:
                </p>
                <div className="bg-blue-100 p-3 rounded text-xs font-mono text-blue-800">
                  <div>1. Erstellen Sie einen Express.js Server</div>
                  <div>2. Leiten Sie Destatis-Anfragen weiter</div>
                  <div>3. Fügen Sie CORS-Header hinzu</div>
                  <div>4. Deployen Sie auf Vercel/Netlify</div>
                </div>
              </div>

              {/* Temporärer Workaround */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h5 className="font-medium text-gray-800 mb-2">🚀 Schneller Test-Workaround:</h5>
                <p className="text-sm text-gray-600 mb-2">
                  Für sofortige Tests können Sie CORS in Chrome temporär deaktivieren:
                </p>
                <code className="text-xs bg-gray-200 p-2 rounded block">
                  chrome --disable-web-security --disable-features=VizDisplayCompositor --user-data-dir=/tmp/chrome_dev_session
                </code>
                <p className="text-xs text-red-600 mt-2">
                  ⚠️ Nur für Entwicklung verwenden! Niemals für normale Browser-Nutzung!
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CorsWorkaroundInfo;