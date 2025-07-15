import React from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiHome, FiDollarSign, FiMapPin, FiBriefcase, FiSave } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const PersonaCard = ({ persona, onSave }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('de-DE', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <div className="absolute bottom-0 transform translate-y-1/2 left-6">
          <div className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
            <img 
              src={persona.avatar} 
              alt={`${persona.firstName} ${persona.lastName}`}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
      
      <div className="pt-16 p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            {persona.firstName} {persona.lastName}
          </h3>
          <div className="flex items-center mt-1 text-gray-600">
            <SafeIcon icon={FiBriefcase} className="mr-2 text-gray-400" />
            <span>{persona.jobTitle}</span>
          </div>
          <div className="flex items-center mt-1 text-gray-600">
            <SafeIcon icon={FiMapPin} className="mr-2 text-gray-400" />
            <span>{persona.location}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
              <SafeIcon icon={FiUser} className="mr-1 text-gray-400" />
              <span>Profil</span>
            </div>
            <div className="text-gray-800">
              <div>{persona.age} Jahre</div>
              <div>{persona.gender === 'male' ? 'Männlich' : 'Weiblich'}</div>
              <div>{persona.householdTypeLabel}</div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
              <SafeIcon icon={FiDollarSign} className="mr-1 text-gray-400" />
              <span>Einkommen</span>
            </div>
            <div className="text-gray-800">
              <div>{formatCurrency(persona.annualIncome)}/Jahr</div>
              <div>{persona.incomeQuintileLabel}</div>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
            <SafeIcon icon={FiHome} className="mr-1 text-gray-400" />
            <span>Wohnsituation</span>
          </div>
          <div className="text-gray-800">
            <div>{persona.housingTypeLabel}</div>
            <div>Haushaltsgröße: {persona.householdSize} {persona.householdSize === 1 ? 'Person' : 'Personen'}</div>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-1">Motivationen</h4>
          <div className="flex flex-wrap gap-2">
            {persona.motivations.slice(0, 3).map((motivation, index) => (
              <span 
                key={index}
                className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
              >
                {motivation}
              </span>
            ))}
          </div>
        </div>
        
        <button
          onClick={() => onSave(persona)}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <SafeIcon icon={FiSave} className="mr-2 -ml-1" />
          Persona speichern
        </button>
      </div>
    </motion.div>
  );
};

export default PersonaCard;