import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function AdminPostSuperballWinners() {
  const [jackpot, setJackpot] = useState(null);
  const [numbers, setNumbers] = useState('');
  const [drawDate, setDrawDate] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadJackpot();
    // Set default draw date to next Friday
    const nextFriday = getNextFriday();
    setDrawDate(nextFriday.toISOString().slice(0, 16));
  }, []);

  function getNextFriday() {
    const now = new Date();
    const day = now.getUTCDay();
    const daysUntilFriday = (5 - day + 7) % 7 || 7;
    const nextFriday = new Date(now);
    nextFriday.setUTCDate(now.getUTCDate() + daysUntilFriday);
    nextFriday.setUTCHours(19, 0, 0, 0);
    return nextFriday;
  }

  async function loadJackpot() {
    try {
      const res = await fetch('/api/superball/jackpot');
      const data = await res.json();
      setJackpot(data);
    } catch (error) {
      console.error('Error loading jackpot:', error);
    }
  }

  function generateRandomNumbers() {
    const nums = [];
    while (nums.length < 5) {
      const num = Math.floor(Math.random() * 50) + 1;
      if (!nums.includes(num)) {
        nums.push(num);
      }
    }
    setNumbers(nums.sort((a, b) => a - b).join(','));
  }

  async function postWinners() {
    const numbersArray = numbers.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));

    if (numbersArray.length !== 5) {
      alert('Please enter exactly 5 numbers separated by commas');
      return;
    }

    if (numbersArray.some(n => n < 1 || n > 50)) {
      alert('All numbers must be between 1 and 50');
      return;
    }

    if (!drawDate) {
      alert('Please select a draw date');
      return;
    }

    if (!confirm(`Post winner numbers ${numbersArray.join(', ')} for draw on ${new Date(drawDate).toLocaleString()}?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/superball/draw-winner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drawDate: new Date(drawDate).toISOString(),
          winnerNumbers: numbersArray
        })
      });

      const data = await response.json();
      setResult(data);

      if (response.ok) {
        alert(`Success! ${data.totalWinners} winner(s) awarded $${data.prizePerWinner?.toFixed(2)} each!`);
        await loadJackpot();
      } else {
        alert(data.message || 'Error posting winners');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error posting winners');
    } finally {
      setLoading(false);
    }
  }

  if (!jackpot?.active) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-center border border-slate-700">
          <span className="text-6xl mb-4 block">⚠️</span>
          <h1 className="text-3xl font-bold text-white mb-4">No Active Superball Jackpot</h1>
          <p className="text-slate-300 text-lg">There is no active Superball jackpot to award at this time.</p>
          <p className="text-slate-400 mt-2">Superball must be triggered first before winners can be posted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-8">Admin: Post Superball Winners</h1>

          {/* Jackpot Info */}
          <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-xl p-6 mb-6 text-center shadow-2xl">
            <p className="text-white text-lg mb-2">Current Jackpot</p>
            <p className="text-5xl font-black text-white">${jackpot.amount?.toLocaleString()}</p>
          </div>

          {/* Form */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 mb-6 border border-slate-700 space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                Draw Date & Time
              </label>
              <input
                type="datetime-local"
                value={drawDate}
                onChange={(e) => setDrawDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Winner Numbers (5 numbers, 1-50, comma-separated)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={numbers}
                  onChange={(e) => setNumbers(e.target.value)}
                  placeholder="e.g., 5,12,23,34,45"
                  className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                />
                <button
                  onClick={generateRandomNumbers}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  🎲 Random
                </button>
              </div>
              {numbers && (
                <div className="mt-3 flex gap-2">
                  {numbers.split(',').map((n, i) => {
                    const num = parseInt(n.trim());
                    if (isNaN(num)) return null;
                    return (
                      <div
                        key={i}
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg"
                      >
                        {num}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={postWinners}
            disabled={loading}
            className={`w-full py-5 text-xl font-bold rounded-xl shadow-xl transition ${
              loading
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:scale-[1.02]'
            }`}
          >
            {loading ? 'Posting...' : '🏆 Post Winner Numbers & Award Prizes'}
          </button>

          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 bg-green-900/30 border border-green-500 rounded-xl p-6"
            >
              <h3 className="text-2xl font-bold text-white mb-4">🎉 Winners Awarded!</h3>
              <div className="space-y-2 text-slate-300">
                <p><strong>Total Winners:</strong> {result.totalWinners}</p>
                <p><strong>Prize Per Winner:</strong> ${result.prizePerWinner?.toFixed(2)}</p>
              </div>
              {result.winners && result.winners.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-white mb-2">Winner Details:</h4>
                  <div className="space-y-2">
                    {result.winners.map((w, i) => (
                      <div key={i} className="bg-slate-700/50 rounded p-3">
                        <p className="text-white">Winner {i + 1}: {w.email}</p>
                        <p className="text-green-400 font-bold">${w.prize?.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
