import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Bell, Shield } from 'lucide-react';
import { PriceDisplay } from '../components/PriceDisplay';
import { useCryptoPrices } from '../hooks/useCryptoPrices';

export function HomePage() {
  const { prices, loading } = useCryptoPrices();

  return (
    <div className="space-y-12">
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Track Crypto Prices & Get Alerts
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Stay updated with real-time cryptocurrency prices and receive instant alerts
          when prices hit your targets.
        </p>
        <Link
          to="/login"
          className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700"
        >
          Get Started
        </Link>
      </section>

      <PriceDisplay prices={prices} loading={loading} />

      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <TrendingUp className="w-12 h-12 text-indigo-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">Real-Time Tracking</h3>
          <p className="text-gray-600">
            Monitor cryptocurrency prices in real-time with accurate market data.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <Bell className="w-12 h-12 text-indigo-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">Price Alerts</h3>
          <p className="text-gray-600">
            Set custom price alerts and get notified when your targets are reached.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <Shield className="w-12 h-12 text-indigo-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
          <p className="text-gray-600">
            Your data is protected with industry-standard security measures.
          </p>
        </div>
      </section>
    </div>
  );
}