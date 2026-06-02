import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform, wrap } from 'framer-motion';

const amcs = [
  { name: 'SBI Mutual Fund',   file: 'sbi_groww.webp',    color: 'text-[#2459A8]' },
  { name: 'HDFC Mutual Fund',  file: 'hdfc_groww.webp',   color: 'text-[#004C91]' },
  { name: 'ICICI Prudential',  file: 'icici_groww.webp',  color: 'text-[#E31E24]' },
  { name: 'Nippon India',      file: 'nippon_groww.png',  color: 'text-[#D3222A]' },
  { name: 'Kotak Mahindra',    file: 'kotak_groww.webp',  color: 'text-[#EE1C25]' },
  { name: 'Axis Mutual Fund',  file: 'axis_groww.webp',   color: 'text-[#82193F]' },
  { name: 'Aditya Birla',      file: 'aditya_groww.webp', color: 'text-[#CD2027]' },
  { name: 'UTI Mutual Fund',   file: 'uti_groww.webp',    color: 'text-[#0069B3]' },
];

const AMCLogos = () => {
  const [isPaused, setIsPaused] = useState(false);
  // Using 6 sets for a massive safety buffer during extreme dragging
  const scrollList = [...amcs, ...amcs, ...amcs, ...amcs, ...amcs, ...amcs, ...amcs, ...amcs];
  const x = useMotionValue(0);
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  const speed = -0.4; // Slightly slower for even more premium feel

  // Reset x to center on mount when content is available
  useEffect(() => {
    const updatePosition = () => {
      if (contentRef.current && contentRef.current.scrollWidth > 0) {
        const singleSetWidth = contentRef.current.scrollWidth / 8;
        x.set(-singleSetWidth * 3);
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
        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600 font-black">
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
          className="flex gap-8 items-center whitespace-nowrap py-4"
          style={{ x }}
          drag="x"
          dragMomentum={false}
          onDrag={handleDrag}
          onDragStart={() => setIsPaused(true)}
          onDragEnd={() => setIsPaused(false)}
        >
          {scrollList.map((amc, i) => (
            <div
              key={`${amc.name}-${i}`}
              className="flex items-center gap-4 group transition-all duration-500"
            >
              <div className="w-16 h-14 flex items-center justify-center">
                <img
                  src={`/logos/${amc.file}`}
                  alt={amc.name}
                  className="max-w-full max-h-full object-contain pointer-events-none select-none"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col select-none">
                <span className={`font-serif font-black tracking-tighter text-xl leading-none transition-colors ${amc.color || 'text-navy-900'}`}>
                  {amc.name.split(' ')[0]}
                </span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-gray-300">Mutual Fund</span>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6]/40 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-[#FAF9F6] via-[#FAF9F6]/40 to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
};

export default AMCLogos;
