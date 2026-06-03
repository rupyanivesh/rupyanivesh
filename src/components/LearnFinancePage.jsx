import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ArrowRight, Check,
  Wallet, Building2, BarChart2, TrendingUp, Target,
} from 'lucide-react';

// ── DATA ─────────────────────────────────────────────────────────────────────

const stats = [
  { num: '₹68L Cr+', label: 'Total MF Industry AUM', sub: 'as of 2024' },
  { num: '10 Cr+', label: 'Active SIP Accounts', sub: 'across India' },
  { num: '44+', label: 'SEBI-Registered AMCs', sub: 'in India' },
  { num: '2500+', label: 'Mutual Fund Schemes', sub: 'Available' },
];

const pillLinks = [
  { label: 'What is a MF?', href: '#lf-what' },
  { label: 'How It Works', href: '#lf-how' },
  { label: 'Types', href: '#lf-types' },
  { label: 'Key Concepts', href: '#lf-concepts' },
  { label: 'Watch & Learn', href: '#lf-videos' },
  { label: 'Risk & Return', href: '#lf-risk' },
  { label: 'SIP vs Lump Sum', href: '#lf-sipvslump' },
  { label: 'Glossary', href: '#lf-glossary' },
  { label: 'Checklist', href: '#lf-checklist' },
];

const flowSteps = [
  { Icon: Wallet, title: 'You Invest', desc: 'Invest any amount through a distributor or directly with the AMC.' },
  { Icon: Building2, title: 'AMC Collects', desc: 'The Asset Management Company pools your money with thousands of other investors.' },
  { Icon: BarChart2, title: 'Fund Manager Deploys', desc: 'A SEBI-registered Fund Manager researches and allocates the pooled corpus into securities.' },
  { Icon: TrendingUp, title: 'NAV Changes Daily', desc: 'Net Asset Value changes daily based on market movements, which affects the value of your investment.' },
  { Icon: Target, title: 'You Earn Returns', desc: 'Redeem your units anytime (open-ended funds) and receive returns proportional to your investment.' },
];

const fundTabs = [
  { id: 'equity', label: 'By Asset Class' },
  { id: 'structure', label: 'By Structure' },
  { id: 'goal', label: 'By Goal' },
];

const fundCards = {
  equity: [
    { badge: 'Equity Fund', badgeCls: 'bg-gold/15 text-navy-900 border border-gold/30', title: 'Equity Mutual Funds', desc: 'Invest primarily in stocks of companies. Suitable for investors with long-term horizons (5+ years) and higher risk tolerance. Returns are subject to market risks.', riskLabel: 'High', riskPct: 85 },
    { badge: 'Debt Fund', badgeCls: 'bg-[#F5F1E6] text-navy-900/80 border border-gold/20', title: 'Debt Mutual Funds', desc: 'Invest in bonds, government securities, and fixed-income instruments. Lower risk, stable but modest returns. Good for 1–3 year goals.', riskLabel: 'Low', riskPct: 20 },
    { badge: 'Hybrid Fund', badgeCls: 'bg-navy-900/10 text-navy-900 border border-navy-900/15', title: 'Hybrid Mutual Funds', desc: 'Mix of equity and debt. Balanced approach  -  moderates risk while providing growth potential. Ideal for moderate risk investors.', riskLabel: 'Medium', riskPct: 55 },
    { badge: 'ELSS Fund', badgeCls: 'bg-gold/20 text-navy-900 border border-gold/35', title: 'ELSS (Tax Saving)', desc: 'Equity Linked Savings Scheme  -  invests in equities with a 3-year lock-in. Eligible for ₹1.5 lakh deduction under Section 80C.', riskLabel: 'High', riskPct: 85 },
    { badge: 'Index Fund', badgeCls: 'bg-[#F7F5EF] text-navy-900/80 border border-gray-200', title: 'Index Funds', desc: 'Passively track a market index like Nifty 50 or Sensex. Lower expense ratio. Suitable for investors who prefer market-matching returns.', riskLabel: 'Medium', riskPct: 55 },
    { badge: 'Liquid Fund', badgeCls: 'bg-[#F5F1E6] text-navy-900/80 border border-gold/20', title: 'Liquid Funds', desc: 'Invest in very short-term instruments (up to 91 days). Highly liquid  -  almost like a savings account, but with slightly better returns.', riskLabel: 'Very Low', riskPct: 12 },
  ],
  structure: [
    { badge: 'Open-Ended', badgeCls: 'bg-[#F5F1E6] text-navy-900/80 border border-gold/20', title: 'Open-Ended Funds', desc: 'Can be bought or sold at any time at the current NAV. Most mutual funds in India are open-ended. Offers maximum liquidity and flexibility.', riskLabel: 'High', riskPct: 85 },
    { badge: 'Closed-Ended', badgeCls: 'bg-gold/20 text-navy-900 border border-gold/35', title: 'Closed-Ended Funds', desc: 'Have a fixed maturity period (3–15 years). Units can only be bought during the NFO period. Listed on stock exchanges for exit.', riskLabel: 'Low', riskPct: 20 },
    { badge: 'Interval', badgeCls: 'bg-navy-900/10 text-navy-900 border border-navy-900/15', title: 'Interval Funds', desc: 'Allow transactions only during specific intervals. Combination of open and closed-ended features. Less common but useful for specific strategies.', riskLabel: 'Medium', riskPct: 50 },
  ],
  goal: [
    { badge: 'Wealth Building', badgeCls: 'bg-gold/15 text-navy-900 border border-gold/30', title: 'For Long-Term Growth', desc: 'Large-cap, mid-cap, or flexi-cap equity funds for investors with 7–10+ year horizon. Returns depend on market conditions and time horizon. Past performance is not indicative of future returns.', riskLabel: '7+ yrs', riskPct: 85 },
    { badge: 'Tax Saving', badgeCls: 'bg-gold/20 text-navy-900 border border-gold/35', title: 'For Tax Planning', desc: 'ELSS funds provide equity exposure + ₹1.5 lakh 80C deduction. Shortest lock-in (3 years) among all 80C instruments.', riskLabel: '3 years', riskPct: 50 },
    { badge: 'Emergency Fund', badgeCls: 'bg-[#F5F1E6] text-navy-900/80 border border-gold/20', title: 'For Parking Cash', desc: 'Liquid funds or overnight funds. Equivalent to a savings account  -  but can earn slightly more. Withdraw within 1 business day.', riskLabel: 'Anytime', riskPct: 12 },
    { badge: "Child's Education", badgeCls: 'bg-navy-900/10 text-navy-900 border border-navy-900/15', title: 'For Future Goals', desc: "Children's funds or balanced advantage funds with SIPs that align with goal timeline. Starting early may allow more time in the market, though returns are subject to market risks and are not guaranteed.", riskLabel: '5–15 yrs', riskPct: 80 },
    { badge: 'Regular Income', badgeCls: 'bg-navy-900/10 text-navy-900 border border-navy-900/15', title: 'For Monthly Cash Flow', desc: 'SWP (Systematic Withdrawal Plan) from balanced or debt funds can generate a monthly income stream post-retirement.', riskLabel: 'Post-retire', riskPct: 50 },
    { badge: 'Index Investing', badgeCls: 'bg-[#F7F5EF] text-navy-900/80 border border-gray-200', title: 'For Passive Growth', desc: 'Nifty 50 or Nifty Next 50 index funds. Low cost. No fund manager bias. Ideal for first-time investors who want simplicity.', riskLabel: 'Very Low', riskPct: 12 },
  ],
};

