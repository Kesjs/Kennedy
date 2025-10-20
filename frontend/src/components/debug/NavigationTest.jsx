import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const NavigationTest = () => {
  const location = useLocation();

  const testLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Plans d\'investissement', href: '/dashboard/invest' },
    { name: 'Nouvel investissement', href: '/dashboard/invest/new' },
    { name: 'Mes investissements', href: '/dashboard/invest/list' },
  ];

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">Test de Navigation</h3>
      <p className="mb-4">Route actuelle: <code className="bg-gray-100 px-2 py-1 rounded">{location.pathname}</code></p>
      
      <div className="space-y-2">
        {testLinks.map((link) => (
          <div key={link.href}>
            <NavLink
              to={link.href}
              className={({ isActive }) =>
                `block px-4 py-2 rounded transition-colors ${
                  isActive
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`
              }
            >
              {link.name}
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavigationTest;
