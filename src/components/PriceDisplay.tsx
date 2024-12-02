import React from 'react';
import { useCryptoPrices } from '../hooks/useCryptoPrices';

const SUPPORTED_CRYPTOS = [
  'bitcoin', 'ethereum', 'binancecoin', 'solana', 'cardano', 'ripple', 
  'polkadot', 'dogecoin', 'avalanche-2', 'matic-network'
];

export function PriceDisplay() {
  const { prices, loading, error, lastUpdated } = useCryptoPrices(SUPPORTED_CRYPTOS);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <p>Error loading prices. Please try again later.</p>
        {lastUpdated && (
          <p className="text-sm text-gray-500">
            Last successful update: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>
    );
  }

  if (!prices) {
    return (
      <div className="p-4 text-gray-500">
        <p>No price data available</p>
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
      <div className="space-y-4">
        {SUPPORTED_CRYPTOS.map((coin) => (
          prices[coin] && (
            <div key={coin} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-center space-x-3">
                <img
                  src={`https://assets.coingecko.com/coins/images/1/thumb/${coin}.png`}
                  alt={coin}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32';
                  }}
                />
                <span className="font-medium">{coin.charAt(0).toUpperCase() + coin.slice(1)}</span>
              </div>
              <span className="text-lg font-semibold">{formatPrice(prices[coin].usd)}</span>
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