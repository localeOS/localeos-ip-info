import type { FingerprintComponents } from '../types';

/**
 * Generate a hash from a string using a simple hash algorithm
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Get canvas fingerprint
 */
function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    canvas.width = 200;
    canvas.height = 50;

    // Draw text with specific styling
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('LocaleOS Analytics 🔒', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('LocaleOS Analytics 🔒', 4, 17);

    return canvas.toDataURL();
  } catch (e) {
    return '';
  }
}

/**
 * Get WebGL fingerprint
 */
function getWebGLFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return '';

    const glContext = gl as WebGLRenderingContext;
    const debugInfo = glContext.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const vendor = glContext.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      const renderer = glContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      return `${vendor}~${renderer}`;
    }
    return '';
  } catch (e) {
    return '';
  }
}

/**
 * Get plugin information
 */
function getPlugins(): string {
  try {
    if (!navigator.plugins) return '';
    return Array.from(navigator.plugins)
      .map(plugin => plugin.name)
      .join(',');
  } catch (e) {
    return '';
  }
}

/**
 * Collect all fingerprint components
 */
export function collectFingerprintComponents(): FingerprintComponents {
  const nav = navigator as any;

  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    colorDepth: screen.colorDepth,
    deviceMemory: nav.deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
    screenResolution: `${screen.width}x${screen.height}`,
    availableScreenResolution: `${screen.availWidth}x${screen.availHeight}`,
    timezoneOffset: new Date().getTimezoneOffset(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    sessionStorage: !!window.sessionStorage,
    localStorage: !!window.localStorage,
    indexedDb: !!window.indexedDB,
    platform: navigator.platform,
    plugins: getPlugins(),
    canvas: getCanvasFingerprint(),
    webgl: getWebGLFingerprint(),
  };
}

/**
 * Generate a unique fingerprint from components
 */
export function generateFingerprint(components?: FingerprintComponents): string {
  const data = components || collectFingerprintComponents();

  // Create a string from all components
  const fingerprintString = [
    data.userAgent,
    data.language,
    data.colorDepth,
    data.deviceMemory || '',
    data.hardwareConcurrency || '',
    data.screenResolution,
    data.availableScreenResolution,
    data.timezoneOffset,
    data.timezone || '',
    data.sessionStorage,
    data.localStorage,
    data.indexedDb,
    data.platform,
    data.plugins,
    simpleHash(data.canvas || ''),
    simpleHash(data.webgl || ''),
  ].join('|');

  // Generate hash
  const hash = simpleHash(fingerprintString);

  return `fp_${hash}_${Date.now().toString(36)}`;
}

/**
 * Get or create a persistent fingerprint (stored in localStorage)
 */
export function getPersistentFingerprint(): string {
  const STORAGE_KEY = 'localeos_fingerprint';

  try {
    // Try to get existing fingerprint
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) {
      return existing;
    }

    // Generate new fingerprint
    const newFingerprint = generateFingerprint();
    localStorage.setItem(STORAGE_KEY, newFingerprint);
    return newFingerprint;
  } catch (e) {
    // If localStorage is not available, generate a session-based fingerprint
    return generateFingerprint();
  }
}
