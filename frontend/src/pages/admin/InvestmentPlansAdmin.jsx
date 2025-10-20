import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { useInvestmentPlans } from '../../hooks/useInvestmentPlans';
import InvestmentPlansList from '../../components/InvestmentPlans/InvestmentPlansList';
import InvestmentPlanForm from '../../components/Admin/InvestmentPlanForm';
import Modal from '../../components/common/Modal';
import { PlusIcon } from '@heroicons/react/24/outline';

const InvestmentPlansAdmin = () => {
  const { isAdmin } = useAuth();
  const { create, update, delete: deletePlan } = useInvestmentPlans();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Redirect if not admin
  if (!isAdmin()) {
    navigate('/unauthorized');
    return null;
  }

  const handleCreatePlan = async (planData) => {
    try {
      setIsSubmitting(true);
      await create(planData);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating plan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePlan = async (id, planData) => {
    try {
      setIsSubmitting(true);
      await update(id, planData);
      setSelectedPlan(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error updating plan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (plan) => {
    setPlanToDelete(plan);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!planToDelete) return;
    
    try {
      setIsSubmitting(true);
      await deletePlan(planToDelete.id);
      setIsDeleteModalOpen(false);
      setPlanToDelete(null);
    } catch (error) {
      console.error('Error deleting plan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (plan) => {
    setSelectedPlan(plan);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (selectedPlan) {
      return handleUpdatePlan(selectedPlan.id, data);
    }
    return handleCreatePlan(data);
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Gestion des plans d'investissement
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4
          ">
            <button
              type="button"
              onClick={() => {
                setSelectedPlan(null);
                setIsFormOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Nouveau plan
            </button>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <InvestmentPlansList 
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </div>
        </div>
      </div>

      {/* Create/Edit Plan Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedPlan(null);
        }}
        title={selectedPlan ? 'Modifier le plan' : 'Nouveau plan d\'investissement'}
      >
        <InvestmentPlanForm
          plan={selectedPlan}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedPlan(null);
          }}
          loading={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmer la suppression"
      >
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Supprimer le plan
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Êtes-vous sûr de vouloir supprimer le plan <span className="font-medium">{planToDelete?.name}</span> ? Cette action est irréversible.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={confirmDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Suppression...' : 'Supprimer'}
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={isSubmitting}
          >
            Annuler
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default InvestmentPlansAdmin;
