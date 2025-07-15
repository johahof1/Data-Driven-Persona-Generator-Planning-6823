import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiUser, FiHome, FiDollarSign, FiMapPin, FiBriefcase, FiTarget, 
  FiHeart, FiAlertTriangle, FiShoppingBag, FiDownload, FiChevronLeft, 
  FiBarChart, FiDatabase, FiCheck 
} from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import ReactECharts from 'echarts-for-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import PersonaAnalysisPanel from '../components/PersonaAnalysisPanel';

const PersonaDetails = ({ personas }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAnalysis, setShowAnalysis] = useState(false);
  const contentRef = useRef(null);

  const persona = personas.find(p => p.id === id);

  if (!persona) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Persona nicht gefunden</h2>
        <button
          onClick={() => navigate('/generator')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <SafeIcon icon={FiChevronLeft} className="mr-2 -ml-1" />
          Zurück zum Generator
        </button>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
  };

  const spendingChartOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}%'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      data: Object.keys(persona.spendingHabits).map(key => {
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
        return labels[key] || key;
      })
    },
    series: [
      {
        name: 'Ausgabenverteilung',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: Object.entries(persona.spendingHabits).map(([key, value]) => {
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
          return {
            name: labels[key] || key,
            value: (value * 100).toFixed(1)
          };
        })
      }
    ]
  };

  const handleExportPDF = async () => {
    if (!contentRef.current) return;

    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Persona_${persona.firstName}_${persona.lastName}.pdf`);
    } catch (error) {
      console.error('Failed to export PDF:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <SafeIcon icon={FiChevronLeft} className="mr-1 -ml-1" />
          Zurück
        </button>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${
              showAnalysis
                ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            <SafeIcon icon={FiBarChart} className="mr-2 -ml-1" />
            {showAnalysis ? 'Analyse ausblenden' : 'Datenanalyse anzeigen'}
          </button>
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <SafeIcon icon={FiDownload} className="mr-2 -ml-1" />
            Als PDF exportieren
          </button>
        </div>
      </div>

      {persona.dataSource === 'real' && (
        <div className="bg-green-50 p-3 rounded-lg mb-4 flex items-center">
          <SafeIcon icon={FiDatabase} className="mr-2 text-green-600" />
          <div>
            <span className="text-green-800 text-sm font-medium">Mit echten Daten generiert</span>
            <span className="text-green-700 text-xs ml-2">Basierend auf aktuellen statistischen Erhebungen</span>
          </div>
          <SafeIcon icon={FiCheck} className="ml-auto text-green-600" />
        </div>
      )}

      {showAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <PersonaAnalysisPanel persona={persona} />
        </motion.div>
      )}

      <div ref={contentRef}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="relative">
            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <div className="absolute bottom-0 transform translate-y-1/2 left-8">
              <div className="h-32 w-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
                <img
                  src={persona.avatar}
                  alt={`${persona.firstName} ${persona.lastName}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="pt-20 p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                {persona.firstName} {persona.lastName}
              </h1>
              <div className="flex items-center mt-2 text-gray-600">
                <SafeIcon icon={FiBriefcase} className="mr-2 text-gray-500" />
                <span className="text-lg">{persona.jobTitle}</span>
              </div>
              <div className="flex items-center mt-1 text-gray-600">
                <SafeIcon icon={FiMapPin} className="mr-2 text-gray-500" />
                <span className="text-lg">{persona.location} ({persona.isUrban ? 'Urban' : 'Ländlich'})</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-center text-lg font-medium text-gray-700 mb-3">
                  <SafeIcon icon={FiUser} className="mr-2 text-blue-500" />
                  <span>Demografisches Profil</span>
                </div>
                <div className="text-gray-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Alter:</span>
                    <span className="font-medium">{persona.age} Jahre</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Geschlecht:</span>
                    <span className="font-medium">{persona.gender === 'male' ? 'Männlich' : 'Weiblich'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Altersgruppe:</span>
                    <span className="font-medium">{persona.ageGroupLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Haushaltstyp:</span>
                    <span className="font-medium">{persona.householdTypeLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Haushaltsgröße:</span>
                    <span className="font-medium">{persona.householdSize} {persona.householdSize === 1 ? 'Person' : 'Personen'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-center text-lg font-medium text-gray-700 mb-3">
                  <SafeIcon icon={FiDollarSign} className="mr-2 text-green-500" />
                  <span>Wirtschaftliches Profil</span>
                </div>
                <div className="text-gray-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jahreseinkommen:</span>
                    <span className="font-medium">{formatCurrency(persona.annualIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Einkommensgruppe:</span>
                    <span className="font-medium">{persona.incomeQuintileLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monatliches Netto:</span>
                    <span className="font-medium">{formatCurrency(persona.annualIncome / 12 * 0.65)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Beruf:</span>
                    <span className="font-medium">{persona.jobTitle}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-center text-lg font-medium text-gray-700 mb-3">
                  <SafeIcon icon={FiHome} className="mr-2 text-purple-500" />
                  <span>Wohnsituation</span>
                </div>
                <div className="text-gray-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wohnform:</span>
                    <span className="font-medium">{persona.housingTypeLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Region:</span>
                    <span className="font-medium">{persona.isUrban ? 'Städtisch' : 'Ländlich'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wohnort:</span>
                    <span className="font-medium">{persona.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wohnausgaben:</span>
                    <span className="font-medium">{(persona.spendingHabits.housing * 100).toFixed(0)}% des Einkommens</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Ausgabenverteilung</h2>
                <ReactECharts option={spendingChartOption} style={{ height: '300px' }} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Besitz von Konsumgütern</h2>
                <div className="bg-gray-50 p-5 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(persona.ownedGoods).map(([goodId, owned]) => {
                      const goodName = {
                        'car': 'Personenkraftwagen',
                        'new_car': 'Neuer PKW',
                        'used_car': 'Gebrauchter PKW',
                        'motorcycle': 'Kraftrad',
                        'bicycle': 'Fahrrad',
                        'smartphone': 'Smartphone',
                        'laptop': 'Laptop/PC',
                        'smart_tv': 'Smart TV'
                      }[goodId] || goodId;

                      return (
                        <div key={goodId} className="flex items-center">
                          <div className={`h-4 w-4 rounded-full mr-2 ${owned ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-gray-800">{goodName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-5 rounded-lg">
                <div className="flex items-center text-lg font-medium text-blue-700 mb-3">
                  <SafeIcon icon={FiTarget} className="mr-2 text-blue-600" />
                  <span>Ziele</span>
                </div>
                <ul className="space-y-2 text-blue-800">
                  {persona.goals.map((goal, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block h-5 w-5 rounded-full bg-blue-100 text-blue-600 mr-2 flex-shrink-0 flex items-center justify-center text-xs">
                        {index + 1}
                      </span>
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 p-5 rounded-lg">
                <div className="flex items-center text-lg font-medium text-red-700 mb-3">
                  <SafeIcon icon={FiAlertTriangle} className="mr-2 text-red-600" />
                  <span>Schmerzpunkte</span>
                </div>
                <ul className="space-y-2 text-red-800">
                  {persona.painPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block h-5 w-5 rounded-full bg-red-100 text-red-600 mr-2 flex-shrink-0 flex items-center justify-center text-xs">
                        {index + 1}
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-purple-50 p-5 rounded-lg">
                <div className="flex items-center text-lg font-medium text-purple-700 mb-3">
                  <SafeIcon icon={FiHeart} className="mr-2 text-purple-600" />
                  <span>Motivationen</span>
                </div>
                <ul className="space-y-2 text-purple-800">
                  {persona.motivations.map((motivation, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block h-5 w-5 rounded-full bg-purple-100 text-purple-600 mr-2 flex-shrink-0 flex items-center justify-center text-xs">
                        {index + 1}
                      </span>
                      {motivation}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                <SafeIcon icon={FiShoppingBag} className="inline-block mr-2 text-gray-700" />
                Kaufverhalten und Präferenzen
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Kaufentscheidungsfaktoren</h3>
                  <div className="space-y-3">
                    {[
                      {
                        factor: 'Preis',
                        value: persona.incomeQuintile === 'lowest' || persona.incomeQuintile === 'lower_middle' ? 90 : persona.incomeQuintile === 'middle' ? 75 : 60
                      },
                      {
                        factor: 'Qualität',
                        value: persona.incomeQuintile === 'highest' || persona.incomeQuintile === 'upper_middle' ? 85 : persona.incomeQuintile === 'middle' ? 70 : 50
                      },
                      {
                        factor: 'Marke',
                        value: persona.incomeQuintile === 'highest' ? 80 : persona.incomeQuintile === 'upper_middle' ? 65 : persona.incomeQuintile === 'middle' ? 50 : 30
                      },
                      {
                        factor: 'Umweltfreundlichkeit',
                        value: (persona.ageGroup === 'young_adults' || persona.ageGroup === 'adults') ? 75 : 55
                      }
                    ].map(item => (
                      <div key={item.factor}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">{item.factor}</span>
                          <span className="text-sm font-medium text-gray-800">{item.value}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${item.value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Einkaufsverhalten</h3>
                  <div className="space-y-2 text-gray-800">
                    <p>
                      <span className="font-medium">Bevorzugte Einkaufskanäle: </span>
                      {persona.ageGroup === 'young_adults' || persona.ageGroup === 'adults'
                        ? 'Online-Shopping und stationärer Handel'
                        : persona.ageGroup === 'elderly'
                        ? 'Vorwiegend stationärer Handel'
                        : 'Ausgewogene Mischung aus Online und stationärem Handel'}
                    </p>
                    <p>
                      <span className="font-medium">Kauffrequenz: </span>
                      {persona.householdSize > 2
                        ? 'Häufige, regelmäßige Einkäufe'
                        : persona.householdSize === 1
                        ? 'Kleinere, aber häufigere Einkäufe'
                        : 'Wöchentliche größere Einkäufe'}
                    </p>
                    <p>
                      <span className="font-medium">Preissensibilität: </span>
                      {persona.incomeQuintile === 'lowest' || persona.incomeQuintile === 'lower_middle'
                        ? 'Hoch - achtet sehr auf Preis und Angebote'
                        : persona.incomeQuintile === 'highest'
                        ? 'Niedrig - Qualität steht im Vordergrund'
                        : 'Mittel - sucht nach gutem Preis-Leistungs-Verhältnis'}
                    </p>
                    <p>
                      <span className="font-medium">Markenaffinität: </span>
                      {persona.incomeQuintile === 'highest' || persona.incomeQuintile === 'upper_middle'
                        ? 'Hoch - bevorzugt bekannte Marken'
                        : persona.incomeQuintile === 'lowest'
                        ? 'Niedrig - Preis wichtiger als Marke'
                        : 'Mittel - Marke wichtig bei bestimmten Produktkategorien'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PersonaDetails;