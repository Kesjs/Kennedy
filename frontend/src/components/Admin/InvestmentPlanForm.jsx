import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const InvestmentPlanForm = ({ plan, onSubmit, onCancel, loading }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      description: '',
      min_amount: '',
      max_amount: '',
      return_percentage: '',
      duration_days: '',
      total_return: '',
      is_active: true,
      features: ''
    }
  });

  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    if (plan) {
      reset({
        ...plan,
        features: ''
      });
      if (plan.features && Array.isArray(plan.features)) {
        setFeatures([...plan.features]);
      }
    }
  }, [plan, reset]);

  const addFeature = (e) => {
    e.preventDefault();
    if (featureInput.trim() && !features.includes(featureInput.trim())) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    const newFeatures = [...features];
    newFeatures.splice(index, 1);
    setFeatures(newFeatures);
  };

  const handleFormSubmit = (data) => {
    const planData = {
      ...data,
      min_amount: parseFloat(data.min_amount),
      max_amount: data.max_amount ? parseFloat(data.max_amount) : null,
      return_percentage: parseFloat(data.return_percentage),
      duration_days: parseInt(data.duration_days, 10),
      total_return: parseFloat(data.total_return),
      is_active: data.is_active === 'true' || data.is_active === true,
      features: features
    };
    
    if (plan) {
      // Update existing plan
      onSubmit(plan.id, planData);
    } else {
      // Create new plan
      onSubmit(planData);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nom du plan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            {...register('name', { required: 'Le nom est requis' })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.name ? 'border-red-500' : ''
            }`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="min_amount" className="block text-sm font-medium text-gray-700">
            Montant minimum (€) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="min_amount"
            step="0.01"
            min="0"
            {...register('min_amount', { 
              required: 'Le montant minimum est requis',
              min: { value: 0, message: 'Le montant doit être positif' }
            })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.min_amount ? 'border-red-500' : ''
            }`}
          />
          {errors.min_amount && <p className="mt-1 text-sm text-red-600">{errors.min_amount.message}</p>}
        </div>

        <div>
          <label htmlFor="max_amount" className="block text-sm font-medium text-gray-700">
            Montant maximum (€) (optionnel)
          </label>
          <input
            type="number"
            id="max_amount"
            step="0.01"
            min="0"
            {...register('max_amount', {
              validate: (value, formValues) => 
                !value || parseFloat(value) > parseFloat(formValues.min_amount) || 
                'Le montant maximum doit être supérieur au montant minimum'
            })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.max_amount ? 'border-red-500' : ''
            }`}
          />
          {errors.max_amount && <p className="mt-1 text-sm text-red-600">{errors.max_amount.message}</p>}
        </div>

        <div>
          <label htmlFor="return_percentage" className="block text-sm font-medium text-gray-700">
            Taux de retour (%) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="return_percentage"
            step="0.01"
            min="0"
            max="100"
            {...register('return_percentage', { 
              required: 'Le taux de retour est requis',
              min: { value: 0, message: 'Le taux doit être positif' },
              max: { value: 100, message: 'Le taux ne peut pas dépasser 100%' }
            })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.return_percentage ? 'border-red-500' : ''
            }`}
          />
          {errors.return_percentage && <p className="mt-1 text-sm text-red-600">{errors.return_percentage.message}</p>}
        </div>

        <div>
          <label htmlFor="duration_days" className="block text-sm font-medium text-gray-700">
            Durée (jours) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="duration_days"
            min="1"
            {...register('duration_days', { 
              required: 'La durée est requise',
              min: { value: 1, message: 'La durée doit être d\'au moins 1 jour' }
            })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.duration_days ? 'border-red-500' : ''
            }`}
          />
          {errors.duration_days && <p className="mt-1 text-sm text-red-600">{errors.duration_days.message}</p>}
        </div>

        <div>
          <label htmlFor="total_return" className="block text-sm font-medium text-gray-700">
            Retour total (%) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="total_return"
            step="0.01"
            min="0"
            {...register('total_return', { 
              required: 'Le retour total est requis',
              min: { value: 0, message: 'Le retour total doit être positif' }
            })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.total_return ? 'border-red-500' : ''
            }`}
          />
          {errors.total_return && <p className="mt-1 text-sm text-red-600">{errors.total_return.message}</p>}
        </div>

        <div>
          <label htmlFor="is_active" className="block text-sm font-medium text-gray-700">
            Statut
          </label>
          <select
            id="is_active"
            {...register('is_active')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value={true}>Actif</option>
            <option value={false}>Inactif</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Avantages
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            placeholder="Ajouter un avantage..."
            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={addFeature}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Ajouter
          </button>
        </div>
        
        {features.length > 0 && (
          <div className="mt-2">
            <div className="flex flex-wrap gap-2">
              {features.map((feature, index) => (
                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                  >
                    <span className="sr-only">Supprimer</span>
                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                      <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <input type="hidden" {...register('features')} value={JSON.stringify(features)} />

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Enregistrement...' : plan ? 'Mettre à jour' : 'Créer le plan'}
        </button>
      </div>
    </form>
  );
};

export default InvestmentPlanForm;
