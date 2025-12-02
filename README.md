# @localeos/ip-info

> **Version:** 1.0.14

Official LocaleOS IP Info SDK for IP geolocation, analytics tracking, and comprehensive IP intelligence.

## Features

- 🌍 **IP Geolocation**: Automatic location detection with country, city, timezone, currency
- 📊 **Analytics Tracking**: Privacy-first system fingerprinting (automatic when enabled)
- 🎯 **One Log Per System**: Automatic deduplication ensures accurate analytics
- 🔒 **Privacy-First**: No personal data collection, no cookies
- 💾 **Smart Caching**: localStorage caching for location data
- 🚀 **Lightweight**: ~16KB with minimal dependencies
- 📦 **TypeScript Support**: Full type definitions included
- 🌐 **Cross-Platform**: Works in all modern browsers

## Installation

```bash
npm install @localeos/ip-info
```

Or with yarn:

```bash
yarn add @localeos/ip-info
```

Or with pnpm:

```bash
pnpm add @localeos/ip-info
```

## Quick Start

### 1. Get Your API Key

1. Sign up at [LocaleOS Dashboard](https://localeos.co)
2. Create a new app
3. Copy your API Key

### 2. Initialize the SDK

```javascript
import localeOS from '@localeos/ip-info';

localeOS.init({
  apiKey: 'leos_your-api-key-here',
  analytics: true, // Enable automatic visit tracking
});

// Get user location info
const location = await localeOS.getLocationInfo();
console.log(location);
```

**That's it!** The SDK automatically:
- Detects the user's IP address using LocaleOS API
- Tracks visits when `analytics: true`
- Ensures one log per unique system (no duplicates)

### Optional: Configure CSP Headers

If your app has strict Content Security Policy, add `https://localeos.co` to your CSP `connect-src` directive:

**Next.js 16+:** Update `next.config.ts`:

```typescript
async headers() {
  return [{
    source: '/:path*',
    headers: [{
      key: 'Content-Security-Policy',
      value: `connect-src 'self' https://localeos.co;`.replace(/\s{2,}/g, ' ').trim(),
    }],
  }];
}
```

> 📖 **Need detailed setup instructions?** See the [Complete Implementation Guide](./COMPLETE_IMPLEMENTATION_GUIDE.md)

## Configuration Options

```typescript
localeOS.init({
  // Required: Your API key from LocaleOS dashboard
  apiKey: 'leos_your-api-key-here',

  // Optional: Enable/disable analytics tracking (defaults to false)
  analytics: true,

  // Optional: Cache duration for location data in milliseconds (defaults to 24 hours)
  // Set to 0 to disable caching
  cacheDuration: 24 * 60 * 60 * 1000, // 24 hours

  // Optional: Custom endpoint for IP detection
  // By default, uses LocaleOS API (https://localeos.co/api/my-ip)
  // Only set this if you want to use your own server-side endpoint
  // The endpoint must return JSON with an "ip" field: { "ip": "x.x.x.x" }
  ipDetectionEndpoint: '/api/my-ip',

  // Optional: Custom API URL for LocaleOS API (optional)
  // Default: 'https://localeos.co'
  // Only override if you have a custom proxy or self-hosted instance
  // Note: Requires adding the API URL to your CSP connect-src directive
  apiUrl: 'https://localeos.co',
});
```

## API Reference

### `init(config: LocaleOSConfig): void`

Initialize the SDK with your configuration. Automatically tracks visits when `analytics: true`.

```javascript
LocaleOS.init({
  apiKey: 'leos_your-api-key-here',
  analytics: true,
});
```

### `getDeviceInfo(): DeviceInfo | null`

Get detailed device information from the browser.

```javascript
const deviceInfo = LocaleOS.getDeviceInfo();
console.log(deviceInfo);
// {
//   browser: "Chrome 120",
//   os: "macOS 14.1",
//   device: "Desktop",
//   screen: { width: 1920, height: 1080, colorDepth: 24 },
//   timezone: -480,
//   language: "en-US",
//   cores: 8
// }
```

### `getLocationInfo(): Promise<LocationInfo | null>`

Get location information from IP address including country, city, timezone, currency, and device information.

```javascript
const locationInfo = await LocaleOS.getLocationInfo();
console.log(locationInfo);
// {
//   ip: "8.8.8.8",
//   country: "United States",
//   countryCode: "US",
//   region: "California",
//   city: "Mountain View",
//   postalCode: "94035",
//   latitude: 37.386,
//   longitude: -122.0838,
//   timezone: "America/Los_Angeles",
//   currency: "USD",
//   currencySymbol: "$",
//   deviceInfo: {
//     client: { browser: "Chrome 120", os: "macOS 14.1", device: "Desktop" },
//     server: { deviceType: "Desktop", os: "macOS", browser: "Chrome" }
//   }
// }
```

**Note:** This method is automatically cached in localStorage for 24 hours to prevent unnecessary API calls.

### `getComprehensiveData(ip?: string): Promise<ComprehensiveIPData | null>`

Get complete IP intelligence data in ipdata.co compatible format.

```javascript
// Get data for user's IP
const data = await LocaleOS.getComprehensiveData();

