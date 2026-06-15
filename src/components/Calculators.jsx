import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import {
  TrendingUpDown,
  CalendarDays,
  ArrowRight,
  ChevronLeft,
  Sparkles,
  Info,
  ChevronDown,
  PiggyBank,
  HandCoins,
  WalletCards,
  Repeat2,
  TrendingUp,
  AlarmClock,
  Scale,
  GraduationCap,
  Armchair,
  Gem,
  House,
  Car,
  Plane,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarController,
  LineController
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarController,
  LineController
);

const INR_SYMBOL = '\u20B9';

const formatCurrency = (val, full = false) => {
  if (!full) {
    if (val >= 10000000) {
      return `${INR_SYMBOL} ${(val / 10000000).toFixed(2)} Cr`;
    } else if (val >= 100000) {
      return `${INR_SYMBOL} ${(val / 100000).toFixed(2)} L`;
    }
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
};

const numberToWords = (n) => {
  if (!Number.isFinite(n) || n < 0) return '';
  if (n === 0) return 'Zero';
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const twoDigits = (num) => {
    if (num < 20) return ones[num];
    return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
  };
  const threeDigits = (num) => {
    if (num === 0) return '';
    if (num < 100) return twoDigits(num);
    return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + twoDigits(num % 100) : '');
  };
  const num = Math.round(n);
  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const rest = num % 1000;
  const parts = [];
  if (crore) parts.push(threeDigits(crore) + ' Crore' + (crore > 1 ? 's' : ''));
  if (lakh) parts.push(threeDigits(lakh) + ' Lakh' + (lakh > 1 ? 's' : ''));
  if (thousand) parts.push(threeDigits(thousand) + ' Thousand');
  if (rest) parts.push(threeDigits(rest));
  const result = parts.join(' ');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const GrowthChart = ({
  data = [],
  chartType = 'Bar',
  title = 'Total Value',
  investedLabel = 'Invested',
  growthLabel = 'Returns'
}) => {
  const labels = data.map(d => `Y${d.year}`);
  const investedData = data.map(d => d.invested);
  const growthData = data.map(d => d.total - d.invested);
  const totalData = data.map(d => d.total);

  const isBar = chartType === 'Bar';
  const isArea = chartType === 'Area';

  // Legacy Theme Colors
  const investedColor = '#1E293B'; // Navy 800
  const growthColor = '#5DBF8A';   // Emerald
  const totalLineColor = '#0EA5E9'; // Sky Blue (for contrast on light)

  const datasets = [
    {
      type: isBar ? 'bar' : 'line',
      label: investedLabel,
      data: investedData,
      backgroundColor: isArea ? investedColor + '20' : investedColor,
      borderColor: investedColor,
      borderWidth: isBar ? 0 : 3,
      fill: isArea ? 'origin' : false,
      stack: 's1',
      tension: 0.4,
      pointRadius: isBar ? 0 : 4,
      borderRadius: isBar ? 4 : 0,
      hoverBackgroundColor: '#2D3748', // Brighter Navy
      hoverBorderWidth: 2,
      hoverBorderColor: '#CBD5E0',
    },
    {
      type: isBar ? 'bar' : 'line',
      label: growthLabel,
      data: growthData,
      backgroundColor: isArea ? growthColor + '20' : growthColor,
      borderColor: growthColor,
      borderWidth: isBar ? 0 : 3,
      fill: isArea ? 'origin' : false,
      stack: 's1',
      tension: 0.4,
      pointRadius: isBar ? 0 : 4,
      borderRadius: isBar ? 4 : 0,
      hoverBackgroundColor: '#48BB78', // Brighter Emerald
      hoverBorderWidth: 2,
      hoverBorderColor: '#CBD5E0',
    },
    {
      type: 'line',
      label: title,
      data: totalData,
      borderColor: totalLineColor,
      borderWidth: 2,
      borderDash: [5, 5],
      pointRadius: 3,
      pointBackgroundColor: '#FFFFFF',
      pointBorderColor: totalLineColor,
      hoverPointRadius: 6,
      hoverPointBackgroundColor: totalLineColor,
      fill: false,
      tension: 0.4,
    }
  ];

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    hover: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          boxHeight: 6,
          color: '#64748B',
          font: { size: 11, weight: '600' },
          padding: 20,
          pointStyleWidth: 10
        }
      },
      tooltip: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        titleColor: '#1E293B',
        bodyColor: '#475569',
        padding: 12,
        cornerRadius: 8,
        mode: 'index',
        intersect: false,
        usePointStyle: true,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
        }
      }
    },
    scales: {
      y: {
        stacked: isBar,
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.04)', drawBorder: false },
        ticks: {
          color: '#94A3B8',
          font: { size: 12, weight: '600' },
          callback: (v) => formatCurrency(v).replace(INR_SYMBOL, '').trim()
        }
      },
      x: {
        stacked: isBar,
        grid: { display: false },
        ticks: {
          color: '#94A3B8',
          font: { size: 12, weight: '600' },
          autoSkip: true,
          maxTicksLimit: 12
        }
      }
    }
  };

  const hoverHighlightPlugin = {
    id: 'hoverHighlight',
    afterDraw: (chart) => {
      if (chart.tooltip?._active?.length) {
        const { ctx, chartArea: { top, bottom }, scales: { x } } = chart;
        const activePoint = chart.tooltip._active[0];
        const xPos = activePoint.element.x;
        const width = (x.getPixelForValue(1) - x.getPixelForValue(0)) * 0.8;

        ctx.save();
        ctx.fillStyle = 'rgba(201, 168, 76, 0.05)';
        ctx.fillRect(xPos - width / 2, top, width, bottom - top);
        ctx.restore();
      }
    }
  };

  return (
    <div className="w-full h-full min-h-[380px]">
       <Chart 
         type="bar" 
         data={{ labels, datasets }} 
         options={options} 
         plugins={[hoverHighlightPlugin]} 
       />
    </div>
  );
};

