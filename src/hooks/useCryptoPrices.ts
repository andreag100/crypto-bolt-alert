import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface CryptoPrice {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
  };
}

const SUPPORTED_CRYPTOS = [
  'BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'XRP', 'DOT', 'DOGE', 'AVAX', 'MATIC',
  'LINK', 'UNI', 'ATOM', 'ALGO', 'NEAR', 'FTM', 'VET', 'ONE', 'EGLD', 'THETA'
];

export function useCryptoPrices(coins: string[] = SUPPORTED_CRYPTOS) {
  const [prices, setPrices] = useState<CryptoPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrices = useCallback(async () => {
    if (!coins.length) return null;

    try {
      const response = await fetch(
        `/.netlify/functions/crypto-prices?coins=${coins.join(',')}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          // Rate limit hit, return the retry delay
          const retryAfter = parseInt(errorData.retryAfter || '30', 10);
          throw new Error('rate_limit:' + retryAfter);
        }
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }, [coins]);

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    let timeoutId: NodeJS.Timeout | null = null;
    const maxRetries = 3;
    const baseRetryDelay = 5000; // 5 seconds
    const pollInterval = 30000; // 30 seconds

    const attemptFetch = async () => {
      if (!mounted) return;
      
      try {
        const data = await fetchPrices();
        if (!mounted) return;
        
        if (data) {
          setPrices(data);
          setError(null);
          setLastUpdated(new Date());
          retryCount = 0; // Reset retry count on successful fetch
        }
      } catch (err) {
        console.error('Error fetching prices:', err);
        if (!mounted) return;

        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch prices';
        setError(errorMessage);

        if (errorMessage.startsWith('rate_limit:')) {
          const retryAfter = parseInt(errorMessage.split(':')[1], 10);
          console.log(`Rate limited. Retrying in ${retryAfter} seconds`);
          toast.error(`Rate limit reached. Retrying in ${retryAfter} seconds`);
          timeoutId = setTimeout(attemptFetch, retryAfter * 1000);
          return;
        }

        if (retryCount < maxRetries) {
          const delay = baseRetryDelay * Math.pow(2, retryCount);
          console.log(`Retrying... Attempt ${retryCount + 1} of ${maxRetries} in ${delay}ms`);
          if (retryCount === 0) {
            toast.error('Failed to fetch crypto prices. Retrying...');
          }
          retryCount++;
          timeoutId = setTimeout(attemptFetch, delay);
        } else {
          console.log('Max retries reached');
          toast.error('Failed to fetch prices. Will try again soon.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    setLoading(true);
    attemptFetch();
    
    // Set up polling interval
    const intervalId = setInterval(attemptFetch, pollInterval);

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [fetchPrices, coins]);

  return { prices, loading, error, lastUpdated };
}