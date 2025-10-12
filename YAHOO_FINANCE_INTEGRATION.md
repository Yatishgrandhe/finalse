# Yahoo Finance API Integration for FinAIse

This document describes the Yahoo Finance API integration implemented in the FinAIse web application using the `yahoo-finance2` library.

## Overview

The Yahoo Finance integration provides real-time stock data, historical prices, market summaries, and financial news for the FinAIse application. It's built using the `yahoo-finance2` npm package and includes comprehensive TypeScript types, React hooks, and UI components.

## Architecture

### Core Components

1. **YahooFinanceService** (`lib/yahoo-finance.ts`) - Main service class
2. **API Routes** (`app/api/stocks/*`) - Next.js API endpoints
3. **React Hooks** (`lib/hooks/useYahooFinance.ts`) - Custom hooks for data fetching
4. **UI Components** - Reusable components for displaying financial data

### Service Layer

```typescript
// YahooFinanceService singleton
const yahooFinanceService = YahooFinanceService.getInstance();

// Available methods:
- getQuote(symbol: string): Promise<YahooQuote | null>
- getQuotes(symbols: string[]): Promise<YahooQuote[]>
- getHistoricalData(symbol: string, period1: Date, period2: Date, interval: string): Promise<YahooHistoricalData[]>
- searchSymbols(query: string): Promise<YahooSearchResult[]>
- getTrendingTickers(): Promise<YahooSearchResult[]>
- getNews(symbol: string, count: number): Promise<YahooNewsItem[]>
- getMarketSummary(): Promise<MarketSummary | null>
- getOptions(symbol: string, expiration?: Date): Promise<any>
- getEarningsCalendar(startDate: Date, endDate: Date): Promise<any[]>
- getRecommendationTrends(symbol: string): Promise<any>
```

### API Endpoints

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/stocks` | GET | Get stock quotes | `symbol` or `symbols` |
| `/api/stocks/historical` | GET | Get historical data | `symbol`, `period1`, `period2`, `interval` |
| `/api/stocks/search` | GET | Search symbols | `q` (query) |
| `/api/stocks/trending` | GET | Get trending tickers | None |
| `/api/stocks/news` | GET | Get stock news | `symbol`, `count` |
| `/api/market` | GET | Get market summary | None |

### React Hooks

```typescript
// Available hooks:
- useStockQuotes(symbols: string[])
- useStockQuote(symbol: string)
- useHistoricalData(symbol: string, period1?: Date, period2?: Date, interval?: string)
- useSymbolSearch(query: string)
- useTrendingTickers()
- useStockNews(symbol: string, count?: number)
- useMarketSummary()
- usePopularSymbols()
- useSectorSymbols(sector: string)
```

## Usage Examples

### 1. Basic Stock Quote

```typescript
import { useStockQuote } from '@/lib/hooks/useYahooFinance';

function StockComponent() {
  const { quote, loading, error } = useStockQuote('AAPL');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!quote) return <div>No data</div>;
  
  return (
    <div>
      <h2>{quote.symbol}</h2>
      <p>Price: ${quote.regularMarketPrice}</p>
      <p>Change: {quote.regularMarketChangePercent}%</p>
    </div>
  );
}
```

### 2. Multiple Stock Quotes

```typescript
import { useStockQuotes } from '@/lib/hooks/useYahooFinance';

function PortfolioComponent() {
  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA'];
  const { quotes, loading, error } = useStockQuotes(symbols);
  
  return (
    <div>
      {quotes.map(quote => (
        <div key={quote.symbol}>
          <h3>{quote.symbol}</h3>
          <p>${quote.regularMarketPrice}</p>
        </div>
      ))}
    </div>
  );
}
```

### 3. Historical Data

```typescript
import { useHistoricalData } from '@/lib/hooks/useYahooFinance';

function ChartComponent() {
  const endDate = new Date();
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
  
  const { historicalData, loading, error } = useHistoricalData('AAPL', startDate, endDate, '1d');
  
  return (
    <div>
      {historicalData.map(data => (
        <div key={data.date.toISOString()}>
          Date: {data.date.toLocaleDateString()}
          Close: ${data.close}
        </div>
      ))}
    </div>
  );
}
```

### 4. Stock Search

```typescript
import { useSymbolSearch } from '@/lib/hooks/useYahooFinance';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const { searchResults, loading, error } = useSymbolSearch(query);
  
  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search stocks..."
      />
      {searchResults.map(result => (
        <div key={result.symbol}>
          {result.symbol} - {result.shortName}
        </div>
      ))}
    </div>
  );
}
```

### 5. Direct API Calls

```typescript
// Using fetch directly
async function getStockData(symbol: string) {
  try {
    const response = await fetch(`/api/stocks?symbol=${symbol}`);
    const data = await response.json();
    
    if (data.success) {
      return data.data[0]; // First quote
    }
    throw new Error(data.error);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return null;
  }
}

// Using the service directly
import { yahooFinanceService } from '@/lib/yahoo-finance';

async function getStockDataDirect(symbol: string) {
  try {
    const quote = await yahooFinanceService.getQuote(symbol);
    return quote;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return null;
  }
}
```

## UI Components

### StockSearch Component

```typescript
import StockSearch from '@/components/StockSearch';

