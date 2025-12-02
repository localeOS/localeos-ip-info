# Content Security Policy (CSP) Compliance Guide

## Problem

By default, `@localeos/ip-info` uses `api.ipify.org` to detect the user's IP address. However, strict Content Security Policy (CSP) headers may block this external API call, causing errors like:

```
Refused to connect to 'https://api.ipify.org' because it violates the document's Content Security Policy.
```

## Solution

Use a **server-side endpoint** for IP detection instead of the external API.

## Implementation

### Step 1: Create a Server-Side IP Detection Endpoint

Create an API route that returns the user's IP address from server-side request headers:

#### Next.js App Router (Recommended)

Create `app/api/my-ip/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Try to get IP from various headers (for proxies/load balancers)
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const cfConnectingIp = request.headers.get("cf-connecting-ip"); // Cloudflare

    // Get the IP address from the most reliable source
    let ip = cfConnectingIp || forwardedFor?.split(",")[0] || realIp || "Unknown";

    // For local development, return a public IP for testing
    if (ip === "::1" || ip === "127.0.0.1" || ip === "Unknown") {
      ip = "8.8.8.8"; // Default to Google DNS for testing
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

### Step 2: Configure LocaleOS to Use Your Endpoint

Update your LocaleOS initialization:

```typescript
import LocaleOS from '@localeos/ip-info';

LocaleOS.init({
  apiKey: process.env.NEXT_PUBLIC_LOCALEOS_API_KEY!,
  analytics: true,
  ipDetectionEndpoint: '/api/my-ip' // 👈 Use your server-side endpoint
});
```

## How It Works

### Architecture
The LocaleOS SDK uses a **proxy pattern** where all API calls go through YOUR server:

```
Browser (SDK) → Your Server (/api/ip-lookup) → LocaleOS Backend → Response
         ✅ No external CSP issues - all requests stay on your domain
```

### IP Detection
For detecting the user's IP address:

**Default Behavior (Without Configuration)**
```
Browser → api.ipify.org (external API) → Get IP
         ❌ May violate CSP
```

**With Custom Endpoint (Recommended)**
```
Browser → Your Server (/api/my-ip) → Get IP from headers → Return to browser
         ✅ No CSP violations
```

## Benefits

✅ **No CSP Violations** - All requests stay within your domain
✅ **More Reliable** - Works with any CSP configuration
✅ **Better Privacy** - No external API calls
✅ **Production Ready** - Supports Cloudflare, proxies, load balancers
✅ **Backward Compatible** - Still works without configuration (uses ipify)

## Headers Checked (In Order)

The server-side endpoint checks these headers to find the real IP:

1. `cf-connecting-ip` - Cloudflare
2. `x-forwarded-for` - Proxies/Load Balancers
3. `x-real-ip` - Nginx
4. Fallback to `8.8.8.8` for local development

## Testing

Test your endpoint:

```bash
curl http://localhost:3000/api/my-ip
# Response: {"ip":"8.8.8.8"}
```

## Full Example

```typescript
// app/layout.tsx or pages/_app.tsx
'use client';

import { useEffect } from 'react';
import LocaleOS from '@localeos/ip-info';

export default function RootLayout({ children }) {
  useEffect(() => {
    // Initialize with custom IP detection endpoint
    LocaleOS.init({
      apiKey: process.env.NEXT_PUBLIC_LOCALEOS_API_KEY!,
      analytics: true,
      ipDetectionEndpoint: '/api/my-ip',
      cacheDuration: 24 * 60 * 60 * 1000, // 24 hours
    });
  }, []);

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

## Troubleshooting

### Still Getting CSP Errors?

1. **Check your CSP headers** - Make sure they allow requests to your own domain
2. **Verify the endpoint works** - Test it with `curl` or browser DevTools
3. **Check the response format** - Must return `{ "ip": "xxx.xxx.xxx.xxx" }`

### Endpoint Returns Wrong IP?

- Check your hosting provider's documentation for the correct header
- Some platforms use custom headers (e.g., Vercel uses `x-forwarded-for`)
- Add more header checks to the endpoint

### Local Development Issues?

- The endpoint falls back to `8.8.8.8` for localhost IPs
- This is expected behavior for testing
- Production will return the real IP

## Version Requirements

- `@localeos/ip-info` >= 1.0.5

## Migration from ipify.org

Before (CSP violations):
```typescript
LocaleOS.init({
  apiKey: process.env.NEXT_PUBLIC_LOCALEOS_API_KEY!
});
// Uses api.ipify.org by default
```

After (CSP compliant):
```typescript
LocaleOS.init({
  apiKey: process.env.NEXT_PUBLIC_LOCALEOS_API_KEY!,
  ipDetectionEndpoint: '/api/my-ip' // Your server-side endpoint
});
```

## Questions?

- GitHub Issues: https://github.com/localeOS/localeos-ip-info/issues
- Email: support@localeos.co
