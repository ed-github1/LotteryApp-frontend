import { useState } from 'react';
import { motion } from 'framer-motion';

export function AdminTriggerSuperball() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function triggerSuperball() {
    if (!confirm('Trigger Superball by posting Oct 3 winner numbers?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/winner-numbers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drawDate: '2025-10-03T19:00:00.000Z',
          winnerNumbers: {
            IT: 10,
            CA: 20,
            MX: 30,
            NZ: 40,
            KR: 50,
            IE: 15,
            UK: 25,
            FR: 5
          }
        })
      });

      const data = await response.json();
      setResult(data);

      if (data.triggeredSuperball) {
        alert(`🎯 SUPERBALL TRIGGERED!\n$${data.superballTransfer.toFixed(2)} transferred to Superball jackpot!`);
      } else {
        alert('Winner numbers posted successfully');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error triggering Superball');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-8">Admin: Trigger Superball</h1>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 mb-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Testing Information</h3>
            <div className="text-slate-300 space-y-2">
              <p>• This will post winner numbers for Oct 3, 2025 draw</p>
              <p>• If this is the 10th consecutive draw without a Cat 1 winner, Superball will be triggered</p>
              <p>• Carryover funds will be transferred to Superball jackpot</p>
              <p>• Users will be able to enter Superball with their credits</p>
            </div>
          </div>

          <button
            onClick={triggerSuperball}
            disabled={loading}
            className={`w-full py-5 text-xl font-bold rounded-xl shadow-xl transition ${
              loading
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-[1.02]'
            }`}
          >
            {loading ? 'Processing...' : '🎯 Trigger Superball (Post Draw 10 Winners)'}
          </button>

          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mt-6 rounded-xl p-6 border ${
                result.triggeredSuperball
                  ? 'bg-green-900/30 border-green-500'
                  : 'bg-blue-900/30 border-blue-500'
              }`}
            >
              <h3 className="text-xl font-bold text-white mb-4">
                {result.triggeredSuperball ? '🎉 Superball Triggered!' : 'ℹ️ Result'}
              </h3>
              <pre className="text-sm text-slate-300 overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