// Get data for specific IP
const data = await LocaleOS.getComprehensiveData('8.8.8.8');

console.log(data);
// Includes: geolocation, timezone, currency, ASN, company, privacy detection, security, device info
```

### `getTimezone(ip?: string): Promise<TimezoneInfo | null>`

Get timezone information for an IP address.

```javascript
const timezone = await LocaleOS.getTimezone('8.8.8.8');
console.log(timezone);
// {
//   name: "America/Los_Angeles",
//   abbr: "PST",
//   offset: "-0800",
//   is_dst: false,
//   current_time: "2024-01-15T10:30:00-08:00"
// }
```

### `getCurrency(ip?: string): Promise<CurrencyInfo | null>`

Get currency information for an IP address.

```javascript
const currency = await LocaleOS.getCurrency('8.8.8.8');
console.log(currency);
// {
//   name: "US Dollar",
//   code: "USD",
//   symbol: "$",
//   native: "$",
//   plural: "US Dollars"
// }
```

### `getASN(ip?: string): Promise<ASNInfo | null>`

Get Autonomous System Number information.

```javascript
const asn = await LocaleOS.getASN('8.8.8.8');
console.log(asn);
// {
//   asn: "AS15169",
//   name: "Google LLC",
//   domain: "google.com",
//   route: "8.8.8.0/24",
//   type: "isp"
// }
```

### `getCompany(ip?: string): Promise<CompanyInfo | null>`

Get company information for an IP address.

```javascript
const company = await LocaleOS.getCompany('8.8.8.8');
console.log(company);
// {
//   name: "Google LLC",
//   domain: "google.com",
//   network: "8.8.8.0/24",
//   type: "business"
// }
```

### `clearCache(): void`

Clear the location cache from both memory and localStorage to force a fresh fetch.

```javascript
LocaleOS.clearCache();
const freshLocation = await LocaleOS.getLocationInfo(); // Forces new API call
```

## Advanced Usage

### Caching Configuration

By default, location data is cached in localStorage for 24 hours:

```javascript
// Custom cache duration (1 hour)
LocaleOS.init({
  apiKey: 'leos_your-api-key-here',
  analytics: true,
  cacheDuration: 60 * 60 * 1000, // 1 hour in milliseconds
});

// Disable caching completely
LocaleOS.init({
  apiKey: 'leos_your-api-key-here',
  analytics: true,
  cacheDuration: 0, // No caching
});
```

### React Integration

```jsx
import { useEffect } from 'react';
import LocaleOS from '@localeos/ip-info';

