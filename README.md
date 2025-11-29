# @localeos/ip-info

Official LocaleOS IP Info SDK for tracking user analytics with privacy-focused system fingerprinting and IP geolocation.

## Features

- 🔒 **Privacy-First**: System fingerprinting instead of invasive tracking
- 🎯 **One Log Per System**: Automatic deduplication ensures one entry per unique system
- 📊 **Comprehensive Device Detection**: Browser, OS, device type, and more
- 🌍 **IP Geolocation**: Automatic IP address detection and location tracking
- 💾 **Smart Caching**: localStorage caching prevents unnecessary API calls on page refresh
- 🔄 **Auto-Retry**: Built-in retry logic for failed requests
- 🚀 **Lightweight**: Minimal bundle size with zero dependencies
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
import LocaleOS from '@localeos/ip-info';

// Initialize with your API key - tracking happens automatically!
LocaleOS.init({
  apiKey: 'leos_your-api-key-here',
  debug: true, // Enable debug mode during development
});
```

**That's it!** The SDK automatically tracks when your app is visited. Each unique system is logged once and updated on subsequent visits.

## Configuration Options

```typescript
LocaleOS.init({
  // Required: Your API key from LocaleOS dashboard
  apiKey: 'your-api-key',

  // Optional: Enable/disable analytics tracking (defaults to false)
  analytics: true,

  // Optional: Cache duration for location data in milliseconds (defaults to 24 hours)
  // Set to 0 to disable caching
  cacheDuration: 24 * 60 * 60 * 1000, // 24 hours
});
```

## API Reference

### `init(config: LocaleOSConfig): void`

Initialize the SDK with your configuration. **Automatically tracks the visit when called.**

```javascript
LocaleOS.init({
  apiKey: 'leos_your-api-key-here',
  debug: true,
});
// Visit is automatically logged!
```

### `track(event?: string | TrackingEvent): Promise<boolean>` _(Optional)_

Manually track an additional event if needed. No personal data or metadata is collected - only system fingerprint and device info.

```javascript
// Simple event
await LocaleOS.track('user_signup');

// Named event
await LocaleOS.track('purchase');

// Object syntax
await LocaleOS.track({ event: 'button_click' });
```

**Note:** Most apps won't need this since visits are tracked automatically on initialization.

### `getFingerprint(): string | null`

Get the current system fingerprint.

```javascript
const fingerprint = LocaleOS.getFingerprint();
console.log(fingerprint); // "fp_abc123_xyz"
```

### `getDeviceInfo(): DeviceInfo | null`

Get detailed device information.

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

**Note:** This method is automatically cached in localStorage for 24 hours to prevent unnecessary API calls when the same system refreshes the page. The cache duration can be customized (see Caching Configuration below).

### `clearCache(): void`

Clear the location cache from both memory and localStorage to force a fresh fetch on the next call.

```javascript
LocaleOS.clearCache();
const freshLocation = await LocaleOS.getLocationInfo(); // Forces new API call
```

## Advanced Usage

### Caching Configuration

By default, location data is cached in localStorage for 24 hours to minimize API calls when the same system refreshes. You can customize this behavior:

```javascript
// Custom cache duration (1 hour)
LocaleOS.init({
  apiKey: 'your-api-key',
  analytics: true,
  cacheDuration: 60 * 60 * 1000, // 1 hour in milliseconds
});

// Disable caching completely
LocaleOS.init({
  apiKey: 'your-api-key',
  analytics: true,
  cacheDuration: 0, // No caching
});

// Default: 24 hours
LocaleOS.init({
  apiKey: 'your-api-key',
  analytics: true,
  // cacheDuration not specified = 24 hours
});
```

**Cache Behavior:**
- Cache is stored in localStorage with a timestamp
- Automatically expires after the configured duration
- Cleared when `clearCache()` is called
- Survives page refreshes but not browser/localStorage clears
- Separate from analytics tracking (tracking always happens if enabled)

**Benefits:**
- Reduces API calls and improves performance
- Prevents rate limiting on IP lookup services
- Instant location data on subsequent page loads
- Lower server costs for high-traffic applications

### Disable Tracking

You can completely disable tracking (useful for development, testing, or user preferences):

```javascript
LocaleOS.init({
  apiKey: 'leos_your-api-key-here',
  enabled: false, // Disable all tracking
});

// All tracking methods will return immediately without making API calls
LocaleOS.track('event'); // Does nothing when disabled
```

**Note:** Tracking can also be disabled server-side in your LocaleOS dashboard. When disabled server-side, the SDK will still make API calls but they will be ignored by the server.

### Error Handling

All tracking methods return a Promise<boolean>:

```javascript
const success = await LocaleOS.track('event');
if (success) {
  console.log('Event tracked successfully');
} else {
  console.log('Failed to track event');
}
```

### React Integration

```jsx
import { useEffect } from 'react';
import LocaleOS from '@localeos/ip-info';

function App() {
  useEffect(() => {
    LocaleOS.init({
      apiKey: process.env.REACT_APP_LOCALEOS_API_KEY,
      debug: process.env.NODE_ENV === 'development',
    });
    // Visit is automatically tracked!
  }, []);

  return <div>Your App</div>;
}
```

### Next.js Integration

```jsx
// pages/_app.js
import { useEffect } from 'react';
import LocaleOS from '@localeos/ip-info';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    LocaleOS.init({
      apiKey: process.env.NEXT_PUBLIC_LOCALEOS_API_KEY,
    });
    // Visit is automatically tracked!
  }, []);

  return <Component {...pageProps} />;
}
```

### Vue Integration

```javascript
// main.js
import { createApp } from 'vue';
import LocaleOS from '@localeos/ip-info';
import App from './App.vue';

LocaleOS.init({
  apiKey: import.meta.env.VITE_LOCALEOS_API_KEY,
});

const app = createApp(App);
app.mount('#app');
```

## How It Works

### System Fingerprinting

LocaleOS uses advanced browser fingerprinting to create a unique identifier for each system:

1. **Canvas Fingerprinting**: Draws a unique pattern based on GPU/font rendering
2. **WebGL Fingerprinting**: Detects graphics card information
3. **Browser Properties**: User agent, language, timezone, screen resolution
4. **Hardware Info**: CPU cores, device memory, platform

### Privacy Considerations

- **No Personal Data**: We don't collect names, emails, or IP addresses (IP is optional)
- **One Entry Per System**: Prevents duplicate tracking
- **No Cross-Site Tracking**: Each app has its own isolated fingerprints
- **User Control**: Users can clear localStorage to reset their fingerprint

### Automatic Deduplication

The system uses the unique fingerprint to ensure only one log entry per system per app. If the same system visits multiple times, the existing log is updated rather than creating duplicates.

## Browser Support

- Chrome/Edge: ✅ Latest 2 versions
- Firefox: ✅ Latest 2 versions
- Safari: ✅ Latest 2 versions
- Opera: ✅ Latest version

## License

MIT

## Support

For questions and support, please open an issue on [GitHub](https://github.com/localeos/analytics/issues).
