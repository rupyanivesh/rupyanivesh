import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform, wrap } from 'framer-motion';

// shape: 'circle' = logo art already sits on a round badge -> render as circle
//        'square' = logo art fills a square/rect background -> render as rounded square
//        'plain'  = logo art has a transparent/white background -> render enlarged with no badge
const amcs = [
  { name: 'Edelweiss Mutual Fund',      short: 'Edelweiss',      file: 'edelweiss_groww.webp', color: 'text-[#0F4C9C]', shape: 'square' },
  { name: 'SBI Mutual Fund',   short: 'SBI',            file: 'sbi_groww.webp',    color: 'text-[#0067B1]', shape: 'square' },
  { name: 'Helios Mutual Fund',         short: 'Helios',         file: 'helios_groww.webp',    color: 'text-[#E9772B]', shape: 'plain', sizeClass: 'w-36 h-24', textGapClass: '-ml-8' },
  { name: 'Motilal Oswal Mutual Fund',  short: 'Motilal Oswal',  file: 'motilal_groww.webp',   color: 'text-[#2E1A8C]', shape: 'square' },
  { name: 'ICICI Prudential',  short: 'ICICI',          file: 'icici_groww.webp',  color: 'text-[#A32638]', shape: 'plain' },
  { name: 'WhiteOak Capital Mutual Fund', short: 'WhiteOak Capital', file: 'whiteoak_groww.webp', color: 'text-[#14315C]', shape: 'square' },
  { name: 'Bandhan Mutual Fund',        short: 'Bandhan',        file: 'bandhan_groww.webp',   color: 'text-[#E13A2E]', shape: 'circle' },
  { name: 'Kotak Mahindra',    short: 'Kotak',          file: 'kotak_groww.webp',  color: 'text-[#003B7E]', shape: 'square' },
  { name: 'PPFAS Mutual Fund',          short: 'PPFAS',          file: 'ppfas_groww.webp',     color: 'text-[#1E8C4B]', shape: 'plain' },
  { name: 'HDFC Mutual Fund',  short: 'HDFC',           file: 'hdfc_groww.webp',   color: 'text-[#ED232A]', shape: 'square' },
  { name: 'Tata Mutual Fund',           short: 'Tata',           file: 'tata_groww.webp',      color: 'text-[#1E4FA3]', shape: 'plain' },
  { name: 'Axis Mutual Fund',  short: 'Axis',           file: 'axis_groww.webp',   color: 'text-[#97144D]', shape: 'square' },
  { name: 'Invesco Mutual Fund',        short: 'Invesco',        file: 'invesco_groww.webp',   color: 'text-[#0027B4]', shape: 'circle' },
  { name: 'Canara Robeco Mutual Fund',  short: 'Canara Robeco',  file: 'canara_groww.webp',    color: 'text-[#00A0B0]', shape: 'square' },
  { name: 'Franklin Templeton Mutual Fund', short: 'Franklin Templeton', file: 'franklin_groww.webp', color: 'text-[#1A1A1A]', shape: 'plain' },
  { name: 'Aditya Birla Sun Life', short: 'Aditya Birla', file: 'aditya_groww.webp', color: 'text-[#B0242E]', shape: 'square' },
  { name: 'Nippon India',      short: 'Nippon India',   file: 'nippon_groww.png',  color: 'text-[#E2231A]', shape: 'plain' },
  { name: 'DSP Mutual Fund',            short: 'DSP',            file: 'dsp_groww.webp',       color: 'text-[#0B2E58]', shape: 'square' },
  { name: 'Mirae Asset Mutual Fund',    short: 'Mirae Asset',    file: 'mirae_groww.webp',     color: 'text-[#E8720C]', shape: 'square' },
  { name: 'Quant Mutual Fund',          short: 'Quant',          file: 'quant_groww.webp',     color: 'text-[#1A1A1A]', shape: 'circle', fit: 'contain' },
  { name: 'UTI Mutual Fund',   short: 'UTI',            file: 'uti_groww.webp',    color: 'text-[#E67817]', shape: 'square' },
  { name: 'Abakkus Mutual Fund',        short: 'Abakkus',        file: 'abakkus_groww.webp',   color: 'text-[#E8871E]', shape: 'circle' },
  { name: 'HSBC Mutual Fund',           short: 'HSBC',           file: 'hsbc_groww.webp',      color: 'text-[#DB0011]', shape: 'plain' },
];

