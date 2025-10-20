import React from 'react';
import { FiArrowUpRight, FiArrowDownRight, FiDownload, FiUpload, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { formatCurrency } from '../../utils/format';

const TransactionItem = ({ transaction }) => {
  const { type, amount, created_at, status } = transaction;
  
  const typeLabels = {
    deposit: 'Dépôt',
    withdrawal: 'Retrait',
    profit: 'Gain',
    investment: 'Investissement'
  };

  // Définition des types de transactions et de leurs propriétés
  const transactionTypes = {
    deposit: { 
      isPositive: true, 
      color: 'blue',
      icon: FiDownload,
      label: 'Dépôt'
    },
    withdrawal: { 
      isPositive: false, 
      color: 'red',
      icon: FiUpload,
      label: 'Retrait'
    },
    profit: { 
      isPositive: true, 
      color: 'green',
      icon: FiDollarSign,
      label: 'Gain'
    },
    investment: { 
      isPositive: false, 
      color: 'purple',
      icon: FiTrendingUp,
      label: 'Investissement'
    }
  };

  // Récupération des propriétés du type de transaction
  const txType = transactionTypes[type] || { isPositive: false, color: 'gray', icon: FiDollarSign, label: type };
  
  const isPositive = txType.isPositive;
  const amountColor = isPositive ? 'text-green-600' : 'text-red-600';
  const amountSign = isPositive ? '+' : '-';
  const Icon = txType.icon;

  // Formater la date de manière sécurisée
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date invalide';
      
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Date invalide';
    }
  };

  const isDateInvalid = !created_at || formatDate(created_at) === 'Date invalide';
  
  return (
    <div className="flex items-center justify-between p-4 rounded-lg transition-colors bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/80 border border-gray-100 dark:border-gray-700/50">
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-lg ${
          txType.color === 'green' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
          txType.color === 'red' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
          txType.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
          txType.color === 'purple' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
          'bg-gray-50 dark:bg-gray-700/30 text-gray-600 dark:text-gray-400'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100 text-base">{txType.label}</p>
          <p className={`text-sm mt-0.5 ${isDateInvalid ? 'text-gray-400 dark:text-gray-500 italic' : 'text-gray-500 dark:text-gray-400'}`}>
            {isDateInvalid ? 'Date inconnue' : formatDate(created_at)}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end ml-4">
        <p className={`font-semibold text-base ${amountColor} whitespace-nowrap`}>
          {amountSign} {formatCurrency(Math.abs(amount), 'EUR')}
        </p>
        <span className={`inline-flex items-center justify-center min-w-[80px] px-3 py-1 rounded-full text-xs font-medium mt-1.5 ${
          status === 'completed' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' 
            : status === 'pending' 
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
              : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
        }`}>
          {status === 'completed' ? 'Terminé' : status === 'pending' ? 'En attente' : 'Échoué'}
        </span>
      </div>
    </div>
  );
};

export default TransactionItem;
