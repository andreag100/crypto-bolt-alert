import { CryptoPrice } from '../types';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const API_KEY = 'CG-X34cBHfDq1ZrPEKUa1R4MVSM';

export async function fetchCryptoPrices(symbols: string[]): Promise<CryptoPrice[]> {
  try {
    const ids = symbols.map(symbol => getCoinGeckoId(symbol.toLowerCase()));
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${ids.join(',')}&vs_currencies=usd&include_24hr_change=true`,
      {
        headers: {
          'Accept': 'application/json',
          'X-CG-API-Key': API_KEY,
          'Cache-Control': 'no-cache',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch prices: ${response.status}`);
    }

    const data = await response.json();
    
    return symbols.map((symbol) => {
      const id = getCoinGeckoId(symbol.toLowerCase());
      const priceData = data[id];
      
      if (!priceData) {
        throw new Error(`No price data available for ${symbol}`);
      }

      return {
        symbol,
        price: priceData.usd,
        change24h: priceData.usd_24h_change,
      };
    });
  } catch (error) {
    console.error('Error fetching prices:', error);
    throw error;
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