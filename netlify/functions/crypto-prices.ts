import { Handler } from '@netlify/functions';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

// Cache responses for 10 seconds
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 10000; // 10 seconds

export const handler: Handler = async (event) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  try {
    const { coins } = event.queryStringParameters || {};
    if (!coins) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing coins parameter' })
      };
    }

    // Check cache first
    const cacheKey = coins;
    const now = Date.now();
    const cached = cache.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_TTL) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(cached.data)
      };
    }

    const response = await fetch(
      `${COINGECKO_API_URL}/simple/price?ids=${coins}&vs_currencies=usd&include_24hr_change=true`,
      {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CoinGecko API error:', response.status, errorText);
      
      if (response.status === 429) {
        return {
          statusCode: 429,
          headers,
          body: JSON.stringify({ 
            error: 'Rate limit exceeded. Please try again later.',
            retryAfter: response.headers.get('retry-after') || '30'
          })
        };
      }

      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    // Update cache
    cache.set(cacheKey, { data, timestamp: now });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch prices',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};
