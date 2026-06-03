import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ShieldCheck, PieChart, Coins, PiggyBank, CalendarClock, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SpotlightCard from './ui/SpotlightCard';
import HeroBackground from './ui/HeroBackground';

const categories = [
  {
    id: 'equity',
    title: 'Equity Mutual Funds',
    icon: TrendingUp,
    shortDesc: 'Primarily invest in equity and equity-related instruments for long-term capital appreciation.',
    details: {
      what: "Invest primarily in stocks and shares of listed companies. These funds seek to generate returns from capital appreciation and dividends.",
      why: "Equity funds have the potential to deliver higher returns over long investment horizons, though they come with higher market volatility.",
      who: "Suitable for investors with a long-term goal (5+ years) and the ability to tolerate market fluctuations."
    },
    tags: ['Growth', 'Market Linked'],
    riskLevel: 'High',
    glowColor: 'rgba(93, 191, 138, 0.3)' // Emerald
  },
  {
    id: 'debt',
    title: 'Debt & Bond Funds',
    icon: ShieldCheck,
    shortDesc: 'Invest in fixed-income securities like government bonds for relatively stable returns.',
    details: {
      what: "Invest in fixed-income securities like government bonds, corporate debentures, and treasury bills.",
      why: "The primary objective is to provide a steady stream of income and preserve capital with lower volatility.",
      who: "Ideal for conservative investors or those with a shorter investment timeline looking for stability."
    },
    tags: ['Income', 'Stable'],
    riskLevel: 'Low to Mod',
    glowColor: 'rgba(56, 189, 248, 0.3)' // Sky
  },
  {
    id: 'hybrid',
    title: 'Hybrid Funds',
    icon: PieChart,
    shortDesc: 'Balance your risk and return by allocating across both equity and debt instruments.',
    details: {
      what: "Maintains a portfolio consisting of both equity and debt securities in varying proportions.",
      why: "Aims to capture equity upside while utilizing debt to cushion against market downturns.",
      who: "Suitable for investors looking for diversification in a single product with moderate risk tolerance."
    },
    tags: ['Balanced', 'Diversified'],
    riskLevel: 'Moderate',
    glowColor: 'rgba(201, 168, 76, 0.3)' // Gold
  },
  {
    id: 'index',
    title: 'Passive Funds',
    icon: Coins,
    shortDesc: 'Passively track benchmark indices like Nifty 50 for cost-efficient market exposure.',
    details: {
      what: "Track specific market indices. They aim to replicate the index performance as closely as possible.",
      why: "Offer institutional-grade diversification at a much lower management cost.",
      who: "Investors who want simple, transparent market exposure without trying to outperform benchmarks."
    },
    tags: ['Passive', 'Low Cost'],
    riskLevel: 'Varies',
    glowColor: 'rgba(168, 85, 247, 0.3)' // Purple
  },
  {
    id: 'elss',
    title: 'Tax-Saving (ELSS)',
    icon: PiggyBank,
    shortDesc: 'Save taxes under Section 80C while participating in equity market growth.',
    details: {
      what: "Specialized equity funds designated for tax savings under Section 80C of the Income Tax Act.",
      why: "Provides potential for market-linked growth with a mandatory 3-year lock-in for discipline.",
      who: "Individual taxpayers looking to reduce taxable income while gaining equity exposure."
    },
    tags: ['Tax Save', 'Locked'],
    riskLevel: 'High',
    glowColor: 'rgba(236, 72, 153, 0.3)' // Pink
  },
];

