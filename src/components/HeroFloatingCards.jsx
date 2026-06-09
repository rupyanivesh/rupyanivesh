import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/* ── constants ── */
const CW = 268;   // card width  — both columns identical
const CH = 300;   // card height — reduced to eliminate empty space
const GAP = 32;   // horizontal gap between left col and right col
const ROW_GAP = 28; // vertical gap between row1 and row2

const POS = {
  c01: { top: 24,                left: 0,        rotate: '-4.5deg', z: 10 },
  c02: { top: 44,                left: CW + GAP, rotate: '4.5deg',  z: 20 },
  c03: { top: CH + ROW_GAP + 24, left: 0,        rotate: '-3.5deg', z: 15 },
  c04: { top: CH + ROW_GAP + 44, left: CW + GAP, rotate: '3.5deg',  z: 12 },
};
const TOTAL_H = CH + ROW_GAP + CH + 44 + 20;

/* ── shared styles ── */
const tag  = c => ({ fontSize: 8.5, letterSpacing: '0.17em', textTransform: 'uppercase', fontWeight: 700, color: c });
const nbadge = (c,bg,b) => ({
  fontSize: 8, fontWeight: 800, color: c, background: bg,
  border: `1px solid ${b}`, borderRadius: 20, padding: '2px 8px', letterSpacing: '0.05em',
});
const h1line  = c => ({ fontFamily:'Georgia,serif', fontWeight:700, fontSize:22, color:c, lineHeight:1.2 });
const h1lineM = c => ({ fontFamily:'Georgia,serif', fontWeight:700, fontSize:15, color:c, lineHeight:1.2 });
const bodyTxt = mobile => ({
  fontSize: mobile ? 10 : 12, color: 'rgba(255,255,255,0.42)',
  lineHeight: 1.6, overflow: 'hidden',
});
const discTxt = { fontSize: 8, color: 'rgba(255,255,255,0.22)', lineHeight: 1.5 };
const div = c => ({ height: 1, background: c, margin: '8px 0' });

const cardBase = (bg, border, shadow) => ({
  width: CW, height: CH, borderRadius: 24, overflow: 'hidden',
  padding: '18px 20px', boxSizing: 'border-box',
  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
  background: bg, border: `1px solid ${border}`, boxShadow: shadow,
});
const cardMobile = (bg, border) => ({
  borderRadius: 18, overflow: 'hidden',
  padding: '14px 16px', boxSizing: 'border-box',
  display: 'flex', flexDirection: 'column',
  background: bg, border: `1px solid ${border}`,
  boxShadow: '0 10px 28px rgba(0,0,0,0.4)',
});

/*
  Colour logic — all from the site palette (navy + gold + offwhite):

  Card 01  Deep navy #0B132B → #1C2541   accent: Gold #C5A059       (flagship brand colours)
  Card 02  Gold-tinted dark  #1A1206     accent: Warm offwhite text  (gold as BG, navy as contrast)
  Card 03  Mid navy #1C2541 → #0B132B    accent: Gold muted #D4AF37  (same navy, lighter gold)
  Card 04  Offwhite #FAF9F6 → #EEE8DC   accent: Navy #0B132B        (inverted — light card = visual pop)
*/

/* Card 01 — Dark navy, cyan accent */
const C01_BG = 'linear-gradient(145deg,#0B1929 0%,#0f2540 100%)';
const Card01 = ({ mobile }) => (
  <div style={mobile ? cardMobile(C01_BG,'rgba(56,189,248,0.18)') : cardBase(C01_BG,'rgba(56,189,248,0.18)','0 24px 56px rgba(0,0,0,0.5)')}>
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8, flexShrink:0 }}>
      <span style={tag('rgba(56,189,248,0.65)')}>Investing Made Simple</span>
      <span style={nbadge('rgba(56,189,248,0.6)','rgba(56,189,248,0.08)','rgba(56,189,248,0.18)')}>01</span>
    </div>
    <div style={{ marginBottom:8, flexShrink:0 }}>
      <div style={mobile ? h1lineM('#fff') : h1line('#fff')}>Invest from</div>
      <div style={mobile ? {...h1lineM('#38BDF8'),fontStyle:'italic'} : {...h1line('#38BDF8'),fontStyle:'italic'}}>Wherever You Are</div>
    </div>
    <p style={bodyTxt(mobile)}>
      Mutual fund investing can be largely managed digitally, from KYC completion to investment transactions, making it more accessible than ever before.
    </p>
    <div style={div('rgba(56,189,248,0.1)')} />
    <p style={discTxt}>KYC mandatory as per SEBI regulations. Process may vary by MFD.</p>
  </div>
);

/* Card 02 — Off-white light card, navy text (inverted contrast) */
const C02_BG = 'linear-gradient(145deg,#F5F0E8 0%,#EBE3D4 100%)';
const Card02 = ({ mobile }) => (
  <div style={mobile ? cardMobile(C02_BG,'rgba(11,19,43,0.1)') : cardBase(C02_BG,'rgba(11,19,43,0.1)','0 24px 56px rgba(11,19,43,0.15)')}>
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8, flexShrink:0 }}>
      <span style={tag('rgba(11,19,43,0.45)')}>Goal-Based Investing</span>
      <span style={nbadge('rgba(11,19,43,0.6)','rgba(11,19,43,0.06)','rgba(11,19,43,0.15)')}>02</span>
    </div>
    <div style={{ marginBottom:8, flexShrink:0 }}>
      <div style={mobile ? h1lineM('#0B132B') : h1line('#0B132B')}>Invest with</div>
      <div style={mobile ? {...h1lineM('#B38D45'),fontStyle:'italic'} : {...h1line('#B38D45'),fontStyle:'italic'}}>Purpose</div>
    </div>
    <p style={{ ...bodyTxt(mobile), color:'rgba(11,19,43,0.5)' }}>
      When investments are tied to specific goals like a child's education, a home or a peaceful retirement, each one has a clear purpose, a timeline and a suitable scheme behind it.
    </p>
    <div style={div('rgba(11,19,43,0.08)')} />
    <p style={{ ...discTxt, color:'rgba(11,19,43,0.3)' }}>Illustrative. Outcomes depend on market conditions.</p>
  </div>
);

