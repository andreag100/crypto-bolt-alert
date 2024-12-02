import React from 'react';
import { useCryptoPrices } from '../hooks/useCryptoPrices';
import { TrendingUp, TrendingDown } from 'lucide-react';

const SUPPORTED_CRYPTOS = [
  { id: 'bitcoin', symbol: 'BTC' },
  { id: 'ethereum', symbol: 'ETH' },
  { id: 'binancecoin', symbol: 'BNB' },
  { id: 'solana', symbol: 'SOL' },
  { id: 'cardano', symbol: 'ADA' },
  { id: 'ripple', symbol: 'XRP' },
  { id: 'polkadot', symbol: 'DOT' },
  { id: 'dogecoin', symbol: 'DOGE' },
  { id: 'avalanche-2', symbol: 'AVAX' },
  { id: 'matic-network', symbol: 'MATIC' }
];

export function PriceDisplay() {
  const { prices, loading, error, lastUpdated } = useCryptoPrices(SUPPORTED_CRYPTOS.map(c => c.id));

  if (loading) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-lg p-4">
              <div className="h-6 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p>Error loading prices. Please try again later.</p>
          {lastUpdated && (
            <p className="text-sm mt-2">
              Last successful update: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!prices) {
    return (
      <div className="p-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-700">
          <p>No price data available</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SUPPORTED_CRYPTOS.map(({ id, symbol }) => (
          prices[id] && (
            <div
              key={id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:border-indigo-500 transition-colors duration-200"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <img
                    src={`https://assets.coingecko.com/coins/images/1/thumb/${id}.png`}
                    alt={symbol}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32';
                    }}
                  />
                  <span className="font-medium">{symbol}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {prices[id].usd_24h_change && (
                    <span
                      className={`text-sm px-2 py-1 rounded flex items-center ${
                        prices[id].usd_24h_change >= 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {prices[id].usd_24h_change >= 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {Math.abs(prices[id].usd_24h_change).toFixed(2)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(prices[id].usd)}
                </span>
              </div>
            </div>
          )
        ))}
      </div>
      {lastUpdated && (
        <div className="mt-4 text-sm text-gray-500 text-right">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}