const DetailPanel = ({ cat, onBack }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={cat.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="h-full"
    >
      <div className="bg-navy-800/30 backdrop-blur-3xl border border-white/10 rounded-2xl md:rounded-[40px] p-5 md:p-12 flex flex-col shadow-2xl relative overflow-hidden">
        <div
          className="absolute -top-24 -right-24 w-64 h-64 blur-[120px] opacity-20 transition-all duration-1000"
          style={{ background: cat.glowColor }}
        />
        <div className="relative z-10 flex flex-col h-full">
          {/* Mobile back button */}
          {onBack && (
            <button
              onClick={onBack}
              className="lg:hidden inline-flex items-center gap-2.5 text-gold text-sm font-black uppercase tracking-[0.18em] px-2.5 py-2 rounded-lg mb-5 self-start"
            >
              <ArrowLeft size={18} /> Back
            </button>
          )}

          <div className="flex items-start justify-between mb-8 lg:mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 ${
                  cat.riskLevel.includes('High') ? 'text-red-400 bg-red-400/5' :
                  cat.riskLevel.includes('Mod')  ? 'text-orange-400 bg-orange-400/5' :
                  'text-green-400 bg-green-400/5'
                }`}>
                  Risk: {cat.riskLevel}
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-black text-white leading-tight">
                {cat.title}
              </h2>
            </div>
            <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-3xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shadow-[0_0_50px_rgba(201,168,76,0.15)] shrink-0">
              <cat.icon size={28} className="lg:hidden" />
              <cat.icon size={44} className="hidden lg:block" />
            </div>
          </div>

          <div className="grid gap-4 lg:gap-6 flex-grow">
            {[
              { l: 'What Exactly Is It?',   v: cat.details.what, i: '01' },
              { l: 'Why Should You Invest?', v: cat.details.why,  i: '02' },
              { l: 'Target Audience',        v: cat.details.who,  i: '03' }
            ].map((item, idx) => (
              <motion.div
                key={item.l}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + idx * 0.08 }}
                className="bg-white/5 border border-white/5 rounded-2xl lg:rounded-3xl p-4 lg:p-6 hover:bg-white/[0.07] transition-all group/item"
              >
                <div className="flex gap-4 lg:gap-6">
                  <span className="text-xl lg:text-2xl font-serif font-black text-gold/20 group-hover/item:text-gold transition-colors shrink-0">{item.i}</span>
                  <div>
                    <h4 className="text-gold font-sans font-black uppercase tracking-[0.2em] text-[10px] mb-2 lg:mb-3">{item.l}</h4>
                    <p className="text-gray-300 font-sans leading-relaxed text-sm">{item.v}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 lg:mt-12 flex flex-col md:flex-row items-center justify-between gap-4 lg:gap-8 pt-5 lg:pt-8 border-t border-white/5">
            <p id="issue-learn-finance-risk-line" className="text-gray-500 text-[13px] font-sans italic max-w-sm">
              All mutual fund investments are subject to market risks. Read all scheme-related documents carefully.
            </p>
            <Link to="/learn-finance" className="btn-primary px-10 py-3.5 rounded-full flex items-center gap-3 font-bold group shadow-[0_15px_40px_rgba(201,168,76,0.3)] w-full md:w-auto justify-center whitespace-nowrap">
              Know More <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  </AnimatePresence>
);

const LearnFinance = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'detail'

  const handleSelect = (cat) => {
    setSelectedCategory(cat);
    setMobileView('detail');
    document.getElementById('learn-finance')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="learn-finance" className="relative pt-16 pb-16 lg:pt-20 lg:pb-20 overflow-hidden bg-navy-900 scroll-mt-24">
      <HeroBackground />

      <div className="container-custom relative z-10 px-6">

        {/* ── Mobile: page-switch between list and detail ── */}
        <div className="lg:hidden">
          <AnimatePresence mode="wait">
            {mobileView === 'list' ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="text-6xl lg:text-7xl font-serif font-bold text-white leading-tight">
                    Know about <br /><span className="text-gold italic text-7xl lg:text-8xl">Mutual Funds</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {categories.map((cat) => (
                    <div key={cat.id} onClick={() => handleSelect(cat)}>
                      <SpotlightCard
                        className={`p-4 cursor-pointer transition-all duration-300 border-white/5 ${
                          selectedCategory.id === cat.id
                            ? 'bg-navy-800/60 border-gold/30'
                            : 'bg-navy-800/10 opacity-70'
                        }`}
                        spotlightColor={cat.glowColor}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-13 h-13 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                            selectedCategory.id === cat.id ? 'bg-gold text-navy-900' : 'bg-white/5 text-gold'
                          }`}>
                            <cat.icon size={24} />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h3 className={`text-lg font-serif font-bold transition-colors ${
                              selectedCategory.id === cat.id ? 'text-gold' : 'text-white'
                            }`}>{cat.title}</h3>
                            <div className="flex items-center gap-1.5 mt-1">
                              {cat.tags.map((tag, i) => (
                                <React.Fragment key={tag}>
                                  {i > 0 && <span className="text-gold/60 text-[10px]">·</span>}
                                  <span className="text-[10px] font-black uppercase tracking-widest text-white/65">{tag}</span>
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                          <ArrowRight size={18} className="text-gold/50 shrink-0" />
                        </div>
                      </SpotlightCard>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3 }}
              >
                <DetailPanel cat={selectedCategory} onBack={() => {
                  setMobileView('list');
                  document.getElementById('learn-finance')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Desktop: side-by-side layout (unchanged) ── */}
        <div className="hidden lg:flex flex-row gap-20 items-stretch">
          <div className="w-2/5 flex flex-col gap-6">
            <div className="mb-8">
              <h2 className="text-5xl font-serif font-bold text-white leading-tight">
                Know about <br /><span className="text-gold italic">Mutual Funds</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <SpotlightCard
                    className={`p-5 cursor-pointer transition-all duration-300 border-white/5 ${
                      selectedCategory.id === cat.id
                        ? 'bg-navy-800/60 border-gold/30 shadow-[0_0_30px_rgba(201,168,76,0.1)]'
                        : 'bg-navy-800/10 hover:bg-navy-800/30 opacity-60 hover:opacity-100'
                    }`}
                    spotlightColor={cat.glowColor}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        selectedCategory.id === cat.id ? 'bg-gold text-navy-900 scale-110' : 'bg-white/5 text-gold'
                      }`}>
                        <cat.icon size={22} />
                      </div>
                      <div className="flex-grow">
                        <h3 className={`text-lg font-serif font-bold transition-colors ${
                          selectedCategory.id === cat.id ? 'text-gold' : 'text-white'
                        }`}>{cat.title}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          {cat.tags.slice(0, 2).map((tag, i) => (
                            <React.Fragment key={tag}>
                              {i > 0 && <span className="text-gold/60 text-[10px]">·</span>}
                              <span className="text-[10px] font-black uppercase tracking-widest text-white/65">{tag}</span>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      {selectedCategory.id === cat.id && (
                        <motion.div layoutId="arrow" className="text-gold">
                          <ArrowRight size={18} />
                        </motion.div>
                      )}
                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="w-3/5 flex flex-col">
            <DetailPanel cat={selectedCategory} onBack={null} />
          </div>
        </div>

      </div>
    </section>
  );
};

export default LearnFinance;
