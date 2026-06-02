import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

const SpotlightCard = ({ children, className = "", spotlightColor = "rgba(201, 168, 76, 0.15)" }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.01 }}
      className={`relative group rounded-[32px] border border-white/10 transition-all duration-500 overflow-hidden ${className.includes('bg-') ? '' : 'bg-white/5 backdrop-blur-xl'} ${className.replace(/flex|grid|items-|justify-|gap-|md:flex|lg:flex|flex-|md:grid|lg:grid/g, '')}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${spotlightColor},
              transparent 80%
            )
          `,
        }}
      />
      
      {/* Animated Border Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              120px circle at ${mouseX}px ${mouseY}px,
              rgba(201, 168, 76, 0.4),
              transparent 100%
            )
          `,
        }}
      />

      <div className={`relative z-20 h-full w-full ${className.match(/flex|grid|items-|justify-|gap-|md:flex|lg:flex|flex-|md:grid|lg:grid/g)?.join(' ') || ''}`}>
        {children}
      </div>
    </motion.div>
  );
};

export default SpotlightCard;
