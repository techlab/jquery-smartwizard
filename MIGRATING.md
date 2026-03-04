# Migrating from SmartWizard v6 to v7

This guide covers all the breaking changes and new features you need to be aware of when upgrading from SmartWizard v6 to v7.

---

## Overview

v7 is a **complete TypeScript rewrite** of the plugin. The core API surface has been redesigned for clarity and consistency. While the HTML structure remains the same, nearly all option names, event names, and public method signatures have changed.

---

## 1. Installation

Update the package:

```bash
npm install smartwizard@latest
```

Update CDN links:

```html
<!-- Base CSS -->
<link href="https://cdn.jsdelivr.net/npm/smartwizard@7/dist/css/smartwizard.min.css" rel="stylesheet" />

<!-- Theme CSS (choose one) -->
<link href="https://cdn.jsdelivr.net/npm/smartwizard@7/dist/css/themes/arrows.min.css" rel="stylesheet" />

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/smartwizard@7/dist/js/jquery.smartWizard.min.js"></script>
```

> **Note:** In v7, `smart_wizard_all.min.css` is split into a base CSS file and separate per-theme files. Include the base CSS and the theme CSS separately.

---

## 2. HTML Structure

The HTML structure is **unchanged**. Your existing markup will work as-is.

```html
<div id="smartwizard">
    <ul class="nav">
        <li class="nav-item"><a class="nav-link" href="#step-1">Step 1</a></li>
        <li class="nav-item"><a class="nav-link" href="#step-2">Step 2</a></li>
    </ul>
    <div class="tab-content">
        <div id="step-1" class="tab-pane">...</div>
        <div id="step-2" class="tab-pane">...</div>
    </div>
    <!-- Optional progressbar -->
    <div class="progress">
        <div class="progress-bar" role="progressbar" style="width: 0%"></div>
    </div>
</div>
```

---

## 3. Options

All options have been restructured into logical groups. Below is the full mapping from v6 to v7.

### Quick reference table

| v6 Option | v7 Option |
|---|---|
| `selected` | `initialStep` |
| `theme` | `theme` ✅ unchanged |
| `justified` | ❌ Removed (use CSS) |
| `autoAdjustHeight` | `behavior.autoHeight` |
| `backButtonSupport` | `behavior.supportBrowserHistory` |
| `enableUrlHash` | `behavior.useUrlHash` |
| `transition.animation` | `transition.effect` |
| `transition.speed` | `transition.speed` ✅ unchanged |
| `transition.easing` | `transition.easing` ✅ unchanged |
| `transition.prefixCss` | `transition.css.prefix` |
| `transition.fwdShowCss` | `transition.css.forward.show` |
| `transition.fwdHideCss` | `transition.css.forward.hide` |
| `transition.bckShowCss` | `transition.css.backward.show` |
| `transition.bckHideCss` | `transition.css.backward.hide` |
| `toolbar.position` | `toolbar.position` ✅ unchanged |
| `toolbar.showNextButton` | `toolbar.buttons.showNext` |
| `toolbar.showPreviousButton` | `toolbar.buttons.showPrevious` |
| `toolbar.extraHtml` | `toolbar.extraElements` |
| `anchor.enableNavigation` | `navigation.enabled` |
| `anchor.enableNavigationAlways` | `navigation.alwaysClickable` |
| `anchor.enableDoneState` | `navigation.completed.enabled` |
| `anchor.markPreviousStepsAsDone` | `navigation.completed.completeAllPreviousSteps` |
| `anchor.unDoneOnBackNavigation` | `navigation.completed.clearOnBack` |
| `anchor.enableDoneStateNavigation` | `navigation.completed.clickable` |
| `keyboard.keyNavigation` | `keyboardNavigation.enabled` |
| `keyboard.keyLeft` | `keyboardNavigation.keys.left` |
| `keyboard.keyRight` | `keyboardNavigation.keys.right` |
| `lang.next` | `localization.buttons.next` |
| `lang.previous` | `localization.buttons.previous` |
| `disabledSteps` | `stepStates.disabled` |
| `errorSteps` | `stepStates.error` |
| `warningSteps` | `stepStates.warning` |
| `hiddenSteps` | `stepStates.hidden` |
| `getContent` | `contentLoader` |

