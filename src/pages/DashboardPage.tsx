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
  const user = useAuthStore((state) => state.user);

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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back!
        </h1>
        <p className="text-gray-600">
          Track your favorite cryptocurrencies and set price alerts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 bg-indigo-600">
              <h2 className="text-xl font-semibold text-white">Live Prices</h2>
            </div>
            <PriceDisplay prices={prices} loading={loading} />
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 bg-indigo-600">
              <h2 className="text-xl font-semibold text-white">Create Alert</h2>
            </div>
            <div className="p-6">
              <AlertForm onSubmit={handleCreateAlert} supportedCryptos={supportedCryptos} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 bg-indigo-600">
              <h2 className="text-xl font-semibold text-white">Your Alerts</h2>
            </div>
            <div className="p-6">
              <AlertList alerts={alerts} onDelete={handleDeleteAlert} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}