const BreakdownTable = ({
  data = [],
  investedLabel = 'Invested Amount',
  growthLabel = 'Est. Returns'
}) => {
  const rows = data;

  return (
    <div className="h-full flex flex-col">
      <div className="overflow-hidden border border-gray-100 rounded-xl flex-1 bg-white flex flex-col">
        <div className="overflow-y-auto overflow-x-auto custom-scrollbar flex-1 max-h-[245px] lg:max-h-none">
          <table className="w-full text-left border-collapse min-w-full">
            <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-gray-400 whitespace-nowrap">Year</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-gray-400 whitespace-nowrap">{investedLabel}</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-gray-400 whitespace-nowrap">{growthLabel}</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-gray-500 font-bold whitespace-nowrap">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.year} className="hover:bg-gray-50/50 border-b border-gray-50 last:border-0 transition-colors">
                  <td className="px-4 py-2.5 text-xs font-bold text-navy-900/60 whitespace-nowrap text-left">Year {row.year}</td>
                  <td className="px-4 py-2.5 text-xs font-medium text-gray-600 whitespace-nowrap">
                    {formatCurrency(row.invested, true)}
                  </td>
                  <td className="px-4 py-2.5 text-xs font-semibold text-emerald-600 whitespace-nowrap">
                    {formatCurrency(row.total - row.invested, true)}
                  </td>
                  <td className="px-4 py-2.5 text-xs font-bold text-navy-900 whitespace-nowrap">
                    {formatCurrency(row.total, true)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const LeadForm = ({ title }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-navy-900 rounded-[32px] p-8 mt-12 shadow-2xl shadow-navy-900/40 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <h4 className="text-2xl font-serif font-black text-white mb-2 relative z-10">{title}</h4>
      <p className="text-navy-200 text-xs mb-8 relative z-10">Book a consultation session with our experts.</p>

      <form className="space-y-4 relative z-10" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text" placeholder="Full Name *"
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-navy-400 focus:border-gold/50 outline-none transition-colors"
        />
        <input
          type="email" placeholder="Your Email *"
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-navy-400 focus:border-gold/50 outline-none transition-colors"
        />
        <input
          type="tel" placeholder="Your Number *"
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-navy-400 focus:border-gold/50 outline-none transition-colors"
        />
        <textarea
          placeholder="Write Your Message"
          rows="3"
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-navy-400 focus:border-gold/50 outline-none transition-colors resize-none"
        />

        <button className="btn-primary w-full bg-gold border-none text-navy-900 py-5 font-black hover:bg-[#D4B069] mt-4 shadow-xl shadow-gold/10">
          Contact Now
        </button>
      </form>
    </motion.div>
  );
};

const FormulaBox = ({ formula }) => {
  if (!formula) return null;
  return (
    <div className="mt-12 group">
      <div className="flex items-center gap-3 mb-6">
        <h4 id="issue-calculator-formula-used" className="text-[10px] font-black uppercase tracking-[0.3em] text-navy-900/30">Formula Used</h4>
      </div>
      <div className="bg-white border border-gray-100 rounded-[32px] p-2 shadow-sm overflow-hidden">
        <div className="bg-navy-900 rounded-[26px] p-5 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10">
            <div className="text-gold font-bold mb-6 text-[11px] uppercase tracking-[0.2em] opacity-80">{formula.label}</div>
            <div className="text-lg md:text-3xl text-white font-serif mb-8 leading-relaxed tracking-wide">
              {formula.equation}
            </div>

            <div className="grid md:grid-cols-2 gap-4 md:gap-8 pt-8 border-t border-white/10">
              <div className="space-y-3">
                <div className="text-[10px] uppercase tracking-widest text-gold/60 font-black mb-4">Variable Definitions</div>
                {formula.details.map((detail, i) => (
                  <div key={i} className="flex gap-2 text-[13px] text-white/70 font-medium">
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 content-start pt-4 md:pt-10">
                {formula.chips.map((chip, i) => (
                  <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-white/40 uppercase tracking-widest hover:border-gold/30 hover:text-gold transition-colors">
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQItem = ({ q, a, isOpen, onClick }) => (
  <div className="border-b border-gray-100 last:border-0">
    <button
      onClick={onClick}
      className="w-full py-6 flex items-center justify-between group text-left transition-all"
    >
      <span className={`text-[15px] font-bold tracking-tight transition-colors ${isOpen ? 'text-gold' : 'text-navy-900 group-hover:text-gold'}`}>
        {q}
      </span>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-gold text-white rotate-180' : 'bg-gray-50 text-gray-400 group-hover:bg-gold/10 group-hover:text-gold'}`}>
        <ChevronDown size={16} />
      </div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="pb-8 pr-12 text-navy-900/60 text-[14px] leading-relaxed font-medium">
            {a.split('\n').map((line, i) => (
              <p key={i} className={i > 0 ? "mt-4" : ""}>
                {line.split('**').map((part, j) => (
                  j % 2 === 1 ? <strong key={j} className="text-navy-900 font-bold">{part}</strong> : part
                ))}
              </p>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQSection = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(0);
  if (!faqs) return null;

  return (
    <div className="mt-16">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-1.5 h-8 bg-gold rounded-full" />
        <h4 id="issue-calculator-faq-heading" className="text-3xl font-serif font-bold text-navy-900">Frequently Asked Questions</h4>
      </div>
      <div className="bg-white border border-gray-100 rounded-[40px] px-4 md:px-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
        {faqs.map((faq, i) => (
          <FAQItem
            key={i}
            {...faq}
            isOpen={openIndex === i}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </div>
  );
};

const formatWithCommas = (v) => {
  if (!Number.isFinite(Number(v))) return String(v);
  return Number(v).toLocaleString('en-IN');
};

const CalculatorInput = ({ label, value, min, max, step, unit, onChange, isCurrency = false }) => {
  const [draft, setDraft] = useState(String(value ?? ''));
  const [isEditing, setIsEditing] = useState(false);
  const isNumeric = isCurrency || (!unit || unit === '%');

  const formatRangeValue = (v) => {
    if (!Number.isFinite(v)) return '';
    if (isCurrency || unit === '\u20B9') return formatCurrency(v, true);
    return `${v}${unit ? ` ${unit}` : ''}`;
  };

  useEffect(() => {
    if (!isEditing) setDraft(String(value ?? ''));
  }, [value, isEditing]);

  const commitDraft = () => {
    const raw = String(draft ?? '').replace(/,/g, '').trim();
    if (!raw) {
      setDraft(String(value ?? ''));
      return;
    }
    let val = Number(raw);
    if (!Number.isFinite(val)) {
      setDraft(String(value ?? ''));
      return;
    }
    if (Number.isFinite(min)) val = Math.max(min, val);
    if (Number.isFinite(max)) val = Math.min(max, val);
    onChange(val);
    setDraft(String(val));
  };

  const handleChange = (e) => {
    const raw = e.target.value.replace(/,/g, '');
    if (raw === '' || raw === '-' || raw === '.') {
      setDraft(raw);
      return;
    }
    const val = Number(raw);
    if (!Number.isFinite(val)) return;
    // Only clamp to max while typing (so overshooting snaps immediately)
    // Min clamping happens on blur via commitDraft
    const clamped = Number.isFinite(max) ? Math.min(max, val) : val;
    setDraft(String(clamped));
    onChange(Math.max(Number.isFinite(min) ? min : -Infinity, clamped));
  };

  const displayValue = isEditing || !isCurrency ? draft : formatWithCommas(value);

  // Square-root scale for currency sliders: smooth and uniform feel across all ranges
  const useSqrt = isCurrency && Number.isFinite(min) && Number.isFinite(max) && min >= 0;
  const SQRT_STEPS = 1000;
  const toSqrt = (v) => {
    const sqMin = Math.sqrt(min);
    const sqMax = Math.sqrt(max);
    return Math.round(((Math.sqrt(Math.max(min, Math.min(max, v))) - sqMin) / (sqMax - sqMin)) * SQRT_STEPS);
  };
  const fromSqrt = (s) => {
    const sqMin = Math.sqrt(min);
    const sqMax = Math.sqrt(max);
    const raw = Math.pow(sqMin + (s / SQRT_STEPS) * (sqMax - sqMin), 2);
    return Math.min(max, Math.max(min, Math.round(raw / step) * step));
  };

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-[20px] p-4 space-y-2 group transition-all hover:bg-white hover:border-gold/20 hover:shadow-sm">
      <label className="text-sm font-semibold text-gray-500 group-hover:text-gold transition-colors">{label}</label>
      <div className="relative">
        {unit === INR_SYMBOL && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-900/40 font-sans font-bold text-sm">{INR_SYMBOL}</span>}
        {unit === '%' ? (
          <div className="relative bg-white border border-gray-50 rounded-xl shadow-sm px-4 py-2 focus-within:border-gold/30 transition-all">
            <span className="invisible whitespace-pre font-sans font-black text-base lg:text-lg">{displayValue}</span>
            <span className="text-navy-900 font-sans font-black text-base lg:text-lg">%</span>
            <input
              type="text"
              inputMode="decimal"
              value={displayValue}
              onChange={handleChange}
              onFocus={() => setIsEditing(true)}
              onBlur={() => { setIsEditing(false); commitDraft(); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  commitDraft();
                  setIsEditing(false);
                  const inputs = Array.from(document.querySelectorAll('input[type="text"], input[type="number"]'));
                  const idx = inputs.indexOf(e.currentTarget);
                  if (idx >= 0 && idx < inputs.length - 1) inputs[idx + 1].focus();
                  else e.currentTarget.blur();
                }
              }}
              className="absolute inset-0 bg-transparent outline-none text-navy-900 font-sans font-black text-base lg:text-lg px-4 py-2 w-full"
            />
          </div>
        ) : (
          <input
            type="text"
            inputMode={isCurrency ? 'numeric' : 'decimal'}
            value={displayValue}
            onChange={handleChange}
            onFocus={() => setIsEditing(true)}
            onBlur={() => {
              setIsEditing(false);
              commitDraft();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                commitDraft();
                setIsEditing(false);
                const inputs = Array.from(document.querySelectorAll('input[type="text"], input[type="number"]'));
                const idx = inputs.indexOf(e.currentTarget);
                if (idx >= 0 && idx < inputs.length - 1) inputs[idx + 1].focus();
                else e.currentTarget.blur();
              }
            }}
            className={`w-full bg-white border border-gray-50 rounded-xl py-2 ${unit === INR_SYMBOL ? 'pl-8' : 'px-4'} pr-4 text-navy-900 font-sans font-black text-base lg:text-lg outline-none focus:border-gold/30 transition-all shadow-sm`}
          />
        )}
      </div>
      <div className="relative h-1.5 flex items-center pt-1">
        <div className="absolute w-full h-1 bg-gray-100 rounded-full" />
        <input
          type="range"
          min={useSqrt ? 0 : min}
          max={useSqrt ? SQRT_STEPS : max}
          step={useSqrt ? 1 : step}
          value={useSqrt ? toSqrt(value) : value}
          onChange={(e) => onChange(useSqrt ? fromSqrt(Number(e.target.value)) : Number(e.target.value))}
          className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer accent-gold z-10"
        />
      </div>
      {isCurrency && value > 0 && (
        <p className="text-sm italic font-medium text-emerald-600 mt-1 tracking-wider">{numberToWords(value)}</p>
      )}
    </div>
  );
};
const SIPCalculator = () => {
  const [frequency, setFrequency] = useState('Monthly'); // 'Monthly', 'Quarterly', 'Yearly'
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);
  const [result, setResult] = useState({ invested: 0, gains: 0, total: 0 });
  const [viewMode, setViewMode] = useState('chart'); // 'chart' | 'table'
  const [chartType, setChartType] = useState('Bar'); // 'Bar' | 'Area' | 'Column' | 'Line' | 'Line Column'
  const [progression, setProgression] = useState([]);

  useEffect(() => {
    const r = rate / 100;
    const m = frequency === 'Monthly' ? 12 : frequency === 'Quarterly' ? 4 : 1;
    const i = r / m;
    const p = amount;
    
    const newProgression = [];
    for (let y = 1; y <= years; y++) {
      const n = y * m;
      const tot = p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      const inv = p * n;
      newProgression.push({ 
        year: y, 
        invested: Math.round(inv), 
        total: Math.round(tot) 
      });
    }

    setProgression(newProgression);
    const last = newProgression[newProgression.length - 1] || { invested: 0, total: 0 };
    setResult({
      invested: last.invested,
      gains: last.total - last.invested,
      total: last.total
    });
  }, [amount, rate, years, frequency]);

  const investedPct = result.total > 0 ? Math.round((result.invested / result.total) * 100) : 0;
  const gainsPct = 100 - investedPct;

  return (
    <div className="flex flex-col lg:flex-row min-h-[500px]">
      {/* Left: Inputs */}
      <div className="lg:w-[45%] p-6 lg:p-8 space-y-6 border-r border-gray-50 flex flex-col">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-sans font-black text-navy-900">SIP Calculator</h3>
          </div>

          {/* Frequency Toggle */}
          <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1">
            {['Monthly', 'Quarterly', 'Yearly'].map(f => (
              <button
                key={f}
                onClick={() => setFrequency(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${frequency === f ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400 hover:text-navy-900'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 flex-1">
          <CalculatorInput
            label={`${frequency} Investment`}
            value={amount} min={500} max={200000} step={500} unit={INR_SYMBOL} isCurrency
            onChange={setAmount}
          />
          <CalculatorInput
            label="Expected Returns (%)"
            value={rate} min={2} max={13} step={0.5} unit="%"
            onChange={setRate}
          />
          <CalculatorInput
            label="Investment Duration (Years)"
            value={years} min={1} max={40} step={1} unit="Yr"
            onChange={setYears}
          />
        </div>
        <div className="lg:hidden mt-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-2 border border-gray-100 shadow-sm transition-all text-center">
              <div className="text-xs font-semibold text-gray-400 mb-1 leading-none">Invested</div>
              <div className="text-[12px] font-sans font-black text-navy-900/80">{formatCurrency(result.invested)}</div>
            </div>
            <div className="bg-white rounded-xl p-2 border border-gray-100 shadow-sm transition-all text-center">
              <div className="text-xs font-semibold text-gray-400 mb-1 leading-none">Est. Returns</div>
              <div className="text-[12px] font-sans font-black text-[#00C896]">{formatCurrency(result.gains)}</div>
            </div>
            <div className="bg-white rounded-xl p-2 border border-navy-900/5 shadow-inner transition-all text-center bg-gray-50/10">
              <div className="text-xs font-semibold text-navy-900/40 mb-1 leading-none">Total Value</div>
              <div className="text-[14px] font-sans font-black text-navy-900">{formatCurrency(result.total)}</div>
            </div>
          </div>
        </div>
        <Link to="/contact" className="w-full bg-navy-900 text-white font-bold py-4 rounded-xl mt-4 hover:bg-gold transition-all duration-300 shadow-lg shadow-navy-900/10 active:scale-[0.98] text-sm text-center block">Contact Us</Link>
      </div>

      {/* Right: Visualization */}
      <div className="flex-1 p-6 lg:p-8 bg-gray-50/20 flex flex-col gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-2 flex-1">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-400 mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-sm bg-navy-700" />
                  <span>Invested <span className="text-navy-900 ml-1">{investedPct}%</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Est. Returns <span className="text-[#00C896] ml-1">{gainsPct}%</span></span>
                  <div className="w-2 h-2 rounded-sm bg-[#00C896]" />
                </div>
              </div>
              <div className="h-1 rounded-full bg-gray-100 flex overflow-hidden">
                <div className="h-full bg-navy-700 transition-all duration-500" style={{ width: `${investedPct}%` }} />
                <div className="h-full bg-[#00C896] transition-all duration-500" style={{ width: `${gainsPct}%` }} />
              </div>
            </div>

            {/* View & Chart Mode Toggles */}
            <div className="flex items-center gap-3 ml-0 lg:ml-6 self-start lg:-translate-y-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex p-1">
                <button
                  onClick={() => setViewMode('chart')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'chart' ? 'bg-gold text-white shadow-sm' : 'bg-amber-50 text-amber-500 hover:bg-amber-100'}`}
                >
                  <TrendingUpDown size={18} />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-gold text-white shadow-sm' : 'bg-amber-50 text-amber-500 hover:bg-amber-100'}`}
                >
                  <CalendarDays size={18} />
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {viewMode === 'chart' && (
              <motion.div
                key="charts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2 bg-white/60 p-1.5 rounded-xl border border-gray-100 w-fit"
              >
                <span className="text-sm font-semibold text-gray-500 px-2">Charts:</span>
                {['Bar', 'Area'].map(type => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${chartType === type ? 'bg-white text-emerald-600 shadow-sm border border-emerald-50' : 'text-gray-400 hover:text-navy-900 border border-transparent'}`}
                  >
                    {type}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 min-h-[300px]">
          {viewMode === 'chart' ? (
            <GrowthChart
              data={progression}
              chartType={chartType}
            />
          ) : (
            <BreakdownTable
              data={progression}
            />
          )}
        </div>

        <div className="hidden lg:grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-2 lg:p-3 border border-gray-100 shadow-sm transition-all text-center">
            <div className="text-xs font-semibold text-gray-400 mb-1 leading-none">Invested</div>
            <div className="text-sm lg:text-lg font-sans font-black text-navy-900/80">{formatCurrency(result.invested)}</div>
          </div>
          <div className="bg-white rounded-xl p-2 lg:p-3 border border-gray-100 shadow-sm transition-all text-center">
            <div className="text-xs font-semibold text-gray-400 mb-1 leading-none">Est. Returns</div>
            <div className="text-sm lg:text-lg font-sans font-black text-[#00C896]">{formatCurrency(result.gains)}</div>
          </div>
          <div className="bg-white rounded-xl p-2 lg:p-3 border border-navy-900/5 shadow-inner transition-all text-center bg-gray-50/10">
            <div className="text-xs font-semibold text-navy-900/40 mb-1 leading-none">Total Value</div>
            <div className="text-lg lg:text-2xl font-sans font-black text-navy-900 whitespace-nowrap">{formatCurrency(result.total, true)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LumpsumCalculator = () => {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [result, setResult] = useState({ invested: 0, gains: 0, total: 0 });
  const [viewMode, setViewMode] = useState('chart');
  const [chartType, setChartType] = useState('Bar');

  const [progression, setProgression] = useState([]);

  useEffect(() => {
    const r = rate / 100;
    const newProgression = [];
    for (let y = 1; y <= years; y++) {
      const tot = amount * Math.pow(1 + r, y);
      newProgression.push({ 
        year: y, 
        invested: amount, 
        total: Math.round(tot) 
      });
    }
    setProgression(newProgression);
    const last = newProgression[newProgression.length - 1] || { total: amount };
    setResult({
      invested: amount,
      gains: last.total - amount,
      total: last.total
    });
  }, [amount, rate, years]);

  const investedPct = result.total > 0 ? Math.round((result.invested / result.total) * 100) : 0;
  const gainsPct = 100 - investedPct;

  return (
    <div className="flex flex-col lg:flex-row min-h-[500px]">
      {/* Left: Inputs */}
      <div className="lg:w-[45%] p-6 lg:p-8 space-y-6 border-r border-gray-50 flex flex-col">
        <div>
          <h3 className="text-xl font-sans font-black text-navy-900">Lumpsum Calculator</h3>
        </div>
        <div className="space-y-4 flex-1">
          <CalculatorInput
            label="Total Investment"
            value={amount} min={5000} max={10000000} step={1000} unit={INR_SYMBOL} isCurrency
            onChange={setAmount}
          />
          <CalculatorInput
            label="Expected Returns (%)"
            value={rate} min={2} max={13} step={0.5} unit="%"
            onChange={setRate}
          />
          <CalculatorInput
            label="Investment Duration (Years)"
            value={years} min={1} max={40} step={1} unit="Yr"
            onChange={setYears}
          />
        </div>
        <div className="lg:hidden mt-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-2 border border-gray-100 shadow-sm transition-all text-center">
              <div className="text-xs font-semibold text-gray-400 mb-1 leading-none">Principal</div>
              <div className="text-[12px] font-sans font-black text-navy-900/80">{formatCurrency(result.invested)}</div>
            </div>
            <div className="bg-white rounded-xl p-2 border border-gray-100 shadow-sm transition-all text-center">
              <div className="text-xs font-semibold text-gray-400 mb-1 leading-none">Est. Gains</div>
              <div className="text-[12px] font-sans font-black text-[#00C896]">{formatCurrency(result.gains)}</div>
            </div>
            <div className="bg-white rounded-xl p-2 border border-navy-900/5 shadow-inner transition-all text-center bg-gray-50/10">
              <div className="text-xs font-semibold text-navy-900/40 mb-1 leading-none">Future Value</div>
              <div className="text-[14px] font-sans font-black text-navy-900">{formatCurrency(result.total)}</div>
            </div>
          </div>
        </div>
        <Link to="/contact" className="w-full bg-navy-900 text-white font-bold py-4 rounded-xl mt-4 hover:bg-gold transition-all duration-300 shadow-lg shadow-navy-900/10 active:scale-[0.98] text-sm text-center block">Contact Us</Link>
      </div>

      {/* Right: Visualization */}
      <div className="flex-1 p-6 lg:p-8 bg-gray-50/20 flex flex-col gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start xl:items-center flex-col xl:flex-row gap-4">
            <div className="space-y-2 w-full xl:flex-1">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-sm bg-navy-700" />
                  <span>Principal <span className="text-navy-900 ml-1">{investedPct}%</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Est. Gains <span className="text-[#00C896] ml-1">{gainsPct}%</span></span>
                  <div className="w-2 h-2 rounded-sm bg-[#00C896]" />
                </div>
              </div>
              <div className="h-1 rounded-full bg-gray-100 flex overflow-hidden">
                <div className="h-full bg-navy-700 transition-all duration-500" style={{ width: `${investedPct}%` }} />
                <div className="h-full bg-[#00C896] transition-all duration-500" style={{ width: `${gainsPct}%` }} />
              </div>
            </div>

            <div className="flex items-center gap-3 ml-0 lg:ml-6 self-start lg:-translate-y-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex p-1">
                <button
                  onClick={() => setViewMode('chart')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'chart' ? 'bg-gold text-white shadow-sm' : 'bg-amber-50 text-amber-500 hover:bg-amber-100'}`}
                >
                  <TrendingUpDown size={18} />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-gold text-white shadow-sm' : 'bg-amber-50 text-amber-500 hover:bg-amber-100'}`}
                >
                  <CalendarDays size={18} />
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {viewMode === 'chart' && (
              <motion.div
                key="charts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2 bg-white/60 p-1.5 rounded-xl border border-gray-100 w-fit overflow-x-auto min-w-min"
              >
                <span className="text-sm font-semibold text-gray-500 px-2 hidden sm:inline">Charts:</span>
                {['Bar', 'Area'].map(type => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${chartType === type ? 'bg-white text-emerald-600 shadow-sm border border-emerald-50' : 'text-gray-400 hover:text-navy-900 border border-transparent'}`}
                  >
                    {type}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 min-h-[300px]">
          {viewMode === 'chart' ? (
            <GrowthChart
              data={progression}
              investedLabel="Principal"
              chartType={chartType}
            />
          ) : (
            <BreakdownTable
              data={progression}
              investedLabel="Principal"
              growthLabel="Est. Gains"
            />
          )}
        </div>

        <div className="hidden lg:grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-2 lg:p-3 border border-gray-100 shadow-sm transition-all text-center">
            <div className="text-xs font-semibold text-gray-400 mb-1 leading-none">Principal</div>
            <div className="text-sm lg:text-lg font-sans font-black text-navy-900/80">{formatCurrency(result.invested)}</div>
          </div>
          <div className="bg-white rounded-xl p-2 lg:p-3 border border-gray-100 shadow-sm transition-all text-center">
            <div className="text-xs font-semibold text-gray-400 mb-1 leading-none">Est. Gains</div>
            <div className="text-sm lg:text-lg font-sans font-black text-[#00C896]">{formatCurrency(result.gains)}</div>
          </div>
          <div className="bg-white rounded-xl p-2 lg:p-3 border border-navy-900/5 shadow-inner transition-all text-center bg-gray-50/10">
            <div className="text-xs font-semibold text-navy-900/40 mb-1 leading-none">Future Value</div>
            <div className="text-lg lg:text-2xl font-sans font-black text-navy-900 whitespace-nowrap">{formatCurrency(result.total, true)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RetirementCalculator = () => {
  const [monthly, setMonthly] = useState(20000);
  const [age, setAge] = useState(30);
  const [retireAge, setRetireAge] = useState(60);
  const [rate, setRate] = useState(12);
  const [result, setResult] = useState({ invested: 0, gains: 0, total: 0 });
  const [viewMode, setViewMode] = useState('chart');
  const [chartType, setChartType] = useState('Bar');

  const [progression, setProgression] = useState([]);

  useEffect(() => {
    const years = retireAge - age;
    if (years <= 0) return;
    const i = rate / 1200;
    const p = monthly;
    
    const newProgression = [];
    for (let y = 1; y <= years; y++) {
      const n = y * 12;
      const tot = p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      const inv = p * n;
      newProgression.push({ 
        year: y, 
        invested: Math.round(inv), 
        total: Math.round(tot) 
      });
    }
    setProgression(newProgression);
    const last = newProgression[newProgression.length - 1] || { invested: 0, total: 0 };
    setResult({
      invested: last.invested,
      gains: last.total - last.invested,
      total: last.total
    });
  }, [monthly, age, retireAge, rate]);

  const investedPct = result.total > 0 ? Math.round((result.invested / result.total) * 100) : 0;
  const gainsPct = 100 - investedPct;

  return (
    <div className="flex flex-col lg:flex-row min-h-[500px]">
      {/* Left: Inputs */}
      <div className="lg:w-[45%] p-6 lg:p-8 space-y-6 border-r border-gray-50 flex flex-col">
        <div>
          <h3 className="text-xl font-sans font-black text-navy-900">Retirement Goal Calculator</h3>
        </div>
        <div className="space-y-4 flex-1">
          <CalculatorInput
            label="Monthly Savings"
            value={monthly} min={2000} max={500000} step={1000} unit={INR_SYMBOL} isCurrency
            onChange={setMonthly}
          />
          <div className="grid grid-cols-2 gap-4">
            <CalculatorInput
              label="Current Age"
              value={age} min={18} max={60} step={1} unit="Yrs"
              onChange={setAge}
            />
            <CalculatorInput
              label="Retirement Age"
              value={retireAge} min={age + 1} max={75} step={1} unit="Yrs"
              onChange={setRetireAge}
            />
          </div>
          <CalculatorInput
            label="Expected Returns (%)"
            value={rate} min={2} max={13} step={0.5} unit="%"
            onChange={setRate}
          />
        </div>
        <div className="lg:hidden mt-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-2 border border-gray-100 shadow-sm transition-all text-center">
              <div className="text-xs font-semibold text-gray-400 mb-1 leading-none">Savings</div>
              <div className="text-[12px] font-sans font-black text-navy-900/80">{formatCurrency(result.invested)}</div>
            </div>
            <div className="bg-white rounded-xl p-2 border border-gray-100 shadow-sm transition-all text-center">
              <div className="text-xs font-semibold text-gray-400 mb-1 leading-none">Monthly Income</div>
              <div className="text-[12px] font-sans font-black text-[#00C896]">{formatCurrency(result.total / 300)}</div>
            </div>
            <div className="bg-white rounded-xl p-2 border border-navy-900/5 shadow-inner transition-all text-center bg-gray-50/10">
              <div className="text-xs font-semibold text-navy-900/40 mb-1 leading-none">Total Corpus</div>
              <div className="text-[14px] font-sans font-black text-navy-900">{formatCurrency(result.total)}</div>
            </div>
          </div>
        </div>
        <Link to="/contact" className="w-full bg-navy-900 text-white font-bold py-4 rounded-xl mt-4 hover:bg-gold transition-all duration-300 shadow-lg shadow-navy-900/10 active:scale-[0.98] text-sm text-center block">Contact Us</Link>
      </div>

      {/* Right: Visualization */}
      <div className="flex-1 p-6 lg:p-8 bg-gray-50/20 flex flex-col gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start xl:items-center flex-col xl:flex-row gap-4">
            <div className="space-y-2 w-full xl:flex-1">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-sm bg-navy-700" />
                  <span>Savings <span className="text-navy-900 ml-1">{investedPct}%</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Est. Returns <span className="text-[#00C896] ml-1">{gainsPct}%</span></span>
                  <div className="w-2 h-2 rounded-sm bg-[#00C896]" />
                </div>
              </div>
              <div className="h-1 rounded-full bg-gray-100 flex overflow-hidden">
                <div className="h-full bg-navy-700 transition-all duration-500" style={{ width: `${investedPct}%` }} />
                <div className="h-full bg-[#00C896] transition-all duration-500" style={{ width: `${gainsPct}%` }} />
              </div>
            </div>

            <div className="flex items-center gap-3 ml-0 lg:ml-6 self-start lg:-translate-y-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex p-1">
                <button
                  onClick={() => setViewMode('chart')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'chart' ? 'bg-gold text-white shadow-sm' : 'bg-amber-50 text-amber-500 hover:bg-amber-100'}`}
                >
                  <TrendingUpDown size={18} />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-gold text-white shadow-sm' : 'bg-amber-50 text-amber-500 hover:bg-amber-100'}`}
                >
                  <CalendarDays size={18} />
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {viewMode === 'chart' && (
              <motion.div
                key="charts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2 bg-white/60 p-1.5 rounded-xl border border-gray-100 w-fit overflow-x-auto min-w-min"
              >
                <span className="text-sm font-semibold text-gray-500 px-2 hidden sm:inline">Charts:</span>
                {['Bar', 'Area'].map(type => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${chartType === type ? 'bg-white text-emerald-600 shadow-sm border border-emerald-50' : 'text-gray-400 hover:text-navy-900 border border-transparent'}`}
                  >
                    {type}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 min-h-[300px]">
          {viewMode === 'chart' ? (
            <GrowthChart
              data={progression}
              chartType={chartType}
              title="Retirement Corpus"
            />
          ) : (
            <BreakdownTable
              data={progression}
              investedLabel="Principal"
              growthLabel="Est. Gains"
            />
          )}
        </div>

        <div className="hidden lg:grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-2 lg:p-3 border border-gray-100 shadow-sm transition-all text-center">
            <div className="text-xs font-semibold text-gray-400 mb-1 leading-none">Savings</div>
            <div className="text-sm lg:text-lg font-sans font-black text-navy-900/80">{formatCurrency(result.invested)}</div>
          </div>
          <div className="bg-white rounded-xl p-2 lg:p-3 border border-gray-100 shadow-sm transition-all text-center">
            <div className="text-xs font-semibold text-gray-400 mb-1 leading-none">Monthly Income</div>
            <div className="text-sm lg:text-lg font-sans font-black text-[#00C896]">{formatCurrency(result.total / 300)}</div>
          </div>
          <div className="bg-white rounded-xl p-2 lg:p-3 border border-navy-900/5 shadow-inner transition-all text-center bg-gray-50/10">
            <div className="text-xs font-semibold text-navy-900/40 mb-1 leading-none">Total Corpus</div>
            <div className="text-lg lg:text-2xl font-sans font-black text-navy-900 whitespace-nowrap">{formatCurrency(result.total, true)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InflationTracker = () => {
  const [expense, setExpense] = useState(50000);
  const [rate, setRate] = useState(6);
  const [years, setYears] = useState(10);
  const [result, setResult] = useState({ present: 0, increase: 0, future: 0 });
  const [viewMode, setViewMode] = useState('chart');
  const [chartType, setChartType] = useState('Bar');
  const [progression, setProgression] = useState([]);

  useEffect(() => {
    const newProgression = [];
    for (let y = 1; y <= years; y++) {
      const future = expense * Math.pow(1 + rate / 100, y);
      newProgression.push({ 
        year: y, 
        invested: expense, 
        total: Math.round(future) 
      });
    }
    setProgression(newProgression);
    const last = newProgression[newProgression.length - 1] || { total: expense };
    setResult({
      present: expense,
      increase: last.total - expense,
      future: last.total
    });
  }, [expense, rate, years]);

  const presentPct = result.future > 0 ? Math.round((result.present / result.future) * 100) : 0;
  const increasePct = 100 - presentPct;

  return (
    <div className="flex flex-col lg:flex-row min-h-[500px]">
      {/* Left: Inputs */}
      <div className="lg:w-[45%] p-6 lg:p-8 space-y-6 border-r border-gray-50 flex flex-col">
        <div>
          <h3 className="text-xl font-sans font-black text-navy-900">Inflation Calculator</h3>
        </div>
        <div className="space-y-4 flex-1">
          <CalculatorInput
            label="Monthly Expenses"
            value={expense} min={5000} max={1000000} step={5000} unit={INR_SYMBOL} isCurrency
            onChange={setExpense}
          />
          <CalculatorInput
            label="Inflation Rate (%)"
            value={rate} min={1} max={15} step={0.1} unit="%"
            onChange={setRate}
          />
          <CalculatorInput
            label="Time Horizon (Years)"
            value={years} min={1} max={40} step={1} unit="Yr"
            onChange={setYears}
          />
        </div>
        <div className="lg:hidden mt-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-2 border border-gray-100 shadow-sm transition-all text-center">
              <div className="text-xs font-semibold text-gray-400 mb-1 leading-none">Today</div>
              <div className="text-[12px] font-sans font-black text-navy-900/80">{formatCurrency(result.present)}</div>
            </div>
            <div className="bg-white rounded-xl p-2 border border-gray-100 shadow-sm transition-all text-center">
              <div className="text-xs font-semibold text-gray-400 mb-1 leading-none">Added Cost</div>
              <div className="text-[12px] font-sans font-black text-red-500">{formatCurrency(result.increase)}</div>
            </div>
            <div className="bg-white rounded-xl p-2 border border-navy-900/5 shadow-inner transition-all text-center bg-gray-50/10">
              <div className="text-xs font-semibold text-navy-900/40 mb-1 leading-none">Future Cost</div>
              <div className="text-[14px] font-sans font-black text-navy-900">{formatCurrency(result.future)}</div>
            </div>
          </div>
        </div>
        <Link to="/contact" className="w-full bg-navy-900 text-white font-bold py-4 rounded-xl mt-4 hover:bg-gold transition-all duration-300 shadow-lg shadow-navy-900/10 active:scale-[0.98] text-sm text-center block">Contact Us</Link>
      </div>

      {/* Right: Visualization */}
      <div className="flex-1 p-6 lg:p-8 bg-gray-50/20 flex flex-col gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start xl:items-center flex-col xl:flex-row gap-4">
            <div className="space-y-2 w-full xl:flex-1">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-sm bg-navy-700" />
                  <span>Base Cost <span className="text-navy-900 ml-1">{presentPct}%</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Cost Increase <span className="text-red-500 ml-1">{increasePct}%</span></span>
                  <div className="w-2 h-2 rounded-sm bg-red-500" />
                </div>
              </div>
              <div className="h-1 rounded-full bg-gray-100 flex overflow-hidden">
                <div className="h-full bg-navy-700 transition-all duration-500" style={{ width: `${presentPct}%` }} />
                <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${increasePct}%` }} />
              </div>
            </div>

            <div className="flex items-center gap-3 ml-0 lg:ml-6 self-start lg:-translate-y-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex p-1">
                <button
                  onClick={() => setViewMode('chart')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'chart' ? 'bg-gold text-white shadow-sm' : 'bg-amber-50 text-amber-500 hover:bg-amber-100'}`}
                >
                  <TrendingUpDown size={18} />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-gold text-white shadow-sm' : 'bg-amber-50 text-amber-500 hover:bg-amber-100'}`}
                >
                  <CalendarDays size={18} />
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {viewMode === 'chart' && (
              <motion.div
                key="charts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2 bg-white/60 p-1.5 rounded-xl border border-gray-100 w-fit overflow-x-auto min-w-min"
              >
                <span className="text-sm font-semibold text-gray-500 px-2 hidden sm:inline">Charts:</span>
                {['Bar', 'Area'].map(type => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${chartType === type ? 'bg-white text-emerald-600 shadow-sm border border-emerald-50' : 'text-gray-400 hover:text-navy-900 border border-transparent'}`}
                  >
                    {type}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 min-h-[300px]">
          {viewMode === 'chart' ? (
            <GrowthChart
              data={progression}
              chartType={chartType}
              title="Future Cost"
              investedLabel="Today"
              growthLabel="Cost Increase"
            />
          ) : (
            <BreakdownTable
              data={progression}
              investedLabel="Today"
              growthLabel="Cost Increase"
            />
          )}
        </div>

        <div className="hidden lg:grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-2 lg:p-3 border border-gray-100 shadow-sm transition-all text-center">
            <div className="text-xs font-semibold text-gray-400 mb-1 leading-none">Today</div>
            <div className="text-sm lg:text-lg font-sans font-black text-navy-900/80">{formatCurrency(result.present)}</div>
          </div>
          <div className="bg-white rounded-xl p-2 lg:p-3 border border-gray-100 shadow-sm transition-all text-center">
            <div className="text-xs font-semibold text-gray-400 mb-1 leading-none">Added Cost</div>
            <div className="text-sm lg:text-lg font-sans font-black text-red-500">{formatCurrency(result.increase)}</div>
          </div>
          <div className="bg-white rounded-xl p-2 lg:p-3 border border-navy-900/5 shadow-inner transition-all text-center bg-gray-50/10">
            <div className="text-xs font-semibold text-navy-900/40 mb-1 leading-none">Future Cost</div>
            <div className="text-lg lg:text-2xl font-sans font-black text-navy-900 whitespace-nowrap">{formatCurrency(result.future, true)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EducationGoal = () => {
  const [target, setTarget] = useState(2500000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);
  const [monthlyRequired, setMonthlyRequired] = useState(0);
  const [viewMode, setViewMode] = useState('chart');
  const [chartType, setChartType] = useState('Bar');
  const [progression, setProgression] = useState([]);

  useEffect(() => {
    const i = rate / 1200;
    const n = years * 12;
    const monthly = target / (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
    setMonthlyRequired(monthly);

    const newProgression = [];
    for (let y = 1; y <= years; y++) {
      const n = y * 12;
      const tot = monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      const inv = monthly * n;
      newProgression.push({ 
        year: y, 
        invested: Math.round(inv), 
        total: Math.round(tot) 
      });
    }
    setProgression(newProgression);
  }, [target, rate, years]);

  const invested = monthlyRequired * years * 12;
  const gains = Math.max(0, target - invested);
  const investedPct = target > 0 ? Math.round((invested / target) * 100) : 0;
  const gainsPct = 100 - investedPct;

  return (
    <div className="flex flex-col lg:flex-row min-h-[500px]">
      {/* Left: Inputs */}
      <div className="lg:w-[45%] p-6 lg:p-8 space-y-6 border-r border-gray-50 flex flex-col">
        <div>
          <h3 className="text-xl font-sans font-black text-navy-900">Education Goal Calculator</h3>
        </div>
        <div className="space-y-4 flex-1">
          <CalculatorInput
            label="Target Goal"
            value={target} min={100000} max={50000000} step={100000} unit={INR_SYMBOL} isCurrency
            onChange={setTarget}
          />
          <CalculatorInput
            label="Time Left (Years)"
            value={years} min={1} max={25} step={1} unit="Yr"
            onChange={setYears}
          />
          <CalculatorInput
            label="Expected Returns (%)"
            value={rate} min={2} max={13} step={0.5} unit="%"
            onChange={setRate}
          />
        </div>
        <div className="bg-gold/5 rounded-2xl p-4 border border-gold/10 space-y-1">
          <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Monthly Needed</p>
          <p className="text-xl font-sans font-black text-navy-900">{formatCurrency(monthlyRequired)}</p>
        </div>
        <div className="lg:hidden mt-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-2 border border-gray-100 shadow-sm transition-all text-center">
              <div className="text-xs font-semibold text-gray-400 mb-1 leading-none">Savings</div>
              <div className="text-[12px] font-sans font-black text-navy-900/80">{formatCurrency(invested)}</div>
            </div>
            <div className="bg-white rounded-xl p-2 border border-gray-100 shadow-sm transition-all text-center">
              <div className="text-xs font-semibold text-gray-400 mb-1 leading-none">Est. Gains</div>
              <div className="text-[12px] font-sans font-black text-[#00C896]">{formatCurrency(gains)}</div>
            </div>
            <div className="bg-white rounded-xl p-2 border border-navy-900/5 shadow-inner transition-all text-center bg-gray-50/10">
              <div className="text-xs font-semibold text-navy-900/40 mb-1 leading-none">Goal Fund</div>
              <div className="text-[14px] font-sans font-black text-navy-900">{formatCurrency(target)}</div>
            </div>
          </div>
        </div>
        <Link to="/contact" className="w-full bg-navy-900 text-white font-bold py-4 rounded-xl mt-4 hover:bg-gold transition-all duration-300 shadow-lg shadow-navy-900/10 active:scale-[0.98] text-sm text-center block">Contact Us</Link>
      </div>

      {/* Right: Visualization */}
      <div className="flex-1 p-6 lg:p-8 bg-gray-50/20 flex flex-col gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start xl:items-center flex-col xl:flex-row gap-4">
            <div className="space-y-2 w-full xl:flex-1">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-sm bg-navy-700" />
                  <span>Savings <span className="text-navy-900 ml-1">{investedPct}%</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Returns <span className="text-[#00C896] ml-1">{gainsPct}%</span></span>
                  <div className="w-2 h-2 rounded-sm bg-[#00C896]" />
                </div>
              </div>
              <div className="h-1 rounded-full bg-gray-100 flex overflow-hidden">
                <div className="h-full bg-navy-700 transition-all duration-500" style={{ width: `${investedPct}%` }} />
                <div className="h-full bg-[#00C896] transition-all duration-500" style={{ width: `${gainsPct}%` }} />
              </div>
            </div>

            <div className="flex items-center gap-3 ml-0 lg:ml-6 self-start lg:-translate-y-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex p-1">
                <button
                  onClick={() => setViewMode('chart')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'chart' ? 'bg-gold text-white shadow-sm' : 'bg-amber-50 text-amber-500 hover:bg-amber-100'}`}
                >
                  <TrendingUpDown size={18} />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-gold text-white shadow-sm' : 'bg-amber-50 text-amber-500 hover:bg-amber-100'}`}
                >
                  <CalendarDays size={18} />
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {viewMode === 'chart' && (
              <motion.div
                key="charts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2 bg-white/60 p-1.5 rounded-xl border border-gray-100 w-fit overflow-x-auto min-w-min"
              >
                <span className="text-sm font-semibold text-gray-500 px-2 hidden sm:inline">Charts:</span>
                {['Bar', 'Area'].map(type => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${chartType === type ? 'bg-white text-emerald-600 shadow-sm border border-emerald-50' : 'text-gray-400 hover:text-navy-900 border border-transparent'}`}
                  >
                    {type}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 min-h-[300px]">
          {viewMode === 'chart' ? (
            <GrowthChart
              data={progression}
              chartType={chartType}
              title="Goal Fund"
            />
          ) : (
            <BreakdownTable
              data={progression}
              investedLabel="Savings"
              growthLabel="Market Growth"
            />
          )}
        </div>

        <div className="hidden lg:grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-2 lg:p-3 border border-gray-100 shadow-sm transition-all text-center">
            <div className="text-xs font-semibold text-gray-400 mb-1 leading-none">Savings</div>
            <div className="text-sm lg:text-lg font-sans font-black text-navy-900/80">{formatCurrency(invested)}</div>
          </div>
          <div className="bg-white rounded-xl p-2 lg:p-3 border border-gray-100 shadow-sm transition-all text-center">
            <div className="text-xs font-semibold text-gray-400 mb-1 leading-none">Est. Gains</div>
            <div className="text-sm lg:text-lg font-sans font-black text-[#00C896]">{formatCurrency(gains)}</div>
          </div>
          <div className="bg-white rounded-xl p-2 lg:p-3 border border-navy-900/5 shadow-inner transition-all text-center bg-gray-50/10">
            <div className="text-xs font-semibold text-navy-900/40 mb-1 leading-none">Goal Fund</div>
            <div className="text-lg lg:text-2xl font-sans font-black text-navy-900 whitespace-nowrap">{formatCurrency(target, true)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const parseDate = (value) => {
  const [d, m, y] = String(value || '').split('-').map(Number);
  if (!d || !m || !y) return null;
  return new Date(y, m - 1, d);
};


const SimpleCalcCard = ({ title, children, resultRows }) => (
  <div className="p-6 lg:p-8">
    <h3 className="text-xl font-sans font-black text-navy-900 mb-5">{title}</h3>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start min-w-0">{children}</div>
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
      {resultRows.map((x) => (
        <div key={x.label} className="rounded-xl border border-gray-100 bg-[#FAF9F6] p-3 min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-navy-900/45 font-black">{x.label}</p>
          <p className={`mt-1 text-base sm:text-lg font-black break-words leading-snug ${x.className || 'text-navy-900'}`}>{x.value}</p>
        </div>
      ))}
    </div>
    <Link to="/contact" className="w-full bg-navy-900 text-white font-bold py-4 rounded-xl mt-4 hover:bg-gold transition-all duration-300 shadow-lg shadow-navy-900/10 active:scale-[0.98] text-sm text-center block">Contact Us</Link>
  </div>
);

const SWPCalculator = () => {
  const [corpus, setCorpus] = useState(3000000);
  const [withdrawal, setWithdrawal] = useState(25000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(20);
  let bal = corpus;
  const r = rate / 1200;
  const m = years * 12;
  let monthsSustained = 0;
  let depletedEarly = false;
  for (let i = 0; i < m; i += 1) {
    if (bal <= 0) break;
    bal = bal * (1 + r) - withdrawal;
    if (bal <= 0) {
      monthsSustained += 1;
      depletedEarly = true;
      break;
    }
    monthsSustained += 1;
  }
  const end = Math.max(0, bal);
  const depleted = depletedEarly || (end === 0 && monthsSustained < m);
  const sustainedLabel = depleted
    ? `~${Math.floor(monthsSustained / 12)}y ${monthsSustained % 12}m`
    : `${years} Yrs`;
  return (
    <SimpleCalcCard
      title="SWP Calculator"
      resultRows={[
        { label: 'Total Withdrawn', value: formatCurrency(withdrawal * monthsSustained) },
        { label: 'Final Corpus', value: formatCurrency(end), className: end > 0 ? 'text-emerald-600' : 'text-rose-600' },
        { label: depleted ? 'Corpus Lasts' : 'Years Sustained', value: sustainedLabel, className: depleted ? 'text-rose-600' : '' },
      ]}
    >
      <CalculatorInput label="Initial Corpus" value={corpus} onChange={setCorpus} unit={INR_SYMBOL} isCurrency min={100000} max={50000000} step={10000} />
      <CalculatorInput label="Monthly Withdrawal" value={withdrawal} onChange={setWithdrawal} unit={INR_SYMBOL} isCurrency min={1000} max={500000} step={500} />
      <CalculatorInput label="Expected Return (%)" value={rate} onChange={setRate} unit="%" min={2} max={13} step={0.1} />
      <CalculatorInput label="Duration (Years)" value={years} onChange={setYears} min={1} max={40} step={1} />
    </SimpleCalcCard>
  );
};

const STPCalculator = () => {
  const [source, setSource] = useState(1000000);
  const [monthly, setMonthly] = useState(25000);
  const [debtRate, setDebtRate] = useState(6.5);
  const [equityRate, setEquityRate] = useState(12);
  const [months, setMonths] = useState(24);
  let debt = source;
  let equity = 0;
  const rd = debtRate / 1200;
  const re = equityRate / 1200;
  for (let i = 0; i < months; i += 1) {
    const tr = Math.min(monthly, Math.max(0, debt));
    debt = (debt - tr) * (1 + rd);
    equity = (equity + tr) * (1 + re);
  }
  return (
    <SimpleCalcCard
      title="STP Calculator"
      resultRows={[
        { label: 'Debt Balance', value: formatCurrency(Math.max(0, debt)) },
        { label: 'Equity Value', value: formatCurrency(equity), className: 'text-emerald-600' },
        { label: 'Total Value', value: formatCurrency(Math.max(0, debt) + equity) },
      ]}
    >
      <CalculatorInput label="Source Corpus" value={source} onChange={setSource} unit={INR_SYMBOL} isCurrency min={100000} max={50000000} step={10000} />
      <CalculatorInput label="Monthly Transfer" value={monthly} onChange={setMonthly} unit={INR_SYMBOL} isCurrency min={1000} max={500000} step={500} />
      <CalculatorInput label="Debt Return (%)" value={debtRate} onChange={setDebtRate} unit="%" min={2} max={13} step={0.1} />
      <CalculatorInput label="Equity Return (%)" value={equityRate} onChange={setEquityRate} unit="%" min={2} max={13} step={0.1} />
      <CalculatorInput label="Transfer Months" value={months} onChange={setMonths} min={1} max={120} step={1} />
    </SimpleCalcCard>
  );
};

const StepUpSIPCalculator = () => {
  const [sip, setSip] = useState(10000);
  const [stepUp, setStepUp] = useState(10);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(20);
  const r = rate / 1200;
  let total = 0;
  let invested = 0;
  let currentSip = sip;
  for (let y = 1; y <= years; y += 1) {
    for (let m = 1; m <= 12; m += 1) {
      total = (total + currentSip) * (1 + r);
      invested += currentSip;
    }
    currentSip *= (1 + stepUp / 100);
  }
  return (
    <SimpleCalcCard
      title="Step-Up SIP Calculator"
      resultRows={[
        { label: 'Invested', value: formatCurrency(invested) },
        { label: 'Future Value', value: formatCurrency(total), className: 'text-emerald-600' },
        { label: 'Wealth Gain', value: formatCurrency(total - invested) },
      ]}
    >
      <CalculatorInput label="Starting SIP" value={sip} onChange={setSip} unit={INR_SYMBOL} isCurrency min={500} max={200000} step={500} />
      <CalculatorInput label="Annual Step-Up (%)" value={stepUp} onChange={setStepUp} unit="%" min={0} max={30} step={1} />
      <CalculatorInput label="Expected Return (%)" value={rate} onChange={setRate} unit="%" min={2} max={13} step={0.1} />
      <CalculatorInput label="Duration (Years)" value={years} onChange={setYears} min={1} max={40} step={1} />
    </SimpleCalcCard>
  );
};

const SIPDelayCostCalculator = () => {
  const [sip, setSip] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(20);
  const [delayYears, setDelayYears] = useState(2);
  const fv = (p, y) => {
    const n = y * 12;
    const r = rate / 1200;
    if (r === 0) return p * n;
    return p * (((1 + r) ** n - 1) / r) * (1 + r);
  };
  const onTime = fv(sip, years);
  const delayed = fv(sip, Math.max(0, years - delayYears));
  return (
    <SimpleCalcCard
      title="SIP Delay Cost Calculator"
      resultRows={[
        { label: 'On-Time Corpus', value: formatCurrency(onTime) },
        { label: 'Delayed Corpus', value: formatCurrency(delayed), className: 'text-rose-600' },
        { label: 'Delay Cost', value: formatCurrency(onTime - delayed) },
      ]}
    >
      <CalculatorInput label="Monthly SIP" value={sip} onChange={setSip} unit={INR_SYMBOL} isCurrency min={500} max={200000} step={500} />
      <CalculatorInput label="Expected Return (%)" value={rate} onChange={setRate} unit="%" min={2} max={13} step={0.1} />
      <CalculatorInput label="Target Horizon (Years)" value={years} onChange={setYears} min={1} max={40} step={1} />
      <CalculatorInput label="Delay (Years)" value={delayYears} onChange={setDelayYears} min={1} max={10} step={1} />
    </SimpleCalcCard>
  );
};

const SIPvsLumpsumCalculator = () => {
  const [monthlySip, setMonthlySip] = useState(10000);
  const [lumpsum, setLumpsum] = useState(1200000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const n = years * 12;
  const r = rate / 1200;
  const sipFV = r === 0 ? monthlySip * n : monthlySip * (((1 + r) ** n - 1) / r) * (1 + r);
  const lumpFV = lumpsum * ((1 + r) ** n);
  return (
    <SimpleCalcCard
      title="SIP vs Lumpsum Calculator"
      resultRows={[
        { label: 'SIP Future Value', value: formatCurrency(sipFV) },
        { label: 'Lumpsum Future Value', value: formatCurrency(lumpFV) },
        { label: 'Difference', value: formatCurrency(Math.abs(lumpFV - sipFV)), className: 'text-emerald-600' },
      ]}
    >
      <CalculatorInput label="Monthly SIP" value={monthlySip} onChange={setMonthlySip} unit={INR_SYMBOL} isCurrency min={500} max={200000} step={500} />
      <CalculatorInput label="Lumpsum Amount" value={lumpsum} onChange={setLumpsum} unit={INR_SYMBOL} isCurrency min={10000} max={100000000} step={10000} />
      <CalculatorInput label="Expected Return (%)" value={rate} onChange={setRate} unit="%" min={2} max={13} step={0.1} />
      <CalculatorInput label="Duration (Years)" value={years} onChange={setYears} min={1} max={40} step={1} />
    </SimpleCalcCard>
  );
};

const GoalPlanner = ({ title }) => {
  const [goalCost, setGoalCost] = useState(2000000);
  const [years, setYears] = useState(10);
  const [inflation, setInflation] = useState(8);
  const [returnRate, setReturnRate] = useState(12);
  const futureCost = goalCost * ((1 + inflation / 100) ** years);
  const rm = returnRate / 1200;
  const lumpToday = rm === 0 ? futureCost : futureCost / ((1 + rm) ** (years * 12));
  const nm = years * 12;
  const sip = rm === 0 ? futureCost / nm : futureCost / ((((1 + rm) ** nm - 1) / rm) * (1 + rm));
  return (
    <SimpleCalcCard
      title={title}
      resultRows={[
        { label: 'Future Goal Cost', value: formatCurrency(futureCost) },
        { label: 'Required Monthly SIP', value: formatCurrency(sip), className: 'text-emerald-600' },
        { label: 'Lumpsum Needed Today', value: formatCurrency(lumpToday) },
      ]}
    >
      <CalculatorInput label="Goal Cost Today" value={goalCost} onChange={setGoalCost} unit={INR_SYMBOL} isCurrency min={100000} max={100000000} step={10000} />
      <CalculatorInput label="Years to Goal" value={years} onChange={setYears} min={1} max={40} step={1} />
      <CalculatorInput label="Goal Inflation (%)" value={inflation} onChange={setInflation} unit="%" min={1} max={15} step={0.1} />
      <CalculatorInput label="Expected Return (%)" value={returnRate} onChange={setReturnRate} unit="%" min={2} max={13} step={0.1} />
    </SimpleCalcCard>
  );
};


export const tools = [
  {
    id: 'sip',
    category: 'Core Investment Calculators',
    title: 'SIP Calculator',
    desc: 'Estimate potential returns from regular investments over a selected time period based on assumed rates of return.',
    subtext: 'Helps illustrate the impact of disciplined investing over time.',
    icon: PiggyBank,
    component: <SIPCalculator />,
    color: "bg-blue-50/50",
    formula: {
      label: "SIP Future Value",
      equation: (<>FV = P * [((1 + r)<sup className="text-xs">n</sup> - 1) / r] * (1 + r)</>),
      details: [
        "P = Investment amount per period",
        "r = Period rate = Annual rate / frequency (12, 4, or 1)",
        "n = Total periods = Years × frequency"
      ],
      chips: ["Rupee Cost Averaging", "Periodic Compounding", "Market Risk Involved", "No Guaranteed Returns"]
    },
    faqs: [
      {
        q: "What is a SIP and how does it work?",
        a: "A **Systematic Investment Plan (SIP)** allows you to invest a fixed amount regularly (monthly, weekly, quarterly) into a mutual fund scheme. On a pre-decided date, the amount is auto-debited from your bank and units are allotted at the prevailing NAV. This builds discipline and leverages **rupee cost averaging** - you buy more units when prices are low and fewer when prices are high, reducing average cost over time."
      },
      {
        q: "Is the return rate shown guaranteed?",
        a: "No. The return rate is **illustrative only**. Mutual funds invest in market instruments (equity, debt, etc.) and returns vary based on market conditions. Past performance is not indicative of future results. Always consult a registered MFD or advisor before investing."
      },
      {
        q: "What is the minimum SIP amount?",
        a: "Most mutual fund houses allow SIPs starting from as low as **₹100 to ₹500 per month**. Some micro-SIP schemes go even lower. There is no maximum cap - you can invest any amount that suits your financial plan."
      },
      {
        q: "Can I stop or modify my SIP anytime?",
        a: "Yes. SIPs in mutual funds are fully flexible. You can **pause, stop, increase, or decrease** your SIP amount at any time. There are no exit loads on SIP cancellation itself (though early redemption of units may attract exit load depending on the fund)."
      },
      {
        q: "How does SIP differ from a Recurring Deposit (RD)?",
        a: "Key differences:\n• RD offers **fixed, guaranteed returns**; SIP returns are market-linked and variable\n• SIP is subject to market risk; equity fund returns may be higher or lower than fixed-income instruments depending on market conditions\n• SIP carries market risk; RD is generally low-risk and fixed-return"
      },
      {
        q: "What is Step-Up SIP?",
        a: "A **Step-Up SIP** (also called Top-Up SIP) allows you to increase your SIP amount by a fixed percentage or absolute amount every year. For example, increasing by 10% annually means your first-year SIP of ₹5,000/month becomes ₹5,500 in year 2, ₹6,050 in year 3, and so on. This aligns investments with your growing income and dramatically boosts the final corpus."
      }
    ]
  },
  {
    id: 'lumpsum',
    category: 'Core Investment Calculators',
    title: 'Lumpsum Investment Calculator',
    desc: 'Estimate potential returns on a one-time investment based on assumed rate of return and investment duration.',
    subtext: 'Useful for understanding growth of a single investment amount.',
    icon: HandCoins,
    component: <LumpsumCalculator />,
    color: "bg-gold/5",
    formula: {
      label: "Formula Used",
      equation: (<>FV = P * (1 + r)<sup className="text-xs">n</sup></>),
      details: [
        "P = Initial investment amount",
        "r = Rate of return per period",
        "n = Number of periods"
      ],
      chips: ["One-time investment", "Compounding impact", "Market-linked returns", "Illustration only"]
    },
    faqs: [
      {
        q: "What is a lumpsum investment?",
        a: "A lumpsum investment involves investing a single, bulk amount of money into a financial instrument (such as a mutual fund) at one time, as opposed to investing smaller amounts regularly over time."
      },
      {
        q: "How does the calculator estimate returns?",
        a: "The calculator estimates the future value by applying the assumed rate of return over the specified investment duration using the compound interest formula. This shows the potential growth mathematically."
      },
      {
        q: "Are the returns guaranteed?",
        a: "No. The returns generated by this tool are illustrative only and based on your inputs. Mutual funds are subject to market risks, and actual returns depend on prevailing market conditions."
      },
      {
        q: "What rate of return should be entered?",
        a: "You should enter a realistic expected rate of return based on historical data for the specific asset class you are considering. Equity funds typically assume higher long-term averages compared to debt funds."
      },
      {
        q: "How is this different from SIP?",
        a: "In a lumpsum investment, your entire capital starts compounding from day one, whereas in a Systematic Investment Plan (SIP), capital is added incrementally over time. Market timing may impact lumpsum investments more than SIPs."
      },
      {
        q: "Can actual returns be higher or lower?",
        a: "Yes. Due to market volatility, the actual performance of your investment may be significantly higher or lower than the estimated outcomes shown here."
      }
    ]
  },
  {
    id: 'retirement',
    category: 'Goal Based Calculators',
    title: 'Retirement Goal Calculator',
    desc: 'Estimate the amount required to meet retirement goals based on expected expenses, time horizon, and assumed returns.',
    subtext: 'Helps in planning long-term financial requirements.',
    icon: Armchair,
    component: <RetirementCalculator />,
    color: "bg-navy-900/5",
    formula: {
      label: "Retirement Corpus Accumulation",
      equation: (<>Corpus = P * [((1 + r)<sup className="text-xs">n</sup> - 1) / r] * (1 + r)</>),
      details: [
        "P = Monthly savings amount",
        "r = Monthly return rate = Annual rate / 12",
        "n = Total months = (Retirement age - Current age) * 12",
        "Monthly Income (4% SWR) = Corpus * 0.04 / 12"
      ],
      chips: ["SIP annuity-due formula", "Monthly compounding", "4% Safe Withdrawal Rate", "Illustration only"]
    },
    faqs: [
      {
        q: "What does the retirement planner estimate?",
        a: "The planner estimates a potential retirement corpus based on your monthly savings amount, expected annual return, and the number of years remaining until retirement. It also shows an indicative monthly income using the 4% safe withdrawal rate as an illustration."
      },
      {
        q: "Does this calculator account for inflation?",
        a: "This tool does not model inflation directly. It projects corpus growth based on your savings and assumed return rate. For inflation-adjusted planning, you should consult a registered financial advisor who can factor in your specific circumstances."
      },
      {
        q: "What is the 4% Safe Withdrawal Rate shown?",
        a: "The monthly income figure shown is illustrative, derived by applying a 4% annual withdrawal rate to the projected corpus (divided by 12). This is a commonly referenced concept in retirement planning literature and is not a guaranteed withdrawal amount."
      },
      {
        q: "Can I change my retirement age later?",
        a: "Yes, this tool is purely for illustrative planning. In reality, you can alter your retirement age, but doing so will change the projected corpus and the monthly savings needed to achieve it."
      },
      {
        q: "Are these estimates guaranteed?",
        a: "No. The estimates are based entirely on user-provided inputs and assumed rates of return. Actual investment performance and retirement needs may vary materially from projections shown here."
      },
      {
        q: "What assumptions affect the result most?",
        a: "The assumed rate of return and the number of years to retirement are the most sensitive variables. Even a small change in either can significantly alter the projected corpus."
      }
    ]
  },
  {
    id: 'education',
    category: 'Goal Based Calculators',
    title: 'Education Goal Calculator',
    desc: 'Estimate the investment required to meet future education expenses based on time horizon and assumed inflation and returns.',
    subtext: 'Helps plan for long-term financial goals.',
    icon: GraduationCap,
    component: <EducationGoal />,
    color: "bg-emerald-50/50",
    formula: {
      label: "Education Goal — Required Monthly SIP",
      equation: (<>Monthly SIP = G / ([((1 + r)<sup className="text-xs">n</sup> - 1) / r] * (1 + r))</>),
      details: [
        "G = Target goal amount (future education cost)",
        "r = Monthly return rate = Annual rate / 12",
        "n = Total months = Years × 12",
        "Annuity-due: invest at start of each month"
      ],
      chips: ["Goal-based planning", "Reverse SIP formula", "Monthly compounding", "Illustration only"]
    },
    faqs: [
      {
        q: "What does the education planner calculate?",
        a: "The planner works backwards from your target goal amount and calculates the monthly SIP required to reach that corpus, using your expected return rate and time horizon."
      },
      {
        q: "How should I decide my target goal amount?",
        a: "Enter the total amount you estimate will be required at the time of the education expense. You may research current costs for your target institution or course and set a realistic figure. This tool does not apply inflation adjustment — the target amount you enter is treated as the final goal."
      },
      {
        q: "Can this help estimate monthly savings needed?",
        a: "Yes. Once you enter the target goal amount, expected return rate, and time horizon, the calculator works backwards to show the monthly SIP required to accumulate that corpus by the target date."
      },
      {
        q: "Are the projections guaranteed?",
        a: "No. The figures are illustrative combinations of your inputs. The actual future cost of education and the returns on your investments are subject to economic and market conditions."
      },
      {
        q: "What if the goal timeline changes?",
        a: "If the timeframe to the goal increases or decreases, the compound effect of both inflation and potential investment returns will shift, requiring a recalculation of your savings strategy."
      },
      {
        q: "Should I revise the estimate periodically?",
        a: "Yes, it is highly recommended to review and adjust your assumptions annually based on actual changes in tuition fees, inflation rates, and market performance."
      }
    ]
  },
  {
    id: 'inflation',
    category: 'Goal Based Calculators',
    title: 'Inflation Calculator',
    desc: 'Understand how inflation may impact the future value of money over time.',
    subtext: 'Helps in assessing purchasing power in the long term.',
    icon: TrendingUp,
    component: <InflationTracker />,
    color: "bg-rose-50/50",
    formula: {
      label: "Formula Used",
      equation: (<>F = P * (1 + i)<sup className="text-xs">n</sup></>),
      details: [
        "P = Present value or current cost",
        "i = Inflation rate",
        "n = Number of years",
        "F = Future value / adjusted cost"
      ],
      chips: ["Purchasing power", "Inflation impact", "Long-term estimate", "Assumption based"]
    },
    faqs: [
      {
        q: "What does the inflation calculator show?",
        a: "The calculator illustrates how a specific amount of money or a current living expense may be projected to grow over time due to the compounded effect of inflation."
      },
      {
        q: "How does inflation affect purchasing power?",
        a: "Inflation gradually decreases the purchasing value of currency. As the cost of goods and services rises, the same amount of money buys less in the future than it does today."
      },
      {
        q: "Is the inflation rate fixed in real life?",
        a: "No. Actual inflation rates fluctuate based on macroeconomic conditions, government policies, and global supply chains. The calculator uses a fixed assumed rate for illustration purposes only."
      },
      {
        q: "Can actual inflation differ from assumptions?",
        a: "Absolutely. Historical inflation trends do not guarantee future economic conditions. Your actual cost of living may increase at a faster or slower pace than estimated here."
      },
      {
        q: "Why is long-term planning important?",
        a: "Understanding the impact of inflation helps investors choose financial instruments that aim to generate returns higher than inflation, thereby attempting to preserve their real purchasing power."
      },
      {
        q: "How often should inflation assumptions be reviewed?",
        a: "It is sensible to review inflation assumptions built into your financial plans annually or whenever there are significant shifts in the macroeconomic environment."
      }
    ]
  },
  {
    id: 'swp',
    category: 'Core Investment Calculators',
    title: 'SWP Calculator',
    desc: 'Estimate monthly withdrawals and remaining corpus over time.',
    subtext: 'Useful for retirement cash-flow simulation.',
    icon: WalletCards,
    component: <SWPCalculator />,
    formula: {
      label: "SWP Corpus Projection",
      equation: (<>B<sub className="text-xs">t+1</sub> = B<sub className="text-xs">t</sub> * (1 + r/12) - W</>),
      details: [
        "B_t = Corpus at start of month t",
        "r = Expected annual return rate",
        "W = Fixed monthly withdrawal",
        "Process repeats for n = Years * 12 months"
      ],
      chips: ["Monthly withdrawal", "Compounding on balance", "Corpus sustainability", "Illustrative only"]
    },
    faqs: [
      { q: "What does this SWP calculator estimate?", a: "It estimates how your corpus changes month by month when you withdraw a fixed amount and the remaining corpus continues to earn returns." },
      { q: "Is SWP withdrawal guaranteed for the full tenure?", a: "No. If withdrawal is too high relative to return and corpus size, corpus can deplete early. The tool is a projection, not a guarantee." },
      { q: "How is this different from FD interest payout?", a: "FD payout is fixed by contract. SWP is market-linked because mutual fund NAVs fluctuate; withdrawals may include both gains and principal." },
      { q: "What inputs matter most?", a: "Initial corpus, withdrawal amount, and assumed return rate are the most sensitive inputs. Small changes can materially alter sustainability." },
      { q: "Should I increase withdrawal yearly for inflation?", a: "In real life, yes many investors do. This version assumes fixed monthly withdrawal; for inflation-adjusted income, you should periodically revise W." }
    ]
  },
  {
    id: 'stp',
    category: 'Core Investment Calculators',
    title: 'STP Calculator',
    desc: 'Model systematic transfer from one fund bucket to another.',
    subtext: 'Illustrates phased deployment strategy.',
    icon: Repeat2,
    component: <STPCalculator />,
    formula: {
      label: "STP Dual-Bucket Model",
      equation: (<>D<sub className="text-xs">t+1</sub> = (D<sub className="text-xs">t</sub> - T) * (1 + r<sub className="text-xs">d</sub>/12), E<sub className="text-xs">t+1</sub> = (E<sub className="text-xs">t</sub> + T) * (1 + r<sub className="text-xs">e</sub>/12)</>),
      details: [
        "D_t = Debt/source bucket value",
        "E_t = Equity/target bucket value",
        "T = Monthly transfer amount",
        "r_d, r_e = Annual return assumptions for debt and equity buckets"
      ],
      chips: ["Phased transfer", "Two return streams", "Timing risk reduction", "Illustrative only"]
    },
    faqs: [
      { q: "Why use STP?", a: "STP helps stagger deployment from a low-volatility bucket to a growth bucket, reducing lump-sum timing risk." },
      { q: "Does STP eliminate market risk?", a: "No. It only spreads entry over time. Final outcome still depends on market path and return assumptions." },
      { q: "How do I choose transfer amount?", a: "Choose T so the source corpus lasts for desired transfer months while maintaining required liquidity and risk comfort." },
      { q: "Is debt return always stable?", a: "Not always. Debt funds are less volatile than equity in general, but returns can vary with rates, credit and duration risk." },
      { q: "When is STP usually used?", a: "Commonly after receiving a large corpus (bonus, sale proceeds, inheritance) and wanting disciplined phased equity allocation." }
    ]
  },
  {
    id: 'step-up-sip',
    category: 'Core Investment Calculators',
    title: 'Step-Up SIP Calculator',
    desc: 'Estimate wealth when SIP increases every year.',
    subtext: 'Suitable for investors whose income grows over time.',
    icon: TrendingUp,
    component: <StepUpSIPCalculator />,
    formula: {
      label: "Step-Up SIP Future Value",
      equation: (<>FV = SUM<sub className="text-xs">y=1..Y</sub> [ SIP<sub className="text-xs">0</sub>(1+g)<sup className="text-xs">y-1</sup> * FVAF(r/12, 12, Y-y+1) ]</>),
      details: [
        "SIP0 = Starting monthly SIP",
        "g = Annual step-up rate",
        "r = Expected annual return",
        "FVAF(i,m,k) = Future-value annuity factor for monthly investing"
      ],
      chips: ["Income-linked investing", "Annual top-up", "Compounding acceleration", "Illustrative only"]
    },
    faqs: [
      { q: "Why does Step-Up SIP create larger corpus?", a: "Because higher contributions in later years compound too, and annual increment aligns investing with rising income." },
      { q: "What step-up percentage is practical?", a: "Many investors use 5% to 15% annually, depending on salary growth and cash-flow flexibility." },
      { q: "Is a higher step-up always better?", a: "Only if sustainable. Overstretching monthly cash flow can lead to discontinuation, which hurts long-term discipline." },
      { q: "Can I pause step-up later?", a: "Yes, in practice you can revise or pause top-up decisions each year based on income and obligations." },
      { q: "Does this assume constant returns?", a: "Yes, the calculator uses a constant assumed rate for projection. Actual returns will vary year to year." }
    ]
  },
  {
    id: 'sip-delay-cost',
    category: 'Core Investment Calculators',
    title: 'SIP Delay Cost Calculator',
    desc: 'See how delaying SIP start impacts final wealth.',
    subtext: 'Shows opportunity cost of waiting.',
    icon: AlarmClock,
    component: <SIPDelayCostCalculator />,
    formula: {
      label: "Delay Cost",
      equation: (<>Delay Cost = FV(SIP, Y) - FV(SIP, Y - d)</>),
      details: [
        "FV(SIP, n) = SIP future value over n years",
        "Y = Total planned investment horizon",
        "d = Delay in years",
        "Both values use same SIP amount and return assumption"
      ],
      chips: ["Opportunity cost", "Time value of money", "Compounding loss", "Illustrative only"]
    },
    faqs: [
      { q: "What is SIP delay cost?", a: "It is the corpus lost by starting later versus starting now with the same SIP amount and return assumptions." },
      { q: "Why is early start so powerful?", a: "Compounding works non-linearly; early contributions stay invested longest and contribute disproportionately to final corpus." },
      { q: "Can bigger SIP later compensate delay?", a: "Partly yes, but usually requires much higher monthly SIP to catch up because lost compounding time cannot be recovered fully." },
      { q: "Is this tool useful for goal planning?", a: "Yes, it quantifies procrastination cost and helps convert goals into immediate action with concrete monthly commitments." },
      { q: "Does market level at start matter?", a: "Short-term entry levels matter, but over long horizons contribution discipline and tenure are usually more influential." }
    ]
  },
  {
    id: 'sip-vs-lumpsum',
    category: 'Core Investment Calculators',
    title: 'SIP vs Lumpsum Calculator',
    desc: 'Compare outcomes of SIP and one-time investment.',
    subtext: 'Helps choose approach per market comfort.',
    icon: Scale,
    component: <SIPvsLumpsumCalculator />,
    formula: {
      label: "SIP vs Lumpsum",
      equation: (<>FV<sub className="text-xs">SIP</sub> = P * [((1+i)<sup className="text-xs">n</sup>-1)/i] * (1+i), &nbsp; FV<sub className="text-xs">Lump</sub> = L * (1+i)<sup className="text-xs">n</sup></>),
      details: [
        "P = Monthly SIP amount",
        "L = One-time lumpsum amount",
        "i = Monthly return rate = r/12",
        "n = Total months"
      ],
      chips: ["Cash-flow choice", "Timing sensitivity", "Risk comfort", "Illustrative only"]
    },
    faqs: [
      { q: "Which is better: SIP or lumpsum?", a: "Neither is universally better. Lumpsum can outperform when invested before sustained uptrends; SIP reduces timing risk via staggered entry." },
      { q: "When should I prefer SIP?", a: "Prefer SIP when income is periodic, markets are uncertain, or you value disciplined averaging over timing calls." },
      { q: "When can lumpsum be suitable?", a: "When you already hold deployable cash, have long horizon, and can tolerate interim volatility." },
      { q: "Are tax outcomes identical?", a: "Tax depends on holding period and asset class of redeemed units. SIP creates multiple purchase lots with different holding clocks." },
      { q: "Can I combine both?", a: "Yes, a common strategy is partial lumpsum plus SIP/STP for the remainder to balance timing and discipline." }
    ]
  },
  {
    id: 'wedding-goal',
    category: 'Goal Based Calculators',
    title: 'Wedding Goal Calculator',
    desc: 'Estimate required SIP/lumpsum for wedding goal.',
    icon: Gem,
    component: <GoalPlanner title="Wedding Goal Calculator" />,
    formula: {
      label: "Goal Funding Math",
      equation: (<>Future Goal = G * (1+i)<sup className="text-xs">n</sup>, &nbsp; Required SIP = Future Goal / FVAF(r/12, 12n)</>),
      details: ["G = Current goal cost", "i = Goal inflation", "n = Years to goal", "r = Expected annual portfolio return"],
      chips: ["Inflation-adjusted goal", "SIP planning", "Long-term compounding", "Illustrative only"]
    },
    faqs: [
      { q: "What does this wedding goal calculator output?", a: "It estimates future wedding cost and the monthly SIP/lumpsum needed today to reach that amount." },
      { q: "Why include inflation?", a: "Event costs usually rise over time; ignoring inflation underestimates required corpus materially." },
      { q: "Should I keep a contingency?", a: "Yes, a 10% to 20% contingency is prudent for venue, logistics and price shocks." }
    ]
  },
  {
    id: 'house-goal',
    category: 'Goal Based Calculators',
    title: 'House Purchase Goal Calculator',
    desc: 'Estimate required corpus for house purchase target.',
    icon: House,
    component: <GoalPlanner title="House Purchase Goal Calculator" />,
    formula: {
      label: "Home Goal Projection",
      equation: (<>Future Cost = C * (1+i)<sup className="text-xs">n</sup></>),
      details: ["C = Current property target cost", "i = Expected property inflation", "n = Years to purchase", "SIP/Lumpsum is solved backward from future cost"],
      chips: ["Goal corpus", "Inflation effect", "Down-payment planning", "Illustrative only"]
    },
    faqs: [
      { q: "Does this include loan EMI?", a: "No, this tool focuses on corpus creation before purchase. EMI affordability should be evaluated separately." },
      { q: "What inflation should I use for property?", a: "Use a realistic local estimate based on city/segment trend rather than a generic national number." },
      { q: "Should I target full value or down payment?", a: "Most users target down payment + registration/fees buffer first, then align loan EMI with income." }
    ]
  },
  {
    id: 'car-goal',
    category: 'Goal Based Calculators',
    title: 'Car Purchase Goal Calculator',
    desc: 'Estimate investments required for future car purchase.',
    icon: Car,
    component: <GoalPlanner title="Car Purchase Goal Calculator" />,
    formula: {
      label: "Vehicle Goal Projection",
      equation: (<>Future Cost = C * (1+i)<sup className="text-xs">n</sup></>),
      details: ["C = Current car cost", "i = Assumed inflation", "n = Years to purchase", "Required SIP/Lumpsum derived from expected return r"],
      chips: ["Short/medium-term goal", "Inflation-adjusted cost", "Savings discipline", "Illustrative only"]
    },
    faqs: [
      { q: "Is this better than financing immediately?", a: "It depends on urgency and loan terms. Saving first reduces debt burden and total interest paid." },
      { q: "Should insurance and on-road charges be included?", a: "Yes, include ex-showroom plus taxes, insurance, accessories and registration for a realistic target." },
      { q: "Best assets for 2-4 year goal?", a: "Conservative to moderate allocations are generally preferred for shorter goals to reduce drawdown risk." }
    ]
  },
  {
    id: 'vacation-goal',
    category: 'Goal Based Calculators',
    title: 'Vacation Goal Calculator',
    desc: 'Plan travel goal with inflation-adjusted target.',
    icon: Plane,
    component: <GoalPlanner title="Vacation Goal Calculator" />,
    formula: {
      label: "Travel Goal Projection",
      equation: (<>Future Trip Cost = C * (1+i)<sup className="text-xs">n</sup></>),
      details: ["C = Current estimated trip cost", "i = Travel inflation assumption", "n = Years until travel", "Savings path solved using expected return r"],
      chips: ["Planned spending", "Inflation-aware", "Goal SIP", "Illustrative only"]
    },
    faqs: [
      { q: "Why plan vacation as a financial goal?", a: "Goal-based saving avoids last-minute debt and helps enjoy the trip without cash-flow stress." },
      { q: "What costs should be included?", a: "Flights, stay, visa, insurance, local transport, food, activities, shopping and contingency." },
      { q: "How often should I revise the goal amount?", a: "Review every 6-12 months as fares and forex can change materially." }
    ]
  },
];

export const CalculatorPage = () => {
  const { calcId } = useParams();
  const navigate = useNavigate();
  const toolId = calcId?.replace('-calculator', '');
  const tool = tools.find(t => t.id === toolId);
  const groupedTools = useMemo(() => {
    const order = [
      'Core Investment Calculators',
      'Goal Based Calculators',
    ];
    const map = {};
    tools.forEach((t) => {
      if (!map[t.category]) map[t.category] = [];
      map[t.category].push(t);
    });
    return order
      .filter((k) => Array.isArray(map[k]) && map[k].length)
      .map((k) => ({ category: k, items: map[k] }));
  }, []);
  const doodleMeta = (id) => {
    const map = {
      sip: { glyph: '\u{1F9EE}', tone: 'from-[#FFE9A8] to-[#FFD29D]' },
      lumpsum: { glyph: '\u{1F4B0}', tone: 'from-[#FDE5C2] to-[#FFD4A8]' },
      swp: { glyph: '\u{1F4B8}', tone: 'from-[#FAD7D7] to-[#FFD7A7]' },
      stp: { glyph: '\u{1F504}', tone: 'from-[#DFF6FF] to-[#CDEBFF]' },
      'step-up-sip': { glyph: '\u{1F4C8}', tone: 'from-[#D7FBE8] to-[#CFF0FF]' },
      'sip-delay-cost': { glyph: '\u23F3', tone: 'from-[#FFE4B8] to-[#FFD3D3]' },
      'sip-vs-lumpsum': { glyph: '\u2696\uFE0F', tone: 'from-[#E7E5FF] to-[#D8F0FF]' },
      retirement: { glyph: '\u{1F474}', tone: 'from-[#FFE8C8] to-[#FADCD0]' },
      education: { glyph: '\u{1F393}', tone: 'from-[#E0F2FF] to-[#D8E9FF]' },
      inflation: { glyph: '\u{1F4C9}', tone: 'from-[#FFE0E0] to-[#FFECCB]' },
      'wedding-goal': { glyph: '\u{1F48D}', tone: 'from-[#FFE1F3] to-[#FFD9E1]' },
      'house-goal': { glyph: '\u{1F3E0}', tone: 'from-[#E4F6FF] to-[#D7F2EA]' },
      'car-goal': { glyph: '\u{1F697}', tone: 'from-[#FFE6D4] to-[#FFE2B8]' },
      'vacation-goal': { glyph: '\u{1F3DD}\uFE0F', tone: 'from-[#DBF7FF] to-[#DDF5E9]' },
    };
    return map[id] || { glyph: '\u{1F9E0}', tone: 'from-[#E7ECFF] to-[#E0F4FF]' };
  };
  const doodleTone = (category) => {
    if (category === 'Core Investment Calculators') {
      return 'from-[#FFE7B0] via-[#FFD9A8] to-[#FFD1E8] text-[#B87400] border-[#F6CF7E]';
    }
    if (category === 'Goal Based Calculators') {
      return 'from-[#DDF8EC] via-[#CFEFFF] to-[#EBD9FF] text-[#0E8D67] border-[#AEE8CF]';
    }
    return 'from-[#E5E9FF] via-[#DDF8FF] to-[#FDE2F2] text-[#3350B8] border-[#C8D2FF]';
  };
  const [openCategories, setOpenCategories] = useState({
    'Core Investment Calculators': true,
    'Goal Based Calculators': true,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [calcId]);

  if (!tool) return <Navigate to="/#calculators" />;

  return (
    <section className="pt-24 pb-12 md:pt-40 md:pb-24 bg-[#F8F5EF] min-h-screen relative overflow-hidden">
      <Helmet>
        <title>{tool.title} | RupyaNivesh</title>
        <meta name="description" content={tool.desc} />
        <link rel="canonical" href={`https://rupyanivesh.in/${tool.id}-calculator`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://rupyanivesh.in/${tool.id}-calculator`} />
        <meta property="og:title" content={`${tool.title} | RupyaNivesh`} />
        <meta property="og:description" content={tool.desc} />
        <meta property="og:image" content="https://rupyanivesh.in/rupyanivesh-logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${tool.title} | RupyaNivesh`} />
        <meta name="twitter:description" content={tool.desc} />
        {tool.faqs && (
          <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: tool.faqs.map(faq => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: { '@type': 'Answer', text: faq.a },
            })),
          })}</script>
        )}
      </Helmet>
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_70%,rgba(197,160,89,0.10),transparent_60%)] pointer-events-none" />
      <div className="max-w-[1680px] mx-auto px-5 lg:px-8 xl:px-10 relative z-10 w-full">
        <Link
          to="/"
          onClick={(e) => {
            e.preventDefault();
            if (window.history.state && window.history.state.idx > 0) {
              navigate(-1);
            } else {
              navigate('/');
            }
          }}
          className="inline-flex items-center gap-2.5 text-gold text-[11px] md:text-[10px] font-black uppercase tracking-[0.26em] px-2 py-2 md:px-0 md:py-0 mb-4 hover:gap-3 transition-all group w-fit rounded-lg"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Tools
        </Link>

        <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] 2xl:grid-cols-[390px_1fr] gap-6 xl:gap-8 items-start">
          <aside className="order-2 xl:order-1 bg-white/95 rounded-[28px] border border-gold/20 p-4 lg:p-5 shadow-[0_20px_60px_rgba(10,20,43,0.08)] xl:sticky xl:top-24">
            {groupedTools.map((group) => (
              <div key={group.category} className="mb-4 last:mb-0">
                <button
                  onClick={() => setOpenCategories((prev) => ({ ...prev, [group.category]: !prev[group.category] }))}
                  className="w-full flex items-center justify-between px-2 py-1.5 mb-2 rounded-xl bg-gradient-to-r from-gold/10 to-transparent border border-gold/20 hover:from-gold/15 transition-colors"
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-navy-900 text-left">
                    {group.category}
                  </p>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-gold/30 bg-white text-gold text-sm font-black shadow-sm">
                    {openCategories[group.category] ? '-' : '+'}
                  </span>
                </button>
                <div className={`space-y-1 overflow-hidden transition-all duration-300 ${openCategories[group.category] ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  {group.items.map((item) => (
                    (() => {
                      const meta = doodleMeta(item.id);
                      return (
                    <button
                      key={item.id}
                      onClick={() => navigate(`/${item.id}-calculator`)}
                      className={`w-full text-left rounded-xl px-3 py-2.5 transition-colors flex items-center gap-2.5 ${
                        item.id === tool.id ? 'bg-gold/20 text-gold border border-gold/30' : 'hover:bg-[#F8F5EF] text-navy-900'
                      }`}
                    >
                      <span className={`relative inline-flex items-center justify-center w-10 h-10 rounded-[13px] border bg-gradient-to-br ${meta.tone} shadow-[0_8px_18px_rgba(10,20,43,0.10)]`}>
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white/90 border border-white shadow-sm" />
                        <span className="text-[18px] leading-none rotate-[-7deg] drop-shadow-sm">{meta.glyph}</span>
                      </span>
                      <span className="text-sm font-bold leading-tight">{item.title}</span>
                    </button>
                      );
                    })()
                  ))}
                </div>
              </div>
            ))}
          </aside>

          <div className="order-1 xl:order-2 w-full">
            <div className="mb-4">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy-900 mb-2 leading-tight">
                {tool.title}
              </h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] shadow-[0_40px_100px_rgba(10,20,43,0.08)] border border-gold/20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                {tool.component}
              </div>
            </motion.div>

            <div className="mt-12 flex flex-col items-center xl:items-start gap-4">
              <div className="flex flex-wrap gap-8 items-center justify-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] xl:justify-start">
                <span id="issue-calculator-sebi-copy" className="flex items-center gap-2">
                  <Info size={14} className="text-gold" />
                  Illustrative Investment Calculator
                </span>
                <span className="opacity-20 hidden md:inline">|</span>
                <span className="flex items-center gap-2">
                  <Sparkles size={14} className="text-gold" />
                  Estimate Potential Outcomes
                </span>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed max-w-3xl text-center xl:text-left mt-2">
                These calculators are for illustration and educational purposes only to help understand the power of compounding. The return rates shown (2%–13%) are based on mean of 10-year rolling returns as prescribed by AMFI. Past performance may or may not be sustained in future and is not a guarantee of any future returns.
              </p>
              <p className="text-gray-400 text-[11px] font-semibold max-w-3xl text-center xl:text-left mt-1">
                Mutual Fund investments are subject to market risks, read all scheme related documents carefully.
              </p>
            </div>

            {/* Added Formula & FAQ Sections */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {tool.faqs && <FAQSection faqs={tool.faqs} />}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Calculators = () => {
  const navigate = useNavigate();
  const [hoveredTool, setHoveredTool] = useState(null);
  const homeCategoryOrder = [
    'Core Investment Calculators',
    'Goal Based Calculators',
  ];
  const groupedHomeTools = useMemo(() => {
    const map = {};
    tools.forEach((t) => {
      if (!map[t.category]) map[t.category] = [];
      map[t.category].push(t);
    });
    return homeCategoryOrder
      .filter((k) => Array.isArray(map[k]) && map[k].length)
      .map((k) => ({ category: k, items: map[k] }));
  }, []);
  const categoryStyle = (category) => {
    if (category === 'Core Investment Calculators') {
      return {
        title: 'Core Investment Calculators',
        subtitle: 'Tools designed to simplify common investment-related calculations.',
        glow: 'from-[#FFF6E6] via-[#FDEBC7] to-[#F9E1B0]',
        border: 'border-gold/35',
        iconBg: 'bg-[#FFF6E6]',
      };
    }
    if (category === 'Goal Based Calculators') {
      return {
        title: 'Goal Based Calculators',
        subtitle: 'Tools focused on helping investors understand goal-related investment requirements.',
        glow: 'from-[#FFF9EE] via-[#F8EED8] to-[#F3E5C6]',
        border: 'border-gold/30',
        iconBg: 'bg-[#FDF4DE]',
      };
    }
    return {
      title: category,
      subtitle: '',
      glow: 'from-[#F7F1E3] via-[#F2E7D2] to-[#F6EEDA]',
      border: 'border-gold/25',
      iconBg: 'bg-[#F7EED8]',
    };
  };

  return (
    <section id="calculators" className="pt-16 pb-8 lg:pt-28 lg:pb-12 bg-[#FAF9F6] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(197,160,89,0.14),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(10,20,43,0.07),transparent_35%)]" />
      <div className="container-custom">
        {/* Header Section */}
        <div className="max-w-4xl mb-10 lg:mb-20 relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <span className="w-12 h-px bg-gradient-to-r from-gold to-gold/20" />
            <span className="text-gold font-black text-xs uppercase tracking-[0.32em]">Precision Tools</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-navy-900 mb-8 leading-[1.05]"
          >
            Smart Investment <br />
            <span className="text-gradient-gold italic drop-shadow-[0_8px_20px_rgba(197,160,89,0.25)]">Calculators</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-xl font-serif font-bold text-navy-700 max-w-2xl"
          >
            Explore how different investment scenarios may play out over time.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 items-stretch -mt-6">
          {groupedHomeTools.map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative h-full overflow-hidden bg-white/95 backdrop-blur-sm border rounded-[28px] p-5 lg:p-6 shadow-[0_30px_70px_rgba(10,20,43,0.10)] ${categoryStyle(group.category).border} flex flex-col transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_36px_90px_rgba(10,20,43,0.14)]`}
            >
              <div className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-r ${categoryStyle(group.category).glow} opacity-95`} />
              <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/70 blur-2xl" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.32),transparent_28%)] pointer-events-none" />
              <div className="mb-4 min-h-[90px]">
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-navy-900 bg-gradient-to-b from-[#FFF9EE] to-[#F6E6BF] px-3 py-1.5 rounded-full border border-gold/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_6px_12px_rgba(197,160,89,0.18)] whitespace-nowrap">
                    {categoryStyle(group.category).title}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-navy-900/50 whitespace-nowrap">
                    {group.items.length} tools
                  </span>
                </div>
                <p className="relative z-10 mt-2 text-[12px] font-semibold text-navy-900/60 leading-relaxed min-h-[36px]">
                  {categoryStyle(group.category).subtitle}
                </p>
              </div>
              <div className="space-y-2 flex-1">
                {group.items.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => navigate(`/${item.id}-calculator`)}
                    onMouseEnter={() => setHoveredTool(item.id)}
                    onMouseLeave={() => setHoveredTool(null)}
                    whileHover={{ y: -2 }}
                    className="relative w-full text-left flex items-center justify-between rounded-xl border border-gray-100/90 bg-white/95 px-4 py-3.5 transition-all group hover:shadow-[0_12px_24px_rgba(10,20,43,0.16)] min-h-[58px] overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-navy-900"
                      initial={false}
                      animate={{
                        opacity: hoveredTool === item.id ? 1 : 0,
                        scale: hoveredTool === item.id ? 1 : 0.98
                      }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                    />
                    <span className="flex items-center gap-3 min-w-0 flex-1">
                      <span className={`relative z-10 inline-flex w-9 h-9 items-center justify-center rounded-lg border ${hoveredTool === item.id ? 'border-gold/40 bg-white/10' : `border-gray-100 ${categoryStyle(group.category).iconBg}`}`}>
                        <item.icon size={16} className={`${hoveredTool === item.id ? 'text-gold' : 'text-gold'} shrink-0`} />
                      </span>
                      <span className={`relative z-10 text-[15px] font-bold leading-tight line-clamp-2 ${hoveredTool === item.id ? 'text-white' : 'text-navy-900'}`}>{item.title}</span>
                    </span>
                    <ArrowRight size={15} className={`relative z-10 transition-all shrink-0 ${hoveredTool === item.id ? 'text-gold translate-x-0.5' : 'text-navy-900/40'}`} />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Section Footer Disclaimer */}
        <div className="mt-8 max-w-2xl mx-auto text-center pt-5 border-t border-gold/15">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
            Calculator results are indicative in nature and should not be construed as investment advice or an assurance of returns. Past performance may or may not be sustained in future and is not a guarantee of any future returns.
          </p>
        </div>
      </div>
    </section>
  );
};
export default Calculators;










