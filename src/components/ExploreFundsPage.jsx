import React, { useEffect, useMemo, useRef, useState } from 'react';

const UPPERCASE_WORDS = new Set([
  'SBI','HDFC','ICICI','AXIS','DSP','UTI','LIC','IDBI','BOI','HSBC','JM',
  'PPFAS','ITI','NJ','PGIM','MOSL','ELSS','NFO','ETF','FoF','SIP','NAV',
  'AMC','SEBI','MF','US','UK','ESG','IT','PSU','FMCG','CEF','G-SEC','MNC',
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
    .replace(/[\s\-–]+(annual|monthly|quarterly|weekly|daily|fortnightly|bonus)[\s\-–]+idcw[\s\-–]+option/gi, (_, f) => ` (${f.charAt(0).toUpperCase() + f.slice(1).toLowerCase()} IDCW)`)
    .replace(/[\s\-–]+(annual|monthly|quarterly|weekly|daily|fortnightly|bonus)[\s\-–]+idcw/gi, (_, f) => ` (${f.charAt(0).toUpperCase() + f.slice(1).toLowerCase()} IDCW)`)
    .replace(/[\s\-–]+(annual|monthly|quarterly|weekly|daily|fortnightly|bonus)\s+idcw[\s\-–]+option/gi, (_, f) => ` (${f.charAt(0).toUpperCase() + f.slice(1).toLowerCase()} IDCW)`)
    .replace(/[\s\-–]+(annual|monthly|quarterly|weekly|daily|fortnightly|bonus)\s+idcw/gi, (_, f) => ` (${f.charAt(0).toUpperCase() + f.slice(1).toLowerCase()} IDCW)`)
    .replace(/[\s\-–]+idcw\s+option/gi, ' (IDCW)')
    .replace(/[\s\-–]+idcw\s+payout/gi, ' (IDCW)')
    .replace(/(?<!\([\w\s]*)[\s\-–]+idcw(?!\))/gi, ' (IDCW)')
    .replace(/\s*\(IDCW\)\s*\(IDCW\)/gi, ' (IDCW)')
    .replace(/[\s\-–]+cumulative\s+option/gi, ' (Growth)')
    .replace(/[\s\-–]+growth$/gi, ' (Growth)')
    .replace(/(\w)\s*[\-–]\s*(\()/g, '$1 $2')
    .replace(/\s+[\-–]\s+([A-Z])/g, ' $1')
    .replace(/\(idcw\)/gi, '(IDCW)')
    .trim();
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ChevronDown, Search } from 'lucide-react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const INR = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const PERIODS = ['1M', '6M', '1Y', '3Y', '5Y', 'MAX'];
const PAGE_SIZE = 40;
const CAGR_RANGE = { min: -11, max: 66 };

const parseDate = (value) => {
  const [d, m, y] = String(value || '').split('-').map(Number);
  if (!d || !m || !y) return null;
  return new Date(y, m - 1, d);
};

const formatPct = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return 'NA';
  const num = Number(value);
  return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
};

const pctClass = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return 'text-gray-500';
  return Number(value) >= 0 ? 'text-emerald-600' : 'text-rose-600';
};

const getCategoryParts = (category) => {
  const value = String(category || '').trim();
  const parts = value.split(' - ').map((x) => x.trim()).filter(Boolean);
  const rawTop = parts[0] || 'Other';
  const sub = parts.length >= 2 ? parts.slice(1).join(' - ') : rawTop;
  const topMap = {
    'Equity Scheme': 'Equity',
    'Debt Scheme': 'Debt',
    'Hybrid Scheme': 'Hybrid',
    'Other Scheme': 'Other',
    'Solution Oriented Scheme': 'Other',
  };
  return { top: topMap[rawTop] || 'Other', sub };
};

const getCategoryKey = (category) => {
  const { top, sub } = getCategoryParts(category);
  return `${top}::${sub}`;
};

const getRiskBand = (cagr3y) => {
  const v = Number(cagr3y);
  if (!Number.isFinite(v)) return { label: 'NA', color: 'bg-gray-400' };
  if (v < 3) return { label: 'Low', color: 'bg-emerald-500' };
  if (v < 15) return { label: 'Mid', color: 'bg-amber-500' };
  return { label: 'High', color: 'bg-rose-500' };
};

const computeInceptionCagr = (navHistory) => {
  if (!Array.isArray(navHistory) || navHistory.length < 2) return null;
  const rows = navHistory
    .map((x) => ({ date: parseDate(x.date), nav: Number(x.nav) }))
    .filter((x) => x.date && Number.isFinite(x.nav) && x.nav > 0)
    .sort((a, b) => a.date - b.date);
  if (rows.length < 2) return null;
  const first = rows[0];
  const last = rows[rows.length - 1];
  const years = (last.date - first.date) / (365.25 * 24 * 60 * 60 * 1000);
  if (!Number.isFinite(years) || years <= 0) return null;
  const cagr = (last.nav / first.nav) ** (1 / years) - 1;
  return Number.isFinite(cagr) ? cagr * 100 : null;
};

const computeRangeCagr = (rows) => {
  if (!Array.isArray(rows) || rows.length < 2) return null;
  const first = rows[0];
  const last = rows[rows.length - 1];
  if (!first?.dt || !last?.dt || !Number.isFinite(first.nav) || !Number.isFinite(last.nav) || first.nav <= 0 || last.nav <= 0) return null;
  const years = (last.dt - first.dt) / (365.25 * 24 * 60 * 60 * 1000);
  if (!Number.isFinite(years) || years <= 0) return null;
  return (((last.nav / first.nav) ** (1 / years)) - 1) * 100;
};

