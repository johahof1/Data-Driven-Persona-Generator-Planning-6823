import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiLogOut, FiSettings, FiChevronDown } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabaseStorage from '../lib/supabaseStorage';

const UserMenu = ({ user, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await supabaseStorage.signOut();
      onSignOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getInitials = (email) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {getInitials(user.email)}
        </div>
        <span className="hidden sm:block">{user.email.split('@')[0]}</span>
        <SafeIcon icon={FiChevronDown} className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
          >
            <div className="py-1">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">Angemeldet als</p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                <SafeIcon icon={FiUser} className="mr-3 h-4 w-4" />
                Profil anzeigen
              </button>
              
              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                <SafeIcon icon={FiSettings} className="mr-3 h-4 w-4" />
                Einstellungen
              </button>
              
              <div className="border-t border-gray-100">
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 hover:text-red-900"
                >
                  <SafeIcon icon={FiLogOut} className="mr-3 h-4 w-4" />
                  Abmelden
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;