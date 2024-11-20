import { CryptoPrice } from '../types';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export async function fetchCryptoPrices(symbols: string[]): Promise<CryptoPrice[]> {
  try {
    const ids = symbols.map(symbol => getCoinGeckoId(symbol.toLowerCase()));
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${ids.join(',')}&vs_currencies=usd&include_24hr_change=true`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch prices');
    }

    const data = await response.json();
    
    return symbols.map((symbol) => {
      const id = getCoinGeckoId(symbol.toLowerCase());
      return {
        symbol,
        price: data[id]?.usd || 0,
        change24h: data[id]?.usd_24h_change || 0,
      };
    });
  } catch (error) {
    console.error('Error fetching prices:', error);
    return [];
  }
}

// Map common symbols to CoinGecko IDs
function getCoinGeckoId(symbol: string): string {
  const mapping: Record<string, string> = {
    btc: 'bitcoin',
    eth: 'ethereum',
    bnb: 'binancecoin',
    sol: 'solana',
    ada: 'cardano',
    xrp: 'ripple',
    dot: 'polkadot',
    doge: 'dogecoin',
    avax: 'avalanche-2',
    matic: 'matic-network',
  };
  return mapping[symbol] || symbol;
}