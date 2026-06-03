import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Info, ArrowUpRight, Lock, ChevronDown } from 'lucide-react';

const riskConfig = {
  'Low':              { bg: 'bg-green-50',   text: 'text-green-600',   border: 'border-green-100',   dot: 'bg-green-600' },
  'Low to Moderate':  { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', dot: 'bg-emerald-600' },
  'Moderate':         { bg: 'bg-yellow-50',  text: 'text-yellow-700',  border: 'border-yellow-100',  dot: 'bg-yellow-600' },
  'Moderately High':  { bg: 'bg-orange-50',  text: 'text-orange-600',  border: 'border-orange-100',  dot: 'bg-orange-500' },
  'High':             { bg: 'bg-red-50',     text: 'text-red-500',     border: 'border-red-100',     dot: 'bg-red-500' },
  'Very High':        { bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200',    dot: 'bg-rose-700' }
};

const riskLevels = ['Low', 'Low to Moderate', 'Moderate', 'Moderately High', 'High', 'Very High'];
const riskColors = ['#16a34a', '#65a30d', '#ca8a04', '#ea580c', '#dc2626', '#991b1b'];
const TABS = ['Equity', 'Debt', 'ELSS', 'Hybrid'];

const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const parseNavDate = (value) => {
  const [d, m, y] = String(value || '').split('-').map(Number);
  if (!d || !m || !y) return null;
  return new Date(y, m - 1, d);
};

// Exact same algorithm as ExploreFundsPage detail chart
const computeLiveCagr = (navHistory, months) => {
  if (!Array.isArray(navHistory) || navHistory.length < 2) return null;
  const rows = navHistory
    .map((x) => ({ dt: parseNavDate(x.date), nav: Number(x.nav) }))
    .filter((x) => x.dt && Number.isFinite(x.nav) && x.nav > 0)
    .sort((a, b) => a.dt - b.dt);
  if (rows.length < 2) return null;
  const latest = rows[rows.length - 1];
  const from = new Date(latest.dt);
  from.setMonth(from.getMonth() - months);
  const rangeRows = rows.filter((x) => x.dt >= from);
  if (rangeRows.length < 2) return null;
  const first = rangeRows[0];
  const last = rangeRows[rangeRows.length - 1];
  if (first.nav <= 0) return null;
  const years = (last.dt - first.dt) / (365.25 * 24 * 60 * 60 * 1000);
  if (years <= 0) return null;
  return ((last.nav / first.nav) ** (1 / years) - 1) * 100;
};

const normalize = (v) =>
  String(v || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const UPPERCASE_WORDS = new Set([
  'SBI','HDFC','ICICI','AXIS','DSP','UTI','LIC','IDBI','BOI','HSBC','JM',
  'PPFAS','ITI','NJ','PGIM','MOSL','ELSS','NFO','ETF','FoF','SIP','NAV',
  'AMC','SEBI','MF','US','UK','ESG','IT','PSU','FMCG','CEF','G-SEC',
]);

const toTitleCase = (str) =>
  str.replace(/\b([a-zA-Z]+)\b/g, (word) => {
    const up = word.toUpperCase();
    if (UPPERCASE_WORDS.has(up)) return up;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

const cleanName = (name) =>
  toTitleCase(String(name || '').trim())
    .replace(/[\s\-–]+growth\s+plan[\s\-–]+growth\s+option/gi, ' (Growth)')
    .replace(/[\s\-–]+growth\s+plan[\s\-–]+growth/gi, ' (Growth)')
    .replace(/[\s\-–]+growth\s+plan/gi, ' (Growth)')
    .replace(/[\s\-–]+growth\s+option/gi, ' (Growth)')
    .replace(/\s*\(Growth\)\s*\(Growth\)/gi, ' (Growth)')
    .replace(/[\s\-–]+payout\s+of\s+income\s+distribution\s+cum\s*capital\s+withdrawal\s+option/gi, ' (IDCW)')
    .replace(/[\s\-–]+income\s+distribution\s+cum\s+capital\s+withdrawal\s+option/gi, ' (IDCW)')
    .replace(/[\s\-–]+income\s+cum\s+distribution\s+withdrawal\s+option/gi, ' (IDCW)')
    .replace(/[\s\-–]+idcw\s+option/gi, ' (IDCW)')
    .replace(/[\s\-–]+idcw\s+payout/gi, ' (IDCW)')
    .replace(/[\s\-–]+idcw/gi, ' (IDCW)')
    .replace(/\s*\(IDCW\)\s*\(IDCW\)/gi, ' (IDCW)')
    .replace(/[\s\-–]+cumulative\s+option/gi, ' (Growth)')
    .replace(/[\s\-–]+growth$/gi, ' (Growth)')
    .replace(/\(idcw\)/gi, '(IDCW)')
    .trim();

const isGrowthLike = (schemeName) => {
  const s = normalize(schemeName);
  if (s.includes('idcw') || s.includes('dividend') || s.includes('payout') || s.includes('bonus')) return false;
  return s.includes('growth') || s.includes('regular');
};

const formatPct = (v) => {
  const n = toNum(v);
  if (n === null) return 'NA';
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
};

const categoryShort = (schemeCategory) => {
  const parts = String(schemeCategory || '').split(' - ').map((x) => x.trim()).filter(Boolean);
  return parts.length > 1 ? parts.slice(1).join(' - ') : (parts[0] || 'NA');
};

const isElss = (schemeCategory) => /elss|equity linked savings/i.test(String(schemeCategory || ''));

const mapTab = (fund) => {
  const cat = String(fund.scheme_category || '');
  if (isElss(cat)) return 'ELSS';
  if (cat.startsWith('Equity Scheme')) return 'Equity';
  if (cat.startsWith('Debt Scheme')) return 'Debt';
  if (cat.startsWith('Hybrid Scheme')) return 'Hybrid';
  return null;
};

const inferRisk = (fund) => {
  const cat = String(fund.scheme_category || '').toLowerCase();
  const c3 = toNum(fund.cagr_3y);
  if (cat.includes('elss') || cat.includes('sectoral') || cat.includes('small cap') || cat.includes('thematic')) return 'Very High';
  if (cat.startsWith('equity scheme')) return 'High';
  if (cat.includes('aggressive hybrid') || cat.includes('equity savings')) return 'High';
  if (cat.startsWith('hybrid scheme')) return 'Moderately High';
  if (cat.includes('overnight') || cat.includes('liquid') || cat.includes('money market')) return 'Low';
  if (cat.startsWith('debt scheme')) {
    if (c3 !== null && c3 >= 8) return 'Moderate';
    return 'Low to Moderate';
  }
  if (c3 !== null && c3 >= 15) return 'High';
  if (c3 !== null && c3 >= 6) return 'Moderate';
  return 'Low to Moderate';
};

// SEBI-style semicircular riskometer
const Riskometer = ({ risk }) => {
  const activeIndex = Math.max(0, riskLevels.indexOf(risk));
  const cx = 50;
  const cy = 52;
  const outerR = 38;
  const innerR = 24;

  const toRad = (deg) => (deg * Math.PI) / 180;
  const pt = (r, deg) => ({
    x: +(cx + r * Math.cos(toRad(deg))).toFixed(3),
    y: +(cy + r * Math.sin(toRad(deg))).toFixed(3)
  });

  const arcSegment = (startDeg, endDeg) => {
    const p1 = pt(outerR, startDeg);
    const p2 = pt(outerR, endDeg);
    const p3 = pt(innerR, endDeg);
    const p4 = pt(innerR, startDeg);
    return [
      `M ${p1.x} ${p1.y}`,
      `A ${outerR} ${outerR} 0 0 1 ${p2.x} ${p2.y}`,
      `L ${p3.x} ${p3.y}`,
      `A ${innerR} ${innerR} 0 0 0 ${p4.x} ${p4.y}`,
      'Z'
    ].join(' ');
  };

  const needleDeg = 180 + activeIndex * 30 + 15;
  const needleTip = pt(outerR - 6, needleDeg);

  return (
    <svg viewBox="0 0 100 56" className="w-16 h-10 mt-1.5" aria-label={`Risk: ${risk}`}>
      {riskLevels.map((_, i) => (
        <path
          key={i}
          d={arcSegment(180 + i * 30, 180 + (i + 1) * 30)}
          fill={riskColors[i]}
          opacity={i === activeIndex ? 1 : 0.18}
        />
      ))}
      <line x1={cx} y1={cy} x2={needleTip.x} y2={needleTip.y} stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="3.5" fill="#1e293b" />
      <circle cx={cx} cy={cy} r="1.8" fill="white" />
      <text x="50" y="56" textAnchor="middle" fontSize="5.5" fontWeight="700" letterSpacing="0.04em" fill="#94a3b8" fontFamily="sans-serif">
        RISKOMETER
      </text>
    </svg>
  );
};

const FundsTable = () => {
  const [activeTab, setActiveTab] = useState('Equity');
  const [disclosureOpen, setDisclosureOpen] = useState(true);
  const [indexData, setIndexData] = useState(null);
  const [metricsByCode, setMetricsByCode] = useState({});

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}mf-data/funds-index.json`);
        const data = await res.json();
        if (!cancelled) setIndexData(data);
      } catch (_err) {
        if (!cancelled) setIndexData({ funds: [] });
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const rankedByTab = useMemo(() => {
    const funds = Array.isArray(indexData?.funds) ? indexData.funds : [];
    const buckets = { Equity: [], Debt: [], ELSS: [], Hybrid: [] };

    const top5 = (pool) =>
      [...pool]
        .filter((f) => isGrowthLike(f.scheme_name) && toNum(f.cagr_5y) !== null)
        .sort((a, b) => {
          const a5 = toNum(a.cagr_5y) ?? -9999;
          const b5 = toNum(b.cagr_5y) ?? -9999;
          if (b5 !== a5) return b5 - a5;
          const a3 = toNum(a.cagr_3y) ?? -9999;
          const b3 = toNum(b.cagr_3y) ?? -9999;
          return b3 - a3;
        })
        .slice(0, 5)
        .map((f) => ({
          name: cleanName(f.scheme_name),
          cat: categoryShort(f.scheme_category),
          r1: toNum(f.cagr_1y),
          r3: toNum(f.cagr_3y),
          r5: toNum(f.cagr_5y),
          risk: inferRisk(f),
          amc: f.fund_house,
          schemeCode: f.scheme_code,
        }));

    buckets.ELSS    = top5(funds.filter((f) => isElss(f.scheme_category)));
    buckets.Equity  = top5(funds.filter((f) => !isElss(f.scheme_category) && String(f.scheme_category).startsWith('Equity Scheme')));
    buckets.Debt    = top5(funds.filter((f) => String(f.scheme_category).startsWith('Debt Scheme')));
    buckets.Hybrid  = top5(funds.filter((f) => String(f.scheme_category).startsWith('Hybrid Scheme')));

    return buckets;
  }, [indexData]);

  useEffect(() => {
    const rows = TABS.flatMap((tab) => rankedByTab[tab] || []);
    const codes = [...new Set(rows.map((r) => r.schemeCode).filter(Boolean))];
    if (!codes.length) return;

    let cancelled = false;
    const run = async () => {
      const entries = await Promise.all(
        codes.map(async (code) => {
          try {
            const res = await fetch(`${import.meta.env.BASE_URL}mf-data/funds/${code}.json`);
            if (!res.ok) return [code, null];
            const detail = await res.json();
            return [
              code,
              {
                return1y: toNum(computeLiveCagr(detail?.nav_history || [], 12)),
                cagr3y:   toNum(computeLiveCagr(detail?.nav_history || [], 36)),
                cagr5y:   toNum(computeLiveCagr(detail?.nav_history || [], 60)),
                hasLive: true,
              },
            ];
          } catch (_err) {
            return [code, null];
          }
        })
      );
      if (!cancelled) {
        setMetricsByCode(Object.fromEntries(entries.filter((x) => x[1])));
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [rankedByTab]);

  return (
    <section id="grow-my-money" className="pt-20 pb-16 bg-white overflow-hidden">
      <div className="container-custom">
        <div className="mb-8 lg:mb-16 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 mb-4 lg:mb-6 text-gold font-bold text-xs uppercase tracking-[0.3em] justify-center lg:justify-start">
            Intelligence
            <span className="w-12 h-px bg-gold" />
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-navy-900 leading-tight">
            Explore, Understand <br />
            <span className="italic text-gold">then Invest</span>
          </h2>
        </div>

        <div className="flex flex-wrap justify-center lg:justify-start gap-3 lg:gap-4 mb-4 lg:mb-12 border-b border-gray-100">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 text-sm font-black uppercase tracking-widest transition-all duration-500 relative ${
                activeTab === tab ? 'text-navy-900' : 'text-gray-300 hover:text-navy-900'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 w-full h-1 bg-gold rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden relative">
          <div className="relative">
            <p className="lg:hidden text-[10px] text-gray-400 text-center py-2 tracking-widest font-bold uppercase">Scroll to view</p>
            <div className="overflow-x-auto pb-4">
              <table className="w-full text-left min-w-[560px]">
                <thead className="bg-[#FAF9F6] border-b border-gray-100 text-gray-400 uppercase text-[10px] font-black tracking-[0.2em]">
                  <tr>
                    <th className="sticky left-0 z-30 bg-[#FAF9F6] px-3 lg:px-10 py-6 w-[210px] min-w-[210px] lg:w-auto lg:min-w-0">Scheme Name</th>
                    <th className="px-3 lg:px-6 py-6 text-center">1YR Returns</th>
                    <th className="px-3 lg:px-6 py-6 text-center">3Y CAGR</th>
                    <th className="px-3 lg:px-6 py-6 text-center">5Y CAGR</th>
                    <th className="px-3 lg:px-10 py-6 text-center">Risk Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <AnimatePresence mode="wait">
                    {(rankedByTab[activeTab] || []).map((fund, i) => (
                      (() => {
                        const m = metricsByCode[fund.schemeCode];
                        const r1 = m?.hasLive ? m.return1y : (m?.return1y ?? fund.r1);
                        const r3 = m?.hasLive ? m.cagr3y   : (m?.cagr3y   ?? fund.r3);
                        const r5 = m?.hasLive ? m.cagr5y   : (m?.cagr5y   ?? fund.r5);
                        const to = fund.schemeCode ? `/explore-funds/${fund.schemeCode}` : '/explore-funds';
                        return (
                      <motion.tr
                        key={`${activeTab}-${fund.name}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        className="group transition-all duration-500 hover:bg-[#FAF9F6]/50"
                      >
                        <td className="sticky left-0 z-20 bg-white group-hover:bg-[#FAF9F6] px-3 lg:px-10 py-4 lg:py-6 w-[210px] min-w-[210px] lg:w-auto lg:min-w-0 border-r border-gray-50">
                          <div className="flex flex-col min-w-0">
                            <Link to={to} className="font-serif font-bold text-xs lg:text-xl text-navy-900 group-hover:text-gold transition-colors leading-snug hover:underline block max-w-full break-words">
                              {fund.name}
                            </Link>
                            <span className="text-[8px] lg:text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 block max-w-full break-words">{fund.amc || fund.cat}</span>
                          </div>
                        </td>
                        <td className="px-3 lg:px-6 py-4 lg:py-6 text-center text-sm lg:text-xl font-bold text-navy-900/60">{formatPct(r1)}</td>
                        <td className="px-3 lg:px-6 py-4 lg:py-6 text-center text-sm lg:text-xl font-bold text-navy-900/80">{formatPct(r3)}</td>
                        <td className="px-3 lg:px-6 py-4 lg:py-6 text-center text-sm lg:text-xl font-bold text-navy-900/60">{formatPct(r5)}</td>
                        <td className="px-3 lg:px-10 py-4 lg:py-6 text-center">
                          <div className="inline-flex flex-col items-center gap-1">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 lg:px-4 py-1 lg:py-1.5 rounded-full text-[9px] lg:text-[10px] font-black uppercase tracking-widest ${riskConfig[fund.risk]?.bg} ${riskConfig[fund.risk]?.text} ${riskConfig[fund.risk]?.border} border`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${riskConfig[fund.risk]?.dot}`} />
                              <span className="hidden sm:inline">{fund.risk}</span>
                              <span className="sm:hidden">{fund.risk.split(' ')[0]}</span>
                            </div>
                            <Riskometer risk={fund.risk} />
                          </div>
                        </td>
                      </motion.tr>
                        );
                      })()
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            <div className="flex justify-center pt-4 pb-8">
              <Link
                to="/explore-funds"
                className="btn-primary shadow-[0_20px_50px_rgba(197,160,89,0.3)] flex items-center gap-3 px-8 py-3 md:px-14 md:py-4 text-sm md:text-base font-bold tracking-wide group"
              >
                Explore More
                <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </Link>
            </div>
          </div>

          <div className="bg-[#FAF9F6] border-t border-gray-100 relative z-10">
            <button
              onClick={() => setDisclosureOpen((o) => !o)}
              className="lg:hidden w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <div className="flex items-center gap-2.5">
                <Info size={14} className="text-gold shrink-0" />
                <span className="text-[10px] text-navy-900 font-black uppercase tracking-widest">Statutory Disclosures</span>
              </div>
              <motion.div animate={{ rotate: disclosureOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronDown size={16} className="text-gray-400" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {disclosureOpen && (
                <motion.div
                  key="disclosure"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="lg:hidden overflow-hidden"
                >
                  <div className="px-5 pb-4 space-y-2 text-gray-500 text-[10px] leading-relaxed">
                    <p>Mutual Fund investments are subject to market risks. Read all the scheme-related documents carefully before investing.</p>
                    <p>We facilitate investments in Regular plans of Mutual Fund Schemes only, Direct Plans are not offered.</p>
                    <p>Returns are historical in nature, past performance may or may not be sustained in the future and is not indicative of future returns.</p>
                    <p>This information is provided for informational purposes only and does not constitute investment advice or a recommendation.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="hidden lg:flex px-10 py-8 flex-col md:flex-row items-start justify-between gap-10">
              <div className="flex items-start gap-4 text-gray-500 text-[10px] font-medium leading-relaxed max-w-3xl">
                <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                  <Info size={16} className="text-gold" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <p className="text-[11px] text-navy-900 font-black uppercase tracking-widest mb-2">Statutory disclosures</p>
                  <p>Mutual Fund investments are subject to market risks. Read all the scheme-related documents carefully before investing.</p>
                  <p>We facilitate investments in Regular plans of Mutual Fund Schemes only, Direct Plans are not offered.</p>
                  <p>Returns are historical in nature, past performance may or may not be sustained in the future and is not indicative of future returns.</p>
                  <p>This information is provided for informational purposes only and does not constitute investment advice or a recommendation. Investors are advised to consult their financial advisor before making any investment decisions.</p>
                </div>
              </div>
              <Link to="/explore-funds" className="flex items-center gap-3 text-navy-900 font-bold text-[10px] uppercase tracking-[0.2em] group shrink-0 mt-2">
                View All Schematics
                <div className="w-10 h-10 rounded-full border border-navy-900/10 flex items-center justify-center group-hover:bg-navy-900 group-hover:text-white transition-all">
                  <ArrowUpRight size={16} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FundsTable;
