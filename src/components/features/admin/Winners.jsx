import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import Loader from '../../common/Loader';
import StatusMessage from '../../common/StatusMessage';
import { getWinnersHistory } from '../../../services/winnerService';
import { useAuth } from '../../../context/AuthContext';
import { MdEmojiEvents, MdPerson, MdAttachMoney, MdCheckCircle, MdCalendarToday, MdArrowBack, MdArrowForward } from 'react-icons/md';
import Pagination from '../../common/Pagination';

const Winners = () => {
  const { user } = useAuth();
  const [currentResults, setCurrentResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCache, setUserCache] = useState({});
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDraws, setTotalDraws] = useState(0);
  const pageSize = 1; // 1 draw per page
  
  const isAdmin = useMemo(() => user?.role === 'admin', [user?.role]);

  useEffect(() => {
    let isMounted = true;
    const fetchPaginatedResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getWinnersHistory(currentPage, pageSize);
        if (!isMounted) return;
        if (response && Array.isArray(response.history)) {
          // Keep the original order from backend (already sorted newest first)
          setCurrentResults(response.history);
          setTotalDraws(response.totalDraws || response.history.length);
          setTotalPages(response.totalPages || Math.ceil((response.totalDraws || response.history.length) / pageSize));
        } else {
          setCurrentResults([]);
          setTotalDraws(0);
          setTotalPages(1);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching winners:', err);
        setError(`Failed to load results: ${err.message}`);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchPaginatedResults();
    return () => { isMounted = false; };
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getCategoryLabel = (winner) => {
    const matches = winner.matches || 0;
    // Only show the number of matches, no additional/bonus
    return `${matches} Match${matches !== 1 ? 'es' : ''}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get the current draw based on the page number (0-indexed array)
  const currentDraw = currentResults[currentPage - 1] || null;

  // Calculate winners per user
  const winnersPerUser = useMemo(() => {
    if (!currentDraw || !currentDraw.winners) return [];
    const userMap = {};
    const winnerNumbersObj = currentDraw.winnerNumbers || {};
    currentDraw.winners.forEach(winner => {
      const userId = winner.user;
      const email = winner.email || null;
      if (!userMap[userId]) {
        userMap[userId] = {
          userId,
          email,
          wins: [],
          totalPrize: 0
        };
      }
      // Calculate matches for this ticket
      let matchCount = 0;
      if (winner.selections) {
        const matchedNumbers = new Set();
        let frMatched = false;
        Object.entries(winner.selections).forEach(([country, number]) => {
          if (country === 'FR') {
            if (!frMatched && winnerNumbersObj.FR && number === winnerNumbersObj.FR) {
              frMatched = true;
            }
          } else {
            // Only count unique numbers for non-FR
            if (Object.entries(winnerNumbersObj)
              .filter(([key]) => key !== 'FR')
              .map(([, val]) => val)
              .includes(number) && !matchedNumbers.has(number)) {
              matchedNumbers.add(number);
            }
          }
        });
        matchCount = matchedNumbers.size + (frMatched ? 1 : 0);
      }
      userMap[userId].wins.push({ ...winner, matches: matchCount });
      userMap[userId].totalPrize += winner.prize || 0;
      // Always update email if present
      if (email) userMap[userId].email = email;
    });
    return Object.values(userMap).sort((a, b) => b.totalPrize - a.totalPrize);
  }, [currentDraw]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <StatusMessage type="error" message={error} />
      </div>
    );
  }

  if (!currentDraw) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-6 py-4 rounded-xl shadow text-center max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-2">No Winner Data Available</h2>
          <p className="text-base">Winner results are not available for this draw yet. Please check back after the next draw or contact support if you believe this is an error.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-7xl pb-20 p-2">
      <motion.div
        key="winners"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Header with Draw Info */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Winners History</h2>
          <p className="text-slate-400">
            Draw #{totalDraws - currentPage + 1} - {formatDate(currentDraw.drawDate)}
          </p>
        </div>

        {/* Draw Details Card */}
        <div className="bg-white/10 rounded-xl border border-purple-500/30 p-6 mb-6">
          {/* Draw Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                <MdEmojiEvents className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Total Winners</div>
                <div className="text-xl font-bold text-yellow-400">
                  {currentDraw.winners?.length || 0}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
                <MdAttachMoney className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Prize Pool</div>
                <div className="text-xl font-bold text-green-400">
                  ${currentDraw.prizePool?.toFixed(2) || '0.00'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg border border-orange-500/30">
                <MdAttachMoney className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Carryover</div>
                <div className="text-xl font-bold text-orange-400">
                  ${currentDraw.carryover?.toFixed(2) || '0.00'}
                </div>
              </div>
            </div>

            {currentDraw.superballCarryover && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg border border-purple-500/30">
                  <MdEmojiEvents className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Superball</div>
                  <div className="text-xl font-bold text-purple-400">
                    ${currentDraw.superballCarryover?.toFixed(2) || '0.00'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Winning Numbers - Lottery Style */}
          {currentDraw.winnerNumbers && (
            <div>
              <div className="text-sm text-gray-300 uppercase tracking-wider mb-3 font-semibold">🎰 Winning Numbers:</div>
              <div className="flex flex-wrap gap-3 items-center">
                {Object.entries(currentDraw.winnerNumbers).map(([country, number]) => (
                  <div key={country} className="flex flex-col items-center gap-2">
                    <div className="text-xs text-gray-400 font-bold uppercase">{country}</div>
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 shadow-lg flex items-center justify-center border-2 border-yellow-300/50">
                        <span className="text-xl font-black text-white drop-shadow-lg">{number}</span>
                      </div>
                      <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Winners Per User Summary */}
        {winnersPerUser.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <MdPerson className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white">Winners Summary by User</h3>
              <span className="text-sm text-gray-400">({winnersPerUser.length} unique {winnersPerUser.length === 1 ? 'winner' : 'winners'})</span>
            </div>

            <div className="grid gap-4">
              {winnersPerUser.map((userSummary, idx) => (
                <div
                  key={userSummary.userId}
                  className="bg-slate-800/40 rounded-lg border border-slate-700/50 p-4 hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
                        <span className="text-lg font-bold text-blue-400">#{idx + 1}</span>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Email</div>
                        <div className="text-sm font-mono text-white break-all">
                          {userSummary.email ? userSummary.email : userSummary.userId.slice(-12)}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="text-xs text-gray-400">Wins</div>
                        <div className="text-lg font-bold text-yellow-400">{userSummary.wins.length}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-400">Total Prize</div>
                        <div className="text-lg font-bold text-green-400">${userSummary.totalPrize.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>

                  {/* User's Winning Tickets */}
                  <div className="space-y-3 mt-4 pt-4 border-t border-slate-700/50">
                    {userSummary.wins.map((win, winIdx) => {
                      // Highlight logic: FR must match exactly, others match any winner number
                      const winnerNumbersObj = currentDraw.winnerNumbers || {};
                      const ticketEntries = Object.entries(win.selections || {});
                      const highlightIndices = ticketEntries
                        .map(([country, number], i) => {
                          if (country === 'FR') {
                            return (winnerNumbersObj.FR && number === winnerNumbersObj.FR) ? i : null;
                          } else {
                            // Only highlight first occurrence of each matched number
                            const nonFRWinnerNumbers = Object.entries(winnerNumbersObj)
                              .filter(([key]) => key !== 'FR')
                              .map(([, val]) => val);
                            const alreadyHighlighted = ticketEntries.slice(0, i).some(([c, n]) => c !== 'FR' && n === number && nonFRWinnerNumbers.includes(n));
                            return nonFRWinnerNumbers.includes(number) && !alreadyHighlighted ? i : null;
                          }
                        })
                        .filter(i => i !== null);
                      // debug logs removed
                      return (
                        <div key={winIdx} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-500 font-semibold">Ticket #{winIdx + 1}</span>
                              <span className="text-xs text-white font-medium">{getCategoryLabel(win)}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-400">Matches:</span>
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold text-xs">
                                  {win.matches}
                                </span>
                              </div>
                              <span className="text-sm font-bold text-yellow-400">${win.prize.toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Lottery Balls for this ticket */}
                          <div className="flex flex-wrap gap-2">
                            {(() => {
                              const seenNumbers = new Set();
                              let frMatched = false;
                              return win.selections && Object.entries(win.selections).map(([country, number], idx) => {
                                let isMatch = false;
                                if (country === 'FR') {
                                  isMatch = !frMatched && currentDraw.winnerNumbers && typeof currentDraw.winnerNumbers.FR !== 'undefined' && String(number) === String(currentDraw.winnerNumbers.FR);
                                  if (isMatch) frMatched = true;
                                } else {
                                  const nonFRWinnerNumbers = Object.entries(currentDraw.winnerNumbers || {})
                                    .filter(([key]) => key !== 'FR')
                                    .map(([, val]) => val);
                                  isMatch = nonFRWinnerNumbers.includes(number) && !seenNumbers.has(number);
                                  if (isMatch) seenNumbers.add(number);
                                }
                                return (
                                  <div key={country + idx} className="flex flex-col items-center gap-1">
                                    <div className="text-[10px] text-gray-500 font-bold uppercase">{country}</div>
                                    <div className={`relative w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
                                      isMatch
                                        ? 'bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 text-white border-2 border-green-300/50'
                                        : 'bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 text-slate-300 border border-slate-600/50'
                                    }`}>
                                      <span className="drop-shadow">{number}</span>
                                      {isMatch && (
                                        <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>
                                      )}
                                    </div>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Winners;