function App() {
  useEffect(() => {
    LocaleOS.init({
      apiKey: process.env.REACT_APP_LOCALEOS_API_KEY,
      analytics: true,
    });
  }, []);

  return <div>Your App</div>;
}
```

### Next.js Integration

```jsx
// pages/_app.js or app/layout.tsx (with 'use client')
import { useEffect } from 'react';
import localeOS from '@localeos/ip-info';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    localeOS.init({
      apiKey: process.env.NEXT_PUBLIC_LOCALEOS_API_KEY,
      analytics: true,
      ipDetectionEndpoint: '/api/my-ip', // Use server-side IP detection
    });
  }, []);

  return <Component {...pageProps} />;
}
```

> **Important:** Don't forget to create the `/api/my-ip` endpoint! See [Complete Implementation Guide](./COMPLETE_IMPLEMENTATION_GUIDE.md)

### Vue Integration

```javascript
// main.js
import { createApp } from 'vue';
import localeOS from '@localeos/ip-info';
import App from './App.vue';

localeOS.init({
  apiKey: import.meta.env.VITE_LOCALEOS_API_KEY,
  analytics: true,
  ipDetectionEndpoint: '/api/my-ip',
});

const app = createApp(App);
app.mount('#app');
```

## How It Works

### Automatic Analytics Tracking

When `analytics: true`, the SDK automatically:
1. Generates a unique system fingerprint
2. Tracks the visit on initialization
3. Uses fingerprints to ensure one log per system per app
4. Updates existing logs instead of creating duplicates

### System Fingerprinting

LocaleOS uses advanced browser fingerprinting:

- **Canvas Fingerprinting**: Unique patterns based on GPU/font rendering
- **WebGL Fingerprinting**: Graphics card vendor and renderer
- **Browser Properties**: User agent, language, timezone, screen resolution
- **Hardware Info**: CPU cores, device memory, platform

### Privacy Considerations

- **No Personal Data**: No names, emails, or personal information
- **One Entry Per System**: Automatic deduplication
- **No Cross-Site Tracking**: Each app has isolated fingerprints
- **User Control**: Users can clear localStorage to reset fingerprint

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import LocaleOS from '@localeos/ip-info';
import type {
  LocaleOSConfig,
  DeviceInfo,
  LocationInfo,
  TimezoneInfo,
  CurrencyInfo,
  ASNInfo,
  CompanyInfo,
  ComprehensiveIPData
} from '@localeos/ip-info';

const config: LocaleOSConfig = {
  apiKey: process.env.NEXT_PUBLIC_LOCALEOS_API_KEY!,
  analytics: true
};

LocaleOS.init(config);

const device: DeviceInfo | null = LocaleOS.getDeviceInfo();
const location: LocationInfo | null = await LocaleOS.getLocationInfo();
const data: ComprehensiveIPData | null = await LocaleOS.getComprehensiveData();
```

## Troubleshooting

### "Failed to fetch" Error

If you see this error in the console:
```
[LocaleOS] Error fetching location info: TypeError: Failed to fetch
```

**Cause:** CORS (Cross-Origin Resource Sharing) restrictions are blocking requests to `https://localeos.co/api/my-ip`.

**Solution:** Use a custom `ipDetectionEndpoint` that runs on your own server:

```typescript
localeOS.init({
  apiKey: 'your-api-key',
  analytics: true,
  ipDetectionEndpoint: '/api/my-ip', // Use your own endpoint
});
```

Create the endpoint (Next.js example):

```typescript
// app/api/my-ip/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    }
  });
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "Unknown";
  return NextResponse.json({ ip }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    }
  });
}
```

### Cache Not Invalidating

If location data seems stale even after IP change:

```javascript
LocaleOS.clearCache();
const freshLocation = await LocaleOS.getLocationInfo();
```

### Analytics Not Tracking

Make sure:
1. `analytics: true` is set in init
2. Your API key is valid
3. CSP headers allow `https://localeos.co`

## Browser Support

- Chrome/Edge: ✅ Latest 2 versions
- Firefox: ✅ Latest 2 versions
- Safari: ✅ Latest 2 versions
- Opera: ✅ Latest version

## License

MIT

## Support

For questions and support, please open an issue on [GitHub](https://github.com/localeOS/localeos-ip-info/issues).
