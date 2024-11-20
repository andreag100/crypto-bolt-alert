import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { AlertForm } from './components/AlertForm';
import { AlertList } from './components/AlertList';
import { PriceDisplay } from './components/PriceDisplay';
import { CryptoAlert, CryptoPrice } from './types';
import { Coins } from 'lucide-react';

// Simulated initial price data
const initialPrices: CryptoPrice[] = [
  { symbol: 'BTC', price: 42000, change24h: 2.5 },
  { symbol: 'ETH', price: 2800, change24h: -1.2 },
  { symbol: 'BNB', price: 380, change24h: 0.8 },
];

function App() {
  const [alerts, setAlerts] = useState<CryptoAlert[]>([]);
  const [prices, setPrices] = useState<CryptoPrice[]>(initialPrices);

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((currentPrices) =>
        currentPrices.map((crypto) => ({
          ...crypto,
          price: crypto.price * (1 + (Math.random() - 0.5) * 0.002),
          change24h: crypto.change24h + (Math.random() - 0.5),
        }))
      );
    }, 5000);

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
            <PriceDisplay prices={prices} />
            <div className="mt-8">
              <AlertList alerts={alerts} onDelete={handleDeleteAlert} />
            </div>
          </div>
          <div>
            <AlertForm onSubmit={handleCreateAlert} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;