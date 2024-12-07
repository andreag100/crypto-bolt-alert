import { CryptoPrice } from '../types';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const API_KEY = 'CG-fsBrSSGAc9VVMg32LHj6XbuE';


export async function fetchCryptoPrices(symbols: string[]): Promise<CryptoPrice[]> {
  try {
    const ids = symbols.map(symbol => getCoinGeckoId(symbol.toLowerCase()));
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${ids.join(',')}&vs_currencies=usd&include_24hr_change=true`,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return symbols.map((symbol) => {
      const id = getCoinGeckoId(symbol.toLowerCase());
      const priceData = data[id];

      return {
        symbol,
        price: priceData?.usd || 0,
        change24h: priceData?.usd_24h_change || 0,
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
    link: 'chainlink',
    uni: 'uniswap',
    atom: 'cosmos',
    algo: 'algorand',
    near: 'near',
    ftm: 'fantom',
    vet: 'vechain',
    one: 'harmony',
    egld: 'elrond-erd-2',
    theta: 'theta-token'
  };
  return mapping[symbol] || symbol;
}
