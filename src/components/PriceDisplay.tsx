import React from 'react';
import { TrendingUp } from 'lucide-react';
import { CryptoPrice } from '../types';

interface PriceDisplayProps {
  prices: CryptoPrice[];
  loading: boolean;
}

export function PriceDisplay({ prices, loading }: PriceDisplayProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-800">Live Prices</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 rounded-lg border border-gray-200 animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-gray-800">Live Prices</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prices.map((crypto) => (
          <div
            key={crypto.symbol}
            className="p-4 rounded-lg border border-gray-200 hover:border-indigo-500 transition-colors duration-200"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">{crypto.symbol}</h3>
              <span
                className={`text-sm px-2 py-1 rounded ${
                  crypto.change24h >= 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {crypto.change24h >= 0 ? '+' : ''}
                {crypto.change24h.toFixed(2)}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              ${crypto.price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}