# Language/i18n Integration Guide

## Installation

```bash
npm install react-i18next i18next
```

## What I've Created:

### 1. **i18n/config.js** - Translation configuration
   - English, Spanish, French translations
   - Stores language preference in localStorage
   - Easy to add more languages

### 2. **context/LanguageContext.jsx** - Language management
   - Provides language state globally
   - Handles language switching
   - Persists selection

### 3. **Updated LanguageSelector.jsx**
   - Beautiful dropdown with animations
   - Shows current language with flag
   - Check mark for selected language

## How to Use:

### Step 1: Wrap App with i18n (main.jsx)
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './main.css'
import './i18n/config' // Import i18n config

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### Step 2: Wrap with LanguageProvider (App.jsx)
```jsx
import { LanguageProvider } from './context/LanguageContext'

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>  {/* Add this */}
          <ToastProvider>
            {/* rest of your providers */}
          </ToastProvider>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}
```

### Step 3: Use in Components

#### Simple Usage:
```jsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('nav.buyTickets')}</h1>
      <button>{t('lottery.checkout')}</button>
    </div>
  );
};
```

#### With Variables:
```jsx
const { t } = useTranslation();

<p>{t('lottery.totalAmount')}: ${totalAmount}</p>
```

### Step 4: Add LanguageSelector to Navbar/Sidebar

```jsx
import LanguageSelector from './components/common/LanguageSelector';

// In your Navbar or Sidebar
<LanguageSelector />
```

## Adding More Languages:

Edit `i18n/config.js`:

```javascript
const resources = {
  // ... existing languages
  de: {
    translation: {
      "nav.buyTickets": "Tickets Kaufen",
      "nav.superball": "Super Ball",
      // ... add translations
    }
  }
};
```

Then add to LanguageContext languages array:
```javascript
{ code: 'de', name: 'Deutsch', flag: '🇩🇪' }
```

## Quick Migration Example:

### Before:
```jsx
<h1>Buy Tickets</h1>
<button>Checkout</button>
<p>Total Amount: $100</p>
```

### After:
```jsx
const { t } = useTranslation();

<h1>{t('nav.buyTickets')}</h1>
<button>{t('lottery.checkout')}</button>
<p>{t('lottery.totalAmount')}: $100</p>
```

## Where to Add LanguageSelector:

1. **Navbar** (for logged-in users)
2. **Sidebar** (admin/user dashboard)
3. **Login/Register pages** (for all users)
4. **Settings page**

## Benefits:

✅ Support multiple languages easily
✅ Users can switch language anytime
✅ Preference saved in localStorage
✅ Beautiful animated dropdown
✅ Easy to maintain and add new translations
✅ SEO-friendly (can detect browser language)

## Next Steps:

1. Install the packages: `npm install react-i18next i18next`
2. Import i18n config in main.jsx
3. Wrap App with LanguageProvider
4. Add LanguageSelector to your Navbar
5. Start replacing hardcoded text with t('key')
