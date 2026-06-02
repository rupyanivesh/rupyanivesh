import { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Headset, PieChart, LayoutDashboard, ChevronDown } from 'lucide-react';

const highlights = [
  { title: 'Investment Options', desc: 'Access a range of mutual fund categories across different investment preferences.', icon: PieChart, accent: 'from-gold/8' },
  { title: 'Transparent Framework', desc: 'Designed to present information with clarity and consistency.', icon: ShieldCheck, accent: 'from-navy-900/5' },
  { title: 'Easy-to-Use Platform', desc: 'Simple interface designed for convenient access and tracking.', icon: LayoutDashboard, accent: 'from-gold/8' },
  { title: 'Customer Support', desc: 'Assistance available to address scheme-related queries.', icon: Headset, accent: 'from-navy-900/5' }
];


const HighlightCard = ({ item, i }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 350, damping: 35 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 350, damping: 35 });
  const shadowY = useTransform(mouseY, [-0.5, 0.5], [-12, 12]);

  const glowX = useTransform(mouseX, [-0.5, 0.5], [15, 85]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], [15, 85]);
  const glowBg = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(197,160,89,0.22), transparent 65%)`;
  const boxShadow = useMotionTemplate`0 ${shadowY}px 40px -12px rgba(197,160,89,0.25), 0 4px 24px rgba(0,0,0,0.06)`;

  const handleMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => { mouseX.set(0); mouseY.set(0); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.1 }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ perspective: 900 }}
      className="group h-full"
    >
      <motion.div
        style={{ rotateX, rotateY, boxShadow }}
        whileHover={{ y: -7 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className="bg-white rounded-3xl p-7 border border-gray-100 hover:border-gold/30 relative overflow-hidden cursor-default transition-colors duration-300 h-full"
      >
        {/* Mouse-tracking radial glow */}
        <motion.div className="absolute inset-0 pointer-events-none z-0" style={{ background: glowBg }} />

        {/* Hover gradient accent - very subtle gold wash */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl z-0" />

        {/* Diagonal corner gradient */}
        <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl ${item.accent} to-transparent pointer-events-none z-0`} />

        {/* Number badge */}
        <div className="absolute top-5 right-6 text-[10px] font-black text-gray-200 group-hover:text-gold/40 tracking-widest select-none transition-colors duration-300 z-10">
          0{i + 1}
        </div>

        <div className="relative z-10 flex items-start gap-3 sm:block">
          {/* Icon */}
          <div className="relative mb-0 sm:mb-6 w-fit shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#0b1a2b] flex items-center justify-center shadow-[0_6px_18px_rgba(11,19,43,0.35)] relative z-10 group-hover:scale-105 transition-transform duration-300">
              <item.icon size={18} className="text-gold sm:w-5 sm:h-5" />
            </div>
            <div className="absolute inset-0 bg-gold/20 rounded-2xl blur-xl scale-150 -z-10 group-hover:bg-gold/40 group-hover:scale-[1.7] transition-all duration-500" />
          </div>

          {/* Text - compact on mobile, original spacing from sm+ */}
          <div>
            <h4 className="font-serif font-bold text-navy-900 text-base sm:text-lg mb-1 sm:mb-2 leading-snug">{item.title}</h4>
            <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed">{item.desc}</p>
          </div>
        </div>

        {/* Bottom shimmer - brightens on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent group-hover:via-gold/65 transition-all duration-300" />
      </motion.div>
    </motion.div>
  );
};

const About = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="why-us" className="pt-10 pb-20 lg:pt-14 lg:pb-24 bg-[#FAF9F6] overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          <div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-navy-900 mb-8 leading-tight">
              <span className="text-gold italic">Why Us?</span> <br />
              We're Not a Bank. <br /> We're Not an App. <br />
              <span className="text-gold italic">We're Your Trust Partner.</span>
            </h2>

            <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
              <p>
                RupyaNivesh is built for today's investors who expect clarity, accessibility, and ease of use. As financial products and markets evolve, having the right tools and information becomes increasingly important.
              </p>

              {/* Mobile: collapsible content */}
              <AnimatePresence initial={false}>
                {(expanded) && (
                  <motion.div
                    key="more"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="lg:hidden overflow-hidden space-y-6"
                  >
                    <p>
                      We provide a digital platform that combines technology with user support to help investors access mutual fund investments and stay aligned with their financial goals. Our focus is on simplifying processes, improving transparency, and making investment information easier to understand.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Desktop: always visible */}
              <p className="hidden lg:block">
                We provide a digital platform that combines technology with user support to help investors access mutual fund investments and stay aligned with their financial goals. Our focus is on simplifying processes, improving transparency, and making investment information easier to understand.
              </p>

              {/* Read More toggle - mobile only */}
              <button
                onClick={() => setExpanded(e => !e)}
                className="lg:hidden flex items-center gap-2 text-gold font-bold text-sm uppercase tracking-widest"
              >
                {expanded ? 'Read Less' : 'Read More'}
                <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronDown size={16} />
                </motion.div>
              </button>

              <div className="hidden lg:block relative p-6 md:p-8 bg-navy-900 rounded-[24px] shadow-premium mt-8 overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-gold/20 transition-all duration-700" />
                <div className="absolute top-4 left-4 md:left-6 text-7xl text-white/5 font-serif leading-none -translate-y-2">"</div>
                <blockquote className="relative z-10 font-serif text-xl md:text-[30px] text-gold italic leading-relaxed pl-4 border-l-[3px] border-gold/30">
                  <span className="block text-gold/80 text-lg mb-2">As Benjamin Franklin said we believe ~</span>
                  <span className="block">"An investment in knowledge pays the best interest."</span>
                </blockquote>
              </div>
            </div>

          </div>

          {/* Right column - stats + cards + ARN badge */}
          <div className="flex flex-col gap-4 lg:gap-6">

            {/* Mission Statement Card */}
            <div className="hidden lg:block relative bg-navy-900 rounded-2xl px-7 py-5 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute top-3 left-5 text-6xl text-white/5 font-serif leading-none">"</div>
              <p className="relative z-10 font-serif italic text-white/90 text-lg leading-relaxed pl-3 border-l-2 border-gold/40">
                Built to make mutual fund distribution accessible and transparent for every Indian family.
              </p>
              <span className="relative z-10 block mt-3 text-[10px] font-black uppercase tracking-[0.25em] text-gold/70 pl-3">Our Founding Mission</span>
            </div>

            {/* 2x2 Card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-gold/5 rounded-full blur-[100px] -z-10" />
              {highlights.map((item, i) => (
                <HighlightCard key={i} item={item} i={i} />
              ))}
            </div>

            {/* ARN badge - moved from left column */}
            <div className="flex items-center gap-5 bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                <span className="font-serif font-bold text-navy-900 text-lg">RN</span>
              </div>
              <div>
                <h4 className="font-bold text-navy-900 text-sm">AMFI Registered Distributor</h4>
                <p className="text-xs text-gray-400 italic">ARN-361484 · Shubh Lakshmi Wealth</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