const accordionItems = [
  { q: 'What is NAV (Net Asset Value)?', a: 'NAV is the price per unit of a mutual fund on a given day. It is calculated by dividing the total value of the fund\'s assets (minus liabilities) by the total number of units. Formula: NAV = (Total Assets – Liabilities) / Total Units. NAV is declared at end of each business day. Buying at a lower NAV doesn\'t mean it\'s "cheaper"  -  what matters is the fund\'s quality and growth potential.' },
  { q: 'What is an Expense Ratio?', a: 'The annual fee charged by the AMC for managing your money  -  expressed as a percentage of your invested amount. For example, a 1% expense ratio on ₹1 lakh means ₹1,000 per year is deducted. Lower expense ratios (like index funds at 0.1–0.2%) mean more of the return stays with you. SEBI has capped expense ratios to protect investors.' },
  { q: 'What is an Exit Load?', a: 'A small penalty charged when you redeem your units before a certain period  -  typically 1 year for equity funds. For example, if you exit within 1 year, the fund may charge 1% of your redemption value as exit load. This discourages premature withdrawals and protects long-term investors in the fund.' },
  { q: 'What is the Power of Compounding?', a: 'Compounding means earning returns on your returns. If you invest ₹1 lakh at 12% per year, after year 1 you have ₹1.12 lakh. Year 2, you earn 12% on ₹1.12 lakh  -  not just on your original ₹1 lakh. Over 20–30 years, this snowball effect can turn modest investments into life-changing wealth.' },
  { q: 'What is Rupee Cost Averaging?', a: 'When you invest a fixed amount via SIP every month, you automatically buy more units when markets are low and fewer when markets are high. Over time, this averages out your cost per unit. You don\'t need to time the market  -  your SIP does the smart work for you automatically.' },
  { q: 'What is KYC and why is it required?', a: 'KYC (Know Your Customer) is a mandatory SEBI requirement before investing in mutual funds. It involves submitting your PAN card, Aadhaar, address proof, and a photograph. It\'s a one-time process that can now be completed digitally (eKYC via Aadhaar OTP). Without KYC, you cannot invest in any mutual fund in India.' },
];

const conceptCards = [
  { icon: '🏷️', title: 'Direct vs Regular Plans', desc: 'Direct plans have no distributor commission  -  lower expense ratio, slightly higher returns. Regular plans involve a distributor who guides you. For new investors, guidance from a registered distributor often outweighs the marginal cost difference.' },
  { icon: '📋', title: 'Growth vs Dividend (IDCW) Option', desc: 'Growth option reinvests profits  -  ideal for wealth building. IDCW pays out periodic distributions. For most long-term goals, Growth option with compounding wins significantly over time.' },
  { icon: '🔄', title: 'SIP, STP & SWP', desc: 'SIP = Invest a fixed amount monthly. STP = Systematically transfer between funds. SWP = Withdraw a fixed amount monthly from your corpus. Together these let you invest, reallocate, and create income streams efficiently.' },
  { icon: '💡', title: 'What is an AMC?', desc: 'Asset Management Company manages your mutual fund  -  e.g., HDFC AMC, SBI Mutual Fund, Mirae Asset. They are registered with SEBI and responsible for all investment decisions within the fund.' },
];

