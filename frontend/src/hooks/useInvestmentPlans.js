import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

export function useInvestmentPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('investment_plans')
        .select('*')
        .order('min_amount', { ascending: true });
      if (error) throw error;
      setPlans(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
    const channel = supabase
      .channel('investment_plans_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'investment_plans' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPlans(prev => [...prev, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setPlans(prev => prev.map(plan => (plan.id === payload.new.id ? payload.new : plan)));
          } else if (payload.eventType === 'DELETE') {
            setPlans(prev => prev.filter(plan => plan.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const create = async (planData) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('investment_plans')
        .insert(planData)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id, updates) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('investment_plans')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('investment_plans')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    plans,
    loading,
    error,
    create,
    update,
    delete: remove,
    refresh: fetchPlans
  };
}
