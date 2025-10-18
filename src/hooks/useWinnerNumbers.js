import { useCallback, useEffect, useMemo, useState } from 'react'
import { getCurrentWinners } from '../services/winnerService'

export default function useWinnerNumbers() {
  const [loading, setLoading] = useState(true)
  const [currentResults, setCurrentResults] = useState([])

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getCurrentWinners()
      // The service may return a single draw object or an array of draws
      if (!res) {
        setCurrentResults([])
      } else if (Array.isArray(res)) {
        setCurrentResults(res)
      } else if (res.history && Array.isArray(res.history)) {
        // some endpoints return { history: [...] }
        setCurrentResults(res.history)
      } else {
        // single draw object -> wrap in array
        setCurrentResults([res])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetch()
  }, [fetch])

  const allNumbers = useMemo(() => {
    // flatten winner numbers into array [{ country, number, drawDate }]
    return currentResults.flatMap((draw) => {
      const drawDate = draw?.drawDate
      const winners = draw?.winnerNumbers || {}
      return Object.keys(winners).map((country) => ({
        country,
        number: winners[country],
        drawDate,
      }))
    })
  }, [currentResults])

  const grouped = useMemo(() => {
    // group by drawDate
    const byDate = {}
    currentResults.forEach((draw) => {
      const key = draw?.drawDate || 'unknown'
      byDate[key] = draw
    })
    return byDate
  }, [currentResults])

  const sortedDates = useMemo(() => {
    return currentResults.map((d) => d.drawDate).filter(Boolean).sort().reverse()
  }, [currentResults])

  return {
    loading,
    currentResults,
    fetch: fetch,
    allNumbers,
    grouped,
    sortedDates,
  }
}
