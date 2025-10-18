import { useState, useEffect, useMemo, useContext, useCallback } from 'react'
import OrdersContext from '../../context/OrdersContext'
import { updateOrderStatus } from '../../services/ordersService'
import Papa from 'papaparse'
import { saveAs } from 'file-saver'
import { useSocket } from './useSocket'
import { useAuth } from '../../context/AuthContext' // Add this import
import { toast } from 'react-toastify'

export const useOrderManagement = () => {
  const [selected, setSelected] = useState([])
  const [batchLoading, setBatchLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('this-month')
  const [currentPage, setCurrentPage] = useState(1)
  // Declare startDate and endDate state variables
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)



  // Reset currentPage to 1 when month filter changes (must be after startDate/endDate are declared)
  useEffect(() => {
    setCurrentPage(1);
  }, [type, startDate, endDate]);

  // Get token from auth context
  const { token } = useAuth()

  // Month range helpers
  const getMonthRange = (month, year) => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0, 23, 59, 59, 999)
    return [firstDay, lastDay]
  }

  // Initial month/year
  const [selectedMonth] = useState(new Date().getMonth())
  const [selectedYear] = useState(new Date().getFullYear())
  const [dayFilter, setDayFilter] = useState(null)
  const [showChart, setShowChart] = useState(false)
  const [authError, setAuthError] = useState(false)
  const [activeTab, setActiveTab] = useState('pending')

  const {
    pendingOrders = [],
    paidOrders = [],
    rejectedOrders = [],
    pendingTotalPages = 1,
    paidTotalPages = 1,
    rejectedTotalPages = 1,
    pendingTotalCount = 0,
    paidTotalCount = 0,
    rejectedTotalCount = 0,
    monthlyRevenue = 0,
    loading,
    fetchPendingOrders,
    fetchPaidOrders,
    fetchRejectedOrders,
    fetchMonthlyRevenue,
    // Get daily totals from context
    dailyTotals,
    totalsLoading,
    totalsError,
    fetchDailyTotals
  } = useContext(OrdersContext)

  const limit = 20

  // Stats
  const [pendingCount, setPendingCount] = useState(0)
  const [approvedCount, setApprovedCount] = useState(0)
  const [rejectedCount, setRejectedCount] = useState(0)

  const socket = useSocket()

  const stats = useMemo(
    () => ({
      pending: pendingTotalCount,
      approved: paidTotalCount,
      rejected: rejectedTotalCount
    }),
    [pendingTotalCount, paidTotalCount, rejectedTotalCount]
  )

  // Orders for active tab
  const orders =
    activeTab === 'pending'
      ? pendingOrders
      : activeTab === 'approved'
      ? paidOrders
      : rejectedOrders

  const totalPages =
    activeTab === 'pending'
      ? pendingTotalPages
      : activeTab === 'approved'
      ? paidTotalPages
      : rejectedTotalPages

  // Filtered orders by TKID search
  const filteredOrders = orders
    ? orders.filter((order) =>
        order.tkid?.toLowerCase().includes(search.toLowerCase())
      )
    : []

  useEffect(() => {
    if (type === 'last-month') {
      const now = new Date()
      const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1
    // Reset currentPage to 1 when month filter changes (must be after all state declarations)
    useEffect(() => {
      setCurrentPage(1);
    }, [type, startDate, endDate]);
      const year =
        now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
      const firstDay = new Date(Date.UTC(year, lastMonth, 1, 0, 0, 0, 0))
      const lastDay = new Date(
        Date.UTC(year, lastMonth + 1, 0, 23, 59, 59, 999)
      )
      setStartDate(firstDay.toISOString())
      setEndDate(lastDay.toISOString())
    }
    if (type === 'this-month') {
      const now = new Date()
      const firstDay = new Date(
        Date.UTC(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
      )
      const lastDay = new Date(
        Date.UTC(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
      )
      setStartDate(firstDay.toISOString())
      setEndDate(lastDay.toISOString())
    }
  }, [type])

  useEffect(() => {
    if (
      !fetchPendingOrders ||
      !fetchPaidOrders ||
      !fetchRejectedOrders ||
      !fetchMonthlyRevenue
    )
      return

    console.log('Dates changed, fetching orders:', { startDate, endDate })

    // Since FilterTabs already sends ISO strings, use them directly
    fetchPendingOrders(type, currentPage, limit, startDate, endDate)
    fetchPaidOrders(type, currentPage, limit, startDate, endDate)
    fetchRejectedOrders(type, currentPage, limit, startDate, endDate)
    fetchMonthlyRevenue(startDate, endDate)
  }, [
    currentPage,
    limit,
    startDate,
    endDate,
    type,
    fetchPendingOrders,
    fetchPaidOrders,
    fetchRejectedOrders,
    fetchMonthlyRevenue
  ])

  // Chart visibility
  useEffect(() => {
    setShowChart(activeTab === 'total-sold')
  }, [activeTab])

  // Fetch daily totals when active tab is 'total-sold'
  useEffect(() => {
    if (
      activeTab === 'total-sold' &&
      fetchDailyTotals &&
      startDate &&
      endDate
    ) {
      console.log('Fetching daily totals for revenue tab:', {
        startDate,
        endDate
      })
      fetchDailyTotals(startDate, endDate)
    }
  }, [activeTab, startDate, endDate, fetchDailyTotals])

  // Batch actions
  const handleBatchAction = async (status) => {
    setBatchLoading(true)
    try {
      await Promise.all(
        selected.map((orderId) => updateOrderStatus(orderId, status, token))
      )
      setSelected([])
      
      // Show toast notification for admin
      const count = selected.length
      if (status === 'accepted') {
        toast.success(`✅ ${count} order(s) approved successfully!`, {
          position: 'top-right',
          autoClose: 3000,
        })
      } else if (status === 'rejected') {
        toast.error(`❌ ${count} order(s) rejected successfully!`, {
          position: 'top-right',
          autoClose: 3000,
        })
      }
      
      // Refetch orders to update the UI in real-time
      if (activeTab === 'pending') {
        await fetchPendingOrders(type, currentPage, limit, startDate, endDate)
      } else if (activeTab === 'approved') {
        await fetchPaidOrders(type, currentPage, limit, startDate, endDate)
      } else if (activeTab === 'rejected') {
        await fetchRejectedOrders(type, currentPage, limit, startDate, endDate)
      }
      
    } catch (err) {
      console.error('Batch update failed', err)
      toast.error('Failed to update orders', {
        position: 'top-right',
        autoClose: 3000,
      })
    } finally {
      setBatchLoading(false)
    }
  }

  // Single order action
  const handleSingleAction = async (orderId, status) => {
    setBatchLoading(true)
    try {
      await updateOrderStatus(orderId, status, token)
      setSelected((prev) => prev.filter((id) => id !== orderId))
      
      // Show toast notification for admin
      if (status === 'accepted') {
        toast.success('✅ Order approved successfully!', {
          position: 'top-right',
          autoClose: 3000,
        })
      } else if (status === 'rejected') {
        toast.error('❌ Order rejected successfully!', {
          position: 'top-right',
          autoClose: 3000,
        })
      } else if (status === 'restored') {
        toast.info('🔄 Order restored to pending!', {
          position: 'top-right',
          autoClose: 3000,
        })
      }
      
      // Refetch orders to update the UI in real-time
      if (activeTab === 'pending') {
        await fetchPendingOrders(type, currentPage, limit, startDate, endDate)
      } else if (activeTab === 'approved') {
        await fetchPaidOrders(type, currentPage, limit, startDate, endDate)
      } else if (activeTab === 'rejected') {
        await fetchRejectedOrders(type, currentPage, limit, startDate, endDate)
      }
      
    } catch (err) {
      console.error('Update failed', err)
      toast.error('Failed to update order status', {
        position: 'top-right',
        autoClose: 3000,
      })
    } finally {
      setBatchLoading(false)
    }
  }

  // Restore rejected order
  const handleRestoreOrder = async (orderId) => {
    setBatchLoading(true)
    try {
      await updateOrderStatus(orderId, 'pending', token)
      setSelected((prev) => prev.filter((id) => id !== orderId))
      
      toast.success('🔄 Order restored to pending!', {
        position: 'top-right',
        autoClose: 3000,
      })
      
      // Refetch orders to update the UI in real-time
      if (activeTab === 'pending') {
        await fetchPendingOrders(type, currentPage, limit, startDate, endDate)
      } else if (activeTab === 'approved') {
        await fetchPaidOrders(type, currentPage, limit, startDate, endDate)
      } else if (activeTab === 'rejected') {
        await fetchRejectedOrders(type, currentPage, limit, startDate, endDate)
      }
      
    } catch (err) {
      console.error('Restore failed', err)
      toast.error('Failed to restore order', {
        position: 'top-right',
        autoClose: 3000,
      })
    } finally {
      setBatchLoading(false)
    }
  }

  // Day chart click
  const handleDayClick = (data) => {
    setDayFilter(data.day)
  }

  // Select all
  const handleSelectAll = () => {
    if (selected.length === filteredOrders.length) setSelected([])
    else setSelected(filteredOrders.map((order) => order._id || order.id))
  }

  // Select one
  const handleSelect = (orderId) => {
    setSelected((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    )
  }

  // Page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  // Export CSV
  const handleExport = () => {
    const csvData = filteredOrders.map((order) => ({
      User: order.user?.email || 'N/A',
      Date: order.purchasedDate
        ? new Date(order.purchasedDate).toLocaleDateString()
        : 'N/A',
      Total: order.total?.toFixed(2) || '0.00',
      Status: order.paymentStatus || 'N/A',
      TKID: order.tkid || 'N/A',
      Tickets: order.tickets?.length || 0,
      PaymentMethod: order.paymentMethod || 'N/A'
    }))
    const csv = Papa.unparse(csvData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'monthly-orders.csv')
  }

  return {
    selected,
    setSelected,
    batchLoading,
    search,
    setSearch,
    type,
    setType,
    currentPage,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    dayFilter,
    setDayFilter,
    showChart,
    setShowChart,
    authError,
    orders,
    loading,
    totalPages,
    dailyTotals,
    totalsLoading,
    totalsError,
    filteredOrders,
    stats,
    handleBatchAction,
    handleSingleAction,
    handleRestoreOrder,
    handleDayClick,
    handleSelectAll,
    handleSelect,
    handlePageChange,
    handleExport,
    activeTab,
    setActiveTab,
    pendingOrders,
    paidOrders,
    rejectedOrders,
    pendingTotalPages,
    paidTotalPages,
    rejectedTotalPages,
    pendingTotalCount,
    paidTotalCount,
    rejectedTotalCount,
    monthlyRevenue
  }
}
