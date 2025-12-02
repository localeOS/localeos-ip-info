import type {
  LocaleOSConfig,
  TrackingResponse,
  LocationInfo,
  TimezoneInfo,
  CurrencyInfo,
  ASNInfo,
  CompanyInfo,
  ComprehensiveIPData,
} from './types';
import { getPersistentFingerprint, generateFingerprint } from './utils/fingerprint';
import { getDeviceInfo, isBrowser } from './utils/device';

class LocaleOSAnalytics {
  private apiKey: string = '';
  private apiUrl: string = '';
  private analyticsEnabled: boolean = false;
  private fingerprint: string | null = null;
  private initialized = false;
  private locationCache: LocationInfo | null = null;
  private cacheDuration: number = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  private cacheKey = 'localeos_location_cache';
  private ipDetectionEndpoint: string = 'https://api.ipify.org?format=json';

  constructor() {
    // Empty constructor - configuration happens in init()
  }

  /**
   * Initialize LocaleOS Analytics
   */
  public init(config: LocaleOSConfig): void {
    if (!isBrowser()) {
      console.warn('[LocaleOS] Can only be initialized in a browser environment');
      return;
    }

    if (!config.apiKey) {
      throw new Error('API key is required to initialize LocaleOS Analytics');
    }

    // Store API key securely
    this.apiKey = config.apiKey;

    // Set API URL (custom or default)
    this.apiUrl = config.apiUrl || this.getDefaultApiUrl();
    this.analyticsEnabled = config.analytics || false;

    // Set cache duration (defaults to 24 hours)
    if (config.cacheDuration !== undefined) {
      this.cacheDuration = config.cacheDuration;
    }

    // Set custom IP detection endpoint if provided
    if (config.ipDetectionEndpoint) {
      this.ipDetectionEndpoint = config.ipDetectionEndpoint;
    }

    // Always use internal fingerprinting
    this.fingerprint = getPersistentFingerprint();

    this.initialized = true;

    // Automatically track visit if analytics is enabled
    if (this.analyticsEnabled) {
      this.sendTrackingRequest();
    }
  }

  /**
   * Get device information
   */
  public getDeviceInfo() {
    if (!isBrowser()) return null;
    return getDeviceInfo();
  }

  /**
   * Get user's IP address from configured endpoint
   * @private
   */
  private async getUserIP(): Promise<string> {
    const ipResponse = await fetch(this.ipDetectionEndpoint);
    const ipData = await ipResponse.json();
    return ipData.ip;
  }

  /**
   * Get location information from IP address
   * Includes country, city, timezone, currency, and device information
   * Uses localStorage cache to prevent unnecessary API calls
   * Automatically invalidates cache if IP address changes
   */
  public async getLocationInfo(): Promise<LocationInfo | null> {
    if (!isBrowser()) return null;

    try {
      // Always check current IP first (lightweight call)
      // Get user IP from configured endpoint
      const currentIp = await this.getUserIP();
      

      // Check if we have memory cache and IP matches
      if (this.locationCache && this.locationCache.ip === currentIp) {
        return this.locationCache;
      }

      // Check localStorage cache if caching is enabled
      if (this.cacheDuration > 0) {
        const cached = this.getFromCache();

        // Validate cached IP matches current IP
        if (cached && cached.ip === currentIp) {
          this.locationCache = cached;
          return cached;
        } else if (cached && cached.ip !== currentIp) {
          // IP changed - clear stale cache
          console.log('[LocaleOS] IP address changed, invalidating cache');
          this.clearCache();
        }
      }

      // Fetch fresh location data
      const locationResponse = await fetch(
        `${this.apiUrl}/api/ip-lookup?ip=${currentIp}&api_key=${this.apiKey}`
      );
      const locationData = await locationResponse.json();

      if (locationData.status === 'success') {
        // Get client-side device info
        const clientDeviceInfo = getDeviceInfo();

        this.locationCache = {
          ip: currentIp,
          country: locationData.country,
          countryCode: locationData.country_code,
          region: locationData.region,
          city: locationData.city,
          postalCode: locationData.postal_code,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          timezone: locationData.timezone,
          currency: locationData.currency,
          currencySymbol: locationData.currency_symbol,
          deviceInfo: {
            client: clientDeviceInfo,
            server: locationData.device,
          },
        };

        // Save to localStorage cache if caching is enabled
        if (this.cacheDuration > 0) {
          this.saveToCache(this.locationCache);
        }

        return this.locationCache;
      }

      return null;
    } catch (error) {
      console.error('[LocaleOS] Error fetching location info:', error);
      return null;
    }
  }

  /**
   * Get comprehensive IP data in ipdata.co format
   * @param ip - Optional IP address (defaults to user's IP)
   * @returns Complete IP intelligence data
   */
  public async getComprehensiveData(ip?: string): Promise<ComprehensiveIPData | null> {
    if (!isBrowser()) return null;

    try {
      // Get user's IP if not provided
      let targetIp = ip;
      if (!targetIp) {
        // Get user IP from configured endpoint
        const currentIp = await this.getUserIP();
        targetIp = currentIp;
      }

      // Fetch comprehensive data from ipdata endpoint with API key
      const response = await fetch(`${this.apiUrl}/api/ipdata/${targetIp}?api_key=${this.apiKey}`);

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data: ComprehensiveIPData = await response.json();
      return data;
    } catch (error) {
      console.error('[LocaleOS] Error fetching comprehensive IP data:', error);
      return null;
    }
  }

