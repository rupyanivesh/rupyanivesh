import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ShieldCheck, TrendingUp, Landmark, Calculator, Globe, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SpotlightCard from './ui/SpotlightCard';

const data = [
  {
    id: 0,
    tag: 'Retirement Goals',
    title: 'Retirement is not just about stepping away from work.',
    body: "It's about having the freedom to choose how you spend your time, whether that means pursuing interests, travelling, supporting family, or simply enjoying a slower pace of life. Explore mutual fund options relevant to long-term goals like retirement, across varying time horizons and risk considerations.",
    t1: 'Life after work',
    l1: 'Focused on long-term financial preparedness.',
    t2: 'Time-led approach',
    l2: 'Aligned with extended investment horizons.',
    btn: 'Contact Us',
    icon: Home,
    desc: 'Options aligned with long-term financial goals'
  },
  {
    id: 1,
    tag: 'Child Education Goal',
    title: 'Every ambition begins with the right foundation.',
    body: "Planning for education means preparing for evolving aspirations, whether it's early learning, higher studies, or opportunities ahead. Explore mutual fund options suited for long-term goals such as education, across different investment horizons and risk considerations.",
    t1: 'Future milestones',
    l1: 'Planning for evolving education needs.',
    t2: 'Step by step',
    l2: 'Aligned with different time horizons.',
    btn: 'Contact Us',
    icon: ShieldCheck,
    desc: 'Options aligned with long-term financial goals'
  },
  {
    id: 2,
    tag: 'Long-Term Wealth Creation',
    title: 'Wealth creation over the long term often reflects consistency and time in the market.',
    body: 'It involves participating across different market phases while keeping broader financial goals in perspective. Explore mutual fund options across asset classes, suited for long-term investment horizons and varying risk considerations.',
    t1: 'Built over time',
    l1: 'Focused on long-term participation.',
    t2: 'Across market phases',
    l2: 'Aligned with varying risk considerations.',
    btn: 'Contact Us',
    icon: Globe,
    desc: 'Options aligned with extended investment horizons'
  },
  {
    id: 3,
    tag: 'Wealth Preservation',
    title: 'Financial journeys are not only about building wealth, but also about sustaining it over time.',
    body: 'Preservation often means managing uncertainty while maintaining a steady financial foundation. Explore a range of mutual fund options across asset classes, based on time horizon and risk considerations.',
    t1: 'Maintain stability',
    l1: 'Focused on financial continuity.',
    t2: 'Balanced approach',
    l2: 'Aligned with evolving priorities.',
    btn: 'Contact Us',
    icon: Landmark,
    desc: 'Structured for stability and long-term balance'
  },
  {
    id: 4,
    tag: 'Tax Saving (ELSS)',
    title: 'Tax planning can be an important part of overall financial decisions.',
    body: 'ELSS (Equity Linked Savings Schemes) are mutual fund options that come with a statutory lock-in period and are often considered for long-term investing along with tax considerations. Explore ELSS mutual fund options based on investment horizon, risk considerations, and applicable tax provisions.',
    t1: 'Tax-aware investing',
    l1: 'As per applicable tax provisions.',
    t2: 'With a lock-in horizon',
    l2: 'Encouraging a longer-term approach.',
    btn: 'Contact Us',
    icon: Calculator,
    desc: 'Options aligned with tax-efficient investing under Section 80C'
  },
  {
    id: 5,
    tag: 'Emergency Funds',
    title: 'Unexpected situations can arise without notice.',
    body: 'Having access to funds for immediate needs can help manage such moments without disrupting long-term financial plans. Explore mutual fund options commonly considered for short-term requirements, across different risk considerations and liquidity needs.',
    t1: 'Ready when needed',
    l1: 'Focused on liquidity and access.',
    t2: 'Short-term focus',
    l2: 'Aligned with immediate financial needs.',
    btn: 'Contact Us',
    icon: TrendingUp,
    desc: 'Options aligned with short-term financial readiness'
  }
];

