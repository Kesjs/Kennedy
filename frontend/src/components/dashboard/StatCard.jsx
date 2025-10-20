import React from 'react';
import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';

const StatCard = ({ title, value, icon: Icon, color = 'blue', change }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600'
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {typeof value === 'number' 
              ? value.toLocaleString('fr-FR', { 
                  style: 'currency', 
                  currency: 'XOF',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }) 
              : value}
          </p>
          {change !== undefined && (
            <div className={`mt-1 flex items-center text-sm ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change >= 0 ? (
                <FiArrowUpRight className="mr-1" />
              ) : (
                <FiArrowDownRight className="mr-1" />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;