import { useState, useEffect } from 'react';
import { CryptoPrice } from '../types';
import { fetchCryptoPrices } from '../services/api';

const SUPPORTED_CRYPTOS = [
  'BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'XRP', 'DOT', 'DOGE', 'AVAX', 'MATIC',
  'LINK', 'UNI', 'ATOM', 'ALGO', 'NEAR', 'FTM', 'VET', 'ONE', 'EGLD', 'THETA'
];
const UPDATE_INTERVAL = 30000; // 30 seconds

export function useCryptoPrices() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchPrices = async () => {
      try {
        const newPrices = await fetchCryptoPrices(SUPPORTED_CRYPTOS);
        if (mounted) {
          setPrices(newPrices);
          setError(null);
        }
      } catch (error) {
        if (mounted) {
          setError('Failed to fetch prices. Please try again later.');
          console.error('Error fetching prices:', error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, UPDATE_INTERVAL);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { prices, loading, error, supportedCryptos: SUPPORTED_CRYPTOS };
}