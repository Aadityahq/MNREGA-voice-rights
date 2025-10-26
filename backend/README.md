# 🇮�� MGNREGA Backend - Real API Integration

## Data Sources (Priority Order)

1. **🌐 data.gov.in API** (Primary) - Real-time government data
2. **📡 NREGA Website** (Secondary) - Direct scraping from official portal
3. **💾 Database Cache** (Fallback) - Previously fetched data
4. **🎲 Mock Data** (Last Resort) - Simulated realistic data

## Smart Caching System

- **Live API**: When APIs are available, fetches fresh data
- **Cache**: Stores all fetched data in MongoDB for 4 hours
- **Offline Mode**: Automatically uses cached data when APIs are down
- **Auto-Refresh**: Cron job updates data every 4 hours

## API Key Setup

Get your free API key from data.gov.in:

1. Visit https://data.gov.in/user/register
2. Sign up and verify email
3. Login and go to "My Account" → "API Keys"
4. Generate key and add to `.env`:
