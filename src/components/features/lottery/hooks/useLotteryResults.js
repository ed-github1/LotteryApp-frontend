import { useEffect, useState } from 'react';
import useWinnerNumbers from '../../../hooks/useWinnerNumbers';
import useTicketPrizes from '../../../hooks/useTicketPrizes';
import { useDraw } from '../../../../context/DrawContext';
import { useOrders } from '../../../../context/OrdersContext';
import { useAuth } from '../../../../context/AuthContext';
import { getMyWins } from '../../../../services/rewardsService';

export default function useLotteryResults(onConfettiChange) {
  const { getDrawsWeekRange, nextDraws } = useDraw();
  const { myPaidOrders, fetchMyPaidOrders } = useOrders();
  const { token } = useAuth();
  const [userWins, setUserWins] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    loading: winnersLoading,
    currentResults,
    fetch: fetchWinnerNumbers,
    allNumbers,
    grouped,
    sortedDates
  } = useWinnerNumbers();

  useEffect(() => {
    const loadData = async () => {
      await fetchMyPaidOrders();
      setLoading(true);
      await fetchWinnerNumbers();
      if (token) {
        try {
          const winsData = await getMyWins(token);
          setUserWins(Array.isArray(winsData.wins) ? winsData.wins : []);
        } catch {
          setUserWins([]);
        }
      } else {
        setUserWins([]);
      }
      setLoading(false);
    };
    loadData();
  }, [fetchMyPaidOrders, fetchWinnerNumbers, token]);

  // Helper to extract date - normalize to YYYY-MM-DD format
  const extractDateStr = (dateStr) => {
    if (!dateStr) return null;
    
    // If it's a Date object
    if (dateStr instanceof Date) {
      return dateStr.toISOString().split('T')[0];
    }
    
    // If it's a string
    if (typeof dateStr === 'string') {
      // Already in YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
      }
      
      // Format: "YYYY-MM-DD HH:MM:SS" or "YYYY-MM-DD HH:MM"
      if (dateStr.includes(' ')) {
        return dateStr.split(' ')[0];
      }
      
      // ISO format or other string - convert to Date
      try {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
      } catch (e) {
        console.error('Date parse error:', e);
      }
    }
    
    return null;
  };

  // Find latest draw date
  let latestDrawDateStr = null;
  if (allNumbers?.length) {
    latestDrawDateStr = [...allNumbers].sort((a, b) => new Date(b.drawDate) - new Date(a.drawDate))[0].drawDate;
  }

  // Normalize the latest draw date to YYYY-MM-DD format
  let targetDateStr = latestDrawDateStr ? extractDateStr(latestDrawDateStr) : '2025-10-20';

  // Filter winning numbers for latest draw using normalized date
  const todayWinningNumbers = latestDrawDateStr
    ? allNumbers.filter(w => extractDateStr(w.drawDate) === targetDateStr)
    : [];

  // Winner numbers object
  const winnerNumbersObj = {};
  todayWinningNumbers.forEach(w => {
    winnerNumbersObj[w.country] = w.number;
  });

  // Filter user wins for current draw using normalized dates
  let userWinsForDraw = [];
  if (targetDateStr && userWins.length > 0) {
    userWinsForDraw = userWins.filter(win => extractDateStr(win.drawDate) === targetDateStr);
  }

  // Total earnings
  let totalEarnings = userWinsForDraw.reduce((sum, win) => sum + (win.prize || win.prizeAmount || 0), 0);

  // Paid orders for latest draw using normalized date comparison
  let displayOrders = [];
  if (myPaidOrders?.length && targetDateStr) {
    console.log('🔍 Filtering orders - Target date:', targetDateStr);
    console.log('🔍 Total paid orders:', myPaidOrders.length);
    
    displayOrders = myPaidOrders.filter(order => {
      if (order.paymentStatus !== 'paid') {
        console.log('❌ Order rejected - not paid:', order._id);
        return false;
      }
      if (!order.drawDate) {
        console.log('❌ Order rejected - no drawDate:', order._id);
        return false;
      }
      
      const orderDate = extractDateStr(order.drawDate);
      const matches = orderDate === targetDateStr;
      
      console.log(`${matches ? '✅' : '❌'} Order ${order._id}: drawDate="${order.drawDate}" -> normalized="${orderDate}" vs target="${targetDateStr}"`);
      
      return matches;
    });
    
    console.log('✅ Filtered orders count:', displayOrders.length);
  }
  displayOrders = displayOrders.filter(Boolean).sort((a, b) => new Date(b.drawDate) - new Date(a.drawDate));

  // Flatten tickets
  const allTickets = displayOrders.flatMap(order =>
    (order.tickets || []).map(ticket => ({
      ...ticket,
      orderId: order._id,
      orderDrawDate: order.drawDate
    }))
  );

  // Ticket prizes
  const { prizeMap: ticketPrizeMap, totalFromTickets } = useTicketPrizes({
    displayOrders: allTickets,
    userWinsForDraw
  });

  // Winner detection for confetti
  const winnerNumbersArray = todayWinningNumbers.map(w => Number(w.number));
  const hasWinner = displayOrders.some(order =>
    (order.tickets || []).some(ticket => {
      const selections = Array.isArray(ticket.selections)
        ? ticket.selections.map(sel => Number(sel.number))
        : Object.values(ticket.selections || {}).map(n => Number(n));
      return selections.some(userNum => winnerNumbersArray.includes(userNum));
    })
  );

  // Confetti effect
  useEffect(() => {
    if (hasWinner && onConfettiChange) {
      const generateConfetti = () => Array.from({ length: 100 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        rot: Math.random() * 360,
        delay: Math.random() * 2,
        size: Math.random() * 10 + 5,
        bg: `hsl(${Math.random() * 360}, 100%, 50%)`
      }));
      onConfettiChange(generateConfetti());
    }
  }, [hasWinner, onConfettiChange]);

  return {
    loading,
    currentResults,
    allNumbers,
    todayWinningNumbers,
    winnerNumbersObj,
    displayOrders,
    allTickets,
    ticketPrizeMap,
    totalFromTickets,
    totalEarnings,
    hasWinner,
    userWinsForDraw
  };
}
