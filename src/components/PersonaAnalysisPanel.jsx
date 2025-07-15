import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBarChart, FiInfo, FiTrendingUp, FiTarget, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import PersonaAnalytics from '../lib/personaAnalytics';

const PersonaAnalysisPanel = ({ persona }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState({});

  const analysisReport = PersonaAnalytics.generateAnalysisReport(persona);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const tabs = [
    { id: 'overview', label: 'Übersicht', icon: FiBarChart },
    { id: 'demographics', label: 'Demografie', icon: FiTrendingUp },
    { id: 'behavior', label: 'Verhalten', icon: FiTarget },
    { id: 'methodology', label: 'Methodik', icon: FiInfo }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <SafeIcon icon={tab.icon} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Persona-Analyse Übersicht
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Statistische Genauigkeit</h4>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {formatPercentage(analysisReport.confidenceScore)}
                </div>
                <p className="text-sm text-blue-700">
                  Basierend auf deutschen Statistiken und demografischen Korrelationen
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Demografische Wahrscheinlichkeit</h4>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {formatPercentage(analysisReport.probabilityBreakdown.demographicMatch.combined)}
                </div>
                <p className="text-sm text-green-700">
                  Wahrscheinlichkeit dieser Merkmalskombination
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-3">Datenquellen</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                {analysisReport.dataSourcesUsed.map((source, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                    {source}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {activeTab === 'demographics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Demografische Analyse
            </h3>

            {/* Alter */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection('age')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="font-medium">Alter: {persona.age} Jahre ({persona.ageGroupLabel})</span>
                </div>
                <SafeIcon 
                  icon={expandedSections.age ? FiChevronUp : FiChevronDown} 
                  className="text-gray-500" 
                />
              </button>
              
              {expandedSections.age && (
                <div className="mt-2 p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Auswahlmethode: </span>
                      <span className="text-gray-600">
                        {analysisReport.demographicAnalysis.demographicBase.age.method}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Altersbereich: </span>
                      <span className="text-gray-600">
                        {analysisReport.demographicAnalysis.demographicBase.age.constraints.min} - {analysisReport.demographicAnalysis.demographicBase.age.constraints.max} Jahre
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Kontext: </span>
                      <span className="text-gray-600">
                        {analysisReport.demographicAnalysis.demographicBase.age.constraints.context}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Bevölkerungsanteil: </span>
                      <span className="text-gray-600">
                        {formatPercentage(analysisReport.probabilityBreakdown.demographicMatch.age)} der deutschen Bevölkerung
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Einkommen */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection('income')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="font-medium">
                    Einkommen: {formatCurrency(persona.annualIncome)} ({persona.incomeQuintileLabel})
                  </span>
                </div>
                <SafeIcon 
                  icon={expandedSections.income ? FiChevronUp : FiChevronDown} 
                  className="text-gray-500" 
                />
              </button>
              
              {expandedSections.income && (
                <div className="mt-2 p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Auswahlmethode: </span>
                      <span className="text-gray-600">
                        {analysisReport.demographicAnalysis.demographicBase.income.method}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Einkommensbereich: </span>
                      <span className="text-gray-600">
                        {formatCurrency(analysisReport.demographicAnalysis.demographicBase.income.range.min)} - {formatCurrency(analysisReport.demographicAnalysis.demographicBase.income.range.max)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Soziale Auswirkungen: </span>
                      <div className="text-gray-600 mt-1">
                        <div><strong>Lebensstil:</strong> {analysisReport.demographicAnalysis.demographicBase.income.socialImplications.lifestyle}</div>
                        <div><strong>Herausforderungen:</strong> {analysisReport.demographicAnalysis.demographicBase.income.socialImplications.challenges}</div>
                        <div><strong>Prioritäten:</strong> {analysisReport.demographicAnalysis.demographicBase.income.socialImplications.priorities}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Beruf */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection('job')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-purple-500 rounded-full mr-3"></div>
                  <span className="font-medium">Beruf: {persona.jobTitle}</span>
                </div>
                <SafeIcon 
                  icon={expandedSections.job ? FiChevronUp : FiChevronDown} 
                  className="text-gray-500" 
                />
              </button>
              
              {expandedSections.job && (
                <div className="mt-2 p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Auswahlmethode: </span>
                      <span className="text-gray-600">
                        {analysisReport.demographicAnalysis.derivedAttributes.jobTitle.method}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Einflussfaktoren: </span>
                      <ul className="text-gray-600 mt-1">
                        {analysisReport.demographicAnalysis.derivedAttributes.jobTitle.factors.map((factor, index) => (
                          <li key={index} className="ml-4">• {factor}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Logik: </span>
                      <span className="text-gray-600">
                        {analysisReport.demographicAnalysis.derivedAttributes.jobTitle.logic.example}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'behavior' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Verhaltensanalyse
            </h3>

            {/* Ausgabenmuster */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection('spending')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="font-medium">Ausgabenmuster</span>
                </div>
                <SafeIcon 
                  icon={expandedSections.spending ? FiChevronUp : FiChevronDown} 
                  className="text-gray-500" 
                />
              </button>
              
              {expandedSections.spending && (
                <div className="mt-2 p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium text-gray-700">Berechnungsmethode: </span>
                      <div className="text-gray-600 mt-1">
                        {analysisReport.spendingAnalysis.explanation.map((explanation, index) => (
                          <div key={index}>• {explanation}</div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Ausgabenkategorien</h5>
                        <div className="space-y-1 text-sm">
                          {Object.entries(persona.spendingHabits).map(([category, percentage]) => {
                            const labels = {
                              housing: 'Wohnen',
                              food: 'Lebensmittel',
                              transport: 'Verkehr',
                              leisure: 'Freizeit',
                              health: 'Gesundheit',
                              communication: 'Kommunikation',
                              clothing: 'Kleidung',
                              other: 'Sonstiges'
                            };
                            return (
                              <div key={category} className="flex justify-between">
                                <span className="text-gray-600">{labels[category] || category}:</span>
                                <span className="font-medium">{formatPercentage(percentage)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Monatliche Ausgaben</h5>
                        <div className="space-y-1 text-sm">
                          {Object.entries(persona.spendingHabits).map(([category, percentage]) => {
                            const monthlyIncome = persona.annualIncome / 12 * 0.65; // Netto-Schätzung
                            const amount = monthlyIncome * percentage;
                            const labels = {
                              housing: 'Wohnen',
                              food: 'Lebensmittel',
                              transport: 'Verkehr',
                              leisure: 'Freizeit',
                              health: 'Gesundheit',
                              communication: 'Kommunikation',
                              clothing: 'Kleidung',
                              other: 'Sonstiges'
                            };
                            return (
                              <div key={category} className="flex justify-between">
                                <span className="text-gray-600">{labels[category] || category}:</span>
                                <span className="font-medium">{formatCurrency(amount)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Konsumgüter */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection('goods')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="font-medium">Konsumgüterbesitz</span>
                </div>
                <SafeIcon 
                  icon={expandedSections.goods ? FiChevronUp : FiChevronDown} 
                  className="text-gray-500" 
                />
              </button>
              
              {expandedSections.goods && (
                <div className="mt-2 p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium text-gray-700">Berechnungsmethode: </span>
                      <span className="text-gray-600">
                        {analysisReport.demographicAnalysis.derivedAttributes.consumerGoods.method}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Einflussfaktoren: </span>
                      <div className="text-gray-600 mt-1">
                        <div>• {analysisReport.demographicAnalysis.derivedAttributes.consumerGoods.factors.householdInfluence}</div>
                        <div>• {analysisReport.demographicAnalysis.derivedAttributes.consumerGoods.factors.incomeInfluence}</div>
                        <div>• {analysisReport.demographicAnalysis.derivedAttributes.consumerGoods.factors.housingInfluence}</div>
                        <div>• {analysisReport.demographicAnalysis.derivedAttributes.consumerGoods.factors.ageInfluence}</div>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Beispiel-Berechnung: </span>
                      <div className="text-gray-600 mt-1">
                        {analysisReport.demographicAnalysis.derivedAttributes.consumerGoods.factors.calculations.map((calc, index) => (
                          <div key={index}>• {calc}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'methodology' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Methodologie & Datenqualität
            </h3>

            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Datenqualität</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPercentage(analysisReport.probabilityBreakdown.statisticalAccuracy.dataSourceQuality)}
                    </div>
                    <div className="text-sm text-blue-700">Datenquellen-Qualität</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPercentage(analysisReport.probabilityBreakdown.statisticalAccuracy.sampleSize)}
                    </div>
                    <div className="text-sm text-blue-700">Stichprobengröße</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPercentage(analysisReport.probabilityBreakdown.statisticalAccuracy.methodology)}
                    </div>
                    <div className="text-sm text-blue-700">Methodologie</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3">Generierungsprozess</h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="h-6 w-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">1</div>
                    <div>
                      <div className="font-medium text-gray-700">Demografische Basis-Auswahl</div>
                      <div className="text-sm text-gray-600">Gewichtete Zufallsauswahl basierend auf deutschen Bevölkerungsstatistiken</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="h-6 w-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">2</div>
                    <div>
                      <div className="font-medium text-gray-700">Korrelationsbasierte Ableitung</div>
                      <div className="text-sm text-gray-600">Beruf, Einkommen und Wohnsituation basierend auf statistischen Zusammenhängen</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="h-6 w-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">3</div>
                    <div>
                      <div className="font-medium text-gray-700">Verhaltensmodellierung</div>
                      <div className="text-sm text-gray-600">Ausgabenmuster und Konsumgüterbesitz basierend auf demografischen Faktoren</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="h-6 w-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">4</div>
                    <div>
                      <div className="font-medium text-gray-700">Psychografische Ergänzung</div>
                      <div className="text-sm text-gray-600">Ziele, Motivationen und Schmerzpunkte abgeleitet aus demografischen Merkmalen</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Limitationen</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Personas basieren auf statistischen Durchschnittswerten</li>
                  <li>• Individuelle Abweichungen sind möglich und normal</li>
                  <li>• Psychografische Merkmale sind Schätzungen basierend auf demografischen Daten</li>
                  <li>• Regionale Unterschiede innerhalb Deutschlands sind vereinfacht</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PersonaAnalysisPanel;