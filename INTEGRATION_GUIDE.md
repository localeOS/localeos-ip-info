# LocaleOS IP Info - Integration Guide

## Installation

### For External Users (Published to npm)

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

### For This Project (Local Development)

Already installed! Located at `packages/localeos-analytics`

---

## Quick Start (3 Steps)

### Step 1: Get Your API Key

1. Log in to your dashboard at `/dashboard`
2. Click "Create New App"
3. Copy the generated API Key

### Step 2: Initialize the SDK

The easiest way is to initialize it in your app's root component or layout.

#### Option A: Next.js App Router (Recommended)

**File: `components/localeos-provider.tsx`** (Already created in this project)

```tsx
'use client';

import { useEffect } from 'react';
import LocaleOS from '@localeos/ip-info';

export function LocaleOSProvider({
  children,
  appId
}: {
  children: React.ReactNode;
  apiKey: string;
}) {
  useEffect(() => {
    LocaleOS.init({
      appId,
      debug: process.env.NODE_ENV === 'development',
      autoTrack: true, // Auto-track page views
    });
  }, [appId]);

  return <>{children}</>;
}

export { default as LocaleOS } from '@localeos/ip-info';
```

**File: `app/layout.tsx`**

```tsx
import { LocaleOSProvider } from '@/components/localeos-provider';

const LOCALEOS_API_KEY = 'leos_your-api-key-here';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LocaleOSProvider appId={LOCALEOS_API_KEY}>
          {children}
        </LocaleOSProvider>
      </body>
    </html>
  );
}
```

#### Option B: Next.js Pages Router

**File: `pages/_app.js`**

```jsx
import { useEffect } from 'react';
import LocaleOS from '@localeos/ip-info';

const LOCALEOS_API_KEY = 'leos_your-api-key-here';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    LocaleOS.init({
      apiKey: LOCALEOS_API_KEY,
      debug: process.env.NODE_ENV === 'development',
      autoTrack: true,
    });
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
```

#### Option C: React (CRA, Vite, etc.)

**File: `src/App.jsx` or `src/main.jsx`**

```jsx
import { useEffect } from 'react';
import LocaleOS from '@localeos/ip-info';

function App() {
  useEffect(() => {
    LocaleOS.init({
      apiKey: 'leos_your-api-key-here',
      debug: true,
      autoTrack: true,
    });
  }, []);

  return <div className="App">{/* Your app */}</div>;
}

export default App;
```

#### Option D: Vanilla JavaScript

**File: `index.html` or your main JS file**

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import LocaleOS from '@localeos/ip-info';

    LocaleOS.init({
      apiKey: 'leos_your-api-key-here',
      debug: true,
      autoTrack: true,
    });
  </script>
</head>
<body>
  <!-- Your content -->
</body>
</html>
```

### Step 3: Track Events (Optional)

The SDK automatically tracks page views if `autoTrack: true`. For custom events:

```tsx
import LocaleOS from '@localeos/ip-info';

// Track a custom event
await LocaleOS.track('button_click', {
  buttonId: 'signup',
  page: '/pricing'
});

// Track page view manually
await LocaleOS.trackPageView({
  customField: 'value'
});

// Track named event
await LocaleOS.trackEvent('purchase', {
  productId: '123',
  price: 99.99
});
```

---

## Configuration Options

```typescript
LocaleOS.init({
  // Required: Your API key from dashboard
  apiKey: 'leos_your-api-key-here',

  // Optional: Custom API endpoint (defaults to current origin)
  apiUrl: 'https://your-domain.com',

  // Optional: Enable debug logging
  debug: false,

  // Optional: Auto-track page views
  autoTrack: true,

  // Optional: Custom fingerprint (use your own user ID)
  customFingerprint: 'user-123',

  // Optional: Disable fingerprinting
  disableFingerprinting: false,

  // Optional: Retry attempts for failed requests
  retryAttempts: 3,

  // Optional: Retry delay in milliseconds
  retryDelay: 1000,
});
```

---

## Where to Add It?

### ✅ Best Practices

1. **Initialize Once** - Add to your root component/layout
2. **High in the Tree** - Initialize as early as possible to catch all page views
3. **Client-Side Only** - Use `'use client'` directive in Next.js App Router
4. **Environment Variables** - Store API key in env vars for production

### 📁 Recommended Locations by Framework

| Framework | Best Location | File Name |
|-----------|--------------|-----------|
| Next.js App Router | Root Layout | `app/layout.tsx` |
| Next.js Pages Router | Custom App | `pages/_app.tsx` |
| React (CRA) | App Component | `src/App.tsx` |
| React (Vite) | Main Entry | `src/main.tsx` |
| Vue | Main Entry | `src/main.js` |
| Vanilla JS | HTML Head | `index.html` |

---

## Environment Variables (Recommended)

Instead of hardcoding your API key, use environment variables:

### Next.js

**File: `.env.local`**

```env
NEXT_PUBLIC_LOCALEOS_API_KEY=leos_your-api-key-here
```

**File: `app/layout.tsx`**

```tsx
const LOCALEOS_API_KEY = process.env.NEXT_PUBLIC_LOCALEOS_API_KEY!;

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <LocaleOSProvider appId={LOCALEOS_API_KEY}>
          {children}
        </LocaleOSProvider>
      </body>
    </html>
  );
}
```

### React (Vite)

**File: `.env`**

```env
VITE_LOCALEOS_API_KEY=leos_your-api-key-here
```

**File: `src/App.tsx`**

```tsx
const appId = import.meta.env.VITE_LOCALEOS_API_KEY;

