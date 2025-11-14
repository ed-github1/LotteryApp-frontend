// Example component showing how to use translations

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const ExampleTranslatedComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      {/* Basic translation */}
      <h1>{t('nav.buyTickets')}</h1>
      
      {/* Translation with variables */}
      <p>{t('lottery.totalAmount')}: ${100}</p>
      
      {/* Translation in attributes */}
      <button title={t('lottery.checkout')}>
        {t('lottery.checkout')}
      </button>
    </div>
  );
};

// HOW TO USE IN YOUR EXISTING COMPONENTS:

// 1. Import useTranslation
// import { useTranslation } from 'react-i18next';

// 2. Get the t function in your component
// const { t } = useTranslation();

// 3. Replace hardcoded text with t('key')
// Before: <h1>Buy Tickets</h1>
// After:  <h1>{t('nav.buyTickets')}</h1>

export default ExampleTranslatedComponent;
