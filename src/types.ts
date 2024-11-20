export interface CryptoAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  created: Date;
}

export interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
}