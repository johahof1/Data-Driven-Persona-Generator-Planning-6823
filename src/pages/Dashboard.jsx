import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiUsers, FiPlus, FiBarChart, FiBookOpen, FiTarget, FiDatabase } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import ReactECharts from 'echarts-for-react';
import DataSourceInfo from '../components/DataSourceInfo';
import dataIntegration from '../lib/dataIntegration';

const Dashboard = ({ personas }) => {
  const [dataStatus, setDataStatus] = useState({ isLoaded: false, isLoading: false, error: null });
  
  useEffect(() => {
    // Prüfe den Datenstatus beim Laden der Komponente
    setDataStatus(dataIntegration.getDataSourceStatus());
  }, []);

  const handleLoadRealData = async () => {
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
  };

  const getDemographicData = () => {
    const ageGroups = {
      'young_adults': 0,
      'adults': 0,
      'middle_age': 0,
      'senior': 0,
      'elderly': 0,
    };
    const genders = {
      'male': 0,
      'female': 0,
    };
    const incomeGroups = {
      'lowest': 0,
      'lower_middle': 0,
      'middle': 0,
      'upper_middle': 0,
      'highest': 0,
    };

    personas.forEach(persona => {
      if (ageGroups.hasOwnProperty(persona.ageGroup)) {
        ageGroups[persona.ageGroup]++;
      }
      if (genders.hasOwnProperty(persona.gender)) {
        genders[persona.gender]++;
      }
      if (incomeGroups.hasOwnProperty(persona.incomeQuintile)) {
        incomeGroups[persona.incomeQuintile]++;
      }
    });

    return { ageGroups, genders, incomeGroups };
  };

  const getChartOptions = () => {
    const { ageGroups, genders, incomeGroups } = getDemographicData();

    const ageLabels = {
      'young_adults': '18-25',
      'adults': '26-35',
      'middle_age': '36-50',
      'senior': '51-65',
      'elderly': 'Über 65',
    };

    const incomeLabels = {
      'lowest': 'Unteres Quintil',
      'lower_middle': 'Unteres Mittelquintil',
      'middle': 'Mittleres Quintil',
      'upper_middle': 'Oberes Mittelquintil',
      'highest': 'Oberes Quintil',
    };

    return {
      age: {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          data: Object.keys(ageGroups).map(key => ageLabels[key])
        },
        series: [
          {
            name: 'Altersgruppen',
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
            data: Object.entries(ageGroups).map(([key, value]) => ({
              name: ageLabels[key],
              value
            }))
          }
        ]
      },
      gender: {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          data: ['Männlich', 'Weiblich']
        },
        series: [
          {
            name: 'Geschlechterverteilung',
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
            data: [
              { name: 'Männlich', value: genders.male },
              { name: 'Weiblich', value: genders.female }
            ]
          }
        ]
      },
      income: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: Object.keys(incomeGroups).map(key => incomeLabels[key]),
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              rotate: 30,
              fontSize: 10
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Personen',
            type: 'bar',
            barWidth: '60%',
            data: Object.values(incomeGroups),
            itemStyle: {
              color: '#6366f1'
            }
          }
        ]
      }
    };
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Persona Generator Dashboard</h1>
        <p className="text-gray-600">
          Erstellen und verwalten Sie realistische Konsumenten-Personas basierend auf deutschen demografischen und wirtschaftlichen Daten.
        </p>
      </div>

      <DataSourceInfo status={dataStatus} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
        >
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <SafeIcon icon={FiUsers} className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Erstellte Personas</p>
              <h3 className="text-2xl font-bold text-gray-800">{personas.length}</h3>
            </div>
          </div>
          <Link to="/personas" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Alle Personas anzeigen →
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
        >
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
              <SafeIcon icon={FiBarChart} className="h-6 w-6 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Datenpunkte</p>
              <h3 className="text-2xl font-bold text-gray-800">1.200+</h3>
            </div>
          </div>
          <button 
            onClick={handleLoadRealData}
            disabled={dataStatus.isLoading}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
          >
            <SafeIcon 
              icon={FiDatabase} 
              className={`mr-1 ${dataStatus.isLoading ? 'animate-pulse' : ''}`} 
            />
            {dataStatus.isLoaded 
              ? 'Echtdaten sind aktiv' 
              : dataStatus.isLoading 
                ? 'Daten werden geladen...' 
                : 'Echtdaten aktivieren'}
          </button>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
        >
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <SafeIcon icon={FiTarget} className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Neue Persona erstellen</p>
              <h3 className="text-2xl font-bold text-gray-800">Generator</h3>
            </div>
          </div>
          <Link to="/generator" className="text-green-600 hover:text-green-800 text-sm font-medium">
            Zum Persona-Generator →
          </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">So funktioniert der Persona-Generator</h2>
          <div className="space-y-4">
            <div className="flex">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-blue-600 font-medium">1</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Datengrundlage</h3>
                <p className="text-gray-600 text-sm">
                  Basierend auf Daten des statistischen Bundesamts (EU-SILC, Wirtschaftsrechnungen, Verbraucherpreisindex)
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-indigo-600 font-medium">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Demografische Profile</h3>
                <p className="text-gray-600 text-sm">
                  Realistische Verteilung von Alter, Geschlecht, Einkommen, Haushaltszusammensetzung und Wohnsituation
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-purple-600 font-medium">3</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Konsumverhalten und Besitz</h3>
                <p className="text-gray-600 text-sm">
                  Korrekte Verteilung von Konsumgüterbesitz und Ausgabenmustern entsprechend der demografischen Merkmale
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-green-600 font-medium">4</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Psychografisches Profil</h3>
                <p className="text-gray-600 text-sm">
                  Ziele, Motivationen und Schmerzpunkte abgeleitet aus demografischen und wirtschaftlichen Faktoren
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Verwendungszwecke</h2>
          <div className="space-y-4">
            <div className="flex">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                <SafeIcon icon={FiTarget} className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Zielgruppenanalyse</h3>
                <p className="text-gray-600 text-sm">
                  Verstehen Sie Ihre potenziellen Kunden besser und optimieren Sie Ihre Marketingstrategien
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 flex-shrink-0">
                <SafeIcon icon={FiBookOpen} className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">User Experience Design</h3>
                <p className="text-gray-600 text-sm">
                  Gestalten Sie Produkte und Dienste, die den Bedürfnissen Ihrer Zielgruppe entsprechen
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                <SafeIcon icon={FiBarChart} className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Marktsegmentierung</h3>
                <p className="text-gray-600 text-sm">
                  Identifizieren Sie unterschiedliche Kundensegmente und deren spezifische Bedürfnisse
                </p>
              </div>
            </div>
            <Link
              to="/generator"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <SafeIcon icon={FiPlus} className="mr-2 -ml-1 h-5 w-5" />
              Persona erstellen
            </Link>
          </div>
        </div>
      </div>

      {personas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Demografische Übersicht Ihrer Personas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-3 text-center">Altersverteilung</h3>
              <ReactECharts option={getChartOptions().age} style={{ height: '300px' }} />
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-3 text-center">Geschlechterverteilung</h3>
              <ReactECharts option={getChartOptions().gender} style={{ height: '300px' }} />
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-3 text-center">Einkommensverteilung</h3>
              <ReactECharts option={getChartOptions().income} style={{ height: '300px' }} />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;