const Services = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="services" className="bg-[#FAF9F6] pt-14 pb-8 lg:py-24 overflow-hidden">
      <div className="container-custom">
        {/* Header Section */}
        <div className="mb-12 lg:mb-16">


          <div className="grid lg:grid-cols-2 gap-8 items-end">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl lg:text-7xl font-serif font-bold text-navy-900 leading-[1.1]"
            >
              Every <span className="text-gold italic">Goal</span> Begins <br />
              with a <span className="text-gold italic">Direction</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 text-sm lg:text-base max-w-lg leading-relaxed mb-1"
            >
              Explore a range of mutual fund options suited for financial goals across different life stages, from foundational needs to future plans.
            </motion.p>
          </div>
        </div>

        {/* Selection Cards Grid  -  desktop only */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
          }}
          className="hidden lg:grid grid-cols-6 gap-4 mb-6"
        >
          {data.map((item, idx) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 15, stiffness: 100 } }
              }}
              onClick={() => setActive(idx)}
              className={`relative bg-white border rounded-2xl p-6 cursor-pointer transition-all duration-300 overflow-hidden
                ${active === idx ? 'border-gold shadow-lg ring-1 ring-gold/20' : 'border-gold/15 hover:border-gold/50'}`}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors
                ${active === idx ? 'bg-gold text-white' : 'bg-[#F8F5EF] text-gold'}`}>
                <item.icon size={20} />
              </div>
              <h3 className="text-navy-900 font-bold text-sm mb-1 leading-tight line-clamp-2">{item.tag}</h3>
              <p className="text-gray-400 text-[11px] leading-snug">{item.desc}</p>
              <div className={`absolute bottom-0 left-0 right-0 h-1 transition-transform duration-500 origin-left bg-gold
                ${active === idx ? 'scale-x-100' : 'scale-x-0'}`} />
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <SpotlightCard
              className="bg-navy-900 rounded-[28px] md:rounded-[32px] p-6 md:p-10 lg:p-14 flex flex-col lg:flex-row gap-5 lg:gap-16 items-start lg:items-center shadow-2xl relative overflow-hidden group/stage border-white/5 min-h-[420px] lg:min-h-0"
              spotlightColor="rgba(201, 168, 76, 0.05)"
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none opacity-40" />

              {/* Left content  -  full width on mobile */}
              <div className="w-full lg:flex-[1.5] lg:min-w-0 z-20">
                <span className="inline-block text-[10px] font-bold tracking-[0.2em] text-gold uppercase bg-gold/10 border border-gold/20 rounded-full px-3 py-1.5 mb-4 lg:mb-6">
                  {data[active].tag}
                </span>
                <h4 className="text-white font-serif text-xl lg:text-[36px] font-black mb-3 lg:mb-6 leading-[1.2] min-h-[60px] lg:min-h-0 max-w-2xl">
                  {data[active].title}
                </h4>
                <p className="text-gray-400 text-sm lg:text-[17px] leading-relaxed mb-5 lg:mb-8 max-w-xl font-medium">
                  {data[active].body}
                </p>

                {/* Feature badges  -  mobile only */}
                <div className="flex lg:hidden gap-2 mb-4">
                  <div className="flex-1 bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="text-xs font-black text-white mb-0.5 leading-snug">{data[active].t1}</div>
                    <div className="text-[9px] text-gray-500 uppercase tracking-wider">{data[active].l1}</div>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="text-xs font-black text-white mb-0.5 leading-snug">{data[active].t2}</div>
                    <div className="text-[9px] text-gray-500 uppercase tracking-wider">{data[active].l2}</div>
                  </div>
                </div>
                <Link to="/contact" className="lg:hidden inline-flex items-center justify-center gap-3 bg-gold text-navy-900 font-black text-xs px-5 py-3 rounded-xl hover:bg-gold/90 transition-all shadow-xl shadow-gold/10 group/btn uppercase tracking-wider w-full">
                  {data[active].btn}
                  <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Feature cards + button  -  desktop only */}
              <div className="hidden lg:flex flex-col gap-4 shrink-0 z-20 min-w-[280px] self-stretch">
                <SpotlightCard
                  className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-7 hover:bg-white/10 transition-all cursor-default"
                  spotlightColor="rgba(93, 191, 138, 0.15)"
                >
                  <div className="text-xl font-black text-white mb-1.5 leading-tight">{data[active].t1}</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{data[active].l1}</div>
                </SpotlightCard>
                <SpotlightCard
                  className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-7 hover:bg-white/10 transition-all cursor-default"
                  spotlightColor="rgba(56, 189, 248, 0.15)"
                >
                  <div className="text-xl font-black text-white mb-1.5 leading-tight">{data[active].t2}</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{data[active].l2}</div>
                </SpotlightCard>
                <Link to="/contact" className="mt-auto inline-flex items-center justify-center gap-3 bg-gold text-navy-900 font-black text-xs px-5 py-3 rounded-xl hover:bg-gold/90 transition-all shadow-xl shadow-gold/10 group/btn uppercase tracking-wider">
                  {data[active].btn}
                  <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </SpotlightCard>
          </motion.div>
        </AnimatePresence>

        {/* Mobile carousel controls */}
        <div className="flex lg:hidden items-center justify-center gap-6 mt-6">
          <button
            onClick={() => setActive((prev) => (prev - 1 + data.length) % data.length)}
            className="w-12 h-12 rounded-full border border-navy-900/20 flex items-center justify-center text-navy-900 hover:bg-navy-900 hover:text-white transition-all duration-300"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {data.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded-full transition-all duration-300 ${active === i ? 'w-6 h-2 bg-gold' : 'w-2 h-2 bg-gray-300'
                  }`}
              />
            ))}
          </div>

          <button
            onClick={() => setActive((prev) => (prev + 1) % data.length)}
            className="w-12 h-12 rounded-full border border-navy-900/20 flex items-center justify-center text-navy-900 hover:bg-navy-900 hover:text-white transition-all duration-300"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