const videoTabs = [
  { id: 'all', label: 'All Videos' },
  { id: 'basics', label: 'Basics' },
  { id: 'sip', label: 'SIP' },
  { id: 'types', label: 'Fund Types' },
  { id: 'tax', label: 'Tax' },
];

const videos = [
  { id: '5E_LZoAGmwM', cat: 'basics', catLabel: 'Basics', title: 'What is a Mutual Fund? Explained Simply', desc: 'The clearest beginner-friendly explanation of how mutual funds work, in Hindi & English.' },
  { id: 'OwSdwgsvnVQ', cat: 'types', catLabel: 'Fund Types', title: 'Types of Mutual Funds  -  Which One is Right for You?', desc: 'Equity, Debt, Hybrid, ELSS  -  a simple breakdown of each fund category and who should use them.' },
  { id: 'r50yf4d5vRQ', cat: 'sip', catLabel: 'SIP', title: 'What is SIP? How Systematic Investment Plans Work', desc: 'Understand why investing a fixed amount monthly can be smarter than waiting for the "right time."' },
  { id: 'MNBgrNe1Yz8', cat: 'basics', catLabel: 'Basics', title: 'Start Investing  -  Your First Step to Wealth', desc: 'A practical guide to getting started with mutual fund investing in India.' },
  { id: '9YXHQq82wHg', cat: 'basics', catLabel: 'Basics', title: 'Goal-Based Investing  -  How to Invest with a Purpose', desc: 'Learn how to align your investments with life goals like retirement, education, and home buying.' },
  { id: 'jstolhRTPXM', cat: 'basics', catLabel: 'Basics', title: 'Diversification  -  Why Not to Put All Eggs in One Basket', desc: 'How spreading your investments across asset classes reduces risk and improves long-term returns.' },
];

const riskSpectrum = [
  { dotCls: 'bg-[#D4B679]', name: 'Low Risk', funds: 'Overnight, Liquid Funds', pct: 20 },
  { dotCls: 'bg-[#C9A84C]', name: 'Low to Moderate', funds: 'Arbitrage, Short Duration', pct: 35 },
  { dotCls: 'bg-gold', name: 'Moderate Risk', funds: 'Hybrid, Balanced Funds', pct: 55 },
  { dotCls: 'bg-navy-700', name: 'Moderately High', funds: 'Large Cap, Index Funds', pct: 72 },
  { dotCls: 'bg-navy-900', name: 'High Risk', funds: 'Small Cap, Sectoral', pct: 90 },
];

const riskTable = [
  { cat: 'Liquid Fund', risk: 'Low', cls: 'bg-[#F5F1E6] text-navy-900/80 border border-gold/20', horizon: '1 day – 3 months' },
  { cat: 'Short Duration Debt', risk: 'Low', cls: 'bg-[#F5F1E6] text-navy-900/80 border border-gold/20', horizon: '1 – 3 years' },
  { cat: 'Balanced Advantage', risk: 'Moderate', cls: 'bg-gold/15 text-navy-900 border border-gold/30', horizon: '3 – 5 years' },
  { cat: 'Large Cap Equity', risk: 'Mod-High', cls: 'bg-gold/20 text-navy-900 border border-gold/35', horizon: '5 – 7 years' },
  { cat: 'Mid Cap Equity', risk: 'High', cls: 'bg-navy-900/10 text-navy-900 border border-navy-900/20', horizon: '7 – 10 years' },
  { cat: 'Small Cap Equity', risk: 'Very High', cls: 'bg-navy-900 text-white border border-navy-900', horizon: '10+ years' },
  { cat: 'ELSS (Tax Saving)', risk: 'High', cls: 'bg-navy-900/10 text-navy-900 border border-navy-900/20', horizon: '3 yrs (lock-in)' },
  { cat: 'Index Fund (Nifty 50)', risk: 'Mod-High', cls: 'bg-gold/20 text-navy-900 border border-gold/35', horizon: '5+ years' },
];

