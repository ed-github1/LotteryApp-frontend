import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getNextDrawService, getDrawHitsByDate } from '../services/drawScheduleService';
import {
  patchWinnerNumberService,
  getLatestWinnerNumbersService,
  createWinnerNumberService
} from '../services/winnerNumbersService';

const DrawContext = createContext();

export const useDraw = () => {
  const context = useContext(DrawContext);
  if (!context) throw new Error('useDraw must be used within a DrawProvider');
  return context;
};

export const DrawProvider = ({ children }) => {
  const { token } = useAuth();

  const hits = async () => {
    const res = await getDrawHitsByDate('2025-09-12T00:00:00.000Z');
  }

  // winnerNumbers: array of { countryCode, drawDate, winnerNumber }
  const [winnerNumbers, setWinnerNumbers] = useState([]);
  // nextDraws: array of { id, countryCode, drawDate }
  const [nextDraws, setNextDraws] = useState([]);




  // ------- S C H E D U L E S ----------------
  useEffect(() => {
    getNextDraws()
  }, [])

  const getNextDraws = async () => {
    try {
      const res = await getNextDrawService()
      setNextDraws(res)
    } catch (error) {
      console.error('Error fetch next draws')
      throw error
    }
  }


  // ----- W I N N E R - N U M B E R S ------


  useEffect(() => {
    if (token) {
      getWinnerNumbers();
    }
  }, [token]);

  const uploadWinnerNumber = async (payload) => {
    try {
      const res = await createWinnerNumberService(payload, token);
      return res;
    } catch (error) {
      // Handle/log error here, or rethrow for the component to handle
      console.error('Error uploading winner number:', error);
      throw error;
    }
  }

  const getWinnerNumbers = async () => {
    try {
      const res = await getLatestWinnerNumbersService(token);
      // Ensure winnerNumbers is always an array
      setWinnerNumbers(Array.isArray(res) ? res : [res]);
    } catch (error) {
      setWinnerNumbers([]);
    }
  }


  const updateWinnerNumber = async (id, countryCode, winnerNumber) => {
    try {
      const res = await patchWinnerNumberService(id, { countryCode, winnerNumber }, token);
      return res;
    } catch (error) {
      console.error('Error updating winner number:', error);
      throw error;
    }
  };

  const upsertWinnerNumber = async (drawDate, countryCode, winnerNumber) => {
    try {
      // Try to create a new WinnerNumber document
      const res = await createWinnerNumberService({
        drawDate,
        winnerNumbers: { [countryCode]: winnerNumber }
      }, token);

      // If backend returns { winner: existingDoc }
      const winnerDoc = res.winner || res;
      // If the doc already existed, PATCH instead
      if (res.winner) {
        await updateWinnerNumber(winnerDoc._id, countryCode, winnerNumber);
      }
      return winnerDoc;
    } catch (error) {
      // If error is 409 and includes winner, PATCH
      if (error.response && error.response.status === 409 && error.response.data?.winner) {
        const winnerDoc = error.response.data.winner;
        await updateWinnerNumber(winnerDoc._id, countryCode, winnerNumber);
        return winnerDoc;
      }
      console.error('Error upserting winner number:', error);
      throw error;
    }
  };

  // ----- R E S U L T S  T A B L E   ------

  //helper funtion is to show always CA first in results
  const countryOrder = ["CA", "IT", "MX", "NZ", "KR", "IE", "UK", "FR", "SUPERBALL"];
  const getSortedWinnerBalls = (winnerNumbers) => {
    return winnerNumbers
      .flatMap((result) =>
        Object.entries(result.winnerNumbers || {}).map(([country, number]) => ({
          country,
          number,
          drawDate: result.drawDate
        }))
      )
      .sort((a, b) => {
        const aIdx = countryOrder.indexOf(a.country);
        const bIdx = countryOrder.indexOf(b.country);
        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
        if (aIdx !== -1) return -1;
        if (bIdx !== -1) return 1;
        return a.country.localeCompare(b.country);
      });
  };


  // Helper to get week range
  const getWeekRange = (date, offset = 0) => {
    const d = new Date(date);
    // 3 = Wednesday (0=Sunday, 1=Monday, ...)
    const dayOfWeek = d.getDay();
    const diff = (dayOfWeek >= 3 ? dayOfWeek - 3 : 7 - (3 - dayOfWeek));
    d.setDate(d.getDate() - diff + offset * 7);
    d.setHours(0, 0, 0, 0);
    const start = new Date(d);
    const end = new Date(d);
    end.setDate(start.getDate() + 7);
    return { start, end };
  };

  // Helper to get week range from nextDraws, only for the same week as the first draw
  const getDrawsWeekRange = (draws) => {
    if (!Array.isArray(draws) || draws.length === 0) return null;
    // Sort draws by drawDate
    const sorted = [...draws].sort((a, b) => new Date(a.drawDate) - new Date(b.drawDate));
    const start = new Date(sorted[0].drawDate);

    // Find all draws in the same week as the first draw
    const weekStart = new Date(start);
    weekStart.setHours(0, 0, 0, 0);
    const { end: weekEnd } = getWeekRange(start);

    // Filter draws to only those in the same week
    const drawsInWeek = sorted.filter(d => {
      const drawDate = new Date(d.drawDate);
      return drawDate >= weekStart && drawDate < weekEnd;
    });

    // Set end to the end of the last draw's day
    const end = new Date(drawsInWeek[drawsInWeek.length - 1].drawDate);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  };

  const weekRange = getDrawsWeekRange(nextDraws);
  let weekRangeStr = '';
  if (weekRange) {
    weekRangeStr = `${weekRange.start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} to ${weekRange.end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
  }

  function getCurrentFridayUTC() {
    const now = new Date();
    // Get the current week's Friday (day 5)
    const dayOfWeek = now.getUTCDay();
    const diff = (5 - dayOfWeek + 7) % 7; // days until Friday
    const friday = new Date(now);
    friday.setUTCDate(now.getUTCDate() + diff);
    friday.setUTCHours(19, 0, 0, 0); // Set to 19:00:00.000Z (or your draw time)
    return friday.toISOString();
  }


  return (
    <DrawContext.Provider value={{
      nextDraws,
      winnerNumbers,
      upsertWinnerNumber,
      uploadWinnerNumber,
      updateWinnerNumber,
      getWinnerNumbers,
      getSortedWinnerBalls,
      getWeekRange,
      getDrawsWeekRange,
      getCurrentFridayUTC,
    }}>
      {children}
    </DrawContext.Provider>
  );
};

