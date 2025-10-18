import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrdersContext';
import { useTicket } from '../../context/TicketContext.jsx'; // Adjust path

export const useSuperBall = () => {
  const { token } = useAuth();
  const [selectedNumbers, setSelectedNumbers] = useState([null, null, null, null, null]);
  const [filledSlots, setFilledSlots] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reviewMode, setReviewMode] = useState(false);
  const [superBallTickets, setSuperBallTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeSlot, setActiveSlot] = useState(0);
  const { createSuperBallTicket, nextDraws, createSuperBallTickets, } = useOrders();
  const { addSuperBallTicket, remove } = useTicket();

  const addTicketToSummary = (ticket) => {
    console.log('Adding SuperBall ticket to summary:', ticket);
    addSuperBallTicket(ticket); // Call the context function
  };

  const handleGenerateTicket = async () => {
    if (filledSlots < 5) return;
    setLoading(true);
    setError('');
    
    try {
      // Find the next SuperBall draw date
      const superBallDraw = nextDraws?.find(draw => 
        draw.countryCode?.toLowerCase() === 'superball'
      );
      
      const ticketData = {
        numbers: selectedNumbers.filter(num => num !== null),
        drawDate: superBallDraw?.drawDate || new Date().toISOString()
      };
      
      // Add to local state (NOT to backend)
      setSuperBallTickets(prev => [...prev, ticketData]);
      addTicketToSummary(ticketData);

      // Reset after adding to summary
      setSelectedNumbers([null, null, null, null, null]);
      setFilledSlots(0);
      setActiveSlot(0);
      setShowModal(false);
      
    } catch (error) {
      setError(error.message || 'Unknown error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = (index) => {
    setActiveSlot(index);
    setShowModal(true);
  };

  const clearSlot = (index) => {
    const newNumbers = [...selectedNumbers];
    newNumbers[index] = null;
    setSelectedNumbers(newNumbers);
    setFilledSlots(prev => prev - 1);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleNumberSelect = (number) => {
    const newNumbers = [...selectedNumbers];
    newNumbers[activeSlot] = number;
    setSelectedNumbers(newNumbers);
    setFilledSlots(prev => prev + 1);
    setShowModal(false);
  };

  const handleRandomizeAllSuperBall = () => {
    const randomNumbers = Array(5).fill().map(() => Math.floor(Math.random() * 10) + 1);
    setSelectedNumbers(randomNumbers);
    setFilledSlots(5);
  };

  const handleClearSelectionsSuperBall = () => {
    setSelectedNumbers([null, null, null, null, null]);
    setFilledSlots(0);
  };

  const handleDeleteTicket = (index) => {
    setSuperBallTickets(prev => prev.filter((_, i) => i !== index));
  };

  const handleReview = async () => {
    setLoading(true);
    setError('');
    try {
      const ticketsPayload = superBallTickets.map(ticket => ({
        numbers: ticket.numbers,
      }));
      await createSuperBallTickets(ticketsPayload, token); // Send all tickets at once
      setSuperBallTickets([]);
      setReviewMode(false);
    } catch (error) {
      setError('Failed to submit tickets');
    } finally {
      setLoading(false);
    }
  };

  const selectionRatio = filledSlots / 5;

  return {
    selectedNumbers,
    filledSlots,
    loading,
    error,
    reviewMode,
    setReviewMode,
    superBallTickets: Array.isArray(superBallTickets)
      ? superBallTickets.filter((t) => t && Array.isArray(t.numbers))
      : [],
    handleGenerateTicket,
    handleSlotClick,
    clearSlot,
    showModal,
    setShowModal,
    closeModal,
    activeSlot,
    handleNumberSelect,
    handleDeleteTicket,
    handleReview,
    handleRandomizeAllSuperBall,
    handleClearSelectionsSuperBall,
  };
};