const glossaryTerms = [
  { term: 'AUM (Assets Under Management)', meaning: "The total market value of all investments managed by a mutual fund. Larger AUM generally indicates investor trust, though very large AUMs can sometimes limit a fund's agility.", letter: 'A' },
  { term: 'AMC (Asset Management Company)', meaning: 'The company that manages your mutual fund  -  e.g., SBI Mutual Fund, HDFC AMC. Registered with SEBI, they are responsible for all investment decisions.', letter: 'A' },
  { term: 'AMFI (Association of Mutual Funds India)', meaning: 'The self-regulatory body for mutual fund distributors in India. All MFDs must be AMFI-registered with a valid ARN number before they can sell mutual funds.', letter: 'A' },
  { term: 'Benchmark', meaning: "A standard index (like Nifty 50) against which a fund's performance is measured. If a fund consistently beats its benchmark, it's adding value over passive investing.", letter: 'B' },
  { term: 'CAGR (Compound Annual Growth Rate)', meaning: 'The rate at which an investment grows annually over a given period, accounting for compounding. Used to compare returns across different investment options fairly.', letter: 'C' },
  { term: 'Corpus', meaning: "The total pool of money in a mutual fund. When you invest, your money becomes part of the fund's corpus, which is managed collectively by the fund manager.", letter: 'C' },
  { term: 'Diversification', meaning: 'Spreading investments across multiple securities, sectors, and asset classes to reduce risk. A key advantage of mutual funds  -  your ₹1,000 is instantly diversified across 50+ stocks.', letter: 'D' },
  { term: 'Direct Plan', meaning: 'A plan where you invest directly with the AMC without going through a distributor. Lower expense ratio, but no advisory support. Best for experienced, self-directed investors.', letter: 'D' },
  { term: 'Expense Ratio', meaning: 'Annual fee charged by the AMC as a % of your invested amount. SEBI has capped these. A 0.5% difference in expense ratio can significantly impact long-term returns.', letter: 'E' },
  { term: 'Exit Load', meaning: 'A fee charged if you redeem your investment before a specified period. Most equity funds charge 1% if redeemed within 1 year. Encourages long-term holding.', letter: 'E' },
  { term: 'Fund Manager', meaning: "A qualified professional who manages the mutual fund's portfolio. They research markets, select securities, and make buy/sell decisions based on the fund's objective.", letter: 'F' },
  { term: 'Folio Number', meaning: 'Your unique account number with a mutual fund house. Similar to a bank account number  -  it helps track all your investments with that particular AMC.', letter: 'F' },
  { term: 'NAV (Net Asset Value)', meaning: 'The price per unit of a mutual fund, calculated daily after market close. NAV = (Total Assets – Liabilities) / Total Units. Not an indicator of fund quality on its own.', letter: 'N' },
  { term: 'NFO (New Fund Offer)', meaning: 'When an AMC launches a brand new mutual fund scheme and offers units at ₹10 each. Not necessarily better than existing funds  -  always evaluate the objective and category.', letter: 'N' },
  { term: 'Regular Plan', meaning: 'A plan where you invest through a registered distributor who receives a commission from the AMC. Slightly higher expense ratio, but includes professional guidance.', letter: 'R' },
  { term: 'Redemption', meaning: "Selling your mutual fund units to get back your money. For open-ended funds, redemption requests are processed at the same day's closing NAV (if placed before cut-off time).", letter: 'R' },
  { term: 'SIP (Systematic Investment Plan)', meaning: 'Investing a fixed amount at regular intervals (monthly/weekly). Automates investing, leverages rupee cost averaging, and builds wealth through compounding over time.', letter: 'S' },
  { term: 'SWP (Systematic Withdrawal Plan)', meaning: 'Withdrawing a fixed amount from your mutual fund at regular intervals. Used primarily by retirees to create a monthly income stream from their invested corpus.', letter: 'S' },
  { term: 'STP (Systematic Transfer Plan)', meaning: 'Automatically moving a fixed amount from one fund to another at regular intervals. Commonly used to shift from a liquid/debt fund into equity gradually  -  reducing timing risk.', letter: 'S' },
  { term: 'XIRR (Extended Internal Rate of Return)', meaning: 'The most accurate way to measure SIP returns, accounting for different investment amounts at different times. Unlike CAGR, XIRR reflects the true annualised return on your actual cash flows.', letter: 'X' },
];

const alphaLetters = ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'N', 'R', 'S', 'X'];

const checklistDocs = [
  'PAN available for investment registration',
  'KYC completed through a SEBI-authorised KRA',
  'Bank account ready for investment and redemption',
  'Mobile number and email updated',
  'Nominee details updated',
];

const checklistMindset = [
  'I have defined my financial goal',
  'I know my investment horizon',
  'I understand that mutual funds carry market risk',
  'I understand that past performance does not guarantee future returns',
  'I have reviewed the SID/KIM before investing',
];

// ── SHARED HELPERS ────────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

const SectionHeader = ({ tag, title, subtitle, light = false }) => (
  <div className="mb-10 lg:mb-14">
    <motion.div {...fadeUp(0)} className="flex items-center gap-3 mb-4">
      <span className="w-8 h-px bg-gold" />
      <span className="text-gold font-bold text-[10px] uppercase tracking-[0.3em]">{tag}</span>
    </motion.div>
    <motion.h2
      {...fadeUp(0.05)}
      className={`text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight mb-4 ${light ? 'text-white' : 'text-navy-900'}`}
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p
        {...fadeUp(0.1)}
        className={`text-sm md:text-base leading-relaxed max-w-2xl ${light ? 'text-white/60' : 'text-navy-900/60'}`}
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

const RiskBar = ({ label, pct }) => {
  const color = pct >= 70 ? 'bg-navy-900' : pct >= 40 ? 'bg-gold' : 'bg-[#D4B679]';
  return (
    <div className="flex items-center gap-3 mt-4">
      <span className="text-[11px] text-gray-400 shrink-0">Risk</span>
      <div className="flex-1 h-1.5 rounded-full bg-gray-100">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] text-gray-400 shrink-0">{label}</span>
    </div>
  );
};

// ── SECTION COMPONENTS ────────────────────────────────────────────────────────

