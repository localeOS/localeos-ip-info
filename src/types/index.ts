/**
 * Configuration options for initializing LocaleOS Analytics
 */
export interface LocaleOSConfig {
  /**
   * Your secret API key from LocaleOS dashboard
   * IMPORTANT: Keep this key secret and never expose it in client-side code
   * Use environment variables to store this key securely
   */
  apiKey: string;

  /**
   * Enable/disable analytics tracking (optional, defaults to false)
   * Set to true to enable automatic visit tracking and event tracking
   */
  analytics?: boolean;

  /**
   * Cache duration in milliseconds for location data (optional, defaults to 24 hours)
   * Set to 0 to disable caching
   * Location data is cached in localStorage to prevent unnecessary API calls
   */
  cacheDuration?: number;

  /**
   * Custom endpoint for IP detection (optional)
   * Use this if you want to avoid CSP issues by using your own server-side endpoint
   * The endpoint should return JSON with an "ip" field
   * Example: '/api/my-ip' or 'https://yourdomain.com/api/my-ip'
   * If not provided, falls back to 'https://api.ipify.org?format=json'
   */
  ipDetectionEndpoint?: string;
}

/**
 * Event data for tracking
 */
export interface TrackingEvent {
  /**
   * Event name (e.g., 'page_view', 'button_click')
   */
  event?: string;
}

/**
 * Device information detected from the browser
 */
export interface DeviceInfo {
  /**
   * Browser name and version
   */
  browser: string;

  /**
   * Operating system name and version
   */
  os: string;

  /**
   * Device type (Desktop, Mobile, Tablet)
   */
  device: string;

  /**
   * Screen resolution
   */
  screen?: {
    width: number;
    height: number;
    colorDepth: number;
  };

  /**
   * Timezone offset
   */
  timezone?: number;

  /**
   * Language
   */
  language?: string;

  /**
   * Hardware concurrency (CPU cores)
   */
  cores?: number;
}

/**
 * Location information from IP address
 */
export interface LocationInfo {
  /**
   * IP address
   */
  ip: string;

  /**
   * Country name
   */
  country?: string;

  /**
   * Country code (ISO 3166-1 alpha-2)
   */
  countryCode?: string;

  /**
   * Region/State
   */
  region?: string;

  /**
   * City
   */
  city?: string;

  /**
   * Postal code
   */
  postalCode?: string;

  /**
   * Latitude
   */
  latitude?: number;

  /**
   * Longitude
   */
  longitude?: number;

  /**
   * Timezone (e.g., "America/New_York")
   */
  timezone?: string;

  /**
   * Currency code (e.g., "USD")
   */
  currency?: string;

  /**
   * Currency symbol (e.g., "$")
   */
  currencySymbol?: string;

  /**
   * Device information detected from browser and server
   */
  deviceInfo?: {
    /**
     * Client-side device info from browser
     */
    client?: DeviceInfo;

    /**
     * Server-side device info from IP lookup
     */
    server?: {
      name: string;
      type: string | null;
      brand: string | null;
      model: string | null;
      os: string | null;
      os_version: string | null;
      browser: string | null;
      browser_version: string | null;
      is_mobile: boolean;
      is_tablet: boolean;
      is_desktop: boolean;
      is_bot: boolean;
      user_agent: string | null;
    };
  };
}

/**
 * Fingerprint components used to generate unique system ID
 */
export interface FingerprintComponents {
  userAgent: string;
  language: string;
  colorDepth: number;
  deviceMemory?: number;
  hardwareConcurrency?: number;
  screenResolution: string;
  availableScreenResolution: string;
  timezoneOffset: number;
  timezone?: string;
  sessionStorage: boolean;
  localStorage: boolean;
  indexedDb: boolean;
  platform: string;
  plugins: string;
  canvas?: string;
  webgl?: string;
}

/**
 * Response from the tracking API
 */
export interface TrackingResponse {
  success: boolean;
  logId?: string;
  message?: string;
  error?: string;
}

/**
 * Timezone information for an IP address
 */
export interface TimezoneInfo {
  /**
   * Timezone name (e.g., "America/New_York")
   */
  name: string;

  /**
   * Timezone abbreviation (e.g., "EST", "PST")
   */
  abbr: string;

