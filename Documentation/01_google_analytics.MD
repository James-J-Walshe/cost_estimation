# Google Analytics 4 Implementation Guide
## Zyantik ICT Cost Estimation Tool

**Document Version:** 1.0  
**Last Updated:** February 2025  
**Status:** Implemented

---

## Overview

The Zyantik Cost Estimation Tool includes Google Analytics 4 (GA4) integration to track user engagement and feature usage. This implementation follows GDPR-compliant practices with a consent-first approach, ensuring users have control over their data.

### Key Features

- **Consent Management** - Users must explicitly accept or decline analytics tracking
- **Privacy-First Design** - No tracking occurs until consent is given
- **Tracking Prevention Handling** - Graceful fallbacks when browser privacy features block storage
- **Automatic Event Tracking** - Key user interactions are tracked automatically
- **Custom Event Support** - Additional events can be tracked programmatically

---

## Architecture

### Module Location

```
cet/
└── modules/
    └── analytics_manager.js    ← Analytics module (v1.1.0)
```

### Integration Pattern

The Analytics Manager follows the project's **Initialization Manager Pattern**, ensuring proper load order and dependency management.

```
Application Load
      ↓
analytics_manager.js loads
      ↓
init_manager.js calls initialize()
      ↓
Check consent status
      ↓
┌─────────────────────────────────────────┐
│  No consent recorded?                    │
│  → Show consent banner                   │
│                                          │
│  Previously accepted?                    │
│  → Initialize GA4 and start tracking     │
│                                          │
│  Previously declined?                    │
│  → Analytics remains disabled            │
└─────────────────────────────────────────┘
```

---

## Consent Management

### Consent Banner

When a user visits the tool for the first time, a consent banner appears at the bottom of the screen:

- **Accept** - Enables analytics tracking and stores consent
- **Decline** - Disables analytics and stores preference
- **Close (X)** - Treated as decline

### Consent Storage

Consent status is stored using a three-tier fallback system to handle browser tracking prevention:

| Priority | Storage Type | Persistence |
|----------|--------------|-------------|
| 1 | localStorage | Permanent until cleared |
| 2 | sessionStorage | Current session only |
| 3 | In-memory | Current page load only |

**Storage Keys:**
- `zyantik_analytics_consent` - Consent status ('accepted' or 'declined')
- `zyantik_analytics_consent_timestamp` - ISO timestamp of consent decision

### Handling Tracking Prevention

Modern browsers (Edge, Firefox, Brave) may block localStorage access. The Analytics Manager detects this and falls back gracefully:

```javascript
// Automatic detection on module load
checkStorageAvailability() {
    try {
        localStorage.setItem('__test__', 'test');
        localStorage.removeItem('__test__');
        this.storageAvailable = true;
    } catch (e) {
        this.storageAvailable = false;
        // Falls back to sessionStorage, then memory
    }
}
```

---

## Events Tracked

### Automatic Events

The following events are tracked automatically once consent is given:

#### Navigation Events

| Event Action | Category | Label | Trigger |
|--------------|----------|-------|---------|
| `tab_change` | navigation | {tab_name} | User clicks a navigation tab |

#### Engagement Events

| Event Action | Category | Label | Trigger |
|--------------|----------|-------|---------|
| `add_item` | engagement | add_internal_resource | Add Internal Resource button clicked |
| `add_item` | engagement | add_vendor_cost | Add Vendor Cost button clicked |
| `add_item` | engagement | add_tool_cost | Add Tool Cost button clicked |
| `add_item` | engagement | add_misc_cost | Add Miscellaneous Cost button clicked |
| `add_item` | engagement | add_risk | Add Risk button clicked |
| `add_item` | engagement | add_rate_card | Add Rate Card button clicked |
| `add_item` | engagement | add_exchange_rate | Add Exchange Rate button clicked |
| `first_interaction` | engagement | - | First click/keypress/touch on page |
| `scroll_depth` | engagement | 25%/50%/75%/90%/100% | User scrolls to milestone |
| `session_duration` | engagement | seconds | Page unload (value = seconds) |

#### Export/Import Events

