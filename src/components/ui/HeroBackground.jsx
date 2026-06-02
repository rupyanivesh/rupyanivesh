import React from 'react';
import { MeshGradient } from '@paper-design/shaders-react';

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden bg-[#0A0C10]">
      {/* Mesh Gradient Layer */}
      <div className="absolute inset-0 w-full h-full opacity-40">
        <MeshGradient
          colors={["#0B0F1A", "#1E293B", "#00D09C", "#C9A84C", "#111827"]}
          speed={0.015}
        />
      </div>

      {/* Decorative Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(93,191,138,0.1),transparent_50%)]" />
      <div className="absolute inset-0 backdrop-blur-[100px]" />
      
      {/* Texture Layer */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
    </div>
  );
};

export default HeroBackground;
