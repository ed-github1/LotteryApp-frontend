import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UsersContext';
import { AuthProvider } from './context/AuthContext';
import Home from './components/pages/Home';
import Register from './components/pages/Register';
import Login from './components/pages/Login';
import EmailVerification from './components/pages/EmailVerification';
import ProtectedRoutes from './components/features/auth/ProtectedRoutes';
import MyAccount from './components/features/profile/MyAccount';
import DashboardLayout from './components/layout/DashboardLayout';
import NotFound from './components/pages/NotFound';
import HowToPlay from './components/pages/HowToPlay';
import { TicketProvider } from './context/TicketContext';
import { OrdersProvider } from './context/OrdersContext';
import { StepProvider } from './context/StepContext';
import { DrawProvider } from './context/DrawContext';

import Results from './components/pages/dashboard/Results';
import WinnerNumberUploadPage from './components/pages/WinnerNumberUploadPage';
import LotteryPlayPage from './components/pages/dashboard/LotteryPlayPage';
import TicketSummaryPage from './components/pages/dashboard/TicketSummaryPage';
import PaymentPage from './components/pages/dashboard/PaymentPage';
import PurchaseHistory from './components/features/dashboard/PurchaseHistory';
import PendingOrdersAdmin from './components/features/admin/OrdersAdmin';
import SuperBallDrawPage from './components/pages/dashboard/SuperBallDrawPage';
import SuperBallTicketSummaryPage from './components/pages/superball/SuperBallTicketSummaryPage';
import Settings from './components/features/dashboard/Settings';
import { SocketProvider } from './context/SocketContext';
import WaitingApprovalPage from './components/pages/payment/WaitingApprovalPage';
import AdminOrdersPage from './components/pages/dashboard/AdminOrdersPage';
import Winners from './components/features/admin/Winners';
import { AdminTriggerSuperball } from './components/pages/superball/AdminTriggerSuperball';
import { AdminPostSuperballWinners } from './components/pages/superball/AdminPostSuperballWinners';
import { ToastProvider } from './context/ToastContext';
import SuperBallActivePopup from './components/common/SuperBallActivePopup';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <UserProvider>
            <DrawProvider>
              <TicketProvider>
                <OrdersProvider>
                  <StepProvider>
                    <SocketProvider>
                    {/* SuperBall Active Popup */}
                    <SuperBallActivePopup />
                    <Routes>
                      {/* Public */}
                      <Route path="/" element={<Home />} />
                      <Route path="*" element={<NotFound />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/verify-email" element={<EmailVerification />} />
                      <Route path="/How-to-Play" element={<HowToPlay />} />
                      {/* Protected routes */}
                      <Route element={<ProtectedRoutes />}>
                        <Route path="/dashboard" element={<DashboardLayout />}>
                          {/*Lottery (user) */}
                          <Route path="buy-ticket" element={<LotteryPlayPage />} />
                          <Route path="ticket-summary" element={<TicketSummaryPage />} />
                          <Route path="results" element={<Results />} />
                          <Route path="purchase-history" element={<PurchaseHistory />} />
                          <Route path="my-account" element={<MyAccount />} />
                          {/* SuperBall (user)*/}
                          <Route path="superball" element={<SuperBallDrawPage />} />
                          <Route path="superball-ticket-summary" element={<SuperBallTicketSummaryPage />} />
                          {/* Admin  */}
                          <Route path="admin/orders" element={<   AdminOrdersPage />} />
                          <Route path="Settings" element={<Settings />} />
                          <Route path="admin/upload-winner-number" element={<WinnerNumberUploadPage />} />
                          <Route path="pending-orders" element={<PendingOrdersAdmin />} />
                          <Route path="admin/winners" element={<Winners />} />

                          {/* Payment */}
                          <Route path="payment" element={<PaymentPage />} />
                          <Route path="pending" element={<WaitingApprovalPage />} />
                        </Route>
                      </Route>
                    </Routes>
                  </SocketProvider>
                </StepProvider>
              </OrdersProvider>
            </TicketProvider>
          </DrawProvider>
        </UserProvider>
      </ToastProvider>
    </AuthProvider>
    </Router>
  );
}

export default App;
