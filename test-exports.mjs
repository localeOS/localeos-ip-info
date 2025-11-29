/**
 * Test file to verify package exports from the built distribution
 * Run with: node test-exports.mjs
 */

import LocaleOS from './dist/index.mjs';
import {
  LocaleOSAnalytics,
  generateFingerprint,
  getPersistentFingerprint,
  getDeviceInfo,
  isBrowser,
  isMobile,
  isTablet,
  isDesktop,
} from './dist/index.mjs';

console.log('🧪 Testing NPM Package Exports...\n');

// Test 1: Default export
console.log('✅ Test 1: Default export exists');
if (!LocaleOS) {
  throw new Error('Default export (LocaleOS) is undefined');
}
if (typeof LocaleOS !== 'object') {
  throw new Error('Default export should be an object instance');
}

// Test 2: Class export
console.log('✅ Test 2: LocaleOSAnalytics class export exists');
if (!LocaleOSAnalytics) {
  throw new Error('LocaleOSAnalytics class is undefined');
}
if (typeof LocaleOSAnalytics !== 'function') {
  throw new Error('LocaleOSAnalytics should be a constructor function');
}

// Test 3: Utility function exports
console.log('✅ Test 3: Utility functions exported');
if (typeof generateFingerprint !== 'function') {
  throw new Error('generateFingerprint should be a function');
}
if (typeof getPersistentFingerprint !== 'function') {
  throw new Error('getPersistentFingerprint should be a function');
}
if (typeof getDeviceInfo !== 'function') {
  throw new Error('getDeviceInfo should be a function');
}
if (typeof isBrowser !== 'function') {
  throw new Error('isBrowser should be a function');
}
if (typeof isMobile !== 'function') {
  throw new Error('isMobile should be a function');
}
if (typeof isTablet !== 'function') {
  throw new Error('isTablet should be a function');
}
if (typeof isDesktop !== 'function') {
  throw new Error('isDesktop should be a function');
}

// Test 4: Default instance has all required methods
console.log('✅ Test 4: Default instance has all documented methods');
const requiredMethods = [
  'init',
  'getDeviceInfo',
  'getLocationInfo',
  'getComprehensiveData',
  'getTimezone',
  'getCurrency',
  'getASN',
  'getCompany',
  'clearCache',
];

for (const method of requiredMethods) {
  if (typeof LocaleOS[method] !== 'function') {
    throw new Error(`Method '${method}' is missing or not a function`);
  }
}

// Test 5: Verify outdated methods don't exist
console.log('✅ Test 5: Outdated methods do not exist');
const outdatedMethods = ['track', 'trackEvent', 'trackPageView'];

for (const method of outdatedMethods) {
  if (method in LocaleOS) {
    throw new Error(`Outdated method '${method}' should not exist`);
  }
}

// Test 6: Can instantiate class
console.log('✅ Test 6: Can instantiate LocaleOSAnalytics class');
const instance = new LocaleOSAnalytics();
if (!instance) {
  throw new Error('Failed to create LocaleOSAnalytics instance');
}

for (const method of requiredMethods) {
  if (typeof instance[method] !== 'function') {
    throw new Error(`Instance method '${method}' is missing or not a function`);
  }
}

// Test 7: Verify browser check works in Node.js
console.log('✅ Test 7: Browser detection works');
const browserCheck = isBrowser();
if (browserCheck !== false) {
  console.warn('⚠️  Warning: isBrowser() should return false in Node.js environment');
}

console.log('\n🎉 All export tests passed!');
console.log('📦 Package exports are correct and match documentation');
console.log('✅ All 9 documented methods are available');
console.log('✅ No outdated methods exist');
console.log('✅ Utility functions are exported');
console.log('✅ Class can be instantiated');