  /**
   * UTC offset in format "+HHMM" or "-HHMM"
   */
  offset: string;

  /**
   * Whether daylight saving time is currently active
   */
  is_dst: boolean;

  /**
   * Current time in the timezone (ISO 8601 format)
   */
  current_time: string;
}

/**
 * Currency information for an IP address
 */
export interface CurrencyInfo {
  /**
   * Currency name (e.g., "US Dollar")
   */
  name: string;

  /**
   * Currency code (ISO 4217, e.g., "USD")
   */
  code: string;

  /**
   * Currency symbol (e.g., "$")
   */
  symbol: string;

  /**
   * Native currency symbol
   */
  native: string;

  /**
   * Plural form of the currency name
   */
  plural: string;
}

/**
 * ASN (Autonomous System Number) information
 */
export interface ASNInfo {
  /**
   * ASN number (e.g., "AS15169")
   */
  asn: string;

  /**
   * Organization name
   */
  name: string;

  /**
   * Domain name
   */
  domain: string | null;

  /**
   * IP route/network
   */
  route: string | null;

  /**
   * Connection type (e.g., "isp", "hosting")
   */
  type: string;
}

/**
 * Company information for an IP address
 */
export interface CompanyInfo {
  /**
   * Company name
   */
  name: string;

  /**
   * Company domain
   */
  domain: string | null;

  /**
   * Network identifier
   */
  network: string | null;

  /**
   * Organization type (e.g., "business", "education")
   */
  type: string;
}

/**
 * Comprehensive IP data in ipdata.co format
 */
export interface ComprehensiveIPData {
  /**
   * IP address
   */
  ip: string;

  /**
   * Whether the IP is in the European Union
   */
  is_eu: boolean;

  /**
   * City name
   */
  city: string | null;

  /**
   * Region/State name
   */
  region: string | null;

  /**
   * Region code
   */
  region_code: string | null;

  /**
   * Region type (e.g., "state", "province")
   */
  region_type: string;

  /**
   * Country name
   */
  country_name: string | null;

  /**
   * Country code (ISO 3166-1 alpha-2)
   */
  country_code: string | null;

  /**
   * Continent name
   */
  continent_name: string | null;

  /**
   * Continent code
   */
  continent_code: string | null;

  /**
   * Latitude coordinate
   */
  latitude: number | null;

  /**
   * Longitude coordinate
   */
  longitude: number | null;

  /**
   * Postal/ZIP code
   */
  postal: string | null;

  /**
   * Country calling code
   */
  calling_code: string | null;

  /**
   * Country flag image URL
   */
  flag: string;

  /**
   * Country flag emoji
   */
  emoji_flag: string | null;

  /**
   * Flag emoji unicode
   */
  emoji_unicode: string | null;

  /**
   * ASN information
   */
  asn?: ASNInfo;

  /**
   * Company information
   */
  company?: CompanyInfo;

  /**
   * Mobile carrier information
   */
  carrier?: {
    name: string | null;
    mcc: string | null;
    mnc: string | null;
  };

  /**
   * Privacy/proxy detection
   */
  privacy: {
    vpn: boolean;
    proxy: boolean;
    tor: boolean;
    relay: boolean;
    hosting: boolean;
    service: string;
  };

  /**
   * Abuse contact information
   */
  abuse: {
    address: string | null;
    country: string | null;
    email: string | null;
    name: string | null;
    network: string | null;
    phone: string | null;
  };

  /**
   * Associated domains
   */
  domains: string[];

  /**
   * Timezone information
   */
  time_zone?: TimezoneInfo;

  /**
   * Currency information
   */
  currency?: CurrencyInfo;

  /**
   * Security/threat information
   */
  security: {
    is_threat: boolean;
    is_bogon: boolean;
    is_tor: boolean;
    is_tor_exit: boolean;
    threat_level: string;
    threat_types: string[];
  };

  /**
   * Languages spoken in the region
   */
  languages: string[];

  /**
   * Device information from User-Agent
   */
  device?: {
    name: string;
    type: string | null;
    brand: string | null;
    model: string | null;
    os: string | null;
    os_version: string | null;
    browser: string | null;
    browser_version: string | null;
    is_mobile: boolean;
    is_tablet: boolean;
    is_desktop: boolean;
    is_bot: boolean;
    user_agent: string | null;
  };
}
