# LocaleOS IP Info - Complete Implementation Guide

> **Latest Version:** 1.0.15 - Production Ready ✨
> **Last Updated:** December 2025
> **Status:** CORS Enabled - Works Out-of-the-Box

## Table of Contents

1. [Quick Start](#quick-start)
2. [Installation](#installation)
3. [Basic Usage](#basic-usage)
4. [Configuration](#configuration)
5. [Framework-Specific Examples](#framework-specific-examples)
6. [CSP Compliance](#csp-compliance)
7. [API Reference](#api-reference)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

### What You Need

1. **API Key** from [LocaleOS Dashboard](https://localeos.co)
2. _(Optional)_ **CSP headers configured** if your app has strict Content Security Policy

> **✨ Zero Configuration Required:** The SDK works out-of-the-box with CORS-enabled LocaleOS API. No server-side endpoints needed!

### 2-Step Integration

```bash
# Step 1: Install
npm install @localeos/ip-info
```

```typescript
// Step 2: Initialize and use
import localeOS from '@localeos/ip-info';

localeOS.init({
  apiKey: 'leos_your-api-key-here',
  analytics: true,
});

// Get user's location info
const location = await localeOS.getLocationInfo();
console.log(location);
```

> **✅ Production Ready:** The SDK uses the CORS-enabled LocaleOS API at `https://localeos.co/api/my-ip` for automatic IP detection. Works from any domain without additional configuration!

---

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

---

## Basic Usage

### Simple Example

```typescript
import localeOS from '@localeos/ip-info';

// Initialize once in your app
localeOS.init({
  apiKey: 'leos_your-api-key-here',
  analytics: true,
});

// Get location info
const location = await localeOS.getLocationInfo();
console.log(location);
// {
//   ip: "8.8.8.8",
//   country: "United States",
//   countryCode: "US",
//   city: "Mountain View",
//   ...
// }

// Get comprehensive IP data
const ipData = await localeOS.getComprehensiveData();
console.log(ipData);

// Get device info (no API call needed)
const device = localeOS.getDeviceInfo();
console.log(device);
```

### Advanced: Custom IP Detection Endpoint (Optional)

**Only needed if:** You want to use your own server-side endpoint for IP detection instead of the default LocaleOS endpoint.

#### Next.js App Router

Create `app/api/my-ip/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const cfConnectingIp = request.headers.get("cf-connecting-ip");

    let ip = cfConnectingIp || forwardedFor?.split(",")[0] || realIp || "Unknown";

    if (ip === "::1" || ip === "127.0.0.1" || ip === "Unknown") {
      ip = "8.8.8.8";
    }

    return NextResponse.json({ ip }, { status: 200 });
  } catch (error) {
    console.error("Error getting IP:", error);
    return NextResponse.json(
      { error: "Failed to get IP address" },
      { status: 500 }
    );
  }
}
```

#### Next.js Pages Router

Create `pages/api/my-ip.ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const forwardedFor = req.headers['x-forwarded-for'];
    const realIp = req.headers['x-real-ip'];
    const cfConnectingIp = req.headers['cf-connecting-ip'];

    let ip = cfConnectingIp ||
             (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(',')[0]) ||
             realIp ||
             'Unknown';

    if (ip === '::1' || ip === '127.0.0.1' || ip === 'Unknown') {
      ip = '8.8.8.8';
    }

    res.status(200).json({ ip });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get IP address' });
  }
}
```

#### Express.js

```javascript
app.get('/api/my-ip', (req, res) => {
  try {
    const ip = req.headers['cf-connecting-ip'] ||
               req.headers['x-forwarded-for']?.split(',')[0] ||
               req.headers['x-real-ip'] ||
               req.ip ||
               'Unknown';

    res.json({ ip: ip === '::1' || ip === '127.0.0.1' ? '8.8.8.8' : ip });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get IP address' });
  }
});
```

Then configure CSP headers to allow connections to LocaleOS:

#### Next.js 16+ (Using next.config.ts)

Update your `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ... other config

  // Content Security Policy headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline';
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https:;
              font-src 'self' data:;
              connect-src 'self' https://localeos.co;
              frame-src 'self';
            `.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

**Important:** Add `https://localeos.co` to the `connect-src` directive.

---

## Configuration

### Basic Configuration

```typescript
import localeOS from '@localeos/ip-info';

localeOS.init({
  apiKey: 'leos_your-api-key-here',
  analytics: true,
});
```

That's it! The SDK will automatically use LocaleOS API to detect the user's IP address.

### All Configuration Options

```typescript
import localeOS from '@localeos/ip-info';

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

  // Optional: Custom API URL for LocaleOS API (defaults to 'https://localeos.co')
  // Only override if you have a custom proxy or self-hosted instance
  apiUrl: 'https://localeos.co',
});
```

---

## Framework-Specific Examples

### Next.js App Router (Recommended)

#### 1. Create a Provider Component

`components/providers/LocaleOSProvider.tsx`:

```typescript
"use client";

import { useEffect } from "react";
import localeOS from "@localeos/ip-info";

export function LocaleOSProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    localeOS.init({
      apiKey: process.env.NEXT_PUBLIC_LOCALEOS_API_KEY || '',
      analytics: true,
      cacheDuration: 24 * 60 * 60 * 1000,
    });
  }, []);

  return <>{children}</>;
}
```

#### 2. Wrap Your App

`app/layout.tsx`:

```typescript
import { LocaleOSProvider } from "@/components/providers/LocaleOSProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LocaleOSProvider>{children}</LocaleOSProvider>
      </body>
    </html>
  );
}
```

### Next.js Pages Router

`pages/_app.tsx`:

```typescript
import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import localeOS from '@localeos/ip-info';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    localeOS.init({
      apiKey: process.env.NEXT_PUBLIC_LOCALEOS_API_KEY || '',
      analytics: true,
      ipDetectionEndpoint: '/api/my-ip',
    });
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
```

### React (Vite)

`src/main.tsx`:

```typescript
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import localeOS from '@localeos/ip-info';
import App from './App';

function Root() {
  useEffect(() => {
    localeOS.init({
      apiKey: import.meta.env.VITE_LOCALEOS_API_KEY || '',
      analytics: true,
      ipDetectionEndpoint: '/api/my-ip',
    });
  }, []);

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
```

### React (Create React App)

`src/App.tsx`:

```typescript
import { useEffect } from 'react';
import localeOS from '@localeos/ip-info';

function App() {
  useEffect(() => {
    localeOS.init({
      apiKey: process.env.REACT_APP_LOCALEOS_API_KEY || '',
      analytics: true,
      ipDetectionEndpoint: '/api/my-ip',
    });
  }, []);

  return <div className="App">{/* Your app */}</div>;
}

export default App;
```

### Vue

`src/main.js`:

```javascript
import { createApp } from 'vue';
import localeOS from '@localeos/ip-info';
import App from './App.vue';

localeOS.init({
  apiKey: import.meta.env.VITE_LOCALEOS_API_KEY || '',
  analytics: true,
  ipDetectionEndpoint: '/api/my-ip',
});

const app = createApp(App);
app.mount('#app');
```

---

## CSP Compliance

### Why CSP Configuration is Required

The SDK needs to:
1. **Detect user's IP** - Uses `/api/my-ip` (your server)
2. **Track analytics** - Calls `https://localeos.co/api/track` (external)
3. **Fetch location data** - Calls `https://localeos.co/api/ip-lookup` (external)

### Required CSP Directives

Add `https://localeos.co` to your `connect-src` directive:

```
connect-src 'self' https://localeos.co;
```

### Complete Example (Next.js)

`next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: `
            default-src 'self';
            connect-src 'self' https://localeos.co;
          `.replace(/\s{2,}/g, ' ').trim(),
        },
      ],
    },
  ];
}
```

---

## API Reference

### `init(config: LocaleOSConfig): void`

Initialize the SDK. Must be called before using any other methods.

```typescript
localeOS.init({
  apiKey: 'leos_your-api-key-here',
  analytics: true,
  ipDetectionEndpoint: '/api/my-ip',
});
```

### `getDeviceInfo(): DeviceInfo | null`

Get client-side device information.

```typescript
const deviceInfo = localeOS.getDeviceInfo();
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

Get location information from IP address.

```typescript
const location = await localeOS.getLocationInfo();
console.log(location);
// {
//   ip: "8.8.8.8",
//   country: "United States",
//   countryCode: "US",
//   city: "Mountain View",
//   timezone: "America/Los_Angeles",
//   currency: "USD",
//   ...
// }
```

### `getComprehensiveData(ip?: string): Promise<ComprehensiveIPData | null>`

Get complete IP intelligence data.

```typescript
// Get data for user's IP
const data = await localeOS.getComprehensiveData();

// Get data for specific IP
const data = await localeOS.getComprehensiveData('8.8.8.8');
```

### `getTimezone(ip?: string): Promise<TimezoneInfo | null>`

Get timezone information.

```typescript
const timezone = await localeOS.getTimezone();
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

Get currency information.

```typescript
const currency = await localeOS.getCurrency();
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

```typescript
const asn = await localeOS.getASN();
```

### `getCompany(ip?: string): Promise<CompanyInfo | null>`

Get company information.

```typescript
const company = await localeOS.getCompany();
```

### `clearCache(): void`

Clear the location cache.

```typescript
localeOS.clearCache();
const freshLocation = await localeOS.getLocationInfo(); // Forces new API call
```

---

## Troubleshooting

### CSP Violation Errors

**Error:**
```
Refused to connect to 'https://api.ipify.org' because it violates CSP
```

**Solution:**
Add `ipDetectionEndpoint: '/api/my-ip'` to your configuration and create the `/api/my-ip` endpoint.

---

**Error:**
```
Refused to connect to 'https://localeos.co' because it violates CSP
```

**Solution:**
Add `https://localeos.co` to your CSP `connect-src` directive in `next.config.ts`:

```typescript
connect-src 'self' https://localeos.co;
```

### Analytics Tracking Fails

**Error:**
```
TypeError: Failed to fetch
```

**Checklist:**
1. ✅ Is `analytics: true` in your config?
2. ✅ Did you add `https://localeos.co` to CSP `connect-src`?
3. ✅ Is your API key valid?
4. ✅ Did you create the `/api/my-ip` endpoint?

### IP Detection Returns Wrong IP

**Check Headers:**
Different hosting providers use different headers:

- Cloudflare: `cf-connecting-ip`
- Vercel/Netlify: `x-forwarded-for`
- Nginx: `x-real-ip`

Update your `/api/my-ip` endpoint to check the correct header for your provider.

### TypeScript Errors

**Install type definitions:**
```bash
npm install --save-dev @types/node
```

**Import types:**
```typescript
import type {
  LocaleOSConfig,
  LocationInfo,
  DeviceInfo,
} from '@localeos/ip-info';
```

---

## Environment Variables

### Next.js

`.env.local`:
```env
NEXT_PUBLIC_LOCALEOS_API_KEY=leos_your-api-key-here
```

Usage:
```typescript
apiKey: process.env.NEXT_PUBLIC_LOCALEOS_API_KEY || ''
```

### Vite

`.env`:
```env
VITE_LOCALEOS_API_KEY=leos_your-api-key-here
```

Usage:
```typescript
apiKey: import.meta.env.VITE_LOCALEOS_API_KEY || ''
```

### Create React App

`.env`:
```env
REACT_APP_LOCALEOS_API_KEY=leos_your-api-key-here
```

Usage:
```typescript
apiKey: process.env.REACT_APP_LOCALEOS_API_KEY || ''
```

---

## Complete Working Example

Here's a complete, working example for Next.js App Router:

### 1. Install Package

```bash
npm install @localeos/ip-info
```

### 2. Create IP Detection Endpoint

`app/api/my-ip/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
             request.headers.get("x-real-ip") ||
             "8.8.8.8";

  return NextResponse.json({ ip });
}
```

### 3. Configure CSP

`next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `connect-src 'self' https://localeos.co;`.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### 4. Create Provider

`components/providers/LocaleOSProvider.tsx`:

```typescript
"use client";

import { useEffect } from "react";
import localeOS from "@localeos/ip-info";

export function LocaleOSProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    localeOS.init({
      apiKey: process.env.NEXT_PUBLIC_LOCALEOS_API_KEY || '',
      analytics: true,
      ipDetectionEndpoint: '/api/my-ip',
    });
  }, []);

  return <>{children}</>;
}
```

### 5. Use in Layout

`app/layout.tsx`:

```typescript
import { LocaleOSProvider } from "@/components/providers/LocaleOSProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LocaleOSProvider>{children}</LocaleOSProvider>
      </body>
    </html>
  );
}
```

### 6. Use SDK Methods (Optional)

`app/page.tsx`:

```typescript
"use client";

import { useEffect, useState } from "react";
import localeOS from "@localeos/ip-info";
import type { LocationInfo } from "@localeos/ip-info";

export default function Page() {
  const [location, setLocation] = useState<LocationInfo | null>(null);

  useEffect(() => {
    async function fetchLocation() {
      const data = await localeOS.getLocationInfo();
      setLocation(data);
    }
    fetchLocation();
  }, []);

  if (!location) return <div>Loading...</div>;

  return (
    <div>
      <h1>Your Location</h1>
      <p>Country: {location.country}</p>
      <p>City: {location.city}</p>
      <p>Currency: {location.currency}</p>
    </div>
  );
}
```

---

## Support

- **GitHub:** [Issues](https://github.com/localeOS/localeos-ip-info/issues)
- **Email:** support@localeos.co
- **Documentation:** [LocaleOS Docs](https://localeos.co/docs)

---

## License

MIT