/* Card 03 — Deep forest green, emerald accent */
const C03_BG = 'linear-gradient(145deg,#071810 0%,#0c2118 100%)';
const Card03 = ({ mobile }) => (
  <div style={mobile ? cardMobile(C03_BG,'rgba(52,211,153,0.18)') : cardBase(C03_BG,'rgba(52,211,153,0.18)','0 24px 56px rgba(0,0,0,0.5)')}>
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8, flexShrink:0 }}>
      <span style={tag('rgba(52,211,153,0.6)')}>Ongoing Support</span>
      <span style={nbadge('rgba(52,211,153,0.55)','rgba(52,211,153,0.08)','rgba(52,211,153,0.15)')}>03</span>
    </div>
    <div style={{ marginBottom:8, flexShrink:0 }}>
      <div style={mobile ? h1lineM('#fff') : h1line('#fff')}>Beyond the</div>
      <div style={mobile ? {...h1lineM('#34D399'),fontStyle:'italic'} : {...h1line('#34D399'),fontStyle:'italic'}}>First Investment</div>
    </div>
    <p style={bodyTxt(mobile)}>
      A mutual fund investment is the beginning of a journey, not the end of a conversation. Questions, portfolio updates and clarity are always part of the process.
    </p>
    <div style={div('rgba(52,211,153,0.1)')} />
    <p style={discTxt}>Portfolio information based on publicly available data. Not advisory.</p>
  </div>
);

/* Card 04 — Rich dark gold-brown, warm gold accent */
const C04_BG = 'linear-gradient(145deg,#2C1F06 0%,#3A2A0A 100%)';
const Card04 = ({ mobile }) => (
  <div style={mobile ? cardMobile(C04_BG,'rgba(212,175,55,0.3)') : cardBase(C04_BG,'rgba(212,175,55,0.3)','0 24px 56px rgba(40,28,6,0.65)')}>
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8, flexShrink:0 }}>
      <span style={tag('rgba(212,175,55,0.7)')}>Diversified Portfolio</span>
      <span style={nbadge('rgba(212,175,55,0.85)','rgba(212,175,55,0.1)','rgba(212,175,55,0.3)')}>04</span>
    </div>
    <div style={{ marginBottom:8, flexShrink:0 }}>
      <div style={mobile ? h1lineM('#fff') : h1line('#fff')}>Balanced Mix.</div>
      <div style={mobile ? {...h1lineM('#D4AF37'),fontStyle:'italic'} : {...h1line('#D4AF37'),fontStyle:'italic'}}>Clear Purpose.</div>
    </div>
    <p style={bodyTxt(mobile)}>
      A well-considered portfolio spreads across equity, debt and hybrid mutual funds, each serving a different goal and horizon.
    </p>
    <div style={div('rgba(212,175,55,0.15)')} />
    <p style={discTxt}>Diversification does not guarantee profit or protect against loss.</p>
  </div>
);

const TiltCard = ({ children, style, className }) => {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 250, damping: 22 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 250, damping: 22 });
  const scale   = useSpring(1, { stiffness: 300, damping: 22 });
  const glareX  = useTransform(mx, [-0.5, 0.5], ['0%', '100%']);
  const glareY  = useTransform(my, [-0.5, 0.5], ['0%', '100%']);

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top)  / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); scale.set(1); };
  const onEnter = () => scale.set(1.04);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ ...style, rotateX, rotateY, scale, transformStyle: 'preserve-3d', perspective: 900, backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}
      className={className}
    >
      {children}
      <motion.div
        style={{
          position: 'absolute', inset: 0, borderRadius: 24, pointerEvents: 'none',
          background: useTransform([glareX, glareY], ([gx, gy]) =>
            `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.13) 0%, transparent 65%)`
          ),
        }}
      />
    </motion.div>
  );
};

/* ════════════════════════════════════ Main ══════════════════════ */
const HeroFloatingCards = () => (
  <>
    {/* Mobile: uniform 2×2 grid */}
    <div className="lg:hidden grid grid-cols-2 gap-3 w-full select-none">
      <Card01 mobile /><Card02 mobile />
      <Card03 mobile /><Card04 mobile />
    </div>

    {/* Desktop: precise 2-column positioned layout */}
    <div
      className="hidden lg:block relative select-none"
      style={{ width: CW * 2 + GAP, height: TOTAL_H }}
    >
      {[
        { Card: Card01, pos: POS.c01, amp: 10, dur: 7.5, delay: 0   },
        { Card: Card02, pos: POS.c02, amp: 12, dur: 8.5, delay: 1.1 },
        { Card: Card03, pos: POS.c03, amp:  9, dur: 9.0, delay: 0.6 },
        { Card: Card04, pos: POS.c04, amp: 11, dur: 7.8, delay: 1.7 },
      ].map(({ Card, pos, amp, dur, delay }, i) => (
        <TiltCard
          key={i}
          style={{
            position: 'absolute',
            top:    pos.top,
            left:   pos.left,
            rotate: pos.rotate,
            zIndex: pos.z,
          }}
        >
          <motion.div
            animate={{ y: [0, -amp, 0] }}
            transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
          >
            <Card />
          </motion.div>
        </TiltCard>
      ))}
    </div>
  </>
);

export default HeroFloatingCards;
