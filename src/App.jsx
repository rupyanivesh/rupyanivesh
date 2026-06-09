import React, { Suspense, lazy, useEffect } from 'react'
import { HashRouter as Router, Navigate, Routes, Route, useLocation, useNavigationType } from 'react-router-dom'
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
    <Router>
      <ScrollToTop />
      <AppLayout />
    </Router>
  )
}

export default App
