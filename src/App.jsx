import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import Generator from './pages/Generator';
import PersonaDetails from './pages/PersonaDetails';
import PersonaLibrary from './pages/PersonaLibrary';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [personas, setPersonas] = useState([]);
  
  const addPersona = (persona) => {
    setPersonas(prev => [...prev, persona]);
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-6"
        >
          <Routes>
            <Route path="/" element={<Dashboard personas={personas} />} />
            <Route path="/generator" element={<Generator addPersona={addPersona} />} />
            <Route path="/personas" element={<PersonaLibrary personas={personas} />} />
            <Route path="/persona/:id" element={<PersonaDetails personas={personas} />} />
          </Routes>
        </motion.div>
      </div>
    </HashRouter>
  );
}

export default App;