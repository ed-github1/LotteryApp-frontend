import { useMemo, useState } from 'react';
import { useTicket } from '../../../context/TicketContext';
import { CircleFlag } from 'react-circle-flags';
import { motion, useReducedMotion } from 'framer-motion';

const CountriesGrid = ({
  countrySelections = {},
  handleCountrySelect,

}) => {
  const { countryConfigs = [] } = useTicket();
  const prefersReducedMotion = useReducedMotion();

  // Include all countries, with France as the 8th
  const allCountries = countryConfigs;

  // Count selections, including France
  const selectedCount = useMemo(() =>
    allCountries.filter(c => countrySelections[c.code] !== undefined && countrySelections[c.code] !== null).length,
    [countrySelections, allCountries]
  );

  // Flip animation variants
  const flipVariants = {
    idle: { rotateY: 0 },
    selected: { rotateY: 180 },
  };

  return (
    <div className="max-w-7xl mx-auto p-4 font-sans bg-white/20 rounded-2xl">
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
       <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight px-4 py-6 md:px-6 md:py-8">
          🍀 Pick Your
          <span className='bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'> Lucky Numbers</span> 
        </h2>
        <p className="text-base md:text-lg text-white/60 mt-2 px-4">
          Select a country to reveal your number panel.
        </p>
      </div>

      {/* Countries Grid */ }
  <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-x-4 gap-y-8 justify-items-center">
    {allCountries.map((country) => {
      const selectedNumber = countrySelections[country.code];
      const hasSelection = selectedNumber !== undefined && selectedNumber !== null;
      const isFrance = country.code === 'FR';
      const isDisabled = isFrance && selectedCount < 7 && !hasSelection;

      return (
        <div
          key={country.code}
          className="flex flex-col items-center space-y-3 w-full max-w-[6rem] text-center"
        >
          <motion.div
            className="relative"
            style={{ perspective: 1000 }}
          >
            <motion.button
              type="button"
              onClick={() => handleCountrySelect(country)}
              className={`size-16 md:size-20 rounded-full relative ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ transformStyle: 'preserve-3d' }}
              aria-label={
                hasSelection
                  ? `${country.name}, selected ${selectedNumber}`
                  : `${country.name}, not selected`
              }
              aria-pressed={hasSelection}
              disabled={isDisabled}
              animate={hasSelection ? "selected" : "idle"}
              variants={flipVariants}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
            >
              {/* Front Side: Flag */}
              <div
                className="absolute inset-0 flex items-center justify-center rounded-full border-2 border-white/50"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(0deg)',
                }}
              >
                <div className="w-full h-full flex items-center justify-center rounded-full overflow-hidden">
                  <CircleFlag
                    countryCode={country.code.toLowerCase()}
                    width="100%"
                    height="100%"
                    className="w-full h-full"
                  />
                </div>
              </div>
              {/* Back Side: Number */}
              <div
                className="absolute inset-0 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 shadow-lg"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <span className="text-3xl md:text-4xl font-black text-black" style={{ textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}>
                  {selectedNumber}
                </span>
              </div>
            </motion.button>
          </motion.div>
          <span className={`text-sm font-semibold truncate w-full ${isFrance ? 'text-yellow-400' : 'text-white'}`}>
            {country.code} {isFrance ? '(Bonus)' : ''}
          </span>
        </div>
      );
    })}
  </div>

  {/* Progress Section */ }
  <div className="mt-12">
    <div className="flex items-center justify-between mb-2 text-white">
      <div className="font-bold">Your Progress</div>
      <div className="font-bold">{selectedCount} / 8 Selected</div>
    </div>
    <div className="w-full bg-black/30 rounded-full h-4 border border-purple-500/30 p-0.5 overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${(selectedCount / 8) * 100}%` }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.8,
          ease: 'easeInOut',
        }}
      />
    </div>
    {selectedCount < 8 && (
      <div className="mt-3 text-center text-sm text-white/60">
        {8 - selectedCount} more to go!
      </div>
    )}
  </div>
    </div >
  );
};

export default CountriesGrid;
