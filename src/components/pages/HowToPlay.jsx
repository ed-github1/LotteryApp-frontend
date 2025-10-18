

const HowToPlay = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-br from-[#0f172a] via-[#1e1a78] to-[#0f172a] py-10 px-2">
      <div className="w-full max-w-3xl bg-slate-900/80 rounded-2xl shadow-2xl border border-slate-700/40 p-8 md:p-12 text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">How to Play</h1>

        {/* Step 1: Pick Your Numbers */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 flex items-center justify-center text-xl font-black text-white shadow-lg">1</span>
            Pick Your Numbers
          </h2>
          <p className="text-white/80 mb-3">Choose your lucky numbers for each country. Each ticket lets you select one number per country. The more matches, the bigger your prize!</p>
          <div className="flex flex-wrap gap-3 mt-2">
            {['CA', 'GB', 'IT', 'KR', 'MX', 'NZ'].map((country, i) => (
              <div key={country} className="flex flex-col items-center gap-1">
                <div className="text-[10px] text-gray-400 font-bold uppercase">{country}</div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 shadow-lg flex items-center justify-center border-2 border-yellow-300/50">
                  <span className="text-lg font-black text-white drop-shadow-lg">{i + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Step 2: Buy Your Ticket */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-400 flex items-center justify-center text-xl font-black text-white shadow-lg">2</span>
            Buy Your Ticket
          </h2>
          <p className="text-white/80">Purchase your ticket securely. Each ticket enters you into the next global draw. The more tickets you buy, the higher your chances to win!</p>
        </section>

        {/* Step 3: Watch the Draw */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-400 flex items-center justify-center text-xl font-black text-white shadow-lg">3</span>
            Watch the Draw
          </h2>
          <p className="text-white/80">Tune in for the live draw to see if your numbers match the winning numbers. Results are posted instantly after each draw.</p>
        </section>

        {/* Step 4: Claim Your Prize */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-400 flex items-center justify-center text-xl font-black text-white shadow-lg">4</span>
            Claim Your Prize
          </h2>
          <p className="text-white/80">If you win, your prize is credited to your account automatically. Major winners may be contacted for verification.</p>
        </section>

        {/* Game Rules */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-2 text-yellow-300">Game Rules</h2>
          <ul className="list-disc pl-6 text-white/80 space-y-2">
            <li>Pick one number for each participating country per ticket.</li>
            <li>Match numbers with the official draw to win prizes.</li>
            <li>Prizes increase with more matches. Special prizes for matching all numbers.</li>
            <li>All draws are random and transparent.</li>
            <li>Players must be 18+ and comply with local laws.</li>
          </ul>
        </section>

        {/* Prizes */}
        <section>
          <h2 className="text-xl font-bold mb-2 text-yellow-300">Winning & Prizes</h2>
          <p className="text-white/80 mb-2">Prizes are awarded based on the number of matches per ticket. The more numbers you match, the bigger your prize!</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-xs font-bold text-yellow-300 uppercase">Matches</th>
                  <th className="px-3 py-2 text-xs font-bold text-yellow-300 uppercase">Prize Example</th>
                </tr>
              </thead>
              <tbody className="text-white/90">
                <tr className="bg-slate-800/60 rounded-lg">
                  <td className="px-3 py-2 font-bold">6 (All)</td>
                  <td className="px-3 py-2">Jackpot (e.g. $10,000,000+)</td>
                </tr>
                <tr className="bg-slate-800/40 rounded-lg">
                  <td className="px-3 py-2 font-bold">5</td>
                  <td className="px-3 py-2">$50,000</td>
                </tr>
                <tr className="bg-slate-800/40 rounded-lg">
                  <td className="px-3 py-2 font-bold">4</td>
                  <td className="px-3 py-2">$1,000</td>
                </tr>
                <tr className="bg-slate-800/40 rounded-lg">
                  <td className="px-3 py-2 font-bold">3</td>
                  <td className="px-3 py-2">$100</td>
                </tr>
                <tr className="bg-slate-800/40 rounded-lg">
                  <td className="px-3 py-2 font-bold">2</td>
                  <td className="px-3 py-2">$10</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowToPlay;
