import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiBriefcase, FiHome, FiUsers, FiMapPin, FiSave, FiEye, FiRefreshCw, FiAlertCircle, FiCheck } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import PersonaCard from './PersonaCard';
import { generatePersonaFromConfig } from '../lib/personaConfigurator';

const PersonaConfigurator = ({ onSave, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Grunddaten
    firstName: '',
    lastName: '',
    gender: '',
    age: '',
    
    // Berufliche Situation
    jobTitle: '',
    industry: '',
    employmentType: '',
    
    // Haushalt & Familie
    maritalStatus: '',
    numberOfChildren: '',
    householdSize: '',
    
    // Wohnsituation
    location: '',
    housingType: '',
    roomCount: '',
    isUrban: true,
    
    // Optionale Präferenzen
    lifestyle: '',
    priorities: []
  });
  
  const [generatedPersona, setGeneratedPersona] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const steps = [
    {
      id: 'basic',
      title: 'Grunddaten',
      icon: FiUser,
      description: 'Name, Geschlecht und Alter'
    },
    {
      id: 'professional',
      title: 'Berufliches',
      icon: FiBriefcase,
      description: 'Beruf und Beschäftigung'
    },
    {
      id: 'household',
      title: 'Haushalt',
      icon: FiUsers,
      description: 'Familie und Zusammenleben'
    },
    {
      id: 'housing',
      title: 'Wohnen',
      icon: FiHome,
      description: 'Wohnort und Wohnsituation'
    },
    {
      id: 'preview',
      title: 'Vorschau',
      icon: FiEye,
      description: 'Persona generieren und prüfen'
    }
  ];

  const germanCities = [
    { name: 'Berlin', isUrban: true, population: 3700000 },
    { name: 'Hamburg', isUrban: true, population: 1900000 },
    { name: 'München', isUrban: true, population: 1500000 },
    { name: 'Köln', isUrban: true, population: 1100000 },
    { name: 'Frankfurt am Main', isUrban: true, population: 750000 },
    { name: 'Stuttgart', isUrban: true, population: 630000 },
    { name: 'Düsseldorf', isUrban: true, population: 620000 },
    { name: 'Leipzig', isUrban: true, population: 600000 },
    { name: 'Dortmund', isUrban: true, population: 590000 },
    { name: 'Essen', isUrban: true, population: 580000 },
    { name: 'Hannover', isUrban: true, population: 530000 },
    { name: 'Bremen', isUrban: true, population: 570000 },
    { name: 'Dresden', isUrban: true, population: 560000 },
    { name: 'Nürnberg', isUrban: true, population: 520000 },
    { name: 'Duisburg', isUrban: true, population: 500000 },
    { name: 'Bochum', isUrban: false, population: 360000 },
    { name: 'Wuppertal', isUrban: false, population: 350000 },
    { name: 'Bielefeld', isUrban: false, population: 330000 },
    { name: 'Bonn', isUrban: false, population: 320000 },
    { name: 'Münster', isUrban: false, population: 310000 }
  ];

  const industries = [
    'Automobil',
    'Maschinenbau',
    'IT & Software',
    'Gesundheitswesen',
    'Bildung',
    'Einzelhandel',
    'Finanzdienstleistungen',
    'Beratung',
    'Medien & Kommunikation',
    'Tourismus & Gastronomie',
    'Logistik & Transport',
    'Energie & Umwelt',
    'Chemie & Pharma',
    'Bauwesen',
    'Öffentlicher Dienst',
    'Sonstige'
  ];

  const jobTitles = {
    'IT & Software': [
      'Software-Entwickler/in',
      'IT-Projektleiter/in',
      'System-Administrator/in',
      'UX/UI Designer/in',
      'Data Scientist',
      'IT-Berater/in'
    ],
    'Gesundheitswesen': [
      'Arzt/Ärztin',
      'Krankenpfleger/in',
      'Physiotherapeut/in',
      'Apotheker/in',
      'Medizinische/r Fachangestellte/r'
    ],
    'Bildung': [
      'Lehrer/in',
      'Professor/in',
      'Erzieher/in',
      'Ausbilder/in',
      'Bildungsberater/in'
    ],
    'Einzelhandel': [
      'Verkäufer/in',
      'Filialleiter/in',
      'Einzelhandelskaufmann/frau',
      'Visual Merchandiser/in'
    ],
    'Finanzdienstleistungen': [
      'Bankkaufmann/frau',
      'Versicherungskaufmann/frau',
      'Finanzberater/in',
      'Steuerberater/in',
      'Wirtschaftsprüfer/in'
    ],
    'default': [
      'Angestellte/r',
      'Sachbearbeiter/in',
      'Teamleiter/in',
      'Geschäftsführer/in',
      'Selbstständige/r'
    ]
  };

  const validateStep = (step) => {
    const errors = {};
    
    switch (step) {
      case 0: // Grunddaten
        if (!formData.firstName.trim()) errors.firstName = 'Vorname ist erforderlich';
        if (!formData.lastName.trim()) errors.lastName = 'Nachname ist erforderlich';
        if (!formData.gender) errors.gender = 'Geschlecht ist erforderlich';
        if (!formData.age || formData.age < 18 || formData.age > 100) {
          errors.age = 'Alter muss zwischen 18 und 100 Jahren liegen';
        }
        break;
        
      case 1: // Berufliches
        if (!formData.jobTitle) errors.jobTitle = 'Beruf ist erforderlich';
        if (!formData.employmentType) errors.employmentType = 'Beschäftigungsverhältnis ist erforderlich';
        break;
        
      case 2: // Haushalt
        if (!formData.maritalStatus) errors.maritalStatus = 'Familienstand ist erforderlich';
        if (!formData.householdSize || formData.householdSize < 1) {
          errors.householdSize = 'Haushaltsgröße ist erforderlich';
        }
        break;
        
      case 3: // Wohnen
        if (!formData.location) errors.location = 'Wohnort ist erforderlich';
        if (!formData.housingType) errors.housingType = 'Wohnform ist erforderlich';
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
    
    // Auto-update dependent fields
    if (field === 'location') {
      const city = germanCities.find(c => c.name === value);
      if (city) {
        setFormData(prev => ({
          ...prev,
          isUrban: city.isUrban
        }));
      }
    }
    
    if (field === 'maritalStatus' || field === 'numberOfChildren') {
      updateHouseholdSize();
    }
  };

  const updateHouseholdSize = () => {
    setTimeout(() => {
      const children = parseInt(formData.numberOfChildren) || 0;
      let size = 1; // Person selbst
      
      if (formData.maritalStatus === 'married' || formData.maritalStatus === 'partnership') {
        size += 1; // Partner
      }
      size += children;
      
      setFormData(prev => ({
        ...prev,
        householdSize: size.toString()
      }));
    }, 100);
  };

  const generatePersona = async () => {
    setIsGenerating(true);
    try {
      const persona = await generatePersonaFromConfig(formData);
      setGeneratedPersona(persona);
    } catch (error) {
      console.error('Error generating persona:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === steps.length - 2) {
        // Last step before preview - generate persona
        generatePersona();
      }
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSave = () => {
    if (generatedPersona) {
      onSave(generatedPersona);
      onClose();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Grunddaten
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vorname *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    validationErrors.firstName ? 'border-red-500' : ''
                  }`}
                  placeholder="Max"
                />
                {validationErrors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nachname *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    validationErrors.lastName ? 'border-red-500' : ''
                  }`}
                  placeholder="Mustermann"
                />
                {validationErrors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Geschlecht *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    validationErrors.gender ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Bitte wählen</option>
                  <option value="male">Männlich</option>
                  <option value="female">Weiblich</option>
                </select>
                {validationErrors.gender && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.gender}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alter *
                </label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    validationErrors.age ? 'border-red-500' : ''
                  }`}
                  placeholder="30"
                />
                {validationErrors.age && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.age}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 1: // Berufliches
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branche
              </label>
              <select
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Bitte wählen</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beruf/Position *
              </label>
              <select
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  validationErrors.jobTitle ? 'border-red-500' : ''
                }`}
              >
                <option value="">Bitte wählen</option>
                {(jobTitles[formData.industry] || jobTitles.default).map(job => (
                  <option key={job} value={job}>{job}</option>
                ))}
              </select>
              {validationErrors.jobTitle && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.jobTitle}</p>
              )}
              
              {/* Custom job input */}
              <div className="mt-2">
                <input
                  type="text"
                  value={formData.jobTitle.startsWith('custom:') ? formData.jobTitle.slice(7) : ''}
                  onChange={(e) => handleInputChange('jobTitle', `custom:${e.target.value}`)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Oder eigenen Beruf eingeben..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beschäftigungsverhältnis *
              </label>
              <select
                value={formData.employmentType}
                onChange={(e) => handleInputChange('employmentType', e.target.value)}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  validationErrors.employmentType ? 'border-red-500' : ''
                }`}
              >
                <option value="">Bitte wählen</option>
                <option value="fulltime">Vollzeit angestellt</option>
                <option value="parttime">Teilzeit angestellt</option>
                <option value="freelance">Selbstständig/Freiberufler</option>
                <option value="student">Student/in</option>
                <option value="retired">Rentner/in</option>
                <option value="unemployed">Arbeitslos</option>
                <option value="parental_leave">Elternzeit</option>
              </select>
              {validationErrors.employmentType && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.employmentType}</p>
              )}
            </div>
          </div>
        );

      case 2: // Haushalt
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Familienstand *
              </label>
              <select
                value={formData.maritalStatus}
                onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  validationErrors.maritalStatus ? 'border-red-500' : ''
                }`}
              >
                <option value="">Bitte wählen</option>
                <option value="single">Ledig</option>
                <option value="married">Verheiratet</option>
                <option value="partnership">Lebenspartnerschaft</option>
                <option value="divorced">Geschieden</option>
                <option value="widowed">Verwitwet</option>
              </select>
              {validationErrors.maritalStatus && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.maritalStatus}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anzahl Kinder
                </label>
                <select
                  value={formData.numberOfChildren}
                  onChange={(e) => handleInputChange('numberOfChildren', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4 oder mehr</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Haushaltsgröße *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.householdSize}
                  onChange={(e) => handleInputChange('householdSize', e.target.value)}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    validationErrors.householdSize ? 'border-red-500' : ''
                  }`}
                  placeholder="Wird automatisch berechnet"
                />
                {validationErrors.householdSize && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.householdSize}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Anzahl Personen im Haushalt (wird automatisch basierend auf Familienstand und Kindern berechnet)
                </p>
              </div>
            </div>
          </div>
        );

      case 3: // Wohnen
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wohnort *
              </label>
              <select
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  validationErrors.location ? 'border-red-500' : ''
                }`}
              >
                <option value="">Bitte wählen</option>
                {germanCities.map(city => (
                  <option key={city.name} value={city.name}>
                    {city.name} ({city.isUrban ? 'städtisch' : 'ländlich'})
                  </option>
                ))}
              </select>
              {validationErrors.location && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.location}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wohnform *
                </label>
                <select
                  value={formData.housingType}
                  onChange={(e) => handleInputChange('housingType', e.target.value)}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    validationErrors.housingType ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Bitte wählen</option>
                  <option value="owner">Eigentum (Haus/Wohnung)</option>
                  <option value="renter">Miete</option>
                </select>
                {validationErrors.housingType && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.housingType}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zimmerzahl
                </label>
                <select
                  value={formData.roomCount}
                  onChange={(e) => handleInputChange('roomCount', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Bitte wählen</option>
                  <option value="1">1 Zimmer</option>
                  <option value="2">2 Zimmer</option>
                  <option value="3">3 Zimmer</option>
                  <option value="4">4 Zimmer</option>
                  <option value="5">5+ Zimmer</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lifestyle-Präferenzen (optional)
              </label>
              <select
                value={formData.lifestyle}
                onChange={(e) => handleInputChange('lifestyle', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Keine Angabe</option>
                <option value="minimalist">Minimalistisch</option>
                <option value="luxury">Luxusorientiert</option>
                <option value="sustainable">Nachhaltig</option>
                <option value="tech-savvy">Technikaffin</option>
                <option value="traditional">Traditionell</option>
                <option value="adventurous">Abenteuerlustig</option>
              </select>
            </div>
          </div>
        );

      case 4: // Vorschau
        return (
          <div className="space-y-6">
            {isGenerating ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Persona wird generiert...</p>
                <p className="text-sm text-gray-500 mt-2">
                  Einkommen und Verhalten werden basierend auf den eingegebenen Daten berechnet
                </p>
              </div>
            ) : generatedPersona ? (
              <div>
                <div className="bg-green-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center">
                    <SafeIcon icon={FiCheck} className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-green-800">Persona erfolgreich generiert</h3>
                      <p className="text-sm text-green-700">
                        Einkommen wurde auf {new Intl.NumberFormat('de-DE', { 
                          style: 'currency', 
                          currency: 'EUR', 
                          maximumFractionDigits: 0 
                        }).format(generatedPersona.annualIncome)} geschätzt
                      </p>
                    </div>
                  </div>
                </div>
                
                <PersonaCard
                  persona={generatedPersona}
                  onSave={() => {}}
                  showSaveButton={false}
                />
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Automatisch generierte Daten:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                    <div>
                      <strong>Einkommensschätzung:</strong>
                      <p>Basierend auf Beruf, Alter und Region</p>
                    </div>
                    <div>
                      <strong>Ausgabenmuster:</strong>
                      <p>Typisch für Haushaltstyp und Einkommen</p>
                    </div>
                    <div>
                      <strong>Konsumgüter:</strong>
                      <p>Wahrscheinlichkeitsbasiert</p>
                    </div>
                    <div>
                      <strong>Ziele & Motivationen:</strong>
                      <p>Alters- und situationsspezifisch</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <SafeIcon icon={FiAlertCircle} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Fehler bei der Persona-Generierung</p>
                <button
                  onClick={generatePersona}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <SafeIcon icon={FiRefreshCw} className="mr-2 h-4 w-4" />
                  Erneut versuchen
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Persona-Konfigurator
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="sr-only">Schließen</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="mt-4">
            <nav className="flex space-x-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center ${
                    index < steps.length - 1 ? 'flex-1' : ''
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      index === currentStep
                        ? 'bg-blue-600 text-white'
                        : index < currentStep
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    <SafeIcon icon={step.icon} className="h-4 w-4" />
                  </div>
                  <div className="ml-2 flex-1">
                    <p className={`text-sm font-medium ${
                      index === currentStep ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-px ml-4 ${
                      index < currentStep ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Zurück
            </button>
            
            <div className="flex space-x-3">
              {currentStep === steps.length - 1 ? (
                <button
                  onClick={handleSave}
                  disabled={!generatedPersona}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SafeIcon icon={FiSave} className="mr-2 h-4 w-4" />
                  Persona speichern
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Weiter
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PersonaConfigurator;