const rangeHighlightPlugin = {
  id: 'rangeHighlightPlugin',
  beforeDatasetsDraw(chart) {
    const meta = chart.getDatasetMeta(0);
    if (!meta?.data?.length) return;
    const cfg = chart.options.plugins?.rangeHighlightMeta;
    if (!cfg || cfg.startIdx == null || cfg.endIdx == null) return;
    const compact = !!cfg.compact;
    const { ctx, chartArea } = chart;
    const startPoint = meta.data[cfg.startIdx];
    const endPoint = meta.data[cfg.endIdx];
    if (!startPoint || !endPoint) return;
    const x1 = Math.min(startPoint.x, endPoint.x);
    const x2 = Math.max(startPoint.x, endPoint.x);

    ctx.save();
    // Highlight selected window
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, 'rgba(34,197,94,0.16)');
    gradient.addColorStop(1, 'rgba(34,197,94,0.03)');
    ctx.fillStyle = gradient;
    ctx.fillRect(x1, chartArea.top, x2 - x1, chartArea.bottom - chartArea.top);

    // Start/end guide lines
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(100,116,139,0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, chartArea.top);
    ctx.lineTo(x1, chartArea.bottom);
    ctx.moveTo(x2, chartArea.top);
    ctx.lineTo(x2, chartArea.bottom);
    ctx.stroke();
    ctx.setLineDash([]);

    // Top return callout
    const r = 6;
    if (!compact) {
      const boxW = 140;
      const boxH = 48;
      const prefX = x1 + 8;
      const bx = Math.max(chartArea.left + 4, Math.min(prefX, chartArea.right - boxW - 4));
      const by = chartArea.top + 8;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bx + r, by);
      ctx.arcTo(bx + boxW, by, bx + boxW, by + boxH, r);
      ctx.arcTo(bx + boxW, by + boxH, bx, by + boxH, r);
      ctx.arcTo(bx, by + boxH, bx, by, r);
      ctx.arcTo(bx, by, bx + boxW, by, r);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      const isNegative = String(cfg.deltaAbs || '').includes('▼') || String(cfg.deltaPct || '').includes('-');
      ctx.fillStyle = isNegative ? '#dc2626' : '#16a34a';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillText(`${cfg.deltaAbs}  (${cfg.deltaPct})`, bx + 10, by + 20);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(cfg.rangeLabel, bx + 10, by + 38);
    }

    const drawEndpointTag = (x, y, dateLabel, navValue, align = 'top') => {
      if (!dateLabel || !Number.isFinite(Number(navValue))) return;
      const w = 92;
      const h = 42;
      const pad = 6;
      const prefX = x - w / 2;
      const tx = Math.max(chartArea.left + 4, Math.min(prefX, chartArea.right - w - 4));
      const prefY = align === 'top' ? y - h - 10 : y + 10;
      const ty = Math.max(chartArea.top + 4, Math.min(prefY, chartArea.bottom - h - 4));

      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(tx + r, ty);
      ctx.arcTo(tx + w, ty, tx + w, ty + h, r);
      ctx.arcTo(tx + w, ty + h, tx, ty + h, r);
      ctx.arcTo(tx, ty + h, tx, ty, r);
      ctx.arcTo(tx, ty, tx + w, ty, r);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#6b7280';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(String(dateLabel), tx + pad, ty + 15);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText(`₹${Number(navValue).toFixed(2)}`, tx + pad, ty + 33);
    };

    if (!compact) {
      drawEndpointTag(startPoint.x, startPoint.y, cfg.startDateLabel, cfg.startNav, 'top');
      drawEndpointTag(endPoint.x, endPoint.y, cfg.endDateLabel, cfg.endNav, 'top');
    }

    // Fixed endpoint dots anchored to actual line points.
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(endPoint.x, endPoint.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};

const crosshairPlugin = {
  id: 'crosshairPlugin',
  afterDatasetsDraw(chart) {
    const { ctx, chartArea, tooltip } = chart;
    if (!tooltip || !tooltip._active || !tooltip._active.length) return;
    const activePoint = tooltip._active[0];
    const x = activePoint.element.x;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, chartArea.top);
    ctx.lineTo(x, chartArea.bottom);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(15,23,42,0.25)';
    ctx.setLineDash([4, 3]);
    ctx.stroke();
    ctx.restore();
  },
};

ChartJS.register(rangeHighlightPlugin, crosshairPlugin);

const WIDE_WRAP = 'max-w-[1720px] mx-auto px-4 md:px-6 lg:px-8';

const SummaryPopup = ({ fund, detail, onClose }) => {
  const popupCardRef = useRef(null);
  const rows = (detail?.nav_history || [])
    .map((x) => ({ ...x, dt: parseDate(x.date), nav: Number(x.nav) }))
    .filter((x) => x.dt && Number.isFinite(x.nav));
  const latest = rows[rows.length - 1];
  const oneYearRows = rows.filter((x) => latest && x.dt >= new Date(latest.dt.getFullYear() - 1, latest.dt.getMonth(), latest.dt.getDate()));
  const min1Y = oneYearRows.length ? Math.min(...oneYearRows.map((x) => x.nav)) : null;
  const max1Y = oneYearRows.length ? Math.max(...oneYearRows.map((x) => x.nav)) : null;
  const inceptionCagr = computeInceptionCagr(detail?.nav_history || []);
  const popupTrendUp =
    oneYearRows.length >= 2 ? oneYearRows[oneYearRows.length - 1].nav >= oneYearRows[0].nav : true;
  const popupLineColor = popupTrendUp ? '#1f7a6f' : '#dc2626';
  const popupFillColor = popupTrendUp ? 'rgba(31,122,111,0.15)' : 'rgba(220,38,38,0.15)';
  const minIdx = min1Y === null ? -1 : oneYearRows.findIndex((x) => x.nav === min1Y);
  const maxIdx = max1Y === null ? -1 : oneYearRows.findIndex((x) => x.nav === max1Y);
  const markerData = oneYearRows.map((_x, i) => {
    if (i === minIdx) return min1Y;
    if (i === maxIdx) return max1Y;
    return null;
  });

  const chartData = {
    labels: oneYearRows.map((x) => x.date),
    datasets: [
      {
        data: oneYearRows.map((x) => x.nav),
        borderColor: popupLineColor,
        backgroundColor: popupFillColor,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHitRadius: 18,
        borderWidth: 2,
        tension: 0.22,
      },
      {
        data: markerData,
        borderColor: 'transparent',
        backgroundColor: '#0f172a',
        pointRadius: (ctx) => (ctx.raw === null ? 0 : 4),
        pointHoverRadius: (ctx) => (ctx.raw === null ? 0 : 4),
        pointHitRadius: 10,
        showLine: false,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    transitions: {
      active: { animation: { duration: 0 } },
    },
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        displayColors: true,
        callbacks: {
          title: (items) => (items?.[0]?.label ? items[0].label : ''),
          label: (ctx) => {
            const v = Number(ctx.parsed?.y || 0);
            if (ctx.datasetIndex === 1) {
              if (ctx.dataIndex === minIdx) return `52W Low: ₹${INR.format(v)}`;
              if (ctx.dataIndex === maxIdx) return `52W High: ₹${INR.format(v)}`;
            }
            return `₹${INR.format(v)}`;
          },
        },
      },
    },
    scales: { x: { display: false, grid: { display: false } }, y: { display: false, grid: { display: false } } },
  };

  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/35 pointer-events-auto" onClick={onClose}>
      <div className="h-full w-full flex md:items-start md:justify-center md:p-4">
      <div
        ref={popupCardRef}
        className="w-full md:max-w-[760px] md:rounded-2xl border border-gray-200 bg-white shadow-2xl relative z-[10000] pointer-events-auto h-[100svh] md:max-h-[90vh] md:h-auto flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-100 p-3 flex items-center shrink-0">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full border border-navy-900/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-navy-900"
          >
            <ArrowLeft size={14} />
            Back
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-y-contain [webkit-overflow-scrolling:touch]">
        <div className="p-3 border-b border-gray-100">
          <p className="text-xs text-navy-900/50 font-bold uppercase tracking-widest">{fund?.fund_house}</p>
          <h3 className="text-2xl leading-tight font-serif font-bold text-navy-900 mt-1">{cleanName(fund?.scheme_name)}</h3>
          <p className="text-sm text-navy-900/55">{fund?.scheme_category}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-[#FAF9F6] border border-gray-200 px-2.5 py-1 text-navy-900/70">
              52W Low: {min1Y === null ? 'NA' : `₹${INR.format(min1Y)}`}
            </span>
            <span className="rounded-full bg-[#FAF9F6] border border-gray-200 px-2.5 py-1 text-navy-900/70">
              52W High: {max1Y === null ? 'NA' : `₹${INR.format(max1Y)}`}
            </span>
          </div>
        </div>
        <div className="p-3 pb-6">
          <p className="text-sm font-bold text-navy-900">1Y Price Trend</p>
          <div className="h-32 mt-2">
            <Line data={chartData} options={chartOptions} />
          </div>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div className="rounded-xl bg-[#FAF9F6] p-3"><p className="text-xs text-navy-900/50">Current NAV</p><p className="font-bold text-navy-900">₹{INR.format(Number(detail?.metrics?.latest_nav || 0))}</p></div>
            <div className="rounded-xl bg-[#FAF9F6] p-3"><p className="text-xs text-navy-900/50">52 Week Low</p><p className="font-bold text-navy-900">{min1Y === null ? 'NA' : `₹${INR.format(min1Y)}`}</p></div>
            <div className="rounded-xl bg-[#FAF9F6] p-3"><p className="text-xs text-navy-900/50">52 Week High</p><p className="font-bold text-navy-900">{max1Y === null ? 'NA' : `₹${INR.format(max1Y)}`}</p></div>
            <div className="rounded-xl bg-[#FAF9F6] p-3"><p className="text-xs text-navy-900/50">1M Return</p><p className={`font-bold ${pctClass(detail?.metrics?.returns_pct?.['1m'])}`}>{formatPct(detail?.metrics?.returns_pct?.['1m'])}</p></div>
            <div className="rounded-xl bg-[#FAF9F6] p-3"><p className="text-xs text-navy-900/50">1Y Return</p><p className={`font-bold ${pctClass(detail?.metrics?.returns_pct?.['1y'])}`}>{formatPct(detail?.metrics?.returns_pct?.['1y'])}</p></div>
            <div className="rounded-xl bg-[#FAF9F6] p-3"><p className="text-xs text-navy-900/50">CAGR (Since Inception)</p><p className={`font-bold ${pctClass(inceptionCagr)}`}>{formatPct(inceptionCagr)}</p></div>
          </div>
        </div>
        <div className="p-3 border-t border-gray-100 pb-[max(env(safe-area-inset-bottom),0.9rem)]">
          <Link to={`/explore-funds/${fund?.scheme_code}`} className="w-full inline-flex justify-center rounded-xl bg-navy-900 text-white font-bold py-3 hover:bg-navy-800 transition-colors">
            View Details
          </Link>
        </div>
        </div>
      </div>
      </div>
    </div>,
    document.body
  );
};