function MyComponent() {
  const handleSymbolSelect = (symbol: YahooSearchResult) => {
    console.log('Selected:', symbol);
  };
  
  return (
    <StockSearch
      onSymbolSelect={handleSymbolSelect}
      placeholder="Search for stocks..."
      className="max-w-md"
    />
  );
}
```

### StockQuote Component

```typescript
import StockQuote from '@/components/StockQuote';

function MyComponent() {
  const quote = {
    symbol: 'AAPL',
    regularMarketPrice: 150.25,
    regularMarketChangePercent: 1.5,
    // ... other properties
  };
  
  return (
    <StockQuote
      quote={quote}
      showDetails={true}
      className="mb-4"
    />
  );
}
```

### MarketOverview Component

```typescript
import MarketOverview from '@/components/MarketOverview';

function MyComponent() {
  return <MarketOverview />;
}
```

## Data Types

### YahooQuote

```typescript
interface YahooQuote {
  symbol: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketVolume?: number;
  marketCap?: number;
  currency?: string;
  exchange?: string;
  regularMarketTime?: Date;
  regularMarketPreviousClose?: number;
  regularMarketOpen?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  averageDailyVolume3Month?: number;
  averageDailyVolume10Day?: number;
  priceToBook?: number;
  priceToEarnings?: number;
  earningsPerShare?: number;
  dividendYield?: number;
  sector?: string;
  industry?: string;
}
```

### YahooHistoricalData

```typescript
interface YahooHistoricalData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjustedClose?: number;
}
```

### YahooSearchResult

```typescript
interface YahooSearchResult {
  symbol: string;
  shortName?: string;
  longName?: string;
  exchange?: string;
  type?: string;
}
```

### YahooNewsItem

```typescript
interface YahooNewsItem {
  uuid: string;
  title: string;
  publisher: string;
  link: string;
  providerPublishTime: number;
  type: string;
  relatedTickers?: string[];
}
```

## Utility Functions

### financeUtils

```typescript
import { financeUtils } from '@/lib/yahoo-finance';

// Format price with currency
const formattedPrice = financeUtils.formatPrice(150.25, 'USD'); // "$150.25"

// Format percentage change
const formattedChange = financeUtils.formatPercentageChange(1.5); // "+1.50%"

// Format volume
const formattedVolume = financeUtils.formatVolume(1000000); // "1.0M"

// Get change color
const changeColor = financeUtils.getChangeColor(1.5); // "text-green-600"

// Get market status
const marketStatus = financeUtils.getMarketStatus('REGULAR'); // { status: 'Open', color: 'text-green-600' }
```

## Error Handling

The integration includes comprehensive error handling:

1. **Service Level**: Try-catch blocks in all service methods
2. **API Level**: HTTP status code checking and error responses
3. **Hook Level**: Error state management in React hooks
4. **Component Level**: Error boundaries and fallback UI

### Error Response Format

```typescript
{
  success: false,
  error: "Error message",
  details: "Detailed error information"
}
```

## Performance Considerations

1. **Caching**: API responses are cached by the browser
2. **Debouncing**: Search queries are debounced to reduce API calls
3. **Pagination**: Large datasets are paginated
4. **Loading States**: UI shows loading states during API calls
5. **Error Boundaries**: React error boundaries catch component errors

## Rate Limiting

The Yahoo Finance API has rate limits. The integration includes:

1. **Request Throttling**: Built-in delays between requests
2. **Error Handling**: Graceful handling of rate limit errors
3. **Retry Logic**: Automatic retry with exponential backoff
4. **Caching**: Reduces redundant API calls

## Security

1. **Input Validation**: All inputs are validated and sanitized
2. **Error Messages**: Sensitive information is not exposed in error messages
3. **CORS**: Proper CORS configuration for API endpoints
4. **Headers**: Security headers are set in API responses

## Testing

### Unit Tests

```typescript
// Example test for YahooFinanceService
describe('YahooFinanceService', () => {
  it('should fetch stock quote', async () => {
    const service = YahooFinanceService.getInstance();
    const quote = await service.getQuote('AAPL');
    
    expect(quote).toBeDefined();
    expect(quote?.symbol).toBe('AAPL');
  });
});
```

### Integration Tests

```typescript
// Example test for API endpoint
describe('/api/stocks', () => {
  it('should return stock data', async () => {
    const response = await fetch('/api/stocks?symbol=AAPL');
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
  });
});
```

## Deployment

The Yahoo Finance integration is ready for production deployment:

1. **Environment Variables**: No additional environment variables required
2. **Dependencies**: All dependencies are included in package.json
3. **Build**: No special build configuration required
4. **Vercel**: Optimized for Vercel deployment

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check API endpoint configuration
2. **Rate Limiting**: Implement request throttling
3. **Data Format**: Verify data structure matches expected types
4. **Network Issues**: Check internet connectivity and API availability

### Debug Mode

Enable debug logging:

```typescript
// In development
if (process.env.NODE_ENV === 'development') {
  console.log('Yahoo Finance API Debug:', data);
}
```

## Future Enhancements

1. **WebSocket Support**: Real-time data updates
2. **Advanced Charting**: Interactive price charts
3. **Portfolio Analytics**: Advanced portfolio analysis
4. **Alerts**: Price and volume alerts
5. **Backtesting**: Historical strategy testing

## Support

For issues and questions:

1. **Documentation**: Check this file and inline comments
2. **GitHub Issues**: Report bugs and feature requests
3. **Community**: Join the FinAIse community discussions
4. **Email**: Contact the development team

## License

This integration is part of the FinAIse project and follows the same MIT license.
