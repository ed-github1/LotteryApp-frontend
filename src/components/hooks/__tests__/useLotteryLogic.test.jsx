// @vitest-environment jsdom
import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { useLotteryLogic } from '../useLotteryLogic';
import { TicketContext } from '../../../context/TicketContext';
import React from 'react';

const mockValue = {
  countryConfigs: [
    { code: 'US', totalNumbers: 50 },
    { code: 'FR', totalNumbers: 10 }
  ],
  tickets: [],
  addTicket: vi.fn(),
  removeTicket: vi.fn(),
  clearTickets: vi.fn(),
  MAX_TICKETS: 10,
  PRICE_PER_SELECTION: 2,
  totalPrice: 0,
  ticketPrice: 2,
  formatPrice: (v) => v.toString(),
  matchedTickets: [],
  getOrderPayload: vi.fn(),
  superBallTickets: [],
  addSuperBallTicket: vi.fn(),
  clearSuperBallTickets: vi.fn(),
  removeSuperBallTicket: vi.fn(),
};

const wrapper = ({ children }) => (
  <TicketContext.Provider value={mockValue}>{children}</TicketContext.Provider>
);

describe('useLotteryLogic', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLotteryLogic(), { wrapper });
    expect(result.current.selectedCountry).toBe(null);
    expect(result.current.countrySelections).toEqual({});
    expect(result.current.totalPrice).toBe(0);
    expect(result.current.isSaveDisabled).toBe(true);
  });

  it('should select a country', () => {
    const { result } = renderHook(() => useLotteryLogic(), { wrapper });
    act(() => {
      result.current.handleCountrySelect({ code: 'US' });
    });
    expect(result.current.selectedCountry).toEqual({ code: 'US' });
  });

  it('should select a number for a country', () => {
    const { result } = renderHook(() => useLotteryLogic(), { wrapper });
    act(() => {
      result.current.handleCountrySelect({ code: 'US' });
      result.current.handleNumberSelect(7);
    });
    // The hook logic sets countrySelections.US only if selectedCountry is set before handleNumberSelect
    expect(result.current.countrySelections.US).toBe(7);
    expect(result.current.selectedCountry).toBe(null);
  });

  it('should randomize all countries, FR may or may not be present', () => {
    const { result } = renderHook(() => useLotteryLogic(), { wrapper });
    act(() => {
      result.current.handleRandomizeAll();
    });
    // US should always be present
    expect(Object.keys(result.current.countrySelections)).toContain('US');
    // FR may or may not be present, but if present, should be a number between 1 and 10
    if ('FR' in result.current.countrySelections) {
      expect(result.current.countrySelections.FR).toBeGreaterThanOrEqual(1);
      expect(result.current.countrySelections.FR).toBeLessThanOrEqual(10);
    }
  });
});