  /**
   * Get timezone information for an IP address
   * @param ip - Optional IP address (defaults to user's IP)
   * @returns Timezone details including abbreviation, offset, and DST status
   */
  public async getTimezone(ip?: string): Promise<TimezoneInfo | null> {
    if (!isBrowser()) return null;

    try {
      // Get user's IP if not provided
      let targetIp = ip;
      if (!targetIp) {
        // Get user IP from configured endpoint
        const currentIp = await this.getUserIP();
        targetIp = currentIp;
      }

      // Fetch timezone data with API key
      const response = await fetch(`${this.apiUrl}/api/ipdata/${targetIp}/time_zone?api_key=${this.apiKey}`);

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data: TimezoneInfo = await response.json();
      return data;
    } catch (error) {
      console.error('[LocaleOS] Error fetching timezone info:', error);
      return null;
    }
  }

  /**
   * Get currency information for an IP address
   * @param ip - Optional IP address (defaults to user's IP)
   * @returns Currency details including code, symbol, and name
   */
  public async getCurrency(ip?: string): Promise<CurrencyInfo | null> {
    if (!isBrowser()) return null;

    try {
      // Get user's IP if not provided
      let targetIp = ip;
      if (!targetIp) {
        // Get user IP from configured endpoint
        const currentIp = await this.getUserIP();
        targetIp = currentIp;
      }

      // Fetch currency data with API key
      const response = await fetch(`${this.apiUrl}/api/ipdata/${targetIp}/currency?api_key=${this.apiKey}`);

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data: CurrencyInfo = await response.json();
      return data;
    } catch (error) {
      console.error('[LocaleOS] Error fetching currency info:', error);
      return null;
    }
  }

  /**
   * Get ASN (Autonomous System Number) information for an IP address
   * @param ip - Optional IP address (defaults to user's IP)
   * @returns ASN details including organization name, domain, and route
   */
  public async getASN(ip?: string): Promise<ASNInfo | null> {
    if (!isBrowser()) return null;

    try {
      // Get user's IP if not provided
      let targetIp = ip;
      if (!targetIp) {
        // Get user IP from configured endpoint
        const currentIp = await this.getUserIP();
        targetIp = currentIp;
      }

      // Fetch ASN data with API key
      const response = await fetch(`${this.apiUrl}/api/ipdata/${targetIp}/asn?api_key=${this.apiKey}`);

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data: ASNInfo = await response.json();
      return data;
    } catch (error) {
      console.error('[LocaleOS] Error fetching ASN info:', error);
      return null;
    }
  }

  /**
   * Get company information for an IP address
   * @param ip - Optional IP address (defaults to user's IP)
   * @returns Company details including name, domain, and network
   */
  public async getCompany(ip?: string): Promise<CompanyInfo | null> {
    if (!isBrowser()) return null;

    try {
      // Get user's IP if not provided
      let targetIp = ip;
      if (!targetIp) {
        // Get user IP from configured endpoint
        const currentIp = await this.getUserIP();
        targetIp = currentIp;
      }

      // Fetch company data with API key
      const response = await fetch(`${this.apiUrl}/api/ipdata/${targetIp}/company?api_key=${this.apiKey}`);

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data: CompanyInfo = await response.json();
      return data;
    } catch (error) {
      console.error('[LocaleOS] Error fetching company info:', error);
      return null;
    }
  }

  /**
   * Send tracking request to the API
   */
  private async sendTrackingRequest(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/api/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
        },
        body: JSON.stringify({
          fingerprint: this.fingerprint,
        }),
      });

      const data: TrackingResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to track event');
      }

      return true;
    } catch (error) {
      console.error('[LocaleOS] Error tracking event:', error);
      return false;
    }
  }

  /**
   * Get default API URL based on current environment
   */
  private getDefaultApiUrl(): string {
    // Always use LocaleOS API by default
    // Users need to add 'https://localeos.co' to their CSP connect-src
    // This is standard practice for third-party SDKs
    return 'https://localeos.co';
  }

  /**
   * Save location data to localStorage cache
   */
  private saveToCache(data: LocationInfo): void {
    if (!isBrowser()) return;

    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('[LocaleOS] Failed to save cache to localStorage:', error);
    }
  }

  /**
   * Get location data from localStorage cache
   * Returns null if cache is expired or invalid
   */
  private getFromCache(): LocationInfo | null {
    if (!isBrowser()) return null;

    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is still valid
      if (now - timestamp < this.cacheDuration) {
        return data;
      }

      // Cache expired, remove it
      this.clearCache();
      return null;
    } catch (error) {
      console.warn('[LocaleOS] Failed to read cache from localStorage:', error);
      return null;
    }
  }

  /**
   * Clear the location cache from both memory and localStorage
   * Useful when you want to force a fresh fetch of location data
   */
  public clearCache(): void {
    this.locationCache = null;

    if (isBrowser()) {
      try {
        localStorage.removeItem(this.cacheKey);
      } catch (error) {
        console.warn('[LocaleOS] Failed to clear cache from localStorage:', error);
      }
    }
  }
}

// Create singleton instance
const localeOS = new LocaleOSAnalytics();

// Export singleton instance as default
export default localeOS;

// Export class for advanced usage
export { LocaleOSAnalytics };

// Export types
export * from './types';

// Export utilities
export { generateFingerprint, getPersistentFingerprint } from './utils/fingerprint';
export { getDeviceInfo, isBrowser, isMobile, isTablet, isDesktop } from './utils/device';

// Export specific types for convenience
export type {
  LocationInfo,
  TimezoneInfo,
  CurrencyInfo,
  ASNInfo,
  CompanyInfo,
  ComprehensiveIPData,
} from './types';
