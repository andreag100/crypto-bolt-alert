import { useState, useEffect } from 'react';
import { CryptoPrice } from '../types';
import { fetchCryptoPrices } from '../services/api';

const SUPPORTED_CRYPTOS = [
  'BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'XRP', 'DOT', 'DOGE', 'AVAX', 'MATIC'
];
const UPDATE_INTERVAL = 30000; // 30 seconds

export function useCryptoPrices() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const newPrices = await fetchCryptoPrices(SUPPORTED_CRYPTOS);
        setPrices(newPrices);
      } catch (error) {
        console.error('Error fetching prices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return { prices, loading };
}