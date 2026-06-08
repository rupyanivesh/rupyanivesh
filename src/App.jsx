import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter as Router, Navigate, Routes, Route, useLocation, useNavigationType } from 'react-router-dom'
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
import ProtectedRoute from './features/mfd-dashboard/components/ProtectedRoute'

const MFDDashboard = lazy(() => import('./components/MFDDashboard'))
const LoginPage = lazy(() => import('./features/mfd-dashboard/pages/LoginPage'))
const SignupPage = lazy(() => import('./features/mfd-dashboard/pages/SignupPage'))
const OtpPage = lazy(() => import('./features/mfd-dashboard/pages/OtpPage'))
const ForgotPasswordPage = lazy(() => import('./features/mfd-dashboard/pages/ForgotPasswordPage'))

const PAGE_META = {
  '/': {
    title: 'RupyaNivesh | Trusted Mutual Fund Distributor',
    description: 'SEBI-registered mutual fund distributor offering expert guidance, SIP calculators, and curated fund research to grow your wealth systematically.',
  },
  '/contact': {
    title: 'Contact Us | RupyaNivesh',
    description: 'Get in touch with RupyaNivesh to start your mutual fund investment journey. Book a free consultation with our expert advisors.',
  },
  '/learn-finance': {
    title: 'Learn Finance | RupyaNivesh',
    description: 'Explore curated finance articles and guides to understand mutual funds, SIP, ELSS, and smart investing strategies.',
  },
  '/explore-funds': {
    title: 'Explore Mutual Funds | RupyaNivesh',
    description: 'Browse and compare top-performing mutual funds across categories. Find the right fund for your investment goals.',
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
  title: 'RupyaNivesh | Mutual Fund Distributor',
  description: 'RupyaNivesh — SEBI-registered mutual fund distributor. Invest in top mutual funds with expert guidance.',
};

const OG_IMAGE = 'https://rupyanivesh.in/rupyanivesh-logo.png';
const BASE_URL = 'https://rupyanivesh.in';

const PageHelmet = () => {
  const { pathname } = useLocation();

  if (pathname.startsWith('/mfd')) {
    return (
      <Helmet>
        <title>MFD Portal | RupyaNivesh</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
    );
  }

  const meta = PAGE_META[pathname] ?? DEFAULT_META;
  const canonical = `${BASE_URL}${pathname}`;

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:site_name" content="RupyaNivesh" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={OG_IMAGE} />
    </Helmet>
  );
};

const MfdRouteFallback = () => (
  <div className="min-h-screen grid place-items-center bg-[#FAF9F6] text-navy-900/70 text-sm">
    Loading MFD dashboard...
  </div>
)

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
      // Home page has many sections — wait for full render before restoring
      const delay = pathname === '/' ? 120 : 0;
      setTimeout(() => window.scrollTo({ top: saved, behavior: 'instant' }), delay);
    } else if (navType === 'PUSH') {
      // Save current scroll before navigating away, then go to top
      scrollPositions[pathname] = window.scrollY;
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, navType]);

  // Save scroll position on every scroll so it's always up to date
  useEffect(() => {
    const save = () => { scrollPositions[pathname] = window.scrollY; };
    window.addEventListener('scroll', save, { passive: true });
    return () => window.removeEventListener('scroll', save);
  }, [pathname]);

  return null;
};

const AppLayout = () => {
  const { pathname } = useLocation();
  const isMfdRoute = pathname.startsWith('/mfd') || pathname.startsWith('/mfd-dashboard');

  if (isMfdRoute) {
    return (
      <main>
        <Suspense fallback={<MfdRouteFallback />}>
          <Routes>
            <Route path="/mfd/login" element={<LoginPage />} />
            <Route path="/mfd/signup" element={<SignupPage />} />
            <Route path="/mfd/otp" element={<OtpPage />} />
            <Route path="/mfd/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/mfd-dashboard"
              element={
                <ProtectedRoute>
                  <MFDDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/mfd/*" element={<Navigate to="/mfd/login" replace />} />
          </Routes>
        </Suspense>
      </main>
    );
  }

  return (
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
};

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