const ScreenerView = () => {
  const navigate = useNavigate();
  const [indexData, setIndexData] = useState(null);

  const [search, setSearch] = useState('');
  const [popupFund, setPopupFund] = useState(null);
  const [popupDetail, setPopupDetail] = useState(null);
  const [selectedAmcs, setSelectedAmcs] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [expandedCategoryGroups, setExpandedCategoryGroups] = useState({
    Debt: true,
    Equity: true,
    Hybrid: true,
    Other: true,
  });
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [cagrMin, setCagrMin] = useState(CAGR_RANGE.min);
  const [cagrMax, setCagrMax] = useState(CAGR_RANGE.max);
  const [sortField, setSortField] = useState('cagr3');
  const [sortOrder, setSortOrder] = useState('desc');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const update = () => setIsMobileView(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

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

  const funds = indexData?.funds || [];

  const amcOptions = useMemo(
    () => [...new Set(funds.map((f) => String(f.fund_house || '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [funds]
  );

  const categoryTree = useMemo(() => {
    const groupOrder = ['Debt', 'Equity', 'Hybrid', 'Other'];
    const groups = new Map();
    funds.forEach((f) => {
      const { top, sub } = getCategoryParts(f.scheme_category);
      if (!groups.has(top)) groups.set(top, new Map());
      const subMap = groups.get(top);
      subMap.set(sub, (subMap.get(sub) || 0) + 1);
    });
    return groupOrder
      .map((name) => {
        const subMap = groups.get(name) || new Map();
        const children = [...subMap.entries()]
          .map(([subName, count]) => ({ name: subName, count, key: `${name}::${subName}` }))
          .sort((a, b) => a.name.localeCompare(b.name));
        return { name, count: children.length, children };
      })
      .filter((group) => group.children.length > 0);
  }, [funds]);

  const filteredCategoryTree = useMemo(() => {
    const q = categorySearch.trim().toLowerCase();
    if (!q) return categoryTree;
    return categoryTree
      .map((group) => ({
        ...group,
        children: group.children.filter((child) => child.name.toLowerCase().includes(q)),
      }))
      .filter((group) => group.children.length > 0);
  }, [categoryTree, categorySearch]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setIsListExpanded(false);
  }, [search, selectedAmcs, selectedCategories, cagrMin, cagrMax]);

  const filteredFunds = useMemo(() => {
    const terms = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let list = funds.filter((f) => {
      const haystack = `${f.scheme_name} ${f.fund_house} ${f.scheme_category} ${f.scheme_code}`.toLowerCase();
      const matchText = terms.length === 0 || terms.every((t) => haystack.includes(t));

      const matchAmc = !selectedAmcs.length || selectedAmcs.includes(String(f.fund_house || ''));
      const cat = getCategoryKey(f.scheme_category);
      const matchCategory = !selectedCategories.length || selectedCategories.includes(cat);
      const cagr3 = Number(f.cagr_3y);
      const matchCagr = Number.isFinite(cagr3) ? cagr3 >= cagrMin && cagr3 <= cagrMax : false;
      return matchText && matchAmc && matchCategory && matchCagr;
    });
    list.sort((a, b) => {
      const aVal = sortField === 'cagr1' ? Number(a.cagr_1y || -9999) : Number(a.cagr_3y || -9999);
      const bVal = sortField === 'cagr1' ? Number(b.cagr_1y || -9999) : Number(b.cagr_3y || -9999);
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });
    return list;
  }, [funds, search, selectedAmcs, selectedCategories, cagrMin, cagrMax, sortField, sortOrder]);

  const visibleFunds = filteredFunds.slice(0, visibleCount);

  const openPopup = async (fund) => {
    if (isMobileView) {
      navigate(`/explore-funds/${fund.scheme_code}`);
      return;
    }
    setPopupFund(fund);
    setPopupDetail(null);
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}mf-data/funds/${fund.scheme_code}.json`);
      if (res.ok) {
        const data = await res.json();
        setPopupDetail(data);
      }
    } catch (_err) {
      setPopupDetail(null);
    }
  };

  const toggleValue = (value, list, setter) => {
    if (list.includes(value)) setter(list.filter((x) => x !== value));
    else setter([...list, value]);
  };

  const applyCagrBand = (band) => {
    if (band === 'low') {
      setCagrMin(-11);
      setCagrMax(3);
      return;
    }
    if (band === 'mid') {
      setCagrMin(3);
      setCagrMax(15);
      return;
    }
    setCagrMin(15);
    setCagrMax(66);
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
      return;
    }
    setSortField(field);
    setSortOrder('desc');
  };

  const activeCagrBand = useMemo(() => {
    if (cagrMin === -11 && cagrMax === 3) return 'low';
    if (cagrMin === 3 && cagrMax === 15) return 'mid';
    if (cagrMin === 15 && cagrMax === 66) return 'high';
    return '';
  }, [cagrMin, cagrMax]);

  return (
    <section className="pt-28 pb-16 relative z-0">
      <div className={WIDE_WRAP}>
        <div className="mb-4 lg:hidden">
          <button
            onClick={() => setMobileFiltersOpen((v) => !v)}
            className="w-full rounded-xl border border-[#e0d7c7] bg-white px-4 py-3 text-sm font-semibold text-navy-900 shadow-sm"
          >
            {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">
          <motion.aside
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className={`${mobileFiltersOpen ? 'block' : 'hidden'} lg:block lg:sticky lg:top-24 relative overflow-hidden rounded-[28px] border border-[#e8e0d1] bg-gradient-to-b from-[#fffdf8] via-[#fffefc] to-[#f8f3e8] p-5 h-fit shadow-[0_18px_48px_rgba(16,24,40,0.08)]`}>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#c5a0591f] to-transparent" />
            <div className="relative flex items-center justify-between">
              <h3 className="font-serif text-[1.7rem] leading-none font-bold text-navy-900">Filters</h3>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-full border border-navy-900/10 px-3 py-1 text-xs font-semibold text-navy-900/65 hover:border-gold hover:text-gold transition-colors"
                  onClick={() => {
                    setSelectedAmcs([]);
                    setSelectedCategories([]);
                    setCategorySearch('');
                    setSearch('');
                    setCagrMin(CAGR_RANGE.min);
                    setCagrMax(CAGR_RANGE.max);
                  }}
                >
                  Reset
                </button>
                <button
                  className="lg:hidden rounded-full border border-navy-900/10 px-3 py-1 text-xs font-semibold text-navy-900/65"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  Done
                </button>
              </div>
            </div>

            <div className="relative mt-4 rounded-2xl border border-[#eee8db] bg-[#fffefb] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-navy-900/50">Plan</p>
              <label className="mt-2 flex items-center gap-2 text-sm font-medium text-navy-900">
                <input type="checkbox" checked readOnly />
                Regular Plans
              </label>
            </div>

            <div className="relative mt-4 rounded-2xl border border-[#eee8db] bg-[#fffefb] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-navy-900/50">Category</p>
              <div className="mt-2 relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-navy-900/40" />
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder="Search by category name"
                  className="w-full rounded-lg border border-gray-200 bg-white pl-8 pr-2 py-1.5 text-sm outline-none focus:border-gold"
                />
              </div>
              <div className="mt-3 max-h-[28rem] overflow-y-auto overflow-x-visible space-y-2 pr-1">
                {filteredCategoryTree.map((group) => (
                  <div key={group.name} className="border-l border-[#ece4d4] pl-2">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedCategoryGroups((prev) => ({ ...prev, [group.name]: !prev[group.name] }))
                      }
                      className="w-full flex items-center justify-between text-sm text-navy-900/90"
                    >
                      <span className="font-medium">{group.name} ({group.count})</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${expandedCategoryGroups[group.name] ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {expandedCategoryGroups[group.name] && (
                      <div className="mt-1.5 space-y-1 pl-2">
                        {group.children.map((child) => (
                          <label key={child.key} className="flex items-center gap-2 text-sm text-navy-900/80 hover:text-navy-900">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(child.key)}
                              onChange={() => toggleValue(child.key, selectedCategories, setSelectedCategories)}
                            />
                            {child.name}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-4 rounded-2xl border border-[#eee8db] bg-[#fffefb] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-navy-900/50">AMC (A-Z)</p>
              <div className="mt-2 max-h-52 overflow-auto space-y-1 pr-1">
                {amcOptions.map((amc) => (
                  <label key={amc} className="flex items-center gap-2 text-sm text-navy-900/80 hover:text-navy-900">
                    <input type="checkbox" checked={selectedAmcs.includes(amc)} onChange={() => toggleValue(amc, selectedAmcs, setSelectedAmcs)} />
                    {amc}
                  </label>
                ))}
              </div>
            </div>

            <div className="relative mt-4 rounded-2xl border border-[#eee8db] bg-[#fffefb] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-navy-900/50">CAGR 3Y (%)</p>
              <div className="mt-2 h-2 rounded-full bg-gradient-to-r from-navy-900 to-gold" />
              <div className="mt-3 grid grid-cols-3 items-center gap-2 text-sm">
                <input
                  type="number"
                  min={CAGR_RANGE.min}
                  max={CAGR_RANGE.max}
                  value={cagrMin}
                  onChange={(e) => setCagrMin(Math.min(Math.max(Number(e.target.value || CAGR_RANGE.min), CAGR_RANGE.min), cagrMax))}
                  className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-center bg-white"
                />
                <p className="text-center text-navy-900/60">to</p>
                <input
                  type="number"
                  min={CAGR_RANGE.min}
                  max={CAGR_RANGE.max}
                  value={cagrMax}
                  onChange={(e) => setCagrMax(Math.max(Math.min(Number(e.target.value || CAGR_RANGE.max), CAGR_RANGE.max), cagrMin))}
                  className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-center bg-white"
                />
              </div>
              <div className="mt-2">
                <div className="relative h-6">
                  <div className="absolute top-1/2 -translate-y-1/2 h-1.5 w-full rounded-full bg-gray-200" />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-gradient-to-r from-navy-900 to-gold"
                    style={{
                      left: `${((cagrMin - CAGR_RANGE.min) / (CAGR_RANGE.max - CAGR_RANGE.min)) * 100}%`,
                      right: `${100 - ((cagrMax - CAGR_RANGE.min) / (CAGR_RANGE.max - CAGR_RANGE.min)) * 100}%`,
                    }}
                  />
                  <input
                    type="range"
                    min={CAGR_RANGE.min}
                    max={CAGR_RANGE.max}
                    value={cagrMin}
                    onChange={(e) => setCagrMin(Math.min(Number(e.target.value), cagrMax))}
                    className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-navy-900 [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition [&::-webkit-slider-thumb]:duration-150 [&::-webkit-slider-thumb]:active:scale-110 [&::-webkit-slider-thumb]:active:shadow-[0_0_0_6px_rgba(15,23,42,0.18)] [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-navy-900"
                  />
                  <input
                    type="range"
                    min={CAGR_RANGE.min}
                    max={CAGR_RANGE.max}
                    value={cagrMax}
                    onChange={(e) => setCagrMax(Math.max(Number(e.target.value), cagrMin))}
                    className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gold [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition [&::-webkit-slider-thumb]:duration-150 [&::-webkit-slider-thumb]:active:scale-110 [&::-webkit-slider-thumb]:active:shadow-[0_0_0_6px_rgba(197,160,89,0.25)] [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-gold"
                  />
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-0 rounded-lg overflow-hidden border border-gray-200">
                <button
                  onClick={() => applyCagrBand('low')}
                  className={`py-2 text-sm font-semibold border-r border-gray-200 transition-colors ${activeCagrBand === 'low'
                    ? 'bg-navy-900 text-white'
                    : 'bg-white hover:bg-[#f9f4e8]'
                    }`}
                >
                  Low
                </button>
                <button
                  onClick={() => applyCagrBand('mid')}
                  className={`py-2 text-sm font-semibold border-r border-gray-200 transition-colors ${activeCagrBand === 'mid'
                    ? 'bg-navy-900 text-white'
                    : 'bg-white hover:bg-[#f9f4e8]'
                    }`}
                >
                  Mid
                </button>
                <button
                  onClick={() => applyCagrBand('high')}
                  className={`py-2 text-sm font-semibold transition-colors ${activeCagrBand === 'high'
                    ? 'bg-navy-900 text-white'
                    : 'bg-white hover:bg-[#f9f4e8]'
                    }`}
                >
                  High
                </button>
              </div>
            </div>
          </motion.aside>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className={`${mobileFiltersOpen ? 'hidden lg:block' : 'block'} bg-gradient-to-b from-[#fffdf9] to-white border border-[#e7dfd1] rounded-[30px] overflow-hidden shadow-[0_18px_48px_rgba(15,23,42,0.08)]`}>
            <div className="p-5 border-b border-[#efe9dc]">
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-[1.8rem] md:text-[2.35rem] leading-[1.08] font-serif font-bold text-navy-900 tracking-tight">Mutual Funds Screener</motion.h1>
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="relative w-full md:w-[420px]">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-900/40" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name / AMC / category / code"
                    className="w-full rounded-xl border border-[#dcd5c7] bg-[#fffefb] pl-9 pr-3 py-2.5 text-sm text-navy-900/85 outline-none focus:border-gold focus:ring-2 focus:ring-gold/15"
                  />
                </div>
                <p className="text-xs md:text-sm text-navy-900/70 self-center font-medium tracking-[0.01em]">
                  Showing {visibleFunds.length} of {filteredFunds.length} matched funds
                </p>
              </div>
            </div>

            <div className="lg:hidden p-3 space-y-2">
              {visibleFunds.map((fund, idx) => (
                <div key={fund.scheme_code} className="rounded-xl border border-[#ece4d4] bg-white p-3">
                  <p className="text-[11px] text-navy-900/45 mb-1">#{idx + 1}</p>
                  <button
                    onClick={() => openPopup(fund)}
                    className="text-left w-full font-semibold text-[1rem] text-navy-900 hover:text-gold leading-snug transition-colors"
                  >
                    {cleanName(fund.scheme_name)}
                  </button>
                  <p className="text-xs text-navy-900/50 mt-0.5">{fund.fund_house}</p>

                  <div className="mt-2 rounded-lg border border-[#efe9dc] bg-[#fffefb] p-2">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-navy-900/45 font-bold">Category</p>
                    <p className="text-sm text-navy-900/80 leading-snug mt-0.5">{fund.scheme_category || 'NA'}</p>
                  </div>

                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-5 gap-1 rounded-lg border border-[#efe9dc] overflow-hidden">
                    <div className="bg-[#faf6ee] p-1.5 min-w-0">
                      <p className="text-[9px] uppercase text-navy-900/45 font-bold">Plan</p>
                      <p className="text-[11px] font-semibold text-navy-900 break-words">Regular</p>
                    </div>
                    <div className="bg-[#faf6ee] p-1.5 min-w-0">
                      <p className="text-[9px] uppercase text-navy-900/45 font-bold">Latest NAV</p>
                      <p className="text-[10px] font-semibold text-navy-900 break-words">₹{INR.format(Number(fund.latest_nav || 0))}</p>
                    </div>
                    <div className="bg-[#faf6ee] p-1.5 min-w-0">
                      <p className="text-[9px] uppercase text-navy-900/45 font-bold">1YR Returns</p>
                      <p className={`text-[10px] font-semibold break-words ${pctClass(fund.cagr_1y)}`}>{formatPct(fund.cagr_1y)}</p>
                    </div>
                    <div className="bg-[#faf6ee] p-1.5 min-w-0">
                      <p className="text-[9px] uppercase text-navy-900/45 font-bold">3YR CAGR</p>
                      <p className={`text-[10px] font-semibold break-words ${pctClass(fund.cagr_3y)}`}>{formatPct(fund.cagr_3y)}</p>
                    </div>
                    <div className="bg-[#faf6ee] p-1.5 min-w-0 col-span-2 sm:col-span-1">
                      <p className="text-[9px] uppercase text-navy-900/45 font-bold">Risk</p>
                      <div className="inline-flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${getRiskBand(fund.cagr_3y).color}`} />
                        <span className="text-[11px] font-semibold text-navy-900/75">{getRiskBand(fund.cagr_3y).label}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full min-w-[860px] table-fixed text-sm">
                <thead className="bg-[#f8f4ea] sticky top-0 z-10 border-y border-[#ece4d4]">
                  <tr className="text-left text-[12px] uppercase tracking-[0.08em] text-navy-900/70">
                    <th className="px-3 py-3.5 w-[4%] align-middle">#</th>
                    <th className="px-3 py-3.5 w-[34%] align-middle">Name</th>
                    <th className="px-3 py-3.5 w-[21%] align-middle">Category</th>
                    <th className="px-3 py-3.5 w-[8%] align-middle">Plan</th>
                    <th className="px-3 py-3.5 w-[11%] align-middle">Latest NAV</th>
                    <th className="px-3 py-3.5 w-[8%] align-middle">
                      <button onClick={() => toggleSort('cagr1')} className="inline-flex w-full items-center justify-start gap-1 leading-tight font-semibold text-navy-900/75 hover:text-navy-900">
                        1YR Returns <span>{sortField === 'cagr1' ? (sortOrder === 'desc' ? '▼' : '▲') : '↕'}</span>
                      </button>
                    </th>
                    <th className="px-3 py-3.5 w-[8%] align-middle">
                      <button onClick={() => toggleSort('cagr3')} className="inline-flex w-full items-center justify-start gap-1 leading-tight font-semibold text-navy-900/75 hover:text-navy-900">
                        3YR CAGR <span>{sortField === 'cagr3' ? (sortOrder === 'desc' ? '▼' : '▲') : '↕'}</span>
                      </button>
                    </th>
                    <th className="px-3 py-3.5 w-[7%] align-middle">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleFunds.map((fund, idx) => (
                    <motion.tr
                      key={fund.scheme_code}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.6) }}
                      className="border-t border-[#efe9dc] hover:bg-[#fffaf0] transition-colors duration-150">
                      <td className="px-3 py-3 text-navy-900/50 align-top">{idx + 1}</td>
                      <td className="px-3 py-3 align-top">
                        <button onClick={() => openPopup(fund)} className="text-left font-semibold text-[0.95rem] md:text-[1.03rem] text-navy-900 hover:text-gold leading-snug transition-colors">
                          {cleanName(fund.scheme_name)}
                        </button>
                        <p className="text-xs text-navy-900/50 mt-0.5">{fund.fund_house}</p>
                      </td>
                      <td className="px-3 py-3 text-navy-900/70 align-top leading-snug">{fund.scheme_category || 'NA'}</td>
                      <td className="px-3 py-3 text-navy-900/70 align-top">Regular</td>
                      <td className="px-3 py-3 font-semibold align-top">₹{INR.format(Number(fund.latest_nav || 0))}</td>
                      <td className={`px-3 py-3 font-semibold align-top ${pctClass(fund.cagr_1y)}`}>{formatPct(fund.cagr_1y)}</td>
                      <td className={`px-3 py-3 font-semibold align-top ${pctClass(fund.cagr_3y)}`}>{formatPct(fund.cagr_3y)}</td>
                      <td className="px-3 py-3 align-top">
                        <div className="inline-flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${getRiskBand(fund.cagr_3y).color}`} />
                          <span className="text-xs font-semibold text-navy-900/75">{getRiskBand(fund.cagr_3y).label}</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {visibleCount < filteredFunds.length && (
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setVisibleCount((v) => v + PAGE_SIZE);
                    setIsListExpanded(true);
                  }}
                  className="w-full md:w-auto rounded-xl bg-navy-900 text-white px-5 py-2.5 font-semibold hover:bg-navy-800"
                >
                  View More
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      {!isMobileView && popupFund && <SummaryPopup fund={popupFund} detail={popupDetail} onClose={() => { setPopupFund(null); setPopupDetail(null); }} />}
    </section>
  );
};

const DetailView = ({ schemeCode }) => {
  const [fund, setFund] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('1Y');
  const [selectedMonthKey, setSelectedMonthKey] = useState('');
  const [dragRange, setDragRange] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartIdx, setDragStartIdx] = useState(null);
  const detailChartRef = useRef(null);
  const chartInteractionRef = useRef(null);
  const [plotOffsets, setPlotOffsets] = useState({ left: 0, right: 0 });
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const check = () => setIsMobileView(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}mf-data/funds/${schemeCode}.json`);
        if (!res.ok) throw new Error('Fund not found');
        const data = await res.json();
        if (!cancelled) setFund(data);
      } catch (_err) {
        if (!cancelled) setFund({ error: true });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [schemeCode]);

  const fullRows = useMemo(
    () =>
      (fund?.nav_history || [])
        .map((x) => ({ ...x, dt: parseDate(x.date), nav: Number(x.nav) }))
        .filter((x) => x.dt && Number.isFinite(x.nav)),
    [fund]
  );

  const chartRows = useMemo(() => {
    if (!fullRows.length) return [];
    if (period === 'MAX') return fullRows;
    const latest = fullRows[fullRows.length - 1];
    const months = period === '1M' ? 1 : period === '6M' ? 6 : period === '1Y' ? 12 : period === '3Y' ? 36 : 60;
    const from = new Date(latest.dt);
    from.setMonth(from.getMonth() - months);
    return fullRows.filter((x) => x.dt >= from);
  }, [fullRows, period]);
  useEffect(() => {
    setSelectedMonthKey('');
    setDragRange(null);
  }, [period, schemeCode]);

  const inceptionCagr = useMemo(() => computeInceptionCagr(fund?.nav_history || []), [fund]);

  const rangeSegments = useMemo(() => {
    const out = [];
    if (!chartRows.length) return out;
    let start = 0;

    const isMonthly = period === '1M' || period === '6M';
    const keyFor = (dt) => {
      if (isMonthly) return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
      const q = Math.floor(dt.getMonth() / 3) + 1;
      return `${dt.getFullYear()}-Q${q}`;
    };
    const labelFor = (dt) => {
      if (isMonthly) return dt.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
      const q = Math.floor(dt.getMonth() / 3) + 1;
      return `Q${q} ${String(dt.getFullYear()).slice(-2)}`;
    };

    for (let i = 1; i <= chartRows.length; i += 1) {
      const prev = chartRows[i - 1];
      const curr = chartRows[i];
      if (!curr || keyFor(prev.dt) !== keyFor(curr.dt)) {
        out.push({
          key: keyFor(prev.dt),
          startIdx: start,
          endIdx: i - 1,
          label: labelFor(prev.dt),
        });
        start = i;
      }
    }
    return out;
  }, [chartRows, period]);

  const selectedSegment = useMemo(
    () => rangeSegments.find((m) => m.key === selectedMonthKey) || null,
    [rangeSegments, selectedMonthKey]
  );

  const activeRows = useMemo(() => {
    if (!chartRows.length) return [];
    if (dragRange && Number.isInteger(dragRange.startIdx) && Number.isInteger(dragRange.endIdx)) {
      return chartRows.slice(dragRange.startIdx, dragRange.endIdx + 1);
    }
    if (!selectedSegment) return chartRows;
    return chartRows.slice(selectedSegment.startIdx, selectedSegment.endIdx + 1);
  }, [chartRows, selectedSegment, dragRange]);

  const rangeStats = useMemo(() => {
    if (!activeRows.length) return { high: null, low: null, returns: null, cagr: null, highDate: null, lowDate: null };
    const navs = activeRows.map((x) => x.nav);
    const high = Math.max(...navs);
    const low = Math.min(...navs);
    const highRow = activeRows.find((x) => x.nav === high) || null;
    const lowRow = activeRows.find((x) => x.nav === low) || null;
    const first = activeRows[0].nav;
    const last = activeRows[activeRows.length - 1].nav;
    const returns = first > 0 ? ((last / first) - 1) * 100 : null;
    return {
      high,
      low,
      highDate: highRow?.date || null,
      lowDate: lowRow?.date || null,
      returns,
      cagr: computeRangeCagr(activeRows),
    };
  }, [activeRows]);
  const rangeMetricValue = rangeStats.returns;
  const isRibbonPositive = (rangeMetricValue ?? 0) >= 0;
  const ribbonTrackClass = isRibbonPositive ? 'bg-emerald-500/90' : 'bg-rose-500/90';
  const ribbonHoverClass = isRibbonPositive ? 'hover:bg-emerald-900/25' : 'hover:bg-rose-900/25';
  const selectedPeriodCagr =
    period === '3Y' || period === '5Y' ? computeRangeCagr(chartRows) : null;
  const selectedPeriodCagrLabel = period === '3Y' ? '3Y CAGR' : period === '5Y' ? '5Y CAGR' : 'CAGR';
  const topMetric = useMemo(() => {
    if (period === '3Y' || period === '5Y') {
      return { label: selectedPeriodCagrLabel, value: selectedPeriodCagr };
    }
    if (period === 'MAX') {
      return { label: 'CAGR (Since Inception)', value: inceptionCagr };
    }
    return { label: 'Returns', value: rangeMetricValue };
  }, [period, selectedPeriodCagrLabel, selectedPeriodCagr, inceptionCagr, rangeMetricValue]);
  const selectedRangeMeta = useMemo(() => {
    if (isMobileView) return null;
    if (!chartRows.length) return null;
    const startIdx =
      dragRange && Number.isInteger(dragRange.startIdx) ? dragRange.startIdx : selectedSegment?.startIdx;
    const endIdx =
      dragRange && Number.isInteger(dragRange.endIdx) ? dragRange.endIdx : selectedSegment?.endIdx;
    if (!Number.isInteger(startIdx) || !Number.isInteger(endIdx)) return null;
    const first = chartRows[startIdx]?.nav;
    const last = chartRows[endIdx]?.nav;
    if (!Number.isFinite(first) || !Number.isFinite(last)) return null;
    const abs = last - first;
    const pct = first > 0 ? ((last / first) - 1) * 100 : 0;
    const startDate = chartRows[startIdx].dt;
    const endDate = chartRows[endIdx].dt;
    const rangeLabel = `${startDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${endDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
    return {
      startIdx,
      endIdx,
      startNav: first,
      endNav: last,
      startDateLabel: chartRows[startIdx].date,
      endDateLabel: chartRows[endIdx].date,
      deltaAbs: `${abs >= 0 ? '▲' : '▼'} ${Math.abs(abs).toFixed(2)}`,
      deltaPct: `${pct >= 0 ? '+' : '-'}${Math.abs(pct).toFixed(2)}%`,
      rangeLabel,
      compact: isMobileView,
    };
  }, [selectedSegment, chartRows, dragRange, isMobileView]);

  const getIndexFromEvent = (event) => {
    const chart = detailChartRef.current;
    if (!chart) return null;
    const points = chart.getElementsAtEventForMode(event.nativeEvent, 'index', { intersect: false }, false);
    if (!points || !points.length) return null;
    return points[0].index;
  };

  const handleChartMouseDown = (event) => {
    const idx = getIndexFromEvent(event);
    if (idx === null) return;
    const activeStart =
      dragRange && Number.isInteger(dragRange.startIdx) ? dragRange.startIdx : selectedSegment?.startIdx;
    const activeEnd =
      dragRange && Number.isInteger(dragRange.endIdx) ? dragRange.endIdx : selectedSegment?.endIdx;
    const hasActiveSelection = Number.isInteger(activeStart) && Number.isInteger(activeEnd);
    if (hasActiveSelection && (idx < activeStart || idx > activeEnd)) {
      clearSelection();
      return;
    }
    setIsDragging(true);
    setDragStartIdx(idx);
    setSelectedMonthKey('');
  };

  const handleChartMouseMove = (event) => {
    if (!isDragging) return;
    const idx = getIndexFromEvent(event);
    if (idx === null) return;
    if (dragStartIdx === null) return;
    if (idx === dragStartIdx) return;
    setDragRange({ startIdx: Math.min(dragStartIdx, idx), endIdx: Math.max(dragStartIdx, idx) });
  };

  const stopDragging = () => {
    if (!isDragging) return;
    if (dragRange && dragRange.startIdx === dragRange.endIdx) {
      setDragRange(null);
    }
    setIsDragging(false);
    setDragStartIdx(null);
  };

  const clearSelection = () => {
    setDragRange(null);
    setSelectedMonthKey('');
  };

  const chartData = {
    labels: chartRows.map((x) => x.date),
    datasets: [
      {
        data: chartRows.map((x) => x.nav),
        borderColor:
          chartRows.length >= 2 && chartRows[chartRows.length - 1].nav < chartRows[0].nav ? '#dc2626' : '#1f7a6f',
        backgroundColor:
          chartRows.length >= 2 && chartRows[chartRows.length - 1].nav < chartRows[0].nav
            ? 'rgba(220,38,38,0.15)'
            : 'rgba(31,122,111,0.15)',
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHitRadius: 18,
        borderWidth: 2,
        tension: 0.2,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      rangeHighlightMeta: selectedRangeMeta,
      crosshairPlugin: {},
      tooltip: {
        enabled: true,
        displayColors: true,
        callbacks: {
          title: (items) => (items?.[0]?.label ? items[0].label : ''),
          label: (ctx) => `₹${INR.format(Number(ctx.parsed?.y || 0))}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: isMobileView ? 4 : 8,
          maxRotation: 0,
          autoSkip: true,
          font: { size: isMobileView ? 10 : 12 },
        },
        grid: { display: false },
      },
      y: {
        ticks: {
          font: { size: isMobileView ? 10 : 12 },
          callback: (v) => {
            const n = Number(v);
            if (Math.abs(n) >= 10000000) return `${(n / 10000000).toFixed(1)}Cr`;
            if (Math.abs(n) >= 100000) return `${(n / 100000).toFixed(1)}L`;
            return INR.format(n);
          },
        },
        grid: { color: 'rgba(15,23,42,0.08)' },
      },
    },
  };

  useEffect(() => {
    const updateOffsets = () => {
      const chart = detailChartRef.current;
      if (!chart || !chart.chartArea || !chart.canvas) return;
      const left = Math.max(0, chart.chartArea.left);
      const right = Math.max(0, chart.canvas.width - chart.chartArea.right);
      setPlotOffsets({ left, right });
    };
    updateOffsets();
    const t = setTimeout(updateOffsets, 0);
    window.addEventListener('resize', updateOffsets);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', updateOffsets);
    };
  }, [period, chartRows.length, selectedMonthKey]);

  useEffect(() => {
    const handleOutsideSelectionClick = (event) => {
      if (!(dragRange || selectedMonthKey)) return;
      if (!chartInteractionRef.current) return;
      if (!chartInteractionRef.current.contains(event.target)) {
        clearSelection();
      }
    };
    document.addEventListener('mousedown', handleOutsideSelectionClick);
    document.addEventListener('touchstart', handleOutsideSelectionClick, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleOutsideSelectionClick);
      document.removeEventListener('touchstart', handleOutsideSelectionClick);
    };
  }, [dragRange, selectedMonthKey]);
  if (loading) return <section className="pt-28 pb-16"><div className={WIDE_WRAP}><p className="text-sm text-navy-900/60">Loading fund details...</p></div></section>;
  if (!fund || fund.error) return <section className="pt-28 pb-16"><div className={WIDE_WRAP}><p className="text-sm text-rose-600">Fund not found.</p></div></section>;

  return (
    <section className="pt-28 pb-16">
      <div className={WIDE_WRAP}>
        {/* Mobile back arrow */}
        <div className="md:hidden mb-3">
          <Link to="/explore-funds" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900/70 hover:text-gold transition-colors">
            <ArrowLeft size={16} /> Back
          </Link>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl md:rounded-3xl p-2.5 sm:p-3 md:p-6">
          <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-5">
            <aside className="h-fit xl:rounded-2xl xl:border xl:border-gray-100 xl:p-4">
              {/* Mobile premium card */}
              <div className="md:hidden relative overflow-hidden rounded-2xl border border-[#e7dfd1] bg-gradient-to-b from-[#fffefb] to-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
                <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-navy-900 via-gold to-emerald-600" />
                <div className="pl-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-navy-900/45 font-bold">{fund.meta?.fund_house}</p>
                    <span className="inline-flex items-center rounded-full border border-navy-900/15 bg-[#f8f4ea] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-navy-900/70">
                      Regular
                    </span>
                  </div>
                  <h1 className="mt-2 text-[1.42rem] font-serif font-bold text-navy-900 leading-[1.16] break-words">{cleanName(fund.meta?.scheme_name)}</h1>
                  <p className="mt-1 text-sm text-navy-900/55 line-clamp-2">{fund.meta?.scheme_category}</p>

                  <div className="mt-3 rounded-xl border border-[#ece5d8] bg-[#fffdf8] p-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="min-w-0 rounded-lg bg-white/80 border border-[#efe9dc] p-2.5">
                        <p className="text-[9px] uppercase tracking-[0.12em] text-navy-900/45 font-bold">NAV</p>
                        <p className="mt-1 text-[1rem] leading-none font-bold text-navy-900 truncate sm:text-[1.1rem]">₹{INR.format(Number(fund.metrics?.latest_nav || 0))}</p>
                      </div>
                      <div className="min-w-0 rounded-lg bg-white/80 border border-[#efe9dc] p-2.5">
                        <p className="text-[9px] uppercase tracking-[0.12em] text-navy-900/45 font-bold">1Y</p>
                        <p className={`mt-1 text-[1rem] leading-none font-bold truncate sm:text-[1.1rem] ${pctClass(fund.metrics?.returns_pct?.['1y'])}`}>{formatPct(fund.metrics?.returns_pct?.['1y'])}</p>
                      </div>
                      <div className="min-w-0 rounded-lg bg-white/80 border border-[#efe9dc] p-2.5 col-span-2">
                        <p className="text-[9px] uppercase tracking-[0.12em] text-navy-900/45 font-bold">Since Inc.</p>
                        <p className={`mt-1 text-[1rem] leading-none font-bold truncate sm:text-[1.1rem] ${pctClass(inceptionCagr)}`}>{formatPct(inceptionCagr)}</p>
                      </div>
                    </div>
                    <p className="mt-2.5 text-[11px] text-navy-900/55">Data updated: {fund.metrics?.latest_date || 'NA'}</p>
                  </div>

                </div>
              </div>

              {/* Desktop original */}
              <div className="hidden md:block">
                <p className="text-[11px] uppercase tracking-widest text-navy-900/45 font-bold">{fund.meta?.fund_house}</p>
                <h1 className="mt-1 text-2xl font-serif font-bold text-navy-900 leading-tight">{cleanName(fund.meta?.scheme_name)}</h1>
                <p className="mt-1 text-sm text-navy-900/55">{fund.meta?.scheme_category}</p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-1 gap-2">
                  <div className="rounded-xl border border-gray-100 p-3">
                    <p className="text-[11px] uppercase tracking-widest text-navy-900/45 font-bold">Latest NAV</p>
                    <p className="mt-1 text-2xl md:text-3xl font-bold text-navy-900">₹{INR.format(Number(fund.metrics?.latest_nav || 0))}</p>
                    <p className="mt-1 text-sm text-navy-900/55">As of: {fund.metrics?.latest_date || 'NA'}</p>
                  </div>
                  <div className="rounded-xl border border-gray-100 p-3">
                    <p className="text-[11px] uppercase tracking-widest text-navy-900/45 font-bold">1Y Return</p>
                    <p className={`mt-1 text-xl md:text-2xl font-bold ${pctClass(fund.metrics?.returns_pct?.['1y'])}`}>{formatPct(fund.metrics?.returns_pct?.['1y'])}</p>
                  </div>
                  <div className="rounded-xl border border-gray-100 p-3">
                    <p className="text-[11px] uppercase tracking-widest text-navy-900/45 font-bold">CAGR (Since Inception)</p>
                    <p className={`mt-1 text-xl md:text-2xl font-bold ${pctClass(inceptionCagr)}`}>{formatPct(inceptionCagr)}</p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-[#e8dcc5] bg-gradient-to-b from-[#fffdf8] to-[#fdf8ee] p-3.5 space-y-2">
                  <p className="text-[11px] leading-relaxed text-navy-900/60">Mutual Fund investments are subject to market risks, read all scheme related documents carefully.</p>
                  <p className="text-[11px] leading-relaxed text-navy-900/60">Past performance may or may not be sustained in future.</p>
                </div>

              </div>
            </aside>

            <div ref={chartInteractionRef} className="rounded-2xl border border-gray-100 p-3 md:p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="grid grid-cols-3 md:flex md:flex-wrap items-start gap-4 md:gap-8 w-full xl:w-auto">
                  <div>
                    <p className="text-sm font-semibold text-navy-900/75">High</p>
                    <p className="text-lg md:text-xl leading-tight font-bold text-navy-900">₹{rangeStats.high === null ? 'NA' : INR.format(rangeStats.high)}</p>
                    <p className="text-[12px] text-navy-900/55">{rangeStats.highDate || 'NA'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-900/75">Low</p>
                    <p className="text-lg md:text-xl leading-tight font-bold text-navy-900">₹{rangeStats.low === null ? 'NA' : INR.format(rangeStats.low)}</p>
                    <p className="text-[12px] text-navy-900/55">{rangeStats.lowDate || 'NA'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-900/75">{topMetric.label}</p>
                    <p className={`text-lg md:text-xl leading-tight font-bold ${pctClass(topMetric.value)}`}>{formatPct(topMetric.value)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 w-full xl:w-auto">
                  <div className="inline-flex rounded-lg border border-gray-200 overflow-x-auto max-w-full">
                    {PERIODS.map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          setPeriod(p);
                          setDragRange(null);
                        }}
                        className={`px-2.5 md:px-3 py-2 text-xs md:text-sm font-bold border-r last:border-r-0 whitespace-nowrap ${period === p ? 'bg-navy-900 text-white' : 'bg-white text-navy-900/75 hover:bg-[#FAF9F6]'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 h-[320px] md:h-[460px]">
                <Line
                  ref={detailChartRef}
                  data={chartData}
                  options={chartOptions}
                  onMouseDown={isMobileView ? undefined : handleChartMouseDown}
                  onMouseMove={isMobileView ? undefined : handleChartMouseMove}
                  onMouseUp={isMobileView ? undefined : stopDragging}
                  onMouseLeave={isMobileView ? undefined : stopDragging}
                  onPointerDown={isMobileView ? undefined : handleChartMouseDown}
                  onPointerMove={isMobileView ? undefined : handleChartMouseMove}
                  onPointerUp={isMobileView ? undefined : stopDragging}
                  onPointerCancel={isMobileView ? undefined : stopDragging}
                />
              </div>
              <div className="mt-3 hidden md:block">
                <div className={`relative h-2 rounded-full ${ribbonTrackClass}`} style={{ marginLeft: `${plotOffsets.left}px`, marginRight: `${plotOffsets.right}px` }}>
                  {rangeSegments.map((m) => {
                    const den = Math.max(chartRows.length - 1, 1);
                    const leftPct = (m.startIdx / den) * 100;
                    const rightPct = (m.endIdx / den) * 100;
                    const widthPct = Math.max(rightPct - leftPct, 0.8);
                    return (
                      <button
                        key={m.key}
                        onClick={() => setSelectedMonthKey((prev) => (prev === m.key ? '' : m.key))}
                        title={m.label}
                        className={`absolute top-0 h-2 transition-colors ${selectedMonthKey === m.key ? 'bg-navy-900' : `bg-transparent ${ribbonHoverClass}`}`}
                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                      />
                    );
                  })}
                </div>
                <div className="mt-3 grid gap-2 text-[11px] text-navy-900/65" style={{ gridTemplateColumns: `repeat(${Math.max(rangeSegments.length, 1)}, minmax(0, 1fr))`, marginLeft: `${plotOffsets.left}px`, marginRight: `${plotOffsets.right}px` }}>
                  {rangeSegments.map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setSelectedMonthKey((prev) => (prev === m.key ? '' : m.key))}
                      className={`text-center truncate px-1 ${selectedMonthKey === m.key ? 'text-navy-900 font-semibold' : ''}`}
                      title={m.label}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Mobile disclaimer */}
          <div className="md:hidden mt-4 rounded-xl border border-[#e8dcc5] bg-gradient-to-b from-[#fffdf8] to-[#fdf8ee] p-3.5 space-y-2">
            <p className="text-[11px] leading-relaxed text-navy-900/60">Mutual Fund investments are subject to market risks, read all scheme related documents carefully.</p>
            <p className="text-[11px] leading-relaxed text-navy-900/60">Past performance may or may not be sustained in future.</p>
            <p className="text-[11px] leading-relaxed text-navy-900/60">Investments made through RupyaNivesh are under the Regular Plan, under which RupyaNivesh may receive distributor commission.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
const ExploreFundsPage = () => {
  const { schemeCode } = useParams();
  if (schemeCode) return <DetailView schemeCode={schemeCode} />;
  return <ScreenerView />;
};

export default ExploreFundsPage;
