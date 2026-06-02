import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const barData = [
  { label: 'Y1', multiplier: 1.0, value: 'Start' },
  { label: 'Y5', multiplier: 1.8, value: 'Grows' },
  { label: 'Y10', multiplier: 3.1, value: 'Builds' },
  { label: 'Y15', multiplier: 5.2, value: 'Scales' },
  { label: 'Y20', multiplier: 8.6, value: 'Expands' },
  { label: 'Y25', multiplier: 13.2, value: 'Compounds' },
];

export const WealthJourney = () => {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 3);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const DownMarketCoins = () => (
    <div className="flex flex-wrap gap-1 items-end min-h-[60px]">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`down-${i}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 + i * 0.05 }}
          className={`flex items-center justify-center font-bold text-navy-900 rounded-full ${i < 8
            ? 'w-[26px] h-[26px] bg-[#E8C97A] text-[9px] shadow-[0_0_10px_rgba(201,168,76,0.4)]'
            : 'w-[18px] h-[18px] bg-gold text-[8px]'
            }`}
        >
          {i < 8 ? '★' : '•'}
        </motion.div>
      ))}
    </div>
  );

  const UpMarketCoins = () => (
    <div className="flex flex-wrap gap-1 items-end min-h-[60px]">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`up-${i}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 + i * 0.05 }}
          className="w-[18px] h-[18px] bg-gold flex items-center justify-center font-bold text-navy-900 rounded-full text-[8px]"
        >
          ★
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="bg-[#111210] rounded-[24px] overflow-hidden relative shadow-[0_40px_80px_rgba(0,0,0,0.35)] border border-[#C9A84C]/20 w-full min-h-[500px] flex flex-col justify-between font-sans relative before:absolute before:inset-0 before:opacity-40 before:pointer-events-none before:bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.03\'/%3E%3C/svg%3E')]">

      <div className="p-7 md:p-9 pb-6 flex-grow flex flex-col relative z-10 w-[min(100%,700px)] lg:w-auto h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-[10px] tracking-[0.18em] text-[#C9A84C] uppercase font-medium mb-2">Investor Education</div>
            <div className="font-serif text-[22px] md:text-2xl font-bold text-[#F0EBE0] leading-[1.25]">
              The <em className="italic text-[#E8C97A] font-serif">Science</em> Behind<br />Wealth Creation
            </div>
          </div>
          <div className="bg-[#C9A84C]/15 border border-[#C9A84C]/30 rounded-full px-3.5 py-1.5 text-[11px] text-[#C9A84C] font-semibold tracking-wide whitespace-nowrap">
            AMFI Registered MFD
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/[0.04] rounded-xl p-1 mb-6 border border-white/[0.06]">
          {['Rupee Cost Averaging', 'Power of Compounding', 'SIP Discipline'].map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`flex-1 py-2 px-1 text-[10px] md:text-xs font-semibold tracking-wide transition-all rounded-[9px] ${activeTab === idx
                ? 'bg-[#C9A84C] text-[#111210] shadow-[0_2px_12px_rgba(201,168,76,0.35)]'
                : 'text-[#8A8778] hover:text-[#F0EBE0] hover:bg-white/[0.06]'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="relative flex-grow min-h-[420px]">
          <AnimatePresence mode="wait">

            {activeTab === 0 && (
              <motion.div key="p0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Market Falls */}
                  <div className="bg-[#1A1A17] rounded-2xl p-4 md:p-5 border border-[#C9A84C]/[0.18] relative overflow-hidden group">
                    <div className="text-[10px] tracking-[0.12em] text-[#8A8778] uppercase mb-4 z-10 relative">📉 When Market Falls</div>

                    {/* Market Wave SVG */}
                    <div className="h-[60px] relative mb-4 opacity-70">
                      <svg className="w-full h-full" viewBox="0 0 200 70" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(255,100,100,0.2)" />
                            <stop offset="100%" stopColor="rgba(255,100,100,0)" />
                          </linearGradient>
                        </defs>
                        <path d="M0,20 C30,20 40,55 70,55 C100,55 110,35 140,40 C160,43 175,58 200,60 L200,70 L0,70 Z" fill="url(#redGrad)" />
                        <path d="M0,20 C30,20 40,55 70,55 C100,55 110,35 140,40 C160,43 175,58 200,60" fill="none" stroke="rgba(255,100,100,0.5)" strokeWidth="1.5" />
                      </svg>
                    </div>

                    <div className="text-[10px] tracking-widest text-[#8A8778] uppercase mb-3 z-10 relative">Your SIP buys <span className="text-[#E8C97A] font-bold">MORE units</span></div>
                    <DownMarketCoins />
                  </div>

                  {/* Market Rises */}
                  <div className="bg-[#1A1A17] rounded-2xl p-4 md:p-5 border border-[#C9A84C]/[0.18] relative overflow-hidden group">
                    <div className="text-[10px] tracking-[0.12em] text-[#8A8778] uppercase mb-4 z-10 relative">📈 When Market Rises</div>

                    {/* Market Wave SVG */}
                    <div className="h-[60px] relative mb-4 opacity-70">
                      <svg className="w-full h-full" viewBox="0 0 200 70" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(93,191,138,0.2)" />
                            <stop offset="100%" stopColor="rgba(93,191,138,0)" />
                          </linearGradient>
                        </defs>
                        <path d="M0,60 C30,60 50,30 80,22 C110,14 130,18 160,12 C175,9 185,8 200,8 L200,70 L0,70 Z" fill="url(#greenGrad)" />
                        <path d="M0,60 C30,60 50,30 80,22 C110,14 130,18 160,12 C175,9 185,8 200,8" fill="none" stroke="rgba(93,191,138,0.6)" strokeWidth="1.5" />
                      </svg>
                    </div>

                    <div className="text-[10px] tracking-widest text-[#8A8778] uppercase mb-3 z-10 relative">Your portfolio <span className="text-[#5DBF8A] font-bold">grows in value</span></div>
                    <UpMarketCoins />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#5DBF8A]/[0.12] to-[#5DBF8A]/[0.04] border border-[#5DBF8A]/20 rounded-xl p-4 flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-xl bg-[#5DBF8A]/15 flex items-center justify-center shrink-0 text-lg">⚖️</div>
                  <div>
                    <strong className="block text-[13px] font-semibold text-[#5DBF8A] mb-1">Systematic, disciplined investing</strong>
                    <span className="text-[11.5px] text-[#8A8778] leading-relaxed">A fixed SIP amount buys more units when prices are lower and fewer when higher, helping average your cost over time.</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 1 && (
              <motion.div key="p1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                <div className="bg-[#1A1A17] rounded-2xl p-6 border border-[#C9A84C]/[0.18] mb-4">
                  <div className="flex justify-center items-end gap-1 md:gap-3 h-[110px] mb-6">
                    {barData.map((d, i) => {
                      const targetH = Math.round((d.multiplier / 13.2) * 90);
                      return (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <div className="text-[9px] md:text-[11px] text-[#E8C97A] font-semibold mb-0.5">{d.value}</div>
                          <motion.div
                            initial={{ height: 4 }}
                            animate={{ height: targetH }}
                            transition={{ duration: 1, delay: i * 0.1, ease: [0.34, 1.2, 0.64, 1] }}
                            className="w-6 md:w-9 rounded-t-md bg-gradient-to-b from-[#E8C97A] to-[#C9A84C] relative overflow-hidden"
                          >
                            <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent" />
                          </motion.div>
                          <div className="text-[9px] md:text-[10px] text-[#8A8778] font-medium">{d.label}</div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex gap-2.5 flex-wrap">
                    <div className="flex-1 min-w-[100px] bg-[#C9A84C]/[0.15] border border-[#C9A84C]/[0.18] rounded-lg p-2 text-center text-[11px] text-[#E0D5BC]">
                      <strong className="block text-[#E8C97A] font-semibold text-xs mb-0.5">Early Years</strong>Principal starts working
                    </div>
                    <div className="flex-1 min-w-[100px] bg-[#C9A84C]/[0.15] border border-[#C9A84C]/[0.18] rounded-lg p-2 text-center text-[11px] text-[#E0D5BC]">
                      <strong className="block text-[#E8C97A] font-semibold text-xs mb-0.5">Mid Term</strong>Reinvested gains add up
                    </div>
                    <div className="flex-1 min-w-[100px] bg-[#C9A84C]/[0.15] border border-[#C9A84C]/[0.18] rounded-lg p-2 text-center text-[11px] text-[#E0D5BC]">
                      <strong className="block text-[#E8C97A] font-semibold text-xs mb-0.5">Long Term</strong>Compounding jumps
                    </div>
                  </div>
                </div>
                <div className="bg-[#5DBF8A]/10 border border-[#5DBF8A]/20 rounded-xl p-4 flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-xl bg-[#5DBF8A]/15 flex items-center justify-center shrink-0 text-lg">🌱</div>
                  <div>
                    <strong className="block text-[13px] font-semibold text-[#5DBF8A] mb-1">The Longer You Stay, The More It Works</strong>
                    <span className="text-[11.5px] text-[#8A8778] leading-relaxed">In mutual funds, reinvested gains generate their own gains. The longer you stay invested, the more this compounding effect works in your favour.</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 2 && (
              <motion.div key="p2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                <div className="bg-[#1A1A17] rounded-2xl p-5 border border-[#C9A84C]/[0.18] mb-4">
                  <div className="flex justify-between items-center mb-5">
                    <div className="text-[12px] text-[#8A8778] tracking-[0.08em] uppercase">12 months of SIP installments</div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.5 }} className="bg-[#5DBF8A]/15 border border-[#5DBF8A]/25 rounded-full px-3 py-1 text-[11px] text-[#5DBF8A] font-semibold">
                      🔥 12 Month Streak
                    </motion.div>
                  </div>
                  <div className="grid grid-cols-12 gap-1.5">
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                        animate={{ backgroundColor: '#C9A84C', boxShadow: '0 0 6px rgba(201,168,76,0.3)' }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                        className="aspect-square rounded shadow-sm"
                      />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-[#C9A84C]/[0.12] to-[#C9A84C]/[0.04] border border-[#C9A84C]/30 rounded-xl p-4 text-center">
                    <div className="font-serif text-[26px] text-[#E8C97A] font-bold">SIP</div>
                    <div className="text-[11px] text-[#8A8778] mt-1 leading-snug">Invest a fixed amount regularly.</div>
                  </div>
                  <div className="bg-[#1A1A17] border border-[#C9A84C]/[0.18] rounded-xl p-4 text-center">
                    <div className="font-serif text-[26px] text-[#E8C97A] font-bold">Auto</div>
                    <div className="text-[11px] text-[#8A8778] mt-1 leading-snug">Automated instalment on a fixed date.</div>
                  </div>
                </div>
                <div className="mt-4 bg-[#5DBF8A]/10 border border-[#5DBF8A]/20 rounded-xl p-4 flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-xl bg-[#5DBF8A]/15 flex items-center justify-center shrink-0 text-lg">🛡️</div>
                  <div>
                    <strong className="block text-[13px] font-semibold text-[#5DBF8A] mb-1">Consistency Over Timing</strong>
                    <span className="text-[11.5px] text-[#8A8778] leading-relaxed">Automated SIPs ensure you stay invested regardless of market news, building the habit needed to achieve long-term financial goals.</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer with strictly compliant disclaimers */}
        <div className="mt-8 pt-5 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="flex-1 w-full">
            <div className="text-[10px] text-[#A09B87] leading-[1.6]">
              <strong className="block text-[#C8C1A5] font-semibold mb-1">
                Mutual Fund investments are subject to market risks. Read all scheme related documents carefully before investing. Past performance is not indicative of future results. The above is for educational purposes only and not investment advice.
              </strong>
            </div>
          </div>
          <Link to="/contact" className="bg-[#C9A84C] hover:bg-[#E8C97A] hover:-translate-y-0.5 text-[#111210] rounded-[10px] px-[22px] py-[11px] text-[13px] font-semibold transition-all whitespace-nowrap shadow-[0_6px_20px_rgba(201,168,76,0.4)]">
            Know More →
          </Link>
        </div>

      </div>
    </div>
  );
};

export default WealthJourney;