### Before (v6)

```javascript
$('#smartwizard').smartWizard({
    selected: 0,
    theme: 'arrows',
    autoAdjustHeight: true,
    backButtonSupport: true,
    enableUrlHash: false,
    transition: {
        animation: 'fade',
        speed: 400,
        easing: '',
        prefixCss: 'animate__animated',
        fwdShowCss: 'animate__fadeIn',
        fwdHideCss: 'animate__fadeOut',
        bckShowCss: 'animate__fadeIn',
        bckHideCss: 'animate__fadeOut',
    },
    toolbar: {
        position: 'bottom',
        showNextButton: true,
        showPreviousButton: true,
        extraHtml: '<button>Custom</button>',
    },
    anchor: {
        enableNavigation: true,
        enableNavigationAlways: false,
        enableDoneState: true,
        markPreviousStepsAsDone: true,
        unDoneOnBackNavigation: false,
        enableDoneStateNavigation: true,
    },
    keyboard: {
        keyNavigation: true,
        keyLeft: [37],
        keyRight: [39],
    },
    lang: {
        next: 'Next',
        previous: 'Previous',
    },
    disabledSteps: [2],
    errorSteps: [],
    warningSteps: [],
    hiddenSteps: [],
    getContent: null,
});
```

### After (v7)

```javascript
$('#smartwizard').smartWizard({
    initialStep: 0,
    theme: 'arrows',
    displayMode: 'auto', // NEW: 'auto' | 'dark' | 'light' | 'none'
    behavior: {
        autoHeight: true,
        supportBrowserHistory: true,
        useUrlHash: false,
    },
    transition: {
        effect: 'css',  // renamed from 'animation'
        speed: 400,
        easing: '',
        css: {
            prefix: 'animate__animated',
            forward:  { show: 'animate__fadeIn',  hide: 'animate__fadeOut' },
            backward: { show: 'animate__fadeIn',  hide: 'animate__fadeOut' },
        },
    },
    toolbar: {
        position: 'bottom',
        buttons: {
            showNext: true,
            showPrevious: true,
        },
        extraElements: '<button>Custom</button>',
    },
    navigation: {
        enabled: true,
        alwaysClickable: false,
        completed: {
            enabled: true,
            completeAllPreviousSteps: true,
            clearOnBack: false,
            clickable: true,
        },
    },
    keyboardNavigation: {
        enabled: true,
        keys: {
            left: [37],
            right: [39],
        },
    },
    swipeNavigation: {  // NEW
        enabled: false,
        threshold: 50,
    },
    localization: {
        buttons: {
            next: 'Next',
            previous: 'Previous',
        },
    },
    stepStates: {
        disabled: [2],
        error: [],
        warning: [],
        hidden: [],
        completed: [],
    },
    contentLoader: null,
});
```

---

## 4. Events

All event names now use the `.sw` namespace suffix.

| v6 Event | v7 Event |
|---|---|
| `leaveStep` | `leave.sw` |
| `showStep` | `shown.sw` |
| `initialized` | `initialized.sw` |
| `loaded` | `loaded.sw` |

### Before (v6)

```javascript
$('#smartwizard')
    .on('leaveStep', function(e, anchorObject, stepIndex, nextStepIndex, stepDirection) {
        console.log(stepIndex, nextStepIndex);
        // return false to cancel
    })
    .on('showStep', function(e, anchorObject, stepIndex, stepDirection, stepPosition) {
        console.log(stepIndex, stepPosition);
    });
```

### After (v7)

```javascript
$('#smartwizard')
    .on('leave.sw', function(e, args) {
        // args: { stepIndex, nextStepIndex, stepElement, stepDirection, stepPosition }
        console.log(args.stepIndex, args.nextStepIndex);
        // return false to cancel
    })
    .on('shown.sw', function(e, args) {
        // args: { stepIndex, stepElement, stepDirection, stepPosition }
        console.log(args.stepIndex, args.stepPosition);
    })
    .on('initialized.sw', function(e) { })
    .on('loaded.sw', function(e) { });
```