| Event Action | Category | Label | Trigger |
|--------------|----------|-------|---------|
| `csv_export` | export | project_data | Export to CSV clicked |
| `json_export` | export | project_data | Export to JSON clicked |
| `json_import` | import | project_data | Import JSON clicked |
| `print` | export | project_summary | Print button clicked |

#### Project Events

| Event Action | Category | Label | Trigger |
|--------------|----------|-------|---------|
| `save_project_info` | project | - | Save Project Info clicked |
| `new_project` | project | - | New Project initiated |
| `clear_data` | project | - | Clear Data clicked |

#### UI Events

| Event Action | Category | Label | Trigger |
|--------------|----------|-------|---------|
| `modal_open` | ui | {modal_id} | Any modal is opened |

#### Consent Events

| Event Action | Category | Label | Trigger |
|--------------|----------|-------|---------|
| `granted` | consent | analytics | User accepts analytics |

---

## Configuration

### Setting the Measurement ID

The GA4 Measurement ID must be configured in `analytics_manager.js`:

```javascript
// Line 30 in analytics_manager.js
this.measurementId = 'G-XXXXXXXXXX';  // Replace with actual ID
```

**To obtain a Measurement ID:**

1. Go to [Google Analytics](https://analytics.google.com/)
2. Navigate to Admin → Data Streams
3. Select or create a Web stream
4. Copy the Measurement ID (format: G-XXXXXXX)

### Debug Mode

Enable debug mode during development to see events logged to the console:

```javascript
// In browser console
window.analyticsManager.enableDebugMode();

// Disable when done
window.analyticsManager.disableDebugMode();
```

---

## Integration with init_manager.js

### Module Registration

The Analytics Manager is registered in `init_manager.js`:

**Constructor (modules object):**
```javascript
this.modules = {
    // ... other modules ...
    analyticsManager: false
};
```

**checkModules() method:**
```javascript
this.modules.analyticsManager = !!(window.analyticsManager || window.AnalyticsManager);
```

**initialize() method (Step 20):**
```javascript
// Step 20: Initialize Analytics Manager
if (this.modules.analyticsManager && typeof window.analyticsManager.initialize === 'function') {
    window.analyticsManager.initialize();
    console.log('✓ Step 20: Analytics Manager initialized');
}
```

### Script Load Order

In `index.html`, the analytics script must load **before** `init_manager.js`:

```html
<!-- Other modules -->
<script src="modules/currency_manager.js"></script>
<script src="modules/analytics_manager.js"></script>  <!-- Analytics -->
<script src="modules/init_manager.js"></script>       <!-- Must be last -->
```

---

## API Reference

### Public Methods

#### Initialization & Status

| Method | Description | Returns |
|--------|-------------|---------|
| `initialize()` | Main entry point - checks consent and initializes | void |
| `isInitialized()` | Check if GA4 is active | boolean |
| `isStorageAvailable()` | Check if localStorage is accessible | boolean |
| `showPrivacySettings()` | Display current privacy settings in console | object |

#### Consent Management

| Method | Description | Returns |
|--------|-------------|---------|
| `getConsentStatus()` | Get current consent status | 'accepted' \| 'declined' \| null |
| `hasConsent()` | Check if user has consented | boolean |
| `acceptConsent()` | Programmatically accept consent | void |
| `declineConsent()` | Programmatically decline consent | void |
| `resetConsent()` | Clear consent (shows banner on reload) | void |
| `withdrawConsent()` | Revoke consent and disable tracking | void |
| `promptConsent()` | Reset and show consent banner | void |

#### Event Tracking

| Method | Description | Parameters |
|--------|-------------|------------|
| `trackEvent(category, action, label, value)` | Track custom event | category: string, action: string, label?: string, value?: number |
| `trackPageView(pagePath, pageTitle)` | Track virtual page view | pagePath: string, pageTitle: string |
| `trackFeatureUsage(featureName, details)` | Track feature with context | featureName: string, details?: object |
| `trackError(errorType, errorMessage)` | Track error occurrence | errorType: string, errorMessage: string |
| `setUserProperties(properties)` | Set user properties for segmentation | properties: object |

#### Debug

| Method | Description |
|--------|-------------|
| `enableDebugMode()` | Log all events to console |
| `disableDebugMode()` | Stop logging events |

---

## Usage Examples

### Track a Custom Event

```javascript
// Track when user uses a specific feature
window.analyticsManager.trackEvent('feature', 'merge_projects', 'success');

// Track with a value
window.analyticsManager.trackEvent('performance', 'load_time', 'initial', 1250);
```

### Track Feature Usage with Context

```javascript
// Track detailed feature usage
window.analyticsManager.trackFeatureUsage('multi_resource_add', {
    resourceCount: 5,
    hasExternalResources: true
});
```

### Track Virtual Page Views (SPA Navigation)

```javascript
// When switching to a "page" within the SPA
window.analyticsManager.trackPageView('/settings/rate-cards', 'Rate Cards Settings');
```

### Check Privacy Settings

```javascript
// View current analytics status
window.analyticsManager.showPrivacySettings();

// Output:
// 📊 Privacy Settings:
//    Storage Available: true
//    Consent Status: accepted
//    Consent Date: 21/02/2025, 10:30:00
//    Analytics Active: true
```

### Reset Consent for Testing

```javascript
// Clear consent and reload to see banner again
window.analyticsManager.resetConsent();
location.reload();
```

---

## Viewing Analytics Data

### Real-time Reports

1. Go to Google Analytics → Reports → Realtime
2. See active users and events as they happen
3. Useful for testing new implementations

### Event Reports

1. Go to Reports → Engagement → Events
2. View event counts by name
3. Click an event to see category/label breakdown

### Custom Explorations

1. Go to Explore → Create new exploration
2. Add dimensions: `event_category`, `event_label`
3. Add metrics: `event_count`, `total_users`
4. Filter by specific events to analyse feature usage

### Recommended Reports to Create

| Report | Purpose | Key Metrics |
|--------|---------|-------------|
| Feature Usage | Which features are most used | Event count by add_item label |
| User Journey | How users navigate the tool | Tab changes sequence |
| Export Patterns | How users export data | Export events by type |
| Session Engagement | How long users stay | Average session duration |

---

## Privacy Considerations

### Data Collected

- **Anonymous usage data** - Pages visited, features used
- **Session information** - Duration, scroll depth
- **Technical data** - Browser type (via GA4 automatic collection)

### Data NOT Collected

- Personal information
- Project names or content
- Financial figures
- Email addresses or identifiers

### GDPR Compliance

- ✅ Consent required before any tracking
- ✅ Clear explanation of data collected
- ✅ Easy opt-out mechanism
- ✅ IP anonymization enabled
- ✅ No third-party data sharing

### User Rights

Users can:
- Decline tracking entirely
- Withdraw consent at any time
- Use browser privacy features without breaking the app

---

## Troubleshooting

### Banner Not Showing

**Symptom:** Consent banner doesn't appear on first visit

**Checks:**
1. Verify `analytics_manager.js` is loaded (check console for "Analytics Manager loaded")
2. Confirm init_manager.js calls `initialize()` (check for "Step 20: Analytics Manager initialized")
3. Check if consent is already stored: `localStorage.getItem('zyantik_analytics_consent')`

**Fix:**
```javascript
// Reset and show banner
window.analyticsManager.resetConsent();
location.reload();
```

### Events Not Tracking

**Symptom:** Events don't appear in GA4

**Checks:**
1. Enable debug mode: `window.analyticsManager.enableDebugMode()`
2. Verify initialized: `window.analyticsManager.isInitialized()` should return `true`
3. Check Measurement ID is correct (not placeholder)
4. Allow 24-48 hours for events to appear in standard reports (use Realtime for immediate verification)

### Storage Blocked by Browser

**Symptom:** Console shows "Tracking Prevention blocked access to storage"

**Impact:** Consent will only persist for the current session (falls back to sessionStorage or memory)

**Resolution:** This is expected behaviour with strict privacy settings. The app handles this gracefully - users will see the consent banner each new session.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | Feb 2025 | Added tracking prevention handling with storage fallbacks |
| 1.0.0 | Feb 2025 | Initial implementation with consent management |

---

## Related Documentation

- [Initialization Manager Pattern](./app_documentation.md)
- [Module Development Guidelines](./app_documentation.md#development-guidelines)
- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
