import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigationType } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import Header from './components/Header'
import Hero from './components/Hero'
import AMCLogos from './components/AMCLogos'
import Services from './components/Services'
import HowItWorks from './components/HowItWorks'
import FundsTable from './components/FundsTable'
import Calculators, { CalculatorPage } from './components/Calculators'
import About from './components/About'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import ContactUs from './components/ContactUs'
import LearnFinance from './components/LearnFinance'
import LearnFinancePage from './components/LearnFinancePage'
import ExploreFundsPage from './components/ExploreFundsPage'
import {
  PrivacyPolicyPage,
  TermsPage,
  InvestorCharterPage,
  GrievancePolicyPage,
} from './components/PolicyPages'
import ScrollToTopButton from './components/ScrollToTopButton'
import WhatsAppButton from './components/WhatsAppButton'

const PAGE_META = {
  '/': {
    title: 'RupyaNivesh | AMFI Registered Mutual Fund Distributor in India',
    description: 'Your AMFI-registered mutual fund distributor — facilitating SIP, ELSS, lumpsum, and mutual fund investments across leading AMCs in India. Nivesh made simple.',
  },
  '/contact': {
    title: 'Contact Us | RupyaNivesh — Mutual Fund Distributor India',
    description: 'Connect with RupyaNivesh, AMFI-registered mutual fund distributor. Start your SIP or mutual fund investment journey today. Serving investors across India.',
  },
  '/learn-finance': {
    title: 'Learn Mutual Funds, SIP & ELSS | Free Finance Guides | RupyaNivesh',
    description: 'Learn how mutual funds, SIP, ELSS, lumpsum, and SWP investments work. Free finance guides and education for every Indian investor.',
  },
  '/explore-funds': {
    title: 'Explore & Compare Mutual Funds in India | RupyaNivesh Screener',
    description: 'Browse and compare mutual funds across equity, debt, ELSS, and hybrid categories. Search by returns, AMC, risk, and category — free mutual fund screener for Indian investors.',
  },
  '/tools': {
    title: 'Free SIP Calculator, ELSS & Mutual Fund Calculators India | RupyaNivesh',
    description: 'Free SIP calculator, lumpsum calculator, ELSS tax saving calculator, SWP, step-up SIP, retirement and goal-based calculators for Indian mutual fund investors.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | RupyaNivesh',
    description: 'Read the RupyaNivesh privacy policy to understand how we collect, use, and protect your personal information.',
  },
  '/terms-and-conditions': {
    title: 'Terms & Conditions | RupyaNivesh',
    description: 'Review the terms and conditions governing the use of the RupyaNivesh platform and services.',
  },
  '/investor-charter': {
    title: 'Investor Charter | RupyaNivesh',
    description: 'Learn about your rights and responsibilities as a mutual fund investor under SEBI guidelines.',
  },
  '/grievance-redressal': {
    title: 'Grievance Redressal | RupyaNivesh',
    description: 'Know how to raise and resolve grievances with RupyaNivesh in line with SEBI regulations.',
  },
};

const DEFAULT_META = {
  title: 'RupyaNivesh | AMFI Registered Mutual Fund Distributor in India',
  description: 'RupyaNivesh — AMFI-registered mutual fund distributor facilitating SIP, ELSS, and mutual fund investments across leading AMCs in India. Nivesh made simple.',
};

const OG_IMAGE = 'https://rupyanivesh.in/rupyanivesh-logo.png?v=4';
const BASE_URL = 'https://rupyanivesh.in';

const PageHelmet = () => {
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] ?? DEFAULT_META;
  const canonical = `${BASE_URL}${pathname}`;

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:site_name" content="RupyaNivesh" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={OG_IMAGE} />
    </Helmet>
  );
};

const Home = () => (
  <>
    <Hero />
    <AMCLogos />
    <Services />
    <HowItWorks />
    <FundsTable />
    <LearnFinance />
    <Calculators />
    <About />
    <FAQ />
  </>
);

const scrollPositions = {};

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          const yOffset = id === 'services' ? -20 : -100;
          const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: 'instant' });
          element.classList.remove('issue-highlight-target');
          void element.offsetWidth;
          element.classList.add('issue-highlight-target');
          window.setTimeout(() => {
            element.classList.remove('issue-highlight-target');
          }, 2600);
        }
      }, 50);
    } else if (navType === 'POP') {
      const saved = scrollPositions[pathname] ?? 0;
      if (saved === 0) return;
      const delay = pathname === '/' ? 120 : 0;
      setTimeout(() => window.scrollTo({ top: saved, behavior: 'instant' }), delay);
    } else if (navType === 'PUSH') {
      scrollPositions[pathname] = window.scrollY;
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, navType]);

  useEffect(() => {
    const save = () => { scrollPositions[pathname] = window.scrollY; };
    window.addEventListener('scroll', save, { passive: true });
    return () => window.removeEventListener('scroll', save);
  }, [pathname]);

  return null;
};

const AppLayout = () => (
  <div className="min-h-screen bg-[#FAF9F6]">
    <Header />
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/learn-finance" element={<LearnFinancePage />} />
        <Route path="/explore-funds" element={<ExploreFundsPage />} />
        <Route path="/explore-funds/:schemeCode" element={<ExploreFundsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-and-conditions" element={<TermsPage />} />
        <Route path="/investor-charter" element={<InvestorCharterPage />} />
        <Route path="/grievance-redressal" element={<GrievancePolicyPage />} />
        <Route path="/:calcId" element={<CalculatorPage />} />
      </Routes>
    </main>
    <Footer />
    <ScrollToTopButton />
    <WhatsAppButton />
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <PageHelmet />
        <AppLayout />
      </Router>
    </HelmetProvider>
  )
}

export default App
