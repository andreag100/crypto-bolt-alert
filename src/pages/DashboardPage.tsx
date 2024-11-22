import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AlertForm } from '../components/AlertForm';
import { AlertList } from '../components/AlertList';
import { PriceDisplay } from '../components/PriceDisplay';
import { useCryptoPrices } from '../hooks/useCryptoPrices';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { CryptoAlert } from '../types';

export function DashboardPage() {
  const { prices, loading, error, supportedCryptos } = useCryptoPrices();
  const [alerts, setAlerts] = useState<CryptoAlert[]>([]);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      loadAlerts();
    }
  }, [user]);

  useEffect(() => {
    if (prices.length > 0 && alerts.length > 0) {
      checkAlerts();
    }
  }, [prices, alerts]);

  const loadAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
      toast.error('Failed to load alerts');
    }
  };

  const checkAlerts = () => {
    alerts.forEach((alert) => {
      const price = prices.find((p) => p.symbol === alert.symbol);
      if (!price) return;

      const condition = alert.condition === 'above' 
        ? price.price >= alert.targetPrice 
        : price.price <= alert.targetPrice;

      if (condition) {
        toast(`${alert.symbol} price ${alert.condition} ${alert.targetPrice}!`, {
          duration: 0,
        });
      }
    });
  };

  const handleCreateAlert = async (
    symbol: string,
    targetPrice: number,
    condition: 'above' | 'below'
  ) => {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .insert([
          {
            user_id: user?.id,
            symbol,
            target_price: targetPrice,
            condition,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      
      setAlerts([...alerts, data]);
      toast.success('Alert created successfully');
    } catch (error) {
      console.error('Error creating alert:', error);
      toast.error('Failed to create alert');
    }
  };

  const handleDeleteAlert = async (id: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAlerts(alerts.filter((alert) => alert.id !== id));
      toast.success('Alert deleted successfully');
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast.error('Failed to delete alert');
    }
  };

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PriceDisplay prices={prices} loading={loading} />
      
      <div className="grid md:grid-cols-2 gap-8">
        <AlertForm
          onSubmit={handleCreateAlert}
          supportedCryptos={supportedCryptos}
        />
        <AlertList alerts={alerts} onDelete={handleDeleteAlert} />
      </div>
    </div>
  );
}