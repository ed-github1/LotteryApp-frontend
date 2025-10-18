import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../../context/AuthContext'
import './SuperballWinner.css'

export default function SuperballWinnerNotification() {
  const { token } = useAuth()
  const [wins, setWins] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [currentWin, setCurrentWin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      checkForWins()
      
      // Check periodically (every 5 minutes)
      const interval = setInterval(checkForWins, 5 * 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [token])

  async function checkForWins() {
    try {
      if (!token) {
        console.log('🎱 SuperballWinnerNotification: No token available');
        return;
      }

      console.log('🎱 SuperballWinnerNotification: Checking for wins...');
      const response = await fetch(`/api/superball/my-wins`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        console.log('🎱 SuperballWinnerNotification: API response not OK:', response.status);
        setLoading(false)
        return
      }

      const data = await response.json()
      console.log('🎱 SuperballWinnerNotification: Received data:', data);
      setLoading(false)

      if (data.hasWins && data.wins.length > 0) {
        console.log('🎱 SuperballWinnerNotification: User has wins!', data.wins);
        setWins(data.wins)
        
        // Show notification for most recent win with pending deposit
        const recentPendingWin = data.wins.find(win => 
          win.myWinnings.some(w => w.depositPending)
        )
        
        console.log('🎱 SuperballWinnerNotification: Recent pending win:', recentPendingWin);
        
        if (recentPendingWin) {
          setCurrentWin(recentPendingWin)
          // Show notification after 1 second delay
          setTimeout(() => {
            console.log('🎱 SuperballWinnerNotification: Showing notification and modal!');
            showNotification(recentPendingWin)
          }, 1000)
        } else {
          console.log('🎱 SuperballWinnerNotification: No pending wins to display');
        }
      } else {
        console.log('🎱 SuperballWinnerNotification: No wins found');
      }
    } catch (error) {
      console.error('🎱 SuperballWinnerNotification: Error checking wins:', error);
      setLoading(false)
    }
  }

  function showNotification(win) {
    const totalPrize = win.myWinnings.reduce((sum, w) => sum + w.prize, 0)
    
    // Browser notification (if permission granted)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🎉 SuperBall Winner!', {
        body: `You won $${totalPrize.toFixed(2)} USDT! Prize will be deposited within 48 hours.`,
        icon: '/vite.svg',
        tag: 'superball-win',
        requireInteraction: true
      })
    }
    
    // Show modal
    setShowModal(true)
  }

  function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  if (loading) return null

  return (
    <>
      {/* Winner Banner */}
      {wins.length > 0 && (
        <WinnerBanner 
          wins={wins} 
          onClick={() => {
            setCurrentWin(wins[0])
            setShowModal(true)
          }}
        />
      )}

      {/* Winner Modal */}
      <AnimatePresence>
        {showModal && currentWin && (
          <WinnerModal 
            win={currentWin}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Request notification permission button */}
      {'Notification' in window && Notification.permission === 'default' && (
        <button 
          className="notification-permission-btn"
          onClick={requestNotificationPermission}
        >
          🔔 Enable Winner Notifications
        </button>
      )}
    </>
  )
}

// Winner Banner Component
function WinnerBanner({ wins, onClick }) {
  const [dismissed, setDismissed] = useState(false)
  
  const pendingWins = wins.filter(win => 
    win.myWinnings.some(w => w.depositPending)
  )
  
  if (dismissed || pendingWins.length === 0) return null

  const totalPending = pendingWins.reduce(
    (sum, win) => sum + win.myWinnings
      .filter(w => w.depositPending)
      .reduce((s, w) => s + w.prize, 0),
    0
  )

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="winner-banner"
    >
      <div className="banner-content">
        <motion.span 
          className="icon"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          🎉
        </motion.span>
        <div className="message">
          <strong>CONGRATULATIONS!</strong> You won ${totalPending.toFixed(2)} USDT 
          in the SuperBall! USDT deposit pending (within 48 hours).
        </div>
        <button className="view-btn" onClick={onClick}>
          View Details →
        </button>
        <button 
          className="close-btn" 
          onClick={(e) => {
            e.stopPropagation()
            setDismissed(true)
          }}
        >
          ✕
        </button>
      </div>
    </motion.div>
  )
}

// Winner Modal Component
function WinnerModal({ win, onClose }) {
  const totalPrize = win.myWinnings.reduce((sum, w) => sum + w.prize, 0)
  const hasPendingDeposit = win.myWinnings.some(w => w.depositPending)
  const drawDate = new Date(win.drawDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <motion.div 
      className="modal-overlay" 
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="modal-content winner-modal" 
        onClick={e => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <motion.div 
          className="confetti"
          animate={{ rotate: [0, 10, -10, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          🎊 🎉 🎊
        </motion.div>
        
        <h1 className="modal-title">CONGRATULATIONS!</h1>
        <h2 className="modal-subtitle">You Won the SuperBall!</h2>
        
        <div className="prize-amount">
          <span className="label">Your Total Prize</span>
          <motion.span 
            className="amount"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            ${totalPrize.toFixed(2)} USDT
          </motion.span>
        </div>
        
        <div className="draw-details">
          <div className="detail-row">
            <span className="detail-label">Draw Date:</span>
            <span className="detail-value">{drawDate}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Winner Number:</span>
            <span className="detail-value winner-number">{win.winnerNumber}</span>
          </div>
        </div>
        
        <div className="winning-tickets">
          <h3>Your Winning Tickets:</h3>
          <ul>
            {win.myWinnings.map((winning, idx) => (
              <motion.li 
                key={idx}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * idx }}
              >
                <span className="ticket-numbers">
                  [{winning.ticket.join(', ')}]
                </span>
                <span className="ticket-prize">
                  ${winning.prize.toFixed(2)} USDT
                </span>
                {winning.depositPending && (
                  <span className="badge pending">⏳ Deposit Pending</span>
                )}
                {winning.depositedAt && (
                  <span className="badge completed">✅ Deposited</span>
                )}
              </motion.li>
            ))}
          </ul>
        </div>
        
        {hasPendingDeposit && (
          <div className="payment-status">
            <h3>💰 Payment Processing</h3>
            <div className="status-steps">
              <div className="step completed">
                <span className="step-icon">✅</span>
                <span className="step-label">Winner Verified</span>
              </div>
              <div className="step pending">
                <span className="step-icon">⏳</span>
                <span className="step-label">USDT Deposit Pending</span>
              </div>
              <div className="step future">
                <span className="step-icon">💵</span>
                <span className="step-label">Funds in Your Wallet</span>
              </div>
            </div>
            <p className="payment-info">
              Your USDT prize will be deposited to your wallet within 48 hours. 
              You'll receive an email when complete.
            </p>
          </div>
        )}
        
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button 
            className="btn-primary" 
            onClick={() => {
              window.location.href = '/dashboard/wallet'
            }}
          >
            View My Wallet
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