const AMCLogos = () => {
  const [isPaused, setIsPaused] = useState(false);
  // Using 6 sets for a massive safety buffer during extreme dragging
  const scrollList = [...amcs, ...amcs, ...amcs, ...amcs, ...amcs, ...amcs, ...amcs, ...amcs];
  const x = useMotionValue(0);
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  const speed = -0.4; // Slightly slower for even more premium feel

  // Reset x to a random offset within the middle set on mount, so each page load starts the strip at a different AMC
  const startFraction = useRef(Math.random());
  useEffect(() => {
    const updatePosition = () => {
      if (contentRef.current && contentRef.current.scrollWidth > 0) {
        const singleSetWidth = contentRef.current.scrollWidth / 8;
        x.set(-singleSetWidth * 3 - singleSetWidth * startFraction.current);
      }
    };

    // Check immediately and on a small delay to handle image loads
    updatePosition();
    const timer = setTimeout(updatePosition, 500);
    return () => clearTimeout(timer);
  }, []);

  useAnimationFrame((t, delta) => {
    if (!isPaused && contentRef.current) {
      const totalWidth = contentRef.current.scrollWidth;
      const singleSetWidth = totalWidth / 8;

      if (singleSetWidth <= 0) return;

      let currentX = x.get();
      currentX += speed * (delta / 16);

      const wrappedX = wrap(-(singleSetWidth * 5), -(singleSetWidth * 3), currentX);
      x.set(wrappedX);
    }
  });

  const handleDrag = (event, info) => {
    if (contentRef.current) {
      const singleSetWidth = contentRef.current.scrollWidth / 8;
      if (singleSetWidth <= 0) return;

      const currentX = x.get();
      x.set(wrap(-(singleSetWidth * 5), -(singleSetWidth * 3), currentX));
    }
  };

  return (
    <section className="py-6 bg-[#FAF9F6] overflow-hidden relative">
      <div className="container-custom mb-4 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-gray-600 font-black">
          Explore Funds Across Trusted AMC<span className="normal-case">s</span>
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative flex overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div
          ref={contentRef}
          className="flex gap-16 max-sm:gap-8 items-center whitespace-nowrap py-4"
          style={{ x }}
          drag="x"
          dragMomentum={false}
          onDrag={handleDrag}
          onDragStart={() => setIsPaused(true)}
          onDragEnd={() => setIsPaused(false)}
        >
          {scrollList.map((amc, i) => {
            const isPlain = amc.shape === 'plain';
            const isContainFit = isPlain || amc.fit === 'contain';
            const badgeShapeClass = amc.shape === 'circle' ? 'rounded-full' : 'rounded-xl';
            return (
              <div
                key={`${amc.name}-${i}`}
                className="flex items-center gap-4 max-sm:gap-2 group transition-all duration-500"
              >
                <div
                  className={
                    isPlain
                      ? `${amc.sizeClass || 'w-20 h-16'} max-sm:w-14 max-sm:h-11 shrink-0 flex items-center justify-center`
                      : `w-16 h-16 max-sm:w-11 max-sm:h-11 shrink-0 flex items-center justify-center ${badgeShapeClass} overflow-hidden ring-1 ring-gray-200 ${amc.fit === 'contain' ? 'bg-white p-2' : ''}`
                  }
                >
                  <img
                    src={`${import.meta.env.BASE_URL}logos/${amc.file}`}
                    alt={amc.name}
                    className={`w-full h-full ${isContainFit ? 'object-contain' : 'object-cover'} pointer-events-none select-none`}
                    loading="lazy"
                  />
                </div>
                <div className={`flex flex-col select-none ${amc.textGapClass || ''}`}>
                  <span className={`font-serif font-black tracking-tighter text-2xl max-sm:text-base leading-none transition-colors ${amc.color || 'text-navy-900'}`}>
                    {amc.short}
                  </span>
                  <span className="text-[10px] max-sm:text-[8px] font-bold uppercase tracking-widest text-gray-300">Mutual Fund</span>
                </div>
              </div>
            );
          })}
        </motion.div>

        <div className="absolute inset-y-0 left-0 w-48 max-sm:w-10 bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6]/40 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-48 max-sm:w-10 bg-gradient-to-l from-[#FAF9F6] via-[#FAF9F6]/40 to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
};

export default AMCLogos;
