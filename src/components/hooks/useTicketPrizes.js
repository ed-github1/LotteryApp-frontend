import { useMemo } from 'react'

function normalizeToObj(selections) {
  // selections may be array or object; return object keyed by country
  if (!selections) return {}
  if (Array.isArray(selections)) {
    // array of { country, number }
    return selections.reduce((acc, s) => {
      if (!s) return acc
      acc[s.country] = s.number
      return acc
    }, {})
  }
  // assume already an object like { FR: 5, MX: 10 }
  return selections
}

export default function useTicketPrizes({ displayOrders = [], userWinsForDraw = [] }) {
  console.log('🎟️ useTicketPrizes - displayOrders:', displayOrders.length, displayOrders)
  console.log('🎟️ useTicketPrizes - userWinsForDraw:', userWinsForDraw.length, userWinsForDraw)

  const prizeMap = useMemo(() => {
    // Build map keyed by ticket.id -> prize
    const perTicket = {}

    displayOrders.forEach((ticket, index) => {
      const ticketId = ticket.id || ticket._id;
      const ticketKey = JSON.stringify(normalizeToObj(ticket.selections || ticket.selection || ticket));

      console.log('🎫 Processing ticket #' + index, 'id:', ticketId, 'selections:', ticket.selections);

      // Match by ticketId first
      const matchByTicketId = userWinsForDraw.find(w =>
        w.ticketId === ticketId || w.ticket?._id === ticketId || w.ticket?.id === ticketId
      );

      if (matchByTicketId) {
        const prize = matchByTicketId.prize || matchByTicketId.prizeAmount || 0;
        console.log('✅ Matched by ticketId:', ticketId, 'prize:', prize);
        perTicket[ticketId] = prize;
      } else {
        // Fallback: match by selections if no ticketId match
        const matchBySelections = userWinsForDraw.find(w => {
          const winKey = JSON.stringify(normalizeToObj(w.selections || w.selection || w.ticket));
          return winKey === ticketKey;
        });
        if (matchBySelections) {
          const prize = matchBySelections.prize || matchBySelections.prizeAmount || 0;
          console.log('✅ Matched by selections:', ticketId, 'prize:', prize);
          perTicket[ticketId || `ticket_${index}`] = prize;
        } else {
          console.log('❌ No match found for ticket:', ticketId);
          perTicket[ticketId || `ticket_${index}`] = 0;
        }
      }
    });

    console.log('📊 Final prizeMap:', perTicket);
    return perTicket;
  }, [displayOrders, userWinsForDraw]);

  const totalFromTickets = useMemo(() => {
    // Sum all prizes from ALL tickets (including duplicates)
    const total = Object.values(prizeMap).reduce((s, v) => s + (Number(v) || 0), 0)
    console.log('💰 Total calculated from prizeMap:', total, 'from values:', Object.values(prizeMap))
    return total
  }, [prizeMap])

  return { prizeMap, totalFromTickets }
}