> **Note:** Event callback arguments are now passed as a **single object** (`args`) rather than individual positional parameters.

---

## 5. Public Methods

Most method names are unchanged. Key differences:

| v6 Method | v7 Method | Notes |
|---|---|---|
| `smartWizard('goToStep', idx)` | `smartWizard('goToStep', idx)` | ✅ unchanged |
| `smartWizard('goToStep', idx, true)` | `smartWizard('goToStep', idx, true)` | ✅ unchanged |
| `smartWizard('next')` | `smartWizard('next')` | ✅ unchanged |
| `smartWizard('prev')` | `smartWizard('prev')` | ✅ unchanged |
| `smartWizard('reset')` | `smartWizard('reset')` | ✅ unchanged |
| `smartWizard('fixHeight')` | `smartWizard('adjustHeight')` | Renamed |
| `smartWizard('setState', [n], 'disabled')` | `smartWizard('setState', [n], 'disable')` | State name changed |
| `smartWizard('unsetState', [n], 'disabled')` | `smartWizard('unsetState', [n], 'disable')` | State name changed |
| `smartWizard('setOptions', opts)` | `smartWizard('setOptions', opts)` | ✅ unchanged; now also calls `load()` |
| `smartWizard('loader', 'show')` | `smartWizard('loader', 'show')` | ✅ unchanged |
| `smartWizard('getStepInfo')` | `smartWizard('getStepInfo')` | ✅ unchanged |

> **`setState` / `unsetState`:** The state string `'disabled'` has been renamed to `'disable'` to match the internal style class name convention.

---

## 6. New Features in v7

These are entirely new capabilities not available in v6:

- **`displayMode`** option — `'auto'` (system preference) | `'dark'` | `'light'` | `'none'`
- **`swipeNavigation`** — swipe left/right on touch devices to navigate steps
- **Horizontal nav scroll** — mouse wheel over the nav bar scrolls horizontally when steps overflow
- **TypeScript support** — full type declarations in `dist/types/`

---

## 7. Removed Options

| Removed | Reason |
|---|---|
| `justified` | Layout is now CSS-only |
| `cycleNavigation` | Removed; handle externally if needed |
| `anchor.enableDoneState` + dark mode variables | Replaced by `navigation.completed.*` and `displayMode` |

---

## 8. CSS Changes

- The single `smart_wizard_all.css` file is now split into:
  - `dist/css/smartwizard.css` — core base styles
  - `dist/css/themes/<theme>.css` — one file per theme
- CSS custom properties (variables) are the primary way to customize colors
- `data-theme="dark"` / `data-theme="light"` is set on the wizard element automatically when `displayMode` is `'auto'`, `'dark'`, or `'light'`

---

## 9. Module Format

v7 ships three formats:

| Format | File |
|---|---|
| Browser global (UMD) | `dist/js/jquery.smartWizard.js` |
| CommonJS | `dist/js/jquery.smartWizard.cjs.js` |
| ES Module | `dist/js/jquery.smartWizard.esm.js` |
| TypeScript types | `dist/types/index.d.ts` |

You no longer need to use `require('smartwizard/dist/js/...')` directly — the `main`, `module`, and `browser` fields in `package.json` resolve automatically.

---

## Checklist

- [ ] Update `npm install smartwizard@latest`
- [ ] Update CDN links — split base CSS + theme CSS
- [ ] Rename all options per the mapping table above
- [ ] Update event listeners to use `.sw` suffix and new `args` object
- [ ] Update `setState`/`unsetState` state name from `'disabled'` to `'disable'`
- [ ] Replace `fixHeight` calls with `adjustHeight`
- [ ] Test CSS transitions — `transition.css` structure has changed
- [ ] Remove references to `justified`, `cycleNavigation`