LocaleOS.init({ appId });
```

### React (CRA)

**File: `.env`**

```env
REACT_APP_LOCALEOS_API_KEY=leos_your-api-key-here
```

**File: `src/App.tsx`**

```tsx
const appId = process.env.REACT_APP_LOCALEOS_API_KEY;

LocaleOS.init({ appId });
```

---

## Complete Example for This Project

You already have this set up! Here's what was added:

### 1. Provider Component
`components/localeos-provider.tsx` - Initializes SDK with API key

### 2. Root Integration
`components/providers.tsx` - Wraps app with LocaleOS tracking

### 3. Demo Component (Optional)
`components/localeos-demo.tsx` - Shows how to use SDK methods

### 4. Homepage Integration (Optional)
`app/page.tsx` - Displays demo on homepage

---

## Testing the Integration

### Check Browser Console

After initialization, you should see:

```
LocaleOS initialized with API key: 7a9f9a40e...
System fingerprint: fp_abc123_xyz
Device info: { browser: "Chrome 120", os: "macOS", ... }
```

### View Analytics

1. Visit `/dashboard`
2. Select your app from the sidebar
3. See real-time analytics including:
   - Total unique system visits
   - Device breakdown (Desktop/Mobile/Tablet)
   - Browser breakdown
   - OS breakdown
   - Recent logs with timestamps

### Manual Test

```tsx
// Track a test event
const success = await LocaleOS.track('test_event', {
  timestamp: new Date().toISOString()
});

console.log('Event tracked:', success);
```

---

## Common Integration Patterns

### 1. E-commerce Tracking

```tsx
// Track product views
LocaleOS.track('product_view', {
  productId: product.id,
  category: product.category,
  price: product.price
});

// Track purchases
LocaleOS.track('purchase', {
  orderId: order.id,
  total: order.total,
  items: order.items.length
});
```

### 2. Form Tracking

```tsx
const handleSubmit = async (e) => {
  e.preventDefault();

  // Track form submission
  await LocaleOS.track('form_submit', {
    formName: 'contact',
    page: window.location.pathname
  });

  // Submit form
  // ...
};
```

### 3. Button Click Tracking

```tsx
<button onClick={async () => {
  await LocaleOS.track('cta_click', {
    buttonText: 'Get Started',
    location: 'hero'
  });
  // Navigate or perform action
}}>
  Get Started
</button>
```

### 4. Page View Tracking (Manual)

```tsx
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import LocaleOS from '@localeos/ip-info';

export function usePageTracking() {
  const pathname = usePathname();

  useEffect(() => {
    LocaleOS.trackPageView({
      path: pathname
    });
  }, [pathname]);
}
```

---

## Troubleshooting

### SDK Not Tracking

1. Check browser console for initialization logs
2. Ensure API key is correct
3. Verify API endpoint is accessible
4. Check network tab for `/api/track` requests

### CORS Issues

If hosting API on different domain, ensure CORS is enabled in `/api/track/route.ts`

### TypeScript Errors

Install type definitions:
```bash
npm install --save-dev @types/node
```

---

## Next Steps

1. ✅ Install package
2. ✅ Initialize SDK in root component
3. ✅ Get API key from dashboard
4. ✅ Test integration
5. ✅ View analytics in dashboard
6. Track custom events
7. Monitor user behavior
8. Optimize based on data

---

## Support

For issues or questions:
- GitHub: https://github.com/localeos/analytics/issues
- Email: support@localeos.co
- Docs: https://docs.localeos.co
