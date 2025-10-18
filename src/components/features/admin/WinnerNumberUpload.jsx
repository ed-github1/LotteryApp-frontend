import React, { useState } from 'react';
import { useDraw } from '../../../context/DrawContext';
import { useAuth } from '../../../context/AuthContext';
import { CircleFlag } from 'react-circle-flags';
import { motion, AnimatePresence } from 'framer-motion';
import { useTicket } from '../../../context/TicketContext';
import { getWinnerNumberByDrawDateService } from '../../../services/winnerNumbersService';
import { postSuperballWinner } from '../../../services/superballService';


const tabs = [
  {
    key: 'lottery',
    label: '🎯 Lottery Winners',
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    key: 'superball',
    label: '🎱 SuperBall Winner',
    gradient: 'from-purple-400 to-pink-500',
  },
];

const WinnerNumberUpload = () => {
  const { uploadWinnerNumber, updateWinnerNumber, nextDraws } = useDraw();
  const { token } = useAuth();
  const { countryConfigs = [] } = useTicket();
  const [activeTab, setActiveTab] = useState('lottery');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [winnerDocId, setWinnerDocId] = useState(null);
  const [currentWinnerNumbers, setCurrentWinnerNumbers] = useState({});
  const [editingNumbers, setEditingNumbers] = useState({}); // Temp state for editing
  const [savingCountries, setSavingCountries] = useState(new Set()); // Track which countries are saving

  // SuperBall state
  const [superballNumber, setSuperballNumber] = useState('');
  const [superballDrawDate, setSuperballDrawDate] = useState('');
  const [isSavingSuperball, setIsSavingSuperball] = useState(false);
  const [superballStatus, setSuperballStatus] = useState('');

  // Selected draw date (defaults to today)
  const [selectedDrawDate, setSelectedDrawDate] = useState(() => {
    const today = new Date();
    const year = today.getUTCFullYear();
    const month = today.getUTCMonth();
    const day = today.getUTCDate();
    const drawDate = new Date(Date.UTC(year, month, day, 2, 0, 0, 0));
    return drawDate.toISOString();
  });


  const todayDrawDate = selectedDrawDate;
  console.log('📅 Selected draw date:', todayDrawDate, 'Local:', new Date(todayDrawDate).toLocaleString());

  // Handler for date change
  const handleDrawDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    selectedDate.setUTCHours(2, 0, 0, 0);
    setSelectedDrawDate(selectedDate.toISOString());
  };
  const countriesForThisDraw = (nextDraws || [])
    .filter(d => {
      const drawDate = new Date(d.drawDate);
      const today = new Date(todayDrawDate);
      return drawDate.toDateString() === today.toDateString();
    })
    .map(d => d.countryCode);

  // Get country config objects for countries in this draw
  // If no draws available, show all countries from config
  const availableCountries = countriesForThisDraw.length > 0
    ? countryConfigs.filter(c => countriesForThisDraw.includes(c.code))
    : countryConfigs;


  // Helper to fetch WinnerNumber doc for this draw date
  const fetchWinnerDocId = async () => {
    if (!todayDrawDate || !token) return null;
    try {
      const res = await getWinnerNumberByDrawDateService(todayDrawDate, token);
      console.log('Fetched winner numbers:', res);
      
      if (Array.isArray(res) && res.length > 0) {
        // Store current winner numbers
        const numbers = res[0].winnerNumbers || {};
        console.log('Setting currentWinnerNumbers from array:', numbers);
        setCurrentWinnerNumbers(numbers);
        setEditingNumbers(numbers); // Initialize editing state
        setWinnerDocId(res[0]._id);
        return res[0]._id;
      }
      if (res && res._id) {
        const numbers = res.winnerNumbers || {};
        setCurrentWinnerNumbers(numbers);
        setEditingNumbers(numbers);
        setWinnerDocId(res._id);
        return res._id;
      }
    } catch (err) {
      // 404 is expected when no document exists yet for this draw date
      // But backend might have a bug where it returns 404 even when doc exists
      if (err.response?.status !== 404) {
        console.error('Error fetching winner numbers:', err);
      } else {
        console.log('No winner numbers exist yet for this draw date (404) - or backend query bug');
      }
      
      // Try to extract any existing data from error response
      if (err.response?.data?.winner) {
        console.log('Found winner data in error response:', err.response.data.winner);
        const numbers = err.response.data.winner.winnerNumbers || {};
        setCurrentWinnerNumbers(numbers);
        setEditingNumbers(numbers);
        setWinnerDocId(err.response.data.winner._id);
        return err.response.data.winner._id;
      }
    }
    return null;
  };

  // Load winner numbers on mount
  React.useEffect(() => {
    if (token && todayDrawDate) {
      console.log('🔄 useEffect triggered - fetching winner numbers...');
      fetchWinnerDocId();
    }
  }, [todayDrawDate, token]);

  // Handle input change for a country
  const handleNumberChange = (countryCode, value) => {
    setEditingNumbers(prev => ({
      ...prev,
      [countryCode]: value
    }));
  };

  // Save a single country's winner number
  const handleSaveCountry = async (countryCode) => {
    const numberValue = editingNumbers[countryCode];
    
    if (!numberValue || numberValue === '') {
      setStatus(`❌ Please enter a number for ${countryCode}`);
      return;
    }

    console.log(`💾 Saving ${countryCode}: ${numberValue}`);
    setSavingCountries(prev => new Set(prev).add(countryCode));
    
    try {
      let docId = winnerDocId;
      if (!docId) {
        console.log('No docId, fetching...');
        docId = await fetchWinnerDocId();
        console.log('Fetched docId:', docId);
      }

      let savedDocId = docId;

      if (!docId) {
        // No doc exists: create new (POST)
        console.log('Creating new winner number document...');
        console.log('Payload:', {
          winnerNumbers: { [countryCode]: Number(numberValue) }
        });
        
        const res = await uploadWinnerNumber({
          winnerNumbers: { [countryCode]: Number(numberValue) }
        });
        
        console.log('✅ CREATE RESPONSE:', JSON.stringify(res, null, 2));
        console.log('Response structure:', {
          hasWinner: !!res.winner,
          hasId: !!res._id,
          drawDate: res.drawDate || res.winner?.drawDate,
          winnerNumbers: res.winnerNumbers || res.winner?.winnerNumbers
        });

        if (res.winner) {
          savedDocId = res.winner._id;
          setWinnerDocId(res.winner._id);
          console.log('✅ Set docId from res.winner._id:', savedDocId);
          
          // Check if winner number was actually saved with the correct value
          const savedWinnerNumbers = res.winner.winnerNumbers || {};
          console.log('Winner numbers in response:', savedWinnerNumbers);
          
          // Always update to ensure we save the new value
          // (Backend returns existing doc, not the updated one on POST)
          if (savedWinnerNumbers[countryCode] !== Number(numberValue)) {
            console.log(`⚠️ Winner number mismatch or missing. Expected: ${numberValue}, Got: ${savedWinnerNumbers[countryCode]}. Updating...`);
            await updateWinnerNumber(res.winner._id, countryCode, Number(numberValue));
          } else {
            console.log('✅ Winner number already matches!');
          }
        } else if (res._id) {
          savedDocId = res._id;
          setWinnerDocId(res._id);
          console.log('✅ Set docId from res._id:', savedDocId);
          const savedWinnerNumbers = res.winnerNumbers || {};
          
          // Always update if value doesn't match
          if (savedWinnerNumbers[countryCode] !== Number(numberValue)) {
            console.log(`⚠️ Updating to ensure correct value: ${numberValue}`);
            await updateWinnerNumber(res._id, countryCode, Number(numberValue));
          }
        }
      } else {
        // Doc exists: update (PATCH)
        console.log('Updating existing document:', docId);
        const updateRes = await updateWinnerNumber(docId, countryCode, Number(numberValue));
        console.log('Update response:', updateRes);
      }

      // Update local state immediately
      const savedNumber = Number(numberValue);
      console.log(`✅ Setting currentWinnerNumbers[${countryCode}] = ${savedNumber}`);
      setCurrentWinnerNumbers(prev => {
        const updated = {
          ...prev,
          [countryCode]: savedNumber
        };
        console.log('Updated currentWinnerNumbers:', updated);
        return updated;
      });
      
      // Refresh data from server to confirm
      console.log('Refreshing from server...');
      await fetchWinnerDocId();
      
      setStatus(`✅ Winner number for ${countryCode} saved successfully!`);
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setStatus(`❌ Error saving ${countryCode}: ${err.response?.data?.message || err.message}`);
    } finally {
      setSavingCountries(prev => {
        const next = new Set(prev);
        next.delete(countryCode);
        return next;
      });
    }
  };

  // Handle SuperBall winner number submission
  const handleSaveSuperball = async () => {
    if (!superballNumber || superballNumber === '') {
      setSuperballStatus('❌ Please enter a SuperBall winner number (1-10)');
      setTimeout(() => setSuperballStatus(''), 3000);
      return;
    }

    if (!superballDrawDate || superballDrawDate === '') {
      setSuperballStatus('❌ Please select a draw date');
      setTimeout(() => setSuperballStatus(''), 3000);
      return;
    }

    const number = Number(superballNumber);
    if (isNaN(number) || number < 1 || number > 10) {
      setSuperballStatus('❌ SuperBall winner number must be between 1 and 10');
      setTimeout(() => setSuperballStatus(''), 3000);
      return;
    }

    setIsSavingSuperball(true);
    try {
      const result = await postSuperballWinner(superballDrawDate, number, token);
      
      setSuperballStatus(
        `✅ SuperBall winner posted! ${result.totalWinners} winner(s) awarded $${result.prizePerWinner?.toFixed(2)} each!`
      );
      
      // Clear form
      setSuperballNumber('');
      setSuperballDrawDate('');
      
      setTimeout(() => setSuperballStatus(''), 5000);
    } catch (err) {
      console.error('SuperBall save error:', err);
      setSuperballStatus(
        `❌ Error: ${err.message || 'Failed to post SuperBall winner'}`
      );
      setTimeout(() => setSuperballStatus(''), 5000);
    } finally {
      setIsSavingSuperball(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4 py-8">
      <div className="w-full max-w-5xl space-y-6">
        {/* Debug Info */}
        {availableCountries.length === 0 && (
          <div className="bg-red-500/20 border-2 border-red-400 text-red-200 p-4 rounded-xl text-center">
            <p className="font-bold mb-2">⚠️ No countries available</p>
            <p className="text-sm">Check console for debug info</p>
          </div>
        )}
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4">
            <span className="text-yellow-400">🏆</span> Manage Winner Numbers
          </h1>
          
          {/* Date Selector */}
          <div className="flex flex-col items-center gap-2 mb-4">
            <label className="text-white/70 text-sm font-semibold">Select Draw Date:</label>
            <input
              type="date"
              value={new Date(todayDrawDate).toISOString().split('T')[0]}
              onChange={handleDrawDateChange}
              className="px-4 py-2 bg-white/10 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:border-yellow-400 text-center font-semibold"
            />
          </div>
          
          <p className="text-lg md:text-xl text-white/80">
            Draw Date: <span className="font-bold text-yellow-300">{new Date(todayDrawDate).toLocaleDateString()} at {new Date(todayDrawDate).toLocaleTimeString()}</span>
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative flex w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-4 font-semibold text-base transition-all duration-200 z-10 relative
                  ${activeTab === tab.key ? 'text-white' : 'text-white/60 hover:text-white'}
                  focus:outline-none`}
                role="tab"
                aria-selected={activeTab === tab.key}
                tabIndex={activeTab === tab.key ? 0 : -1}
                style={{ borderRadius: 0 }}
              >
                {tab.label}
              </button>
            ))}
            {/* Animated Tab Indicator */}
            <motion.div
              layout
              transition={{ type: 'spring', damping: 18, stiffness: 250 }}
              className="absolute top-0 h-full w-1/2 rounded-2xl pointer-events-none"
              style={{
                left: activeTab === 'superball' ? '50%' : '0%',
                background:
                  activeTab === 'superball'
                    ? 'linear-gradient(to right, #a78bfa, #f472b6)'
                    : 'linear-gradient(to right, #facc15, #f97316)',
                boxShadow: '0 2px 16px 0 rgba(0,0,0,0.12)',
              }}
            />
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'lottery' && (
            <motion.div
              key="lottery"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
        {/* Status Message */}
        <AnimatePresence>
          {status && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`text-center py-3 rounded-xl font-semibold ${
                status.startsWith('✅')
                  ? 'bg-green-500/20 text-green-200 border-2 border-green-400'
                  : 'bg-red-500/20 text-red-200 border-2 border-red-400'
              }`}
            >
              {status}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Winner Numbers Table */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
        >
          {/* Table Header */}
          <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 border-b-2 border-yellow-400/30 px-6 py-4">
            <h2 className="text-2xl font-bold text-white text-center">
              Enter Winner Numbers
            </h2>
          </div>

          {/* Table Content */}
          <div className="p-6">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left text-white/80 font-semibold py-3 px-4">Country</th>
                    <th className="text-center text-white/80 font-semibold py-3 px-4">Winner Number</th>
                    <th className="text-center text-white/80 font-semibold py-3 px-4">Status</th>
                    <th className="text-center text-white/80 font-semibold py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {availableCountries.map((country) => {
                    const savedValue = currentWinnerNumbers[country.code];
                    const isSaved = savedValue !== undefined && savedValue !== null && savedValue !== '';
                    const isSaving = savingCountries.has(country.code);
                    const currentValue = editingNumbers[country.code] || '';
                    
                    // Debug logging
                    console.log(`${country.code}: savedValue=${savedValue}, isSaved=${isSaved}, currentValue=${currentValue}`);
                    
                    return (
                      <motion.tr
                        key={country.code}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-white/10 hover:bg-white/5 transition-colors"
                      >
                        {/* Country */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <CircleFlag
                              countryCode={country.flag}
                              alt={country.name}
                              className="h-8 w-8 rounded-full border-2 border-white/30"
                            />
                            <div>
                              <div className="text-white font-semibold">{country.name}</div>
                              <div className="text-white/60 text-sm">{country.code}</div>
                            </div>
                          </div>
                        </td>

                        {/* Number Input */}
                        <td className="py-4 px-4">
                          <input
                            type="number"
                            min="1"
                            max={country.totalNumbers}
                            value={currentValue}
                            onChange={(e) => handleNumberChange(country.code, e.target.value)}
                            placeholder={`1-${country.totalNumbers}`}
                            className="w-full max-w-[120px] mx-auto px-4 py-2 text-center text-xl font-bold bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 transition-all"
                          />
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 text-center">
                          {isSaved ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-semibold">
                              ✓ Saved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm">
                              ○ Empty
                            </span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => handleSaveCountry(country.code)}
                            disabled={isSaving || !currentValue}
                            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                              isSaving
                                ? 'bg-gray-500/20 text-gray-400 cursor-wait'
                                : !currentValue
                                ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-500 hover:to-yellow-600 hover:scale-105'
                            }`}
                          >
                            {isSaving ? '⏳' : '💾'} {isSaving ? 'Saving...' : 'Save'}
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {availableCountries.map((country) => {
                const savedValue = currentWinnerNumbers[country.code];
                const isSaved = savedValue !== undefined && savedValue !== null && savedValue !== '';
                const isSaving = savingCountries.has(country.code);
                const currentValue = editingNumbers[country.code] || '';
                
                console.log(`Mobile ${country.code}: savedValue=${savedValue}, isSaved=${isSaved}`);
                
                return (
                  <motion.div
                    key={country.code}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                  >
                    {/* Country Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <CircleFlag
                          countryCode={country.flag}
                          alt={country.name}
                          className="h-10 w-10 rounded-full border-2 border-white/30"
                        />
                        <div>
                          <div className="text-white font-semibold">{country.name}</div>
                          <div className="text-white/60 text-sm">{country.code}</div>
                        </div>
                      </div>
                      {isSaved ? (
                        <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold">
                          ✓ Saved
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
                          Empty
                        </span>
                      )}
                    </div>

                    {/* Input and Button */}
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1"
                        max={country.totalNumbers}
                        value={currentValue}
                        onChange={(e) => handleNumberChange(country.code, e.target.value)}
                        placeholder={`1-${country.totalNumbers}`}
                        className="flex-1 px-4 py-3 text-center text-xl font-bold bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
                      />
                      <button
                        onClick={() => handleSaveCountry(country.code)}
                        disabled={isSaving || !currentValue}
                        className={`px-6 py-3 rounded-xl font-semibold ${
                          isSaving
                            ? 'bg-gray-500/20 text-gray-400'
                            : !currentValue
                            ? 'bg-gray-500/20 text-gray-400'
                            : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900'
                        }`}
                      >
                        {isSaving ? '⏳' : '💾'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Help Text */}
          <div className="bg-white/5 border-t border-white/10 px-6 py-4 text-center text-white/60 text-sm">
            💡 Enter the winning number for each country and click Save
          </div>
        </motion.div>
            </motion.div>
          )}

          {activeTab === 'superball' && (
            <motion.div
              key="superball"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >

        {/* SuperBall Winner Number Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
        >
          {/* SuperBall Header */}
          <div className="bg-gradient-to-r from-purple-400/20 to-pink-500/20 border-b-2 border-purple-400/30 px-6 py-4">
            <h2 className="text-2xl font-bold text-white text-center flex items-center justify-center gap-3">
              <span className="text-3xl">🎱</span>
              SuperBall Winner Number
              <span className="text-3xl">🎱</span>
            </h2>
            <p className="text-white/70 text-center mt-2 text-sm">
              Post the winning number (1-10) to award the jackpot to winners
            </p>
          </div>

          {/* SuperBall Status Message */}
          <AnimatePresence>
            {superballStatus && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mx-6 mt-6 text-center py-3 rounded-xl font-semibold ${
                  superballStatus.startsWith('✅')
                    ? 'bg-green-500/20 text-green-200 border-2 border-green-400'
                    : 'bg-red-500/20 text-red-200 border-2 border-red-400'
                }`}
              >
                {superballStatus}
              </motion.div>
            )}
          </AnimatePresence>

          {/* SuperBall Form */}
          <div className="p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Draw Date Input */}
              <div>
                <label className="block text-white/80 font-semibold mb-2 text-sm">
                  Draw Date
                </label>
                <input
                  type="date"
                  value={superballDrawDate}
                  onChange={(e) => setSuperballDrawDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400 text-lg"
                />
              </div>

              {/* Winner Number Input */}
              <div>
                <label className="block text-white/80 font-semibold mb-2 text-sm">
                  Winner Number (1-10)
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={superballNumber}
                    onChange={(e) => setSuperballNumber(e.target.value)}
                    placeholder="Enter number 1-10"
                    className="flex-1 px-4 py-3 text-center text-2xl font-bold bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                  />
                  <button
                    onClick={handleSaveSuperball}
                    disabled={isSavingSuperball || !superballNumber || !superballDrawDate}
                    className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${
                      isSavingSuperball
                        ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                        : !superballNumber || !superballDrawDate
                        ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 shadow-lg'
                    }`}
                  >
                    {isSavingSuperball ? '⏳ Posting...' : '🎱 Post Winner'}
                  </button>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-purple-500/10 border border-purple-400/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">ℹ️</span>
                  <div className="text-sm text-white/80 space-y-2">
                    <p className="font-semibold text-purple-300">Important Notes:</p>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>SuperBall requires an active jackpot (10 consecutive draws without Cat 1 winner)</li>
                      <li>Winner number must be between 1 and 10</li>
                      <li>This will automatically award prizes to all winners</li>
                      <li>USDT deposits will be processed within 48 hours</li>
                      <li>Winners will be notified by email</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WinnerNumberUpload;