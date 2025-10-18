import { useState, useMemo, useCallback } from 'react';
import { useTicket } from '../../context/TicketContext';

export const useLotteryLogic = () =>  {
  const { countryConfigs, tickets, addTicket, PRICE_PER_SELECTION, MAX_TICKETS } = useTicket();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countrySelections, setCountrySelections] = useState({});

  const selectedCount = useMemo(
    () => Object.values(countrySelections).filter(Boolean).length - (countrySelections.FR ? 1 : 0), // Main selections (excludes FR)
    [countrySelections]
  );

  // Total count including FR if selected
  const totalCount = useMemo(
    () => selectedCount + (countrySelections.FR ? 1 : 0),
    [selectedCount, countrySelections.FR]
  );

  const totalPrice = useMemo(
    () => totalCount * PRICE_PER_SELECTION, // Price includes FR
    [totalCount, PRICE_PER_SELECTION]
  );

  const isSaveDisabled = useMemo(
    () => selectedCount < 7 || tickets.length >= MAX_TICKETS,
    [selectedCount, tickets.length, MAX_TICKETS]
  );

  const handleCountrySelect = useCallback((country) => {
    console.log('Country selected:', country);
    setSelectedCountry(country);
  }, []);

  const handleNumberSelect = useCallback((number) => {
    if (selectedCountry) {
      setCountrySelections((prev) => {
        const updated = { ...prev, [selectedCountry.code]: number };
        console.log('Updated countrySelections object:', updated);
        return updated;
      });
      console.log('Number selected for country', selectedCountry.code, ':', number);
      setSelectedCountry(null);
    }
  }, [selectedCountry]);

  const handleSaveTicket = useCallback(() => {
    if (isSaveDisabled) return;
    addTicket(countrySelections, totalCount); // Pass totalCount to include FR in price
    setCountrySelections({});
  }, [isSaveDisabled, addTicket, countrySelections, totalCount]);

  const handleRandomizeAll = useCallback(() => {
    const randomSelections = {};
    countryConfigs.forEach((country) => {
      if (country.code !== 'FR') { // Randomize main countries
        randomSelections[country.code] = Math.floor(Math.random() * country.totalNumbers) + 1;
      }
    });
    // Optionally randomize FR as bonus
    if (Math.random() > 0.5) {
      randomSelections.FR = Math.floor(Math.random() * 10) + 1; // FR has 10 numbers
    }
    setCountrySelections(randomSelections);
  }, [countryConfigs]);

  const handleRandomizeCountry = useCallback((countryCode) => {
    const country = countryConfigs.find((c) => c.code === countryCode);
    if (!country) return;
    const randomNumber = Math.floor(Math.random() * country.totalNumbers) + 1;
    setCountrySelections((prev) => ({ ...prev, [countryCode]: randomNumber }));
  }, [countryConfigs]);

  const handleClearSelections = useCallback(() => {
    setCountrySelections({});
  }, []);

  return {
    countryConfigs,
    tickets,
    selectedCountry,
    setSelectedCountry,
    countrySelections,
    selectedCount,
    totalCount,
    totalPrice,
    isSaveDisabled,
    handleCountrySelect,
    handleNumberSelect,
    handleSaveTicket,
    handleRandomizeAll,
    handleRandomizeCountry,
    handleClearSelections,
    PRICE_PER_SELECTION,
    MAX_TICKETS,
  };
}