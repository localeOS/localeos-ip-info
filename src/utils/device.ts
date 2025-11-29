import type { DeviceInfo } from '../types';

/**
 * Detect browser name and version from user agent
 */
function detectBrowser(userAgent: string): string {
  const browsers = [
    { name: 'Chrome', pattern: /Chrome\/(\d+)/ },
    { name: 'Firefox', pattern: /Firefox\/(\d+)/ },
    { name: 'Safari', pattern: /Version\/(\d+).*Safari/ },
    { name: 'Edge', pattern: /Edg\/(\d+)/ },
    { name: 'Opera', pattern: /OPR\/(\d+)/ },
    { name: 'IE', pattern: /MSIE (\d+)/ },
  ];

  for (const browser of browsers) {
    const match = userAgent.match(browser.pattern);
    if (match) {
      return `${browser.name} ${match[1]}`;
    }
  }

  return 'Unknown Browser';
}

/**
 * Detect operating system from user agent
 */
function detectOS(userAgent: string): string {
  const osList = [
    { name: 'Windows 11', pattern: /Windows NT 10.0.*rv:11/ },
    { name: 'Windows 10', pattern: /Windows NT 10.0/ },
    { name: 'Windows 8.1', pattern: /Windows NT 6.3/ },
    { name: 'Windows 8', pattern: /Windows NT 6.2/ },
    { name: 'Windows 7', pattern: /Windows NT 6.1/ },
    { name: 'macOS', pattern: /Mac OS X (\d+[._]\d+)/ },
    { name: 'iOS', pattern: /iPhone OS (\d+[._]\d+)/ },
    { name: 'iPad OS', pattern: /iPad.*OS (\d+[._]\d+)/ },
    { name: 'Android', pattern: /Android (\d+)/ },
    { name: 'Linux', pattern: /Linux/ },
    { name: 'ChromeOS', pattern: /CrOS/ },
  ];

  for (const os of osList) {
    const match = userAgent.match(os.pattern);
    if (match) {
      if (match[1]) {
        const version = match[1].replace(/_/g, '.');
        return `${os.name} ${version}`;
      }
      return os.name;
    }
  }

  return 'Unknown OS';
}

/**
 * Detect device type
 */
function detectDeviceType(userAgent: string): string {
  const mobilePattern = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const tabletPattern = /iPad|Android(?!.*Mobile)/i;

  if (tabletPattern.test(userAgent)) {
    return 'Tablet';
  }

  if (mobilePattern.test(userAgent)) {
    return 'Mobile';
  }

  return 'Desktop';
}

/**
 * Get comprehensive device information
 */
export function getDeviceInfo(): DeviceInfo {
  const userAgent = navigator.userAgent;

  return {
    browser: detectBrowser(userAgent),
    os: detectOS(userAgent),
    device: detectDeviceType(userAgent),
    screen: {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
    },
    timezone: new Date().getTimezoneOffset(),
    language: navigator.language,
    cores: navigator.hardwareConcurrency,
  };
}

/**
 * Check if the environment is a browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Check if the user is on a mobile device
 */
export function isMobile(): boolean {
  if (!isBrowser()) return false;
  return detectDeviceType(navigator.userAgent) === 'Mobile';
}

/**
 * Check if the user is on a tablet
 */
export function isTablet(): boolean {
  if (!isBrowser()) return false;
  return detectDeviceType(navigator.userAgent) === 'Tablet';
}

/**
 * Check if the user is on a desktop
 */
export function isDesktop(): boolean {
  if (!isBrowser()) return false;
  return detectDeviceType(navigator.userAgent) === 'Desktop';
}
