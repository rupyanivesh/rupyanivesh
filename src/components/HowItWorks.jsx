import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  UserPlus,
  Target,
  Search,
  Zap,
  Headset,
  RefreshCcw
} from 'lucide-react';

const steps = [
  {
    title: 'Easy Onboarding',
    desc: 'Smooth account opening, we assist in completing your KYC seamlessly through authorised platforms.',
    pos: 'top',
    icon: UserPlus
  },
  {
    title: 'Understanding Your Needs',
    desc: 'We collect your investment goals, time horizon, and preferences to facilitate transactions.',
    pos: 'bottom',
    icon: Target
  },
  {
    title: 'Explore Options',
    desc: 'We provide information about mutual fund schemes and categories to help you make informed decisions.',
    pos: 'top',
    icon: Search
  },
  {
    title: 'Hassle-Free Transactions',
    desc: 'We facilitate your investments in mutual fund schemes based on your instructions.',
    pos: 'bottom',
    icon: Zap
  },
  {
    title: 'Ongoing Support',
    desc: 'We assist with account services, transaction support, and access to investment details.',
    pos: 'top',
    icon: Headset
  },
  {
    title: 'Stay Informed',
    desc: 'We share portfolio updates and general information to help you stay aware of your investments.',
    pos: 'bottom',
    icon: RefreshCcw
  }
];

const TiltCard = ({ children, className }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 20 });
  const glareX = useTransform(x, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(y, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
      className={className}
    >
      {children}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: useTransform(
            [glareX, glareY],
            ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.12) 0%, transparent 60%)`
          ),
        }}
      />
    </motion.div>
  );
};

const HowItWorks = () => {
  const [hoveredStep, setHoveredStep] = useState(null);

  return (
    <section id="how-it-works" className="py-14 lg:py-24 bg-[#FAF9F6] overflow-hidden">
      <div className="container-custom">
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center gap-2 mb-4 lg:mb-6">
            <span className="w-12 h-px bg-gold" />
            <span className="text-gold font-bold text-xs uppercase tracking-[0.3em]">The Process</span>
            <span className="w-12 h-px bg-gold" />
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-serif font-bold text-navy-900 leading-tight">
            Your Investment <br /> <span className="text-gold italic">Journey With Us</span>
          </h2>
        </div>

        <div className="relative max-w-6xl mx-auto py-4">
          {/* SVG Wave Path (Desktop Only) */}
          <div className="hidden lg:block absolute inset-0 py-12 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
              {/* Base Path */}
              <motion.path
                d="M 50 150 C 150 30, 250 30, 350 150 C 450 270, 550 270, 650 150 C 750 30, 850 30, 900 90"
                fill="none"
                stroke="#C5A059"
                strokeWidth="2"
                strokeDasharray="8 8"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.3 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              {/* Highlight Path overlay (Solid Darker Gold) */}
              <motion.path
                d="M 50 150 C 150 30, 250 30, 350 150 C 450 270, 550 270, 650 150 C 750 30, 850 30, 900 90"
                fill="none"
                stroke="#C5A059"
                strokeWidth="4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: hoveredStep !== null ? (hoveredStep + 1) / steps.length : 0,
                  opacity: hoveredStep !== null ? 1 : 0
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </svg>
          </div>

          {/* Desktop grid (lg+) */}
          <div className="hidden lg:grid lg:grid-cols-6 gap-6 relative z-10">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`flex flex-col items-center text-center group cursor-pointer ${step.pos === 'bottom' ? 'lg:mt-32' : 'lg:mb-32'}`}
                onMouseEnter={() => setHoveredStep(i)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 + 0.1 }}
                  className="text-3xl lg:text-5xl font-serif font-black text-gold/30 transition-all duration-500 group-hover:text-gold group-hover:-translate-y-2 mb-3 lg:mb-4"
                >
                  0{i + 1}
                </motion.div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, type: "spring", damping: 12 }}
                  whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0], transition: { duration: 0.4 } }}
                  className="w-14 h-14 rounded-full bg-navy-900 border-4 border-white shadow-xl flex items-center justify-center text-gold mb-6 relative z-10 group-hover:border-gold/30 group-hover:shadow-[0_0_25px_rgba(197,160,89,0.4)] cursor-pointer"
                >
                  <step.icon size={22} />
                </motion.div>
                <TiltCard className="p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white transition-all duration-500 group-hover:bg-white group-hover:border-gold/40 group-hover:shadow-2xl group-hover:shadow-gold/10 relative overflow-hidden cursor-pointer">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 + 0.3 }}
                  >
                    <h3 className="text-lg font-serif font-bold text-navy-900 mb-2 transition-colors duration-500 group-hover:text-gold">{step.title}</h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-medium">{step.desc}</p>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-gold/50 via-gold to-gold/50 transition-all duration-500 group-hover:w-2/3 rounded-t-full" />
                  </motion.div>
                </TiltCard>
              </div>
            ))}
          </div>

          {/* Mobile: 3x2 equal grid with click effects */}
          <div className="lg:hidden">
            <div className="grid grid-cols-3 gap-3">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  onClick={() => setHoveredStep(hoveredStep === i ? null : i)}
                  whileTap={{ scale: 0.95 }}
                  animate={hoveredStep === i
                    ? { y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }
                    : { y: 0 }
                  }
                  className={`relative flex flex-col items-center text-center p-3 rounded-2xl border cursor-pointer transition-all duration-300 ${
                    hoveredStep === i
                      ? 'bg-navy-900 border-gold/40 shadow-[0_8px_24px_rgba(197,160,89,0.25)]'
                      : 'bg-white border-gray-100 shadow-sm'
                  }`}
                >
                  {/* Number badge */}
                  <div className={`text-xs font-serif font-black mb-2 transition-colors duration-300 ${
                    hoveredStep === i ? 'text-gold/60' : 'text-gold/30'
                  }`}>
                    0{i + 1}
                  </div>

                  {/* Icon circle */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    hoveredStep === i
                      ? 'bg-gold text-navy-900 shadow-[0_0_16px_rgba(197,160,89,0.5)]'
                      : 'bg-navy-900 text-gold'
                  }`}>
                    <step.icon size={16} />
                  </div>

                  {/* Title */}
                  <h3 className={`text-[10px] font-serif font-bold leading-tight mb-1 transition-colors duration-300 ${
                    hoveredStep === i ? 'text-white' : 'text-navy-900'
                  }`}>
                    {step.title}
                  </h3>

                  {/* Desc - only visible when active */}
                  <motion.p
                    animate={hoveredStep === i ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`text-[9px] leading-relaxed overflow-hidden ${
                      hoveredStep === i ? 'text-gray-400' : ''
                    }`}
                  >
                    {step.desc}
                  </motion.p>

                  {/* Active gold bottom bar */}
                  {hoveredStep === i && (
                    <motion.div
                      layoutId="mobileStepBar"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gold rounded-full"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

