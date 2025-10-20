import React from 'react';
import { useInvestmentPlans } from '../../hooks/useInvestmentPlans';
import { formatCurrency } from '../../utils/format';

const InvestmentPlansList = ({ onEdit, onDelete }) => {
  const { plans, loading, error } = useInvestmentPlans();

  if (loading) return <div>Chargement des plans d'investissement...</div>;
  if (error) return <div className="text-red-500">Erreur: {error}</div>;
  if (!plans.length) return <div>Aucun plan d'investissement disponible.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div key={plan.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {plan.is_active ? 'Actif' : 'Inactif'}
              </span>
            </div>
            
            <div className="mt-4">
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(plan.min_amount)}
                {plan.max_amount ? ` - ${formatCurrency(plan.max_amount)}` : '+'}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Retour: {plan.return_percentage}% sur {plan.duration_days} jours
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Retour total: {plan.total_return}%
              </p>
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-gray-700">Avantages:</h4>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                {plan.features?.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {(onEdit || onDelete) && (
              <div className="mt-6 flex space-x-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(plan)}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Modifier
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(plan)}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvestmentPlansList;
