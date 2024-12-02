import { useState, useEffect } from 'react';
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

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 5000; // 5 seconds

    const fetchPrices = async () => {
      if (!coins.length) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coins.join(',')}&vs_currencies=usd&include_24hr_change=true`,
          {
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (mounted) {
          setPrices(data);
          setError(null);
          setLastUpdated(new Date());
          retryCount = 0; // Reset retry count on successful fetch
        }
      } catch (err) {
        console.error('Error fetching prices:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch prices');
          
          if (retryCount < maxRetries) {
            console.log(`Retrying... Attempt ${retryCount + 1} of ${maxRetries}`);
            if (retryCount === 0) {
              toast.error('Failed to fetch crypto prices. Retrying...');
            }
            retryCount++;
            setTimeout(fetchPrices, retryDelay);
          } else {
            toast.error('Failed to fetch prices after multiple attempts. Please refresh the page.');
            console.log('Max retries reached');
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    setLoading(true);
    fetchPrices();
    
    // Set up polling interval (30 seconds)
    const intervalId = setInterval(fetchPrices, 30000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [coins]);

  return { prices, loading, error, lastUpdated };
}