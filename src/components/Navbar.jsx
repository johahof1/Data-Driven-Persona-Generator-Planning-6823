import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiUsers, FiPlusCircle, FiBookOpen, FiLogIn, FiDatabase, FiHardDrive } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import UserMenu from './UserMenu';

const Navbar = ({ user, onSignIn, onSignOut, useSupabase }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: FiHome },
    { path: '/generator', label: 'Generator', icon: FiPlusCircle },
    { path: '/personas', label: 'Personas', icon: FiUsers },
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <SafeIcon icon={FiBookOpen} className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-800">PersonaGen</span>
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === item.path
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <SafeIcon icon={item.icon} className="mr-1" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {/* Storage indicator */}
            <div className="flex items-center px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
              <SafeIcon 
                icon={useSupabase ? FiDatabase : FiHardDrive} 
                className={`mr-1 h-3 w-3 ${useSupabase ? 'text-green-600' : 'text-blue-600'}`} 
              />
              {useSupabase ? 'Cloud' : 'Lokal'}
            </div>

            <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
              Datenstand: 07/2025
            </span>

            {user ? (
              <UserMenu user={user} onSignOut={onSignOut} />
            ) : (
              <button
                onClick={onSignIn}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <SafeIcon icon={FiLogIn} className="mr-2 -ml-1 h-4 w-4" />
                Anmelden
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1 px-2">
          <div className="flex justify-around">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === item.path
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <SafeIcon 
                  icon={item.icon} 
                  className={`h-6 w-6 ${
                    location.pathname === item.path ? 'text-indigo-600' : 'text-gray-500'
                  }`} 
                />
                <span className="mt-1">{item.label}</span>
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="h-1 w-6 bg-indigo-500 rounded-full mt-1"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile auth section */}
          <div className="border-t border-gray-200 pt-4 pb-3">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center space-x-2">
                <SafeIcon 
                  icon={useSupabase ? FiDatabase : FiHardDrive} 
                  className={`h-4 w-4 ${useSupabase ? 'text-green-600' : 'text-blue-600'}`} 
                />
                <span className="text-sm text-gray-700">
                  {useSupabase ? 'Cloud-Speicher' : 'Lokaler Speicher'}
                </span>
              </div>
              
              {user ? (
                <UserMenu user={user} onSignOut={onSignOut} />
              ) : (
                <button
                  onClick={onSignIn}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <SafeIcon icon={FiLogIn} className="mr-1 h-4 w-4" />
                  Anmelden
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;