# Changelog

All notable changes to the LocaleOS IP Info SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.15] - 2025-12-02 - Production Ready ✨

### Added
- Production verification section in documentation
- CORS verification examples in README
- Status badges indicating production-ready status

### Changed
- Updated documentation to reflect CORS is now enabled in production
- Removed "Failed to fetch" troubleshooting warnings (issue resolved)
- Moved custom endpoint configuration to "Advanced" section
- Emphasized zero-configuration setup

### Fixed
- ✅ CORS enabled on LocaleOS API (`https://localeos.co/api/my-ip`)
- ✅ SDK now works out-of-the-box from any domain
- ✅ No server-side endpoints required for basic usage

## [1.0.14] - 2025-12-02

### Added
- Comprehensive CORS troubleshooting documentation
- Custom endpoint setup examples
- Cache invalidation solutions

### Changed
- Updated troubleshooting section with CORS workarounds
- Added Next.js endpoint examples with CORS headers

## [1.0.13] - 2025-12-01

### Changed
- SDK now uses LocaleOS API for IP detection by default
- Changed default `ipDetectionEndpoint` from `api.ipify.org` to `${apiUrl}/api/my-ip`
- Simplified quick start from 4 steps to 2 steps
- Made `ipDetectionEndpoint` truly optional

### Improved
- Better developer experience out of the box
- Reduced integration friction
- Maintained backward compatibility

## [1.0.12] - 2025-11-30

### Added
- Complete implementation guide
- Framework-specific examples (Next.js, React, Vue)
- CSP compliance documentation

## [1.0.11] - 2025-11-29

### Added
- Initial public release
- IP geolocation functionality
- Analytics tracking with fingerprinting
- Device information detection
- TypeScript support
- localStorage caching

### Features
- 🌍 IP Geolocation
- 📊 Analytics Tracking
- 🎯 One Log Per System
- 🔒 Privacy-First
- 💾 Smart Caching
- 🚀 Lightweight (~16KB)
- 📦 TypeScript Support

---

## Migration Guide

### Upgrading to 1.0.15 from 1.0.14

No breaking changes! If you implemented the CORS workaround from v1.0.14, you can now remove it:

**Before (v1.0.14 workaround):**
```typescript
localeOS.init({
  apiKey: 'your-api-key',
  analytics: true,
  ipDetectionEndpoint: '/api/my-ip', // Custom endpoint to avoid CORS
});
```

**After (v1.0.15 - recommended):**
```typescript
localeOS.init({
  apiKey: 'your-api-key',
  analytics: true,
  // No ipDetectionEndpoint needed - uses CORS-enabled LocaleOS API
});
```

The custom endpoint still works if you prefer to use it!

### Upgrading to 1.0.13+ from 1.0.12 or earlier

No breaking changes. The `ipDetectionEndpoint` parameter is now optional and defaults to LocaleOS API.

---

## Links

- [npm package](https://www.npmjs.com/package/@localeos/ip-info)
- [GitHub Repository](https://github.com/localeOS/localeos-ip-info)
- [Documentation](https://github.com/localeOS/localeos-ip-info#readme)
- [LocaleOS Dashboard](https://localeos.co)
