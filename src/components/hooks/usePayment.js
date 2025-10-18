import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTicket } from '../../context/TicketContext'
import { useOrders } from '../../context/OrdersContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

const usePayment = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [selected, setSelected] = useState(null)
  const [tkid, setTkid] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [tkidValid, setTkidValid] = useState(null)
  const [paymentDeadline, setPaymentDeadline] = useState(null)
  const [timeLeft, setTimeLeft] = useState(null)
  const [hasSubmitted, setHasSubmitted] = useState(false);  // Add this
  const { clearTickets, totalPrice, tickets, getOrderPayload } = useTicket()
  const { user, token } = useAuth()
  const { getAllOrders, submitOrder } = useOrders()

  const totalAmount = totalPrice



  // Generate QR code data
  const qrData = selected
    ? `bitcoin:${
        selected === 'BTC'
          ? '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
          : '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
      }`
    : ''
  const qrUrl = selected
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        qrData
      )}`
    : ''

  // Set payment deadline
  useEffect(() => {
    if (selected && !paymentDeadline) {
      const deadline = new Date()
      deadline.setMinutes(deadline.getMinutes() + 30)
      setPaymentDeadline(deadline)
    }
  }, [selected, paymentDeadline])

  // Countdown timer
  useEffect(() => {
    if (paymentDeadline && selected) {
      const timer = setInterval(() => {
        const now = new Date()
        const diff = paymentDeadline - now
        if (diff <= 0) {
          setTimeLeft(null)
          setError('Payment deadline expired. Please start over.')
          setSelected(null)
          setPaymentDeadline(null)
        } else {
          const minutes = Math.floor(diff / 60000)
          const seconds = Math.floor((diff % 60000) / 1000)
          setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`)
        }
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [paymentDeadline, selected])

  // Transaction ID validation
  useEffect(() => {
    if (tkid) {
      const isValid = /^[a-zA-Z0-9]{6,}$/.test(tkid)
      setTkidValid(isValid)
    } else {
      setTkidValid(null)
    }
  }, [tkid])

  // Redirect if no tickets
  useEffect(() => {
    const savedOrder = localStorage.getItem('pendingOrder')
    if (
      !getOrderPayload ||
      (!getOrderPayload().tickets?.length && savedOrder)
    ) {
      try {
        const parsed = JSON.parse(savedOrder)
        if (parsed && parsed.tickets?.length) {
          // Optionally restore to context here
        }
      } catch (e) {
        localStorage.removeItem('pendingOrder')
      }
    } else if (!getOrderPayload || !getOrderPayload().tickets?.length) {
      if (!hasSubmitted) {  // Add this condition
        navigate('/dashboard/ticket-summary')
      }
    }
  }, [getOrderPayload, navigate, hasSubmitted]);  // Add hasSubmitted to deps

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const validateAndSubmit = async () => {
    const basePayload = getOrderPayload(); // Get tickets from TicketContext
    const payload = {
      ...basePayload,
      tkid,
      paymentMethod: selected,
    };

    setIsSubmitting(true);
    setError('');
    try {
      if (!tkidValid) {
        throw new Error(
          'Please enter a valid transaction ID (minimum 6 characters, alphanumeric only)'
        );
      }
      if (!tkid || tkid.length < 6) {
        throw new Error('Transaction ID is required');
      }
      if (totalAmount <= 0) {
        throw new Error('Total amount must be greater than 0');
      }
      setHasSubmitted(true);
      await submitOrder(payload, navigate);
      clearTickets();
      getAllOrders && getAllOrders();
      toast.showSuccess('🎉 Order placed successfully! Awaiting approval...');
    } catch (e) {
      setError(e.message || 'Transaction submission failed. Please try again.');
      setHasSubmitted(false);
      toast.showError(e.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const resetFlow = () => {
    setSelected(null)
    setTkid('')
    setError('')
    setPaymentDeadline(null)
    setTimeLeft(null)
    setTkidValid(null)
  }

  return {
    selected,
    setSelected,
    tkid,
    setTkid,
    isSubmitting,
    error,
    copied,
    tkidValid,
    timeLeft,
    totalAmount,
    qrData,
    qrUrl,
    copyToClipboard,
    validateAndSubmit,
    resetFlow,
    navigate
  }
}

export default usePayment

