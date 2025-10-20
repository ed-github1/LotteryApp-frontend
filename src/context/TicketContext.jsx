import { createContext, useContext, useState, useEffect } from 'react';
import { useDraw } from './DrawContext'; // Import DrawContext to get winner numbers

const TicketContext = createContext();

export const countryConfigs = [
  {
    code: 'CA',
    name: 'Lotto Max',
    flag: 'ca',
    totalNumbers: 49,
  },
  {
    code: 'IT',
    name: 'Super Ena lotto',
    flag: 'it',
    totalNumbers: 90,
  },
  {
    code: 'MX',
    name: 'Melate',
    flag: 'mx',
    totalNumbers: 56,
  },
  {
    code: 'NZ',
    name: 'New Zealand Lotto',
    flag: 'nz',
    totalNumbers: 40,
  },
  {
    code: 'KR',
    name: 'Nanum Lotto',
    flag: 'kr',
    totalNumbers: 45,
  },
  {
    code: 'IE',
    name: 'Ireland Lotto',
    flag: 'ie',
    totalNumbers: 47,
  },
  {
    code: 'UK',
    name: 'UK Lotto',
    flag: 'gb',
    totalNumbers: 59,
  },
  { code: 'FR', name: 'France Lotto', flag: 'fr', totalNumbers: 10 },

]

export const TicketProvider = ({ children }) => {
  const { winnerNumbers = {} } = useDraw();

  // --------- REGULAR LOTTERY ---------
  const [tickets, setTickets] = useState(() => {
    try {
      const stored = localStorage.getItem('tickets');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading tickets from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tickets', JSON.stringify(tickets));
    } catch (error) {
      console.error('Error saving tickets to localStorage:', error);
    }
  }, [tickets]);

  const addTicket = (countrySelections, selectedCount) => {
    if (!selectedCount || selectedCount <= 0) {
      console.warn('Invalid selectedCount:', selectedCount);
      return;
    }
    setTickets((prev) => [
      ...prev,
      {
        // Store selections as an object
        selections: { ...countrySelections },
        price: Number(formatPrice(selectedCount * PRICE_PER_SELECTION)),
      },
    ]);
  };

  const removeTicket = (idx) => {
    setTickets((prev) => prev.filter((_, i) => i !== idx));
  };

  const clearTickets = () => {
    setTickets([]);
    localStorage.removeItem('tickets');
  };

  const totalPrice = tickets.reduce((sum, t) => sum + t.price, 0);
  const PRICE_PER_SELECTION = 0.4;
  const MAX_TICKETS = 10;
  const formatPrice = (value) => value.toFixed(2).padStart(5, '0');

  const mergedCountryConfigs = countryConfigs.map((country) => ({
    ...country,
    winnerNumber: winnerNumbers ? winnerNumbers[country.code] || null : null,
  }));

  const matchedTickets = tickets.map((ticket) => {
    // selections is now an object
    const isWinner = Object.entries(ticket.selections).some(([countryCode, number]) => {
      return winnerNumbers[countryCode] === number;
    });
    return { ...ticket, isWinner };
  });

  const getOrderPayload = () => ({
    tickets: tickets.map((ticket) => ({
      selections: ticket.selections
    })),
  });

  // --------- SUPERBALL ---------
  const [superBallTickets, setSuperBallTickets] = useState(() => {
    try {
      const stored = localStorage.getItem('superBallTickets');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addSuperBallTicket = (ticket) => {
    setSuperBallTickets((prev) => {
      const updated = [...prev, ticket];
      localStorage.setItem('superBallTickets', JSON.stringify(updated));
      return updated;
    });
  };

  const clearSuperBallTickets = () => {
    setSuperBallTickets([]);
    localStorage.removeItem('superBallTickets');
  };

  const removeSuperBallTicket = (idx) => {
    setSuperBallTickets((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
      localStorage.setItem('superBallTickets', JSON.stringify(updated));
      return updated;
    });
  };

  // --------- PROVIDER ---------
  return (
    <TicketContext.Provider
      value={{
        // Regular Lottery
        tickets,
        addTicket,
        removeTicket,
        clearTickets,
        MAX_TICKETS,
        PRICE_PER_SELECTION,
        totalPrice,
        ticketPrice: PRICE_PER_SELECTION,
        formatPrice,
        countryConfigs: mergedCountryConfigs,
        matchedTickets,
        getOrderPayload,
        // SuperBall
        superBallTickets,
        addSuperBallTicket,
        clearSuperBallTickets,
        removeSuperBallTicket,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

// Custom hook for easy access
export const useTicket = () => useContext(TicketContext);


export { TicketContext };
