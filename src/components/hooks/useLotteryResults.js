import { useEffect, useState } from 'react';
import useWinnerNumbers from './useWinnerNumbers';
import useTicketPrizes from './useTicketPrizes';
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

  // Helper to extract date
  const extractDateStr = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes(' ')) return dateStr.split(' ')[0];
    return new Date(dateStr).toISOString().split('T')[0];
  };

  // Find latest draw date
  let latestDrawDateStr = null;
  if (allNumbers?.length) {
    latestDrawDateStr = [...allNumbers].sort((a, b) => new Date(b.drawDate) - new Date(a.drawDate))[0].drawDate;
  }

  let targetDateStr = latestDrawDateStr ? latestDrawDateStr.split(' ')[0] : '2025-10-20';

  // Filter winning numbers for latest draw
  const todayWinningNumbers = latestDrawDateStr
    ? allNumbers.filter(w => w.drawDate === latestDrawDateStr)
    : [];

  // Winner numbers object
  const winnerNumbersObj = {};
  todayWinningNumbers.forEach(w => {
    winnerNumbersObj[w.country] = w.number;
  });

  // Filter user wins for current draw
  let userWinsForDraw = [];
  if (latestDrawDateStr && userWins.length > 0) {
    const drawDateStr = extractDateStr(targetDateStr);
    userWinsForDraw = userWins.filter(win => extractDateStr(win.drawDate) === drawDateStr);
  }

  // Total earnings
  let totalEarnings = userWinsForDraw.reduce((sum, win) => sum + (win.prize || win.prizeAmount || 0), 0);

  // Paid orders for latest draw
  let displayOrders = [];
  if (myPaidOrders?.length) {
    let latestDrawDateTime = latestDrawDateStr;
    displayOrders = myPaidOrders.filter(order => {
      if (order.paymentStatus !== 'paid' || !order.drawDate) return false;
      return order.drawDate === latestDrawDateTime;
    });
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