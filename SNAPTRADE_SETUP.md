# SnapTrade OAuth Integration Setup Guide

This guide will help you set up SnapTrade OAuth integration for broker syncing (e.g., Robinhood) on your FinAIse website.

## 🚀 Quick Start

### 1. Create a SnapTrade Developer Account

1. Go to [https://snaptrade.com/developers](https://snaptrade.com/developers)
2. Register your application
3. Obtain your credentials:
   - `clientId`
   - `consumerKey`
   - Choose between Sandbox or Production environment

### 2. Environment Configuration

Create a `.env.local` file in your project root with:

```bash
# SnapTrade API Configuration
NEXT_PUBLIC_SNAPTRADE_CLIENT_ID=your-snaptrade-client-id
NEXT_PUBLIC_SNAPTRADE_CONSUMER_KEY=your-snaptrade-consumer-key

# Use mock service for development/testing (set to false for production)
NEXT_PUBLIC_USE_MOCK_SNAPTRADE=true

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. OAuth Flow Overview

The SnapTrade OAuth integration follows this flow:

1. **User clicks "Connect Broker"** → Frontend calls `/api/snaptrade/auth`
2. **Generate OAuth URL** → Backend calls SnapTrade API to get redirect URL
3. **Redirect to SnapTrade** → User logs into their broker (e.g., Robinhood)
4. **OAuth Callback** → SnapTrade redirects back to `/api/snaptrade/callback`
5. **Save Authorization** → Store authorization ID in Supabase
6. **Fetch Portfolio** → Use authorization ID to get portfolio data

## 🔧 API Endpoints

### POST `/api/snaptrade/auth`
Generates OAuth redirect URL for broker connection.

**Request:**
```json
{
  "redirectUri": "https://yourwebsite.com/api/snaptrade/callback",
  "userId": "user-id-optional"
}
```

**Response:**
```json
{
  "success": true,
  "redirectUrl": "https://snaptrade.com/oauth/authorize?...",
  "redirectUri": "https://yourwebsite.com/api/snaptrade/callback",
  "userId": "user-id-optional"
}
```

### GET `/api/snaptrade/callback`
Handles OAuth callback from SnapTrade.

**Query Parameters:**
- `code` - Authorization code from SnapTrade
- `state` - State parameter (optional)
- `error` - Error code if OAuth failed
- `error_description` - Error description if OAuth failed
- `userId` - User ID (optional)

**Response:** Redirects to dashboard with success/error parameters.

### GET `/api/snaptrade/holdings`
Fetches portfolio holdings for a connected account.

**Query Parameters:**
- `authorizationId` - Authorization ID from OAuth callback
- `accountId` - Specific account ID (optional)

**Response:**
```json
{
  "success": true,
  "holdings": [
    {
      "symbol": "AAPL",
      "quantity": 10,
      "averagePrice": 150.00,
      "currentPrice": 175.50,
      "marketValue": 1755.00,
      "gainLoss": 255.00,
      "gainLossPercent": 17.0,
      "accountId": "account-123"
    }
  ],
  "count": 1
}
```

## 🎯 Frontend Integration

### Connect Broker Button

The `BrokerConnection` component handles the OAuth flow:

```tsx
import BrokerConnection from '@/components/BrokerConnection'

<BrokerConnection 
  onConnectionSuccess={(authorizationId) => {
    console.log('Broker connected:', authorizationId)
    // Reload portfolio data
  }}
  onConnectionError={(error) => {
    console.error('Connection failed:', error)
  }}
/>
```

### Portfolio Data Fetching

```tsx
// Fetch portfolio holdings
const response = await fetch(`/api/snaptrade/holdings?authorizationId=${authId}`)
const data = await response.json()

if (data.success) {
  setPortfolioHoldings(data.holdings)
}
```

## 🧪 Testing with Mock Service

For development and testing, the system includes a mock SnapTrade service:

### Enable Mock Mode
```bash
NEXT_PUBLIC_USE_MOCK_SNAPTRADE=true
```

### Mock Features
- Simulates complete OAuth flow
- Provides realistic portfolio data (AAPL, GOOGL, TSLA)
- Includes proper delays and error handling
- Console logs for debugging

### Mock Portfolio Data
```json
{
  "symbol": "AAPL",
  "quantity": 10,
  "averagePrice": 150.00,
  "currentPrice": 175.50,
  "marketValue": 1755.00,
  "gainLoss": 255.00,
  "gainLossPercent": 17.0
}
```

## 🔒 Security Considerations

### HTTPS Required
SnapTrade OAuth requires HTTPS in production. Make sure your callback URL uses HTTPS.

### Environment Variables
Never commit real SnapTrade credentials to version control. Use environment variables and `.env.local` for local development.

### User Data Security
- SnapTrade handles all broker authentication
- Never store broker usernames/passwords
- Only store the authorization ID for API calls

## 🚨 Troubleshooting

### Common Issues

1. **"Failed to generate broker connection URL"**
   - Check SnapTrade credentials
   - Verify HTTPS is enabled
   - Check network connectivity

2. **OAuth callback errors**
   - Verify callback URL matches exactly
   - Check for URL encoding issues
   - Ensure proper error handling

3. **Portfolio data not loading**
   - Verify authorization ID is valid
   - Check SnapTrade API status
   - Review console logs for errors

### Debug Mode

Enable detailed logging by checking browser console and server logs. The integration includes comprehensive logging for debugging.

## 📚 Additional Resources

- [SnapTrade Developer Documentation](https://snaptrade.com/developers)
- [SnapTrade API Reference](https://docs.snaptrade.com/)
- [OAuth 2.0 Specification](https://tools.ietf.org/html/rfc6749)

## 🎉 Production Deployment

1. **Get Production Credentials**
   - Contact SnapTrade for production access
   - Update environment variables
   - Set `NEXT_PUBLIC_USE_MOCK_SNAPTRADE=false`

2. **SSL Certificate**
   - Ensure HTTPS is properly configured
   - Update callback URLs to use HTTPS

3. **Testing**
   - Test OAuth flow end-to-end
   - Verify portfolio data accuracy
   - Check error handling

4. **Monitoring**
   - Set up error tracking
   - Monitor API response times
   - Track OAuth success rates
