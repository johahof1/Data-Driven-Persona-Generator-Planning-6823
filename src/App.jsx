import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';

import Dashboard from './pages/Dashboard';
import Generator from './pages/Generator';
import PersonaDetails from './pages/PersonaDetails';
import PersonaLibrary from './pages/PersonaLibrary';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import supabaseStorage from './lib/supabaseStorage';
import PersonaStorage from './lib/storage';
import './App.css';

function App() {
  const [personas, setPersonas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [useSupabase, setUseSupabase] = useState(false);

  // Check authentication status on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (supabaseStorage.checkAvailability()) {
          const currentUser = await supabaseStorage.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setUseSupabase(true);
          }
        }
      } catch (error) {
        console.log('No user authenticated or Supabase not available, using local storage');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Load personas when authentication status changes
  useEffect(() => {
    const loadPersonas = async () => {
      if (isLoading) return;

      try {
        let loadedPersonas = [];
        if (useSupabase && user && supabaseStorage.checkAvailability()) {
          // Load from Supabase
          loadedPersonas = await supabaseStorage.loadPersonas();
        } else {
          // Load from local storage
          loadedPersonas = PersonaStorage.loadPersonas();
        }
        setPersonas(loadedPersonas);
      } catch (error) {
        console.error('Error loading personas:', error);
        // Fallback to local storage
        const localPersonas = PersonaStorage.loadPersonas();
        setPersonas(localPersonas);
      }
    };

    loadPersonas();
  }, [user, useSupabase, isLoading]);

  // Auto-save personas when they change
  useEffect(() => {
    if (isLoading) return;

    const savePersonas = async () => {
      try {
        if (useSupabase && user && supabaseStorage.checkAvailability()) {
          // Save to Supabase
          await supabaseStorage.savePersonas(personas);
        } else {
          // Save to local storage
          PersonaStorage.savePersonas(personas);
        }
      } catch (error) {
        console.error('Error saving personas:', error);
        // Fallback to local storage
        PersonaStorage.savePersonas(personas);
      }
    };

    if (personas.length >= 0) {
      savePersonas();
    }
  }, [personas, user, useSupabase, isLoading]);

  const handleAuthSuccess = async () => {
    try {
      if (!supabaseStorage.checkAvailability()) {
        throw new Error('Supabase not available');
      }

      const currentUser = await supabaseStorage.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setUseSupabase(true);

        // Migrate local personas to Supabase if any exist
        const localPersonas = PersonaStorage.loadPersonas();
        if (localPersonas.length > 0) {
          await supabaseStorage.savePersonas(localPersonas);
          // Clear local storage after successful migration
          PersonaStorage.clearAll();
        }

        // Reload personas from Supabase
        const supabasePersonas = await supabaseStorage.loadPersonas();
        setPersonas(supabasePersonas);
      }
    } catch (error) {
      console.error('Error during auth success:', error);
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setUseSupabase(false);
    setPersonas([]);
    // Load local personas after sign out
    const localPersonas = PersonaStorage.loadPersonas();
    setPersonas(localPersonas);
  };

  const addPersona = async (persona) => {
    const newPersona = {
      ...persona,
      id: persona.id || crypto.randomUUID(),
      createdAt: persona.createdAt || new Date().toISOString()
    };

    setPersonas(prev => {
      const newPersonas = [...prev, newPersona];
      return newPersonas;
    });
  };

  const deletePersona = async (personaId) => {
    try {
      if (useSupabase && user && supabaseStorage.checkAvailability()) {
        await supabaseStorage.deletePersona(personaId);
      }

      setPersonas(prev => {
        const newPersonas = prev.filter(p => p.id !== personaId);
        return newPersonas;
      });
    } catch (error) {
      console.error('Error deleting persona:', error);
      // Still update local state even if Supabase fails
      setPersonas(prev => prev.filter(p => p.id !== personaId));
    }
  };

  const updatePersona = async (updatedPersona) => {
    try {
      if (useSupabase && user && supabaseStorage.checkAvailability()) {
        await supabaseStorage.updatePersona(updatedPersona);
      }

      setPersonas(prev => {
        const newPersonas = prev.map(p => 
          p.id === updatedPersona.id ? updatedPersona : p
        );
        return newPersonas;
      });
    } catch (error) {
      console.error('Error updating persona:', error);
      // Still update local state even if Supabase fails
      setPersonas(prev => 
        prev.map(p => p.id === updatedPersona.id ? updatedPersona : p)
      );
    }
  };

  const clearAllPersonas = async () => {
    try {
      if (useSupabase && user && supabaseStorage.checkAvailability()) {
        await supabaseStorage.clearAllPersonas();
      } else {
        PersonaStorage.clearAll();
      }
      setPersonas([]);
    } catch (error) {
      console.error('Error clearing personas:', error);
      // Still clear local state even if Supabase fails
      setPersonas([]);
    }
  };

  const handleImportPersonas = async (importedPersonas) => {
    try {
      const personasToAdd = importedPersonas.map(persona => ({
        ...persona,
        id: crypto.randomUUID(), // Generate new IDs
        createdAt: new Date().toISOString()
      }));

      if (useSupabase && user && supabaseStorage.checkAvailability()) {
        await supabaseStorage.savePersonas(personasToAdd);
      }

      setPersonas(prev => [...prev, ...personasToAdd]);
    } catch (error) {
      console.error('Error importing personas:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Persona-Daten werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar
          user={user}
          onSignIn={() => setShowAuthModal(true)}
          onSignOut={handleSignOut}
          useSupabase={useSupabase}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-6"
        >
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  personas={personas}
                  clearAllPersonas={clearAllPersonas}
                  onImport={handleImportPersonas}
                  user={user}
                  useSupabase={useSupabase}
                />
              }
            />
            <Route
              path="/generator"
              element={<Generator addPersona={addPersona} />}
            />
            <Route
              path="/personas"
              element={
                <PersonaLibrary
                  personas={personas}
                  deletePersona={deletePersona}
                  updatePersona={updatePersona}
                />
              }
            />
            <Route
              path="/persona/:id"
              element={
                <PersonaDetails
                  personas={personas}
                  updatePersona={updatePersona}
                  deletePersona={deletePersona}
                />
              }
            />
          </Routes>
        </motion.div>

        {/* Only show auth modal if Supabase is available */}
        {supabaseStorage.checkAvailability() && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuthSuccess}
          />
        )}
      </div>
    </HashRouter>
  );
}

export default App;