const HeroSection = () => (
  <section className="bg-navy-900 pt-28 pb-16 lg:pt-36 lg:pb-20 relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[120px]" />
    </div>
    <div className="container-custom relative z-10 text-center">
      <motion.p {...fadeUp(0)} className="text-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-5">
        RupyaNivesh · Learn Finance
      </motion.p>
      <motion.h1
        {...fadeUp(0.08)}
        className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-10"
      >
        Everything You Need to Know<br />
        About <span className="text-gold italic">Mutual Funds</span>  -  Simply.
      </motion.h1>
      {/* Pill nav */}
      <motion.div {...fadeUp(0.18)} className="flex flex-wrap justify-center gap-2 mb-14">
        {pillLinks.map((p) => (
          <button
            key={p.href}
            onClick={() => document.getElementById(p.href.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="px-4 py-2 rounded-full border border-white/15 text-white/70 text-xs font-medium bg-white/5 hover:bg-gold hover:border-gold hover:text-navy-900 hover:font-bold transition-all"
          >
            {p.label}
          </button>
        ))}
      </motion.div>

      {/* Stats bar */}
      <motion.div
        {...fadeUp(0.22)}
        className="bg-white rounded-2xl border-t-4 border-gold overflow-hidden grid grid-cols-2 lg:grid-cols-4 shadow-2xl"
      >
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`p-6 lg:p-8 text-center ${i < stats.length - 1 ? 'border-b lg:border-b-0 lg:border-r border-gray-100' : ''}`}
          >
            <div className="text-3xl lg:text-4xl font-serif font-bold text-gold mb-1">{s.num}</div>
            <div className="text-xs text-gray-500 leading-tight">
              {s.label}<br /><span className="text-gray-400">{s.sub}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

const WhatSection = () => (
  <section id="lf-what" className="py-20 lg:py-28 bg-[#FAF9F6]">
    <div className="container-custom">
      <SectionHeader
        tag="The Basics"
        title="What Exactly is a Mutual Fund?"
        subtitle="If you've ever wondered where to start  -  you're in the right place. Let's make this crystal clear."
      />
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <motion.div {...fadeUp(0.05)} className="space-y-4 text-navy-900/70 leading-relaxed text-sm md:text-base">
          <p>
            A <strong className="text-navy-900">Mutual Fund is a pool of money collected from many investors</strong>  -  like you  -  and invested collectively into stocks, bonds, or other assets by a professional fund manager.
          </p>
          <p>
            Think of it like this: You and 10,000 other people each contribute ₹5,000. Now you have ₹5 crores to invest. A trained professional (the Fund Manager) uses this large pool to buy shares of multiple companies.{' '}
            <strong className="text-navy-900">You own a proportionate share of the entire portfolio.</strong>
          </p>
          <p>
            When the investments grow, your share of the profit grows too. Since the money is spread across many assets, the risk is significantly reduced. This is the magic of{' '}
            <strong className="text-navy-900">diversification</strong>.
          </p>
          <p>
            Mutual Funds in India are <strong className="text-navy-900">regulated by SEBI</strong> and distributed through AMFI-registered distributors, ensuring investor protection at every step.
          </p>
        </motion.div>

        {/* Analogy box */}
        <motion.div
          {...fadeUp(0.1)}
          className="bg-navy-900 rounded-3xl p-8 lg:p-10 text-white relative overflow-hidden"
        >
          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-gold/10 blur-2xl" />
          <div className="relative z-10">
            <span className="text-gold text-[10px] font-bold uppercase tracking-[0.25em] mb-3 block">
              The "Lunch Box" Analogy
            </span>
            <h3 className="text-2xl font-serif font-bold mb-4 leading-snug">Imagine a shared lunch box</h3>
            <p className="text-white/70 text-sm leading-relaxed mb-3">
              You want a full nutritious meal, but you can't afford to buy all ingredients separately. So 10 of you pool ₹50 each and hire a cook. The cook buys the best ingredients and prepares a balanced meal for everyone.
            </p>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              You each get your share of the meal  -  proportional to what you contributed.{' '}
              <strong className="text-white">The outcome is always a balanced, managed result.</strong>
            </p>
            <div className="space-y-3">
              {[
                'You invest a small amount (even ₹500/month)',
                'Your money pools with thousands of others',
                'A SEBI-registered Fund Manager invests it wisely',
                'Returns are distributed proportionally to investors',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center text-navy-900 text-[11px] font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-white/80 text-sm leading-snug">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const HowItWorksSection = () => (
  <section id="lf-how" className="py-20 lg:py-28 bg-navy-900 relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
    </div>
    <div className="container-custom relative z-10">
      <SectionHeader
        light
        tag="The Process"
        title="How Does a Mutual Fund Work?"
        subtitle="From your ₹500 to a diversified portfolio  -  here's the journey your money takes."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-0 mt-4 relative">
        {/* connector line desktop */}
        <div className="hidden lg:block absolute top-9 left-[10%] w-[80%] h-px bg-gradient-to-r from-gold/80 to-gold/10" />
        {flowSteps.map(({ Icon, title, desc }, i) => (
          <motion.div
            key={title}
            {...fadeUp(i * 0.08)}
            className="flex flex-col items-center text-center px-4 relative z-10"
          >
            <div className="w-16 h-16 lg:w-[72px] lg:h-[72px] rounded-full bg-gold flex items-center justify-center shadow-[0_0_0_8px_rgba(201,168,76,0.15)] mb-5 hover:scale-110 transition-transform">
              <Icon size={24} className="text-navy-900" />
            </div>
            <h4 className="text-white font-serif font-bold text-base mb-2">{title}</h4>
            <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const TypesSection = () => {
  const [activeTab, setActiveTab] = useState('equity');
  return (
    <section id="lf-types" className="py-20 lg:py-28 bg-[#FAF9F6]">
      <div className="container-custom">
        <SectionHeader
          tag="Fund Categories"
          title="Types of Mutual Funds"
          subtitle="There's a fund for every goal, every risk appetite, and every time horizon."
        />
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {fundTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-5 py-2 rounded-full border text-sm font-medium transition-all ${activeTab === t.id
                  ? 'bg-navy-900 border-navy-900 text-white'
                  : 'border-gray-200 text-navy-900/50 hover:border-navy-900/40 hover:text-navy-900'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {fundCards[activeTab].map((card) => (
              <div
                key={card.title}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-gold/50 hover:shadow-[0_8px_30px_rgba(201,168,76,0.1)] hover:-translate-y-1 transition-all duration-300"
              >
                <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 ${card.badgeCls}`}>
                  {card.badge}
                </span>
                <h4 className="text-navy-900 font-serif font-bold text-lg mb-2">{card.title}</h4>
                <p className="text-navy-900/60 text-sm leading-relaxed">{card.desc}</p>
                <RiskBar label={card.riskLabel} pct={card.riskPct} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

const ConceptsSection = () => {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <section id="lf-concepts" className="py-20 lg:py-28 bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-start">
          {/* Left column: header + accordion */}
          <div>
            <SectionHeader
              tag="Financial Literacy"
              title="Key Concepts You Must Know"
              subtitle="These are the terms every investor hears  -  and every investor should truly understand before starting."
            />
            <motion.div {...fadeUp(0.05)} className="space-y-0">
            {accordionItems.map((item, i) => (
              <div key={i} className="border-b border-gray-100">
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className="w-full text-left py-5 flex items-center justify-between gap-4 group"
                >
                  <h4 className="text-navy-900 font-medium text-sm md:text-base group-hover:text-gold transition-colors">
                    {item.q}
                  </h4>
                  <ChevronDown
                    size={18}
                    className={`text-gold shrink-0 transition-transform duration-300 ${openIdx === i ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openIdx === i && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="text-navy-900/60 text-sm leading-relaxed pb-5">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            </motion.div>
          </div>

          {/* Concept cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="space-y-4 lg:sticky lg:top-28"
          >
            {conceptCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.06 * i, ease: 'easeOut' }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group relative overflow-hidden bg-gradient-to-br from-[#FCFAF4] to-[#F6F2E8] border border-gold/20 rounded-2xl p-5 flex gap-4 items-start shadow-[0_8px_22px_rgba(10,20,43,0.06)] hover:border-gold/45 hover:shadow-[0_14px_34px_rgba(201,168,76,0.18)] transition-all"
              >
                <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-gold/10 blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <motion.span
                  whileHover={{ rotate: -8, scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                  className="relative z-10 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-gold/25 text-2xl shrink-0 mt-0.5 shadow-sm"
                >
                  {card.icon}
                </motion.span>
                <div className="relative z-10">
                  <h4 className="text-navy-900 font-serif font-bold text-base mb-1">{card.title}</h4>
                  <p className="text-navy-900/60 text-sm leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const VideosSection = () => {
  return (
    <section id="lf-videos" className="py-20 lg:py-28 bg-[#F0EDE6]">
      <div className="container-custom">
        <SectionHeader
          tag="Watch & Learn"
          title="Learn Through Videos"
        />

        <AnimatePresence mode="wait">
          <motion.div
            key="all"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {videos.map((v) => (
              <motion.div
                key={v.id}
                {...fadeUp(0)}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute inset-0 w-full h-full border-0"
                    src={`https://www.youtube.com/embed/${v.id}?rel=0&iv_load_policy=3&modestbranding=1`}
                    title={v.title}
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <span className="text-gold text-[10px] font-bold uppercase tracking-widest">{v.catLabel}</span>
                  <h4 className="text-navy-900 font-serif font-bold text-base mt-1 mb-1 leading-snug">{v.title}</h4>
                  <p className="text-navy-900/50 text-xs leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

const RiskReturnSection = () => (
  <section id="lf-risk" className="py-14 lg:py-28 bg-[#FAF9F6]">
    <div className="container-custom">
      <SectionHeader
        tag="Risk Management"
        title="Understanding Risk & Return"
        subtitle="Risk isn't your enemy  -  ignorance of risk is. Here's how to read the riskometer on every mutual fund document."
      />
      <div className="grid lg:grid-cols-2 gap-5 sm:gap-7 lg:gap-14 items-start">
        {/* Spectrum */}
        <motion.div {...fadeUp(0.05)} className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 lg:p-8 min-w-0">
          <h4 className="text-navy-900 font-serif font-bold text-lg sm:text-xl mb-4 sm:mb-6 leading-tight">
            SEBI Riskometer  -  What Each Level Means
          </h4>
          <div className="space-y-3.5">
            {riskSpectrum.map((row) => (
              <div key={row.name} className="rounded-xl border border-gray-100 bg-[#FCFCFA] p-3 sm:p-3.5 min-w-0">
                <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-3 h-3 rounded-full shrink-0 ${row.dotCls}`} />
                  <span className="text-navy-900 text-sm font-semibold flex-1 min-w-0 break-words leading-tight">{row.name}</span>
                </div>
                <div className="mt-2 flex items-center gap-2.5 min-w-0">
                  <div className="flex-1 h-1.5 rounded-full bg-gray-100 min-w-0">
                  <div className={`h-full rounded-full ${row.dotCls} transition-all`} style={{ width: `${row.pct}%` }} />
                </div>
                  <span className="text-navy-900/45 text-[11px] shrink-0 text-right whitespace-nowrap">{row.funds}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Table */}
        <motion.div {...fadeUp(0.1)}>
          <div className="md:hidden space-y-2.5">
            {riskTable.map((row) => (
              <div key={row.cat} className="rounded-xl border border-gray-100 bg-white p-3.5">
                <p className="text-navy-900 text-sm font-semibold leading-snug">{row.cat}</p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${row.cls}`}>
                    {row.risk}
                  </span>
                  <span className="text-[11px] text-navy-900/50 text-right">{row.horizon}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="text-[10px] font-bold uppercase tracking-widest text-navy-900/40 text-left py-3 px-4">Fund Category</th>
                  <th className="text-[10px] font-bold uppercase tracking-widest text-navy-900/40 text-left py-3 px-4">Risk</th>
                  <th className="text-[10px] font-bold uppercase tracking-widest text-navy-900/40 text-left py-3 px-4">Ideal Horizon</th>
                </tr>
              </thead>
              <tbody>
                {riskTable.map((row, i) => (
                  <tr key={row.cat} className={`border-b border-gray-50 hover:bg-[#FAF9F6] transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                    <td className="py-3 px-4 text-navy-900 font-medium">{row.cat}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${row.cls}`}>
                        {row.risk}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-navy-900/50">{row.horizon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-navy-900/40 mt-3.5 leading-relaxed">
            SEBI mandates that every mutual fund scheme display this riskometer in all scheme documents and advertisements.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

const SIPvsLumpSumSection = () => (
  <section id="lf-sipvslump" className="py-14 lg:py-28 bg-navy-900 relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gold/6 rounded-full blur-3xl" />
    </div>
    <div className="container-custom relative z-10">
      <SectionHeader
        light
        tag="Strategy"
        title="SIP vs Lump Sum  -  Know the Difference"
        subtitle="Both approaches have their place. The right one depends entirely on your situation, not on what's trending."
      />
      <div className="grid md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
        {/* SIP card */}
        <motion.div
          {...fadeUp(0.05)}
          className="rounded-2xl p-4 sm:p-6 lg:p-9 border border-gold/30 bg-gold/10 min-w-0"
        >
          <h3 className="text-white font-serif text-2xl sm:text-3xl font-bold mb-1">SIP</h3>
          <p className="text-white/55 text-xs sm:text-sm mb-4 sm:mb-6">Systematic Investment Plan</p>
          <ul className="space-y-2.5 sm:space-y-3">
            {[
              'Invest a fixed amount every month (₹500, ₹1,000, ₹5,000...)',
              'Benefits from Rupee Cost Averaging  -  buy more units when markets fall',
              'Builds investing discipline with auto-debit',
              "Doesn't require market timing  -  works in all market conditions",
              'Best suited for salaried individuals with regular income',
              'Start and stop anytime  -  no penalty for pausing',
            ].map((li, i) => (
              <li key={i} className="flex gap-2.5 text-white/80 text-[13px] sm:text-sm leading-relaxed min-w-0">
                <ArrowRight size={13} className="text-gold shrink-0 mt-0.5" />
                {li}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Lump Sum card */}
        <motion.div
          {...fadeUp(0.1)}
          className="rounded-2xl p-4 sm:p-6 lg:p-9 border border-white/10 bg-white/[0.04] min-w-0"
        >
          <h3 className="text-white font-serif text-2xl sm:text-3xl font-bold mb-1">Lump Sum</h3>
          <p className="text-white/55 text-xs sm:text-sm mb-4 sm:mb-6">One-Time Investment</p>
          <ul className="space-y-2.5 sm:space-y-3">
            {[
              'Invest a large amount all at once',
              'Best when markets are significantly undervalued (corrections)',
              'Requires good timing or risk of entering at market peak',
              'Better returns if market consistently rises after investment',
              'Suitable for bonuses, inheritance, or sale of an asset',
              'Consider STP (Systematic Transfer Plan) to reduce timing risk',
            ].map((li, i) => (
              <li key={i} className="flex gap-2.5 text-white/80 text-[13px] sm:text-sm leading-relaxed min-w-0">
                <ArrowRight size={13} className="text-gold/60 shrink-0 mt-0.5" />
                {li}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  </section>
);

const GlossarySection = () => {
  const [activeLetter, setActiveLetter] = useState('All');
  const [selected, setSelected] = useState(glossaryTerms[0]);

  const filtered = activeLetter === 'All' ? glossaryTerms : glossaryTerms.filter((t) => t.letter === activeLetter);

  const handleSelect = (term) => {
    setSelected(term);
  };

  return (
    <section id="lf-glossary" className="py-14 lg:py-24 bg-[#FAF9F6]">
      <div className="container-custom">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <motion.div {...fadeUp(0)} className="flex items-center gap-3 mb-3">
              <span className="w-8 h-px bg-gold" />
              <span className="text-gold font-bold text-[10px] uppercase tracking-[0.3em]">Reference</span>
            </motion.div>
            <motion.h2 {...fadeUp(0.05)} className="text-3xl md:text-4xl font-serif font-bold text-navy-900">
              Mutual Fund Glossary
            </motion.h2>
          </div>
          {/* Alpha filter */}
          <motion.div {...fadeUp(0.08)} className="-mx-1 px-1 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {alphaLetters.map((l) => (
              <button
                key={l}
                onClick={() => {
                  setActiveLetter(l);
                  const first = l === 'All' ? glossaryTerms[0] : glossaryTerms.find((t) => t.letter === l);
                  if (first) setSelected(first);
                }}
                className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-xs font-medium transition-all mr-1.5 ${activeLetter === l
                    ? 'bg-navy-900 border-navy-900 text-white'
                    : 'border-gray-200 text-navy-900/50 hover:border-navy-900/40 hover:text-navy-900'
                  }`}
              >
                {l}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Two-panel layout */}
        <div className="grid lg:grid-cols-[2fr_3fr] gap-4 items-start">
          {/* Mobile-first: definition first for faster readability */}
          <div className="lg:hidden">
            <AnimatePresence mode="wait">
              {selected && (
                <motion.div
                  key={`m-${selected.term}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="bg-navy-900 rounded-2xl p-5 relative overflow-hidden"
                >
                  <div className="absolute -top-16 -right-16 w-48 h-48 bg-gold/8 rounded-full blur-2xl pointer-events-none" />
                  <div className="relative z-10">
                    <h3 className="text-white font-serif font-bold text-xl leading-tight mb-4">
                      {selected.term}
                    </h3>
                    <div className="w-10 h-px bg-gold/40 mb-4" />
                    <p className="text-white/75 text-sm leading-relaxed">
                      {selected.meaning}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Left: compact term list */}
          <motion.div
            {...fadeUp(0.08)}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden max-h-[58vh] overflow-y-auto"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLetter}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {filtered.map((t) => (
                  <button
                    key={t.term}
                    onClick={() => handleSelect(t)}
                    className={`w-full text-left px-4 sm:px-5 py-3 flex items-center justify-between gap-3 transition-all border-b border-gray-50 last:border-b-0 group ${selected?.term === t.term
                        ? 'bg-navy-900 text-white'
                        : 'hover:bg-[#FAF9F6] text-navy-900'
                      }`}
                  >
                    <span className={`text-sm font-medium leading-snug min-w-0 break-words ${selected?.term === t.term ? 'text-white' : 'text-navy-900'}`}>
                      {t.term}
                    </span>
                  </button>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right: definition panel */}
          <div className="hidden lg:block lg:sticky lg:top-28">
            <AnimatePresence mode="wait">
              {selected && (
                <motion.div
                  key={selected.term}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="bg-navy-900 rounded-2xl p-8 lg:p-10 relative overflow-hidden"
                >
                  <div className="absolute -top-16 -right-16 w-48 h-48 bg-gold/8 rounded-full blur-2xl pointer-events-none" />
                  <div className="relative z-10">
                    <h3 className="text-white font-serif font-bold text-2xl lg:text-3xl leading-tight mb-5">
                      {selected.term}
                    </h3>
                    <div className="w-10 h-px bg-gold/40 mb-5" />
                    <p className="text-white/70 text-sm lg:text-base leading-relaxed">
                      {selected.meaning}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const ChecklistSection = () => {
  const [docsDone, setDocsDone] = useState(new Set());
  const [mindsetDone, setMindsetDone] = useState(new Set());

  const toggle = (i, done, setDone) => {
    setDone((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const CheckItem = ({ text, done, onToggle }) => (
    <div
      onClick={onToggle}
      className={`flex gap-3 items-start p-4 rounded-xl border cursor-pointer select-none transition-all ${done
          ? 'border-gold/40 bg-gold/10'
          : 'border-gray-100 bg-white hover:border-gold/40'
        }`}
    >
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${done ? 'bg-gold border-gold' : 'border-gray-300'}`}>
        {done && <Check size={11} className="text-white" />}
      </div>
      <p className={`text-sm leading-relaxed transition-colors ${done ? 'text-gray-400 line-through' : 'text-navy-900/70'}`}>{text}</p>
    </div>
  );

  return (
    <section id="lf-checklist" className="py-20 lg:py-28 bg-white">
      <div className="container-custom">
        <SectionHeader
          tag="Before You Invest"
          title="Your First Investment Checklist"
          subtitle="Tick these off before making your first mutual fund investment."
        />
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          <motion.div {...fadeUp(0.05)}>
            <h4 className="text-navy-900 font-serif font-bold text-xl mb-4">Documentation Ready</h4>
            <div className="space-y-3">
              {checklistDocs.map((text, i) => (
                <CheckItem
                  key={i}
                  text={text}
                  done={docsDone.has(i)}
                  onToggle={() => toggle(i, docsDone, setDocsDone)}
                />
              ))}
            </div>
          </motion.div>
          <motion.div {...fadeUp(0.1)}>
            <h4 className="text-navy-900 font-serif font-bold text-xl mb-4">Investment Readiness</h4>
            <div className="space-y-3">
              {checklistMindset.map((text, i) => (
                <CheckItem
                  key={i}
                  text={text}
                  done={mindsetDone.has(i)}
                  onToggle={() => toggle(i, mindsetDone, setMindsetDone)}
                />
              ))}
            </div>
          </motion.div>
        </div>
        <p className="mt-8 text-xs text-gray-400 text-center max-w-2xl mx-auto">
          Before investing, consider your emergency fund, exit load, taxation, investment costs, and the suitability of SIP, STP or Lump Sum based on your goal and time horizon.
        </p>
      </div>
    </section>
  );
};

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

const LearnFinancePage = () => (
  <div className="min-h-screen">
    <HeroSection />
    <WhatSection />
    <HowItWorksSection />
    <TypesSection />
    <ConceptsSection />
    <VideosSection />
    <RiskReturnSection />
    <SIPvsLumpSumSection />
    <GlossarySection />
    <ChecklistSection />
  </div>
);

export default LearnFinancePage;
