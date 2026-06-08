import React, { useState, useMemo } from 'react';
import { TrendingUp, BarChart3, PieChart, ArrowUpRight, CheckCircle2, ChevronRight, ShieldCheck, Landmark, HeadphonesIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroFloatingCards from './HeroFloatingCards';
import bgImage from '../assets/bg2.webp';

const fmt = (n) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
};

const InteractiveHeroCalculator = () => {
  const [activeTab, setActiveTab] = useState('sip');

  // SIP / Lumpsum / Goal Common Params
  const [val, setVal] = useState(10000); // Monthly SIP or Lumpsum Principal
  const [yrs, setYrs] = useState(15);
  const [ret, setRet] = useState(12);

  // Goal Specific
  const [target, setTarget] = useState(10000000); // 1 Cr

  const results = useMemo(() => {
    const r = ret / 100 / 12;
    const n = yrs * 12;

    if (activeTab === 'sip') {
      const fv = val * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      const invested = val * n;
      const fdR = 0.07 / 12;
      const fdFv = val * ((Math.pow(1 + fdR, n) - 1) / fdR) * (1 + fdR);
      const extra = fv - fdFv;
      const pctMore = ((fv / fdFv) - 1) * 100;
      return { fv, invested, gains: fv - invested, extra, pctMore, type: 'sip' };
    }

    if (activeTab === 'lumpsum') {
      const fv = val * Math.pow(1 + ret / 100, yrs);
      const invested = val;
      const fdFv = val * Math.pow(1 + 0.07, yrs);
      const extra = fv - fdFv;
      const pctMore = ((fv / fdFv) - 1) * 100;
      return { fv, invested, gains: fv - invested, extra, pctMore, fdFv, type: 'lump' };
    }

    if (activeTab === 'goal') {
      // Required SIP calculation
      const reqSip = target * r / ((Math.pow(1 + r, n) - 1) * (1 + r));
      const n2 = (yrs > 2 ? yrs - 2 : 1) * 12;
      const reqSipDelay = target * r / ((Math.pow(1 + r, n2) - 1) * (1 + r));
      const invested = reqSip * n;
      const gains = target - invested;
      const lumpOption = target / Math.pow(1 + ret / 100, yrs);
      const delayPct = ((reqSipDelay / reqSip) - 1) * 100;
      return { reqSip, reqSipDelay, invested, gains, lumpOption, delayPct, type: 'goal' };
    }

    return {};
  }, [activeTab, val, yrs, ret, target]);

  const chartData = useMemo(() => {
    if (activeTab === 'goal') return null;
    const W = 460, H = 68;
    const months = yrs * 12;
    let maxV = 0;
    const pts_growth = [];
    const pts_inv = [];

    for (let m = 1; m <= months; m++) {
      let g = 0;
      let inv = 0;
      const r = ret / 100 / 12;
      if (activeTab === 'sip') {
        g = val * ((Math.pow(1 + r, m) - 1) / r) * (1 + r);
        inv = val * m;
      } else {
        const yr = m / (activeTab === 'sip' ? 12 : months / yrs);
        g = val * Math.pow(1 + ret / 100, yr);
        inv = val;
      }
      if (g > maxV) maxV = g;
      pts_growth.push(g);
      pts_inv.push(inv);
    }

    const xScale = (i) => (i / (pts_growth.length - 1)) * W;
    const yScale = (v) => (1 - (v / maxV)) * (H - 6) + 2;

    let growthPath = 'M';
    let invPath = 'M';
    for (let i = 0; i < pts_growth.length; i++) {
      growthPath += (i ? 'L' : '') + xScale(i).toFixed(1) + ' ' + yScale(pts_growth[i]).toFixed(1);
      invPath += (i ? 'L' : '') + xScale(i).toFixed(1) + ' ' + yScale(pts_inv[i]).toFixed(1);
    }

    const lastX = xScale(pts_growth.length - 1);
    const lastY = yScale(pts_growth[pts_growth.length - 1]);
    const fillPath = growthPath + ` L${lastX.toFixed(1)} ${H} L0 ${H} Z`;

    return { growthPath, invPath, fillPath, lastX, lastY };
  }, [activeTab, val, yrs, ret]);

  return (
    <div className="bg-[#0D1117] rounded-[40px] p-6 md:p-8 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] relative overflow-hidden group border border-white/5">
      {/* Dynamic Gold Glow Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold/10 rounded-full blur-[80px] group-hover:bg-gold/15 transition-all duration-1000" />

      <div className="relative z-10">
        <h3 className="text-white font-serif text-xl font-bold mb-6 leading-tight">
          Visualise your <span className="italic text-gold italic">investment illustration</span> <br />
          across different time horizons
        </h3>

        <div className="flex gap-2 p-1 bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl mb-6">
          {[
            { id: 'sip', label: 'Monthly SIP' },
            { id: 'lumpsum', label: 'Lumpsum' },
            { id: 'goal', label: 'Goal Planner' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === tab.id
                ? 'bg-gold/20 text-gold border border-gold/30 shadow-[0_4px_20px_-10px_rgba(197,160,89,0.4)]'
                : 'text-gray-500 hover:text-gray-300'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SIP & LUMPSUM UI */}
        {(activeTab === 'sip' || activeTab === 'lumpsum') && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    {activeTab === 'sip' ? 'Monthly SIP' : 'Investment'}
                  </span>
                  <span className="text-white text-sm font-bold">{fmt(val)}</span>
                </div>
                <input
                  type="range" min={activeTab === 'sip' ? 500 : 10000} max={activeTab === 'sip' ? 100000 : 5000000} step={500} value={val}
                  onChange={(e) => setVal(Number(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-gold"
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Duration</span>
                  <span className="text-white text-sm font-bold">{yrs} Yrs</span>
                </div>
                <input
                  type="range" min="1" max="40" value={yrs}
                  onChange={(e) => setYrs(Number(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-gold"
                />
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Illustrative Returns (p.a.)</span>
                <span className="text-white text-sm font-bold">{ret}%</span>
              </div>
              <input
                type="range" min="5" max="15" step="0.5" value={ret}
                onChange={(e) => setRet(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-gold"
              />
            </div>

            <div className="h-20 relative mb-8 overflow-hidden rounded-2xl bg-white/[0.03] border border-white/5 p-4">
              <svg className="w-full h-full" viewBox="0 0 460 68" preserveAspectRatio="none">
                <path d={chartData.fillPath} fill="rgba(196, 160, 80, 0.12)" className="transition-all duration-300" />
                <path d={chartData.invPath} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 2" />
                <path d={chartData.growthPath} fill="none" stroke="#C4A050" strokeWidth="2" strokeLinecap="round" className="transition-all duration-300" />
                <circle cx={chartData.lastX} cy={chartData.lastY} r="4" fill="#C4A050" className="transition-all duration-300" />
                <text x="6" y="13" fill="rgba(196,160,80,0.6)" fontSize="9" fontWeight="bold">GROWTH</text>
                <text x="6" y="24" fill="rgba(255,255,255,0.2)" fontSize="9" fontWeight="bold">INVESTED</text>
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6 md:mb-8">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1 leading-none">Invested</div>
                <div className="text-lg font-bold text-white truncate">{fmt(results.invested)}</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="text-[9px] text-green-500/50 font-bold uppercase tracking-widest mb-1 leading-none">Estimated Returns</div>
                <div className="text-lg font-bold text-green-400 truncate">+{fmt(results.gains)}</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1 leading-none">Est. Final Value</div>
                <div className="text-lg font-bold text-white truncate">{fmt(results.fv)}</div>
              </div>
            </div>

            <div className="bg-gold/5 border border-gold/10 rounded-2xl p-5 mb-8 flex items-center justify-between gap-4">
              <div className="flex-grow">
                <div className="text-[10px] text-gray-400 font-bold mb-1">vs Fixed Deposit (7%)</div>
                <div className="text-sm font-medium text-white leading-tight">
                  {activeTab === 'sip' ? (
                    <>You earn <span className="text-gold font-bold">{fmt(results.extra)} more</span></>
                  ) : (
                    <>FD grows to <span className="text-gray-400">{fmt(results.fdFv)}</span></>
                  )}
                </div>
              </div>
              <div className="bg-green-500/20 text-green-400 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-green-500/10 whitespace-nowrap">
                +{Math.round(results.pctMore)}% BEAT
              </div>
            </div>
          </>
        )}

        {/* GOAL PLANNER UI */}
        {activeTab === 'goal' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
              <div className="space-y-3">
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Target Amount</div>
                <div className="text-xl font-bold text-white leading-none">{fmt(target)}</div>
                <input
                  type="range" min="100000" max="100000000" step="100000" value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                  className="w-full h-0.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-gold"
                />
              </div>
              <div className="space-y-3">
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Time to Goal</div>
                <div className="text-xl font-bold text-white leading-none">{yrs} yrs</div>
                <input
                  type="range" min="1" max="40" value={yrs}
                  onChange={(e) => setYrs(Number(e.target.value))}
                  className="w-full h-0.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-gold"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Expected Return</div>
              <div className="text-xl font-bold text-white leading-none">{ret.toFixed(1)}% p.a.</div>
              <input
                type="range" min="5" max="25" step="0.5" value={ret}
                onChange={(e) => setRet(Number(e.target.value))}
                className="w-full h-0.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-gold"
              />
            </div>

            <div className="bg-[#1C2433] border border-white/5 rounded-2xl p-6 text-center">
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Required Monthly SIP</div>
              <div className="text-4xl font-serif font-black text-gold mb-1">₹{Math.round(results.reqSip).toLocaleString('en-IN')}</div>
              <p className="text-[10px] text-gray-400">
                to reach {fmt(target)} in {yrs} years at {ret.toFixed(1)}% p.a.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="text-[9px] text-gray-500 font-bold uppercase mb-1">Total Invested</div>
                <div className="text-base font-bold text-white">{fmt(results.invested)}</div>
                <div className="text-[9px] text-gray-600">Over {yrs} years</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="text-[9px] text-gray-500 font-bold uppercase mb-1">Estimated Corpus</div>
                <div className="text-base font-bold text-green-400">{fmt(results.gains)}</div>
                <div className="text-[9px] text-gray-600">Pure returns</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="text-[9px] text-gray-500 font-bold uppercase mb-1">If You Delay 2 Yrs</div>
                <div className="text-base font-bold text-orange-400">₹{Math.round(results.reqSipDelay).toLocaleString('en-IN')}</div>
                <div className="text-[9px] text-gray-600">SIP needed instead</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="text-[9px] text-gray-500 font-bold uppercase mb-1">Lumpsum Option</div>
                <div className="text-base font-bold text-white">₹{Math.round(results.lumpOption).toLocaleString('en-IN')}</div>
                <div className="text-[9px] text-gray-600">One-time investment</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Cost of Delay - every year you wait</div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, 100 - results.delayPct)}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-gray-500 font-bold">
                <span>Start today</span>
                <span className="text-gray-400">+{Math.round(results.delayPct)}% more SIP if delayed 2 yrs</span>
              </div>
            </div>
          </div>
        )}

        <Link to="/contact" className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-xs font-black group mt-8 shadow-[0_15px_30px_-10px_rgba(196,160,80,0.4)]">
          {activeTab === 'sip' && 'Start This SIP with Guided Support'}
          {activeTab === 'lumpsum' && 'Invest This Lumpsum with Guided Support'}
          {activeTab === 'goal' && 'Build My Goal Portfolio'}
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>

        <p className="text-center text-[10px] text-gray-400 font-medium mt-6 leading-relaxed">
          Growth projections are illustrative. Actual performance may vary. <br />
          Mutual fund investments are subject to market risks.
        </p>
      </div>
    </div>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-28 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-[#FAF9F6] lg:bg-white">
      {/* Right half background image */}
      <div
        className="absolute top-0 right-0 w-full lg:w-[50%] h-full opacity-10 lg:opacity-100 z-0"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent hidden lg:block" />
        <div className="absolute inset-0 bg-white/10 lg:bg-transparent pointer-events-none" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Content Left */}
          <div className="lg:pt-4">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-12 h-px bg-gold" />
              <span className="text-gold font-bold text-xs uppercase tracking-[0.3em]">Simple. Steady. Purposeful.</span>
            </div>

            <h1 className="text-5xl sm:text-5xl md:text-7xl font-serif font-bold text-navy-900 leading-[1.1] mb-8">
              Simplify <br />
              the way you <br /> invest in <br /> <span className="italic text-gold underline decoration-gold/20 decoration-8 underline-offset-8">Mutual Funds</span>
              <br className="block sm:hidden" />
            </h1>

            <p id="issue-hero-guidance-copy" className="text-sm sm:text-base md:text-lg text-gray-500 mb-5 md:mb-8 max-w-xl leading-relaxed font-medium">
              Mutual fund investing becomes simpler through discipline, structure, and consistency. We facilitate access to SIPs and mutual fund investment options across different investing horizons and financial preferences.
            </p>

            <div className="mb-6 md:mb-8 flex justify-start">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-4 bg-gold hover:bg-gold-600 text-white font-bold rounded-full px-8 py-4 text-base md:text-lg tracking-tight transition-all duration-500 shadow-[0_8px_32px_-8px_rgba(197,160,89,0.55)] hover:shadow-[0_16px_40px_-8px_rgba(197,160,89,0.7)] hover:scale-[1.03] active:scale-95"
              >
                <span>Start Your Mutual Fund Journey</span>
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20 group-hover:bg-white/30 transition-all duration-300">
                  <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-3 w-full gap-1 mt-1">
              {[
                { icon: <ShieldCheck size={22} strokeWidth={1.4} />, title: 'AMFI Registered MFD', sub: 'NISM Certified & SEBI Compliant' },
                { icon: <Landmark size={22} strokeWidth={1.4} />, title: 'Mutual Fund Distribution', sub: 'Aligned to Your Financial Goals' },
                { icon: <HeadphonesIcon size={22} strokeWidth={1.4} />, title: 'Ongoing Support', sub: 'Available at Every Stage' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.15, ease: 'easeOut' }}
                  whileHover={{ y: -3, transition: { duration: 0.22 } }}
                  className="flex flex-col items-center text-center px-2 py-4 rounded-xl hover:bg-gold/5 border border-transparent hover:border-gold/15 transition-all duration-300 cursor-default"
                >
                  <div className="w-11 h-11 rounded-xl bg-gold/10 flex items-center justify-center mb-2.5 text-gold shadow-sm shrink-0">
                    {item.icon}
                  </div>
                  <p className="text-[13px] md:text-[14px] font-bold text-navy-900 mb-1 leading-tight">{item.title}</p>
                  <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-[0.1em] leading-relaxed">{item.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center lg:justify-end h-full w-full lg:pl-6 xl:pl-10">
            <div className="w-full max-w-[620px]">
              <HeroFloatingCards />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
