import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { AlertForm } from './components/AlertForm';
import { AlertList } from './components/AlertList';
import { PriceDisplay } from './components/PriceDisplay';
import { CryptoAlert, CryptoPrice } from './types';
import { Coins } from 'lucide-react';
import { fetchCryptoPrices } from './services/api';

const SUPPORTED_CRYPTOS = ['BTC', 'ETH', 'BNB', 'SOL', 'ADA'];
const UPDATE_INTERVAL = 30000; // 30 seconds

function App() {
  const [alerts, setAlerts] = useState<CryptoAlert[]>([]);
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial prices and set up polling
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const newPrices = await fetchCryptoPrices(SUPPORTED_CRYPTOS);
        setPrices(newPrices);
      } catch (error) {
        toast.error('Failed to fetch crypto prices');
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Check alerts
  useEffect(() => {
    alerts.forEach((alert) => {
      const currentPrice = prices.find((p) => p.symbol === alert.symbol);
      if (!currentPrice) return;

      const condition =
        alert.condition === 'above'
          ? currentPrice.price >= alert.targetPrice
          : currentPrice.price <= alert.targetPrice;

      if (condition) {
        toast.success(
          `${alert.symbol} price is now ${
            alert.condition === 'above' ? 'above' : 'below'
          } $${alert.targetPrice.toLocaleString()}!`,
          {
            duration: 5000,
          }
        );
        setAlerts((current) => current.filter((a) => a.id !== alert.id));
      }
    });
  }, [prices, alerts]);

  const handleCreateAlert = (
    symbol: string,
    targetPrice: number,
    condition: 'above' | 'below'
  ) => {
    if (!SUPPORTED_CRYPTOS.includes(symbol)) {
      toast.error(`${symbol} is not supported. Please choose from: ${SUPPORTED_CRYPTOS.join(', ')}`);
      return;
    }

    const newAlert: CryptoAlert = {
      id: Math.random().toString(36).substr(2, 9),
      symbol,
      targetPrice,
      condition,
      created: new Date(),
    };
    setAlerts((current) => [...current, newAlert]);
    toast.success('Price alert created successfully!');
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts((current) => current.filter((alert) => alert.id !== id));
    toast.success('Alert removed successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <Coins className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Crypto Alert</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PriceDisplay prices={prices} loading={loading} />
            <div className="mt-8">
              <AlertList alerts={alerts} onDelete={handleDeleteAlert} />
            </div>
          </div>
          <div>
            <AlertForm onSubmit={handleCreateAlert} supportedCryptos={SUPPORTED_CRYPTOS} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;