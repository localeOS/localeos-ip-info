# LocaleOS IP Info - Quick Start Guide

> **Version:** 1.0.12+ | **3-Minute Setup**

## Installation

```bash
npm install @localeos/ip-info
```

## Required Steps

### Step 1: Create IP Detection Endpoint ⚠️

**Next.js App Router** - Create `app/api/my-ip/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
             request.headers.get("x-real-ip") ||
             "8.8.8.8";
  return NextResponse.json({ ip });
}
```

**Next.js Pages Router** - Create `pages/api/my-ip.ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
             req.headers['x-real-ip'] ||
             '8.8.8.8';
  res.status(200).json({ ip });
}
```

---

### Step 2: Configure CSP Headers (if using `analytics: true`)

**Next.js 16+** - Update `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [{
      source: '/:path*',
      headers: [{
        key: 'Content-Security-Policy',
        value: `connect-src 'self' https://localeos.co;`.replace(/\s{2,}/g, ' ').trim(),
      }],
    }];
  },
};

export default nextConfig;
```

---

### Step 3: Initialize SDK

**Next.js App Router** - Create Provider:

```typescript
// components/providers/LocaleOSProvider.tsx
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

Wrap your app in `app/layout.tsx`:

```typescript
import { LocaleOSProvider } from "@/components/providers/LocaleOSProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <LocaleOSProvider>{children}</LocaleOSProvider>
      </body>
    </html>
  );
}
```

---

**Next.js Pages Router**:

```typescript
// pages/_app.tsx
import { useEffect } from 'react';
import localeOS from '@localeos/ip-info';

function MyApp({ Component, pageProps }) {
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

---

## Environment Variable

Create `.env.local`:

```env
NEXT_PUBLIC_LOCALEOS_API_KEY=leos_your-api-key-here
```

---

## Usage Examples

### Get Location Info

```typescript
import localeOS from '@localeos/ip-info';

const location = await localeOS.getLocationInfo();
console.log(location);
// { ip, country, city, timezone, currency, ... }
```

### Get Device Info

```typescript
const device = localeOS.getDeviceInfo();
console.log(device);
// { browser, os, device, screen, ... }
```

### Get Comprehensive Data

```typescript
const data = await localeOS.getComprehensiveData();
// Full IP intelligence data
```

---

## Checklist

- [ ] Install `@localeos/ip-info`
- [ ] Create `/api/my-ip` endpoint
- [ ] Configure CSP headers (add `https://localeos.co` to `connect-src`)
- [ ] Create LocaleOS provider component
- [ ] Initialize SDK with `ipDetectionEndpoint: '/api/my-ip'`
- [ ] Add environment variable `NEXT_PUBLIC_LOCALEOS_API_KEY`
- [ ] Test integration

---

## Troubleshooting

### CSP Violation: `api.ipify.org`

**Problem:** `Refused to connect to 'https://api.ipify.org'`

**Solution:** Add `ipDetectionEndpoint: '/api/my-ip'` to your `init()` config

### CSP Violation: `localeos.co`

**Problem:** `Refused to connect to 'https://localeos.co'`

**Solution:** Add `https://localeos.co` to your CSP `connect-src` directive

### Analytics Not Working

**Checklist:**
1. Is `analytics: true` in config?
2. Is `https://localeos.co` in CSP `connect-src`?
3. Did you create `/api/my-ip` endpoint?
4. Is your API key valid?

---

## Full Documentation

For detailed setup instructions, see:
- [Complete Implementation Guide](./COMPLETE_IMPLEMENTATION_GUIDE.md)
- [README](./README.md)
- [CSP Guide](./CSP_GUIDE.md)

---

## Support

- GitHub: [Issues](https://github.com/localeOS/localeos-ip-info/issues)
- Email: support@localeos.co
- Website: [LocaleOS.co](https://localeos.co)
