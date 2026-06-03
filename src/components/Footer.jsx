import React, { useState } from 'react';
import {
  Mail, Phone, MapPin, MessageCircle, ExternalLink, X,
  Globe, Share2, Shield, Scale, BookOpen,
  AlertTriangle, ChevronRight, Play
} from 'lucide-react';
import { Link } from 'react-router-dom';
import logoSrc from '../assets/logo.png';

// Policy Modal Shell
const PolicyModal = ({ title, icon: Icon, onClose, children }) => {
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="absolute inset-0 bg-navy-900/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[88vh] flex flex-col">
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            {Icon && <div className="w-8 h-8 bg-gold/15 rounded-lg flex items-center justify-center"><Icon size={16} className="text-gold" /></div>}
            <h2 id="modal-title" className="text-lg font-serif font-bold text-navy-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
          >
            <X size={16} className="text-navy-900" />
          </button>
        </div>
        <div className="overflow-y-auto px-7 py-6 flex-1 text-sm text-gray-700 leading-relaxed space-y-5">
          {children}
        </div>
        <div className="px-7 py-3 border-t border-gray-100 shrink-0 flex items-center justify-between bg-gray-50/60 rounded-b-2xl">
          <p className="text-[10px] text-gray-400 font-medium">RupyaNivesh · Brand of Shubh Lakshmi Wealth · ARN-361484</p>
          <button onClick={onClose} className="text-[11px] font-bold text-gold hover:underline">Close</button>
        </div>
      </div>
    </div>
  );
};

const SH = ({ children }) => (
  <h3 className="font-bold text-navy-900 text-sm mt-5 mb-1.5">{children}</h3>
);

const InfoBox = ({ children }) => (
  <div className="bg-gold/10 border border-gold/30 rounded-xl p-3.5 text-xs text-navy-900">{children}</div>
);

// Privacy Policy
export const PrivacyPolicyContent = () => (
  <>
    <InfoBox>Last updated: May 2026 &nbsp;|&nbsp; Governing law: Information Technology Act, 2000 &amp; DPDP Act, 2023</InfoBox>
    <SH>1. Who We Are</SH>
    <p>RupyaNivesh is a brand operated by Shubh Lakshmi Wealth ("we", "us", "our"), an AMFI-Registered Mutual Fund Distributor (ARN-361484) operating from Hisar, Haryana. We are committed to protecting your personal data and your right to privacy in accordance with applicable Indian laws and SEBI/AMFI guidelines.</p>

    <SH>2. Information We Collect</SH>
    <ul className="list-disc pl-5 space-y-1">
      <li>Full name, email address, phone number, and location</li>
      <li>PAN, Aadhaar (for KYC/eKYC compliance), date of birth</li>
      <li>Financial information shared voluntarily (income, investment goals, risk profile)</li>
      <li>Device and usage data (IP address, browser type, pages visited, time spent)</li>
      <li>Communication records via contact form, WhatsApp, email, or phone</li>
    </ul>

    <SH>3. Why We Collect It (Legal Bases)</SH>
    <ul className="list-disc pl-5 space-y-1">
      <li><strong>Contractual necessity:</strong> To process your mutual fund transactions and service your investments</li>
      <li><strong>Legal obligation:</strong> KYC/AML compliance under PMLA 2002, SEBI/AMFI regulations</li>
      <li><strong>Legitimate interest:</strong> To improve our website, personalise content, and prevent fraud</li>
      <li><strong>Consent:</strong> To send investment updates, scheme information, and promotional communications (you can withdraw at any time)</li>
    </ul>

    <SH>4. How We Share Your Information</SH>
    <p>We do not sell, trade, or rent your personal information. We may share data with:</p>
    <ul className="list-disc pl-5 space-y-1 mt-1.5">
      <li>Asset Management Companies (AMCs) for transaction processing</li>
      <li>Registrar &amp; Transfer Agents (CAMS, KFintech) for folio management</li>
      <li>Regulatory bodies (SEBI, AMFI, FIU-IND) as required by law</li>
      <li>Technology service providers under strict data-processing agreements</li>
    </ul>

    <SH>5. Data Security</SH>
    <p>We implement SSL encryption, access controls, and audit trails to protect your data. Despite precautions, no internet transmission is 100% secure; we will notify you promptly in case of a data breach as required by law.</p>

    <SH>6. Data Retention</SH>
    <p>We retain personal data for as long as your relationship with us is active, and for a minimum of 5 years thereafter as mandated by PMLA and SEBI regulations. After that period, data is securely deleted or anonymised.</p>

    <SH>7. Your Rights Under DPDP Act 2023</SH>
    <ul className="list-disc pl-5 space-y-1">
      <li>Right to access personal data we hold about you</li>
      <li>Right to correct inaccurate or incomplete information</li>
      <li>Right to erasure (subject to regulatory retention obligations)</li>
      <li>Right to withdraw consent for marketing at any time</li>
      <li>Right to nominate a person to exercise your rights on your behalf</li>
    </ul>

    <SH>8. Cookies &amp; Tracking</SH>
    <p>We use essential cookies for website functionality and analytics cookies (with consent) to understand site usage. You can disable non-essential cookies in your browser settings without affecting core features.</p>

    <SH>9. Contact for Privacy Matters</SH>
    <p>Email: <strong>info@rupyanivesh.in</strong> &nbsp;|&nbsp; Phone: <strong>+91 88899-98057</strong><br />Address: 2nd Floor, Plot No. 02, Sector-13, Hisar-125005 (Haryana)</p>

    <SH>10. Updates to This Policy</SH>
    <p>We may revise this policy periodically. Material changes will be notified via email or a prominent notice on our website at least 15 days before taking effect.</p>
  </>
);

// Terms & Conditions
export const TermsContent = () => (
  <>
    <InfoBox>Last updated: May 2026 &nbsp;|&nbsp; These Terms govern the use of the RupyaNivesh website and services operated by Shubh Lakshmi Wealth.</InfoBox>
    <SH>1. Acceptance of Terms</SH>
    <p>By accessing or using the RupyaNivesh website (rupyanivesh.in), you agree to be bound by these Terms &amp; Conditions and all applicable laws. If you disagree with any part, please discontinue use of this website.</p>

    <SH>2. Nature of Services - Distributor, Not Adviser</SH>
    <p>These terms are between you and Shubh Lakshmi Wealth (operating the RupyaNivesh brand), an <strong>AMFI-Registered Mutual Fund Distributor (ARN-361484)</strong>. We facilitate the <em>distribution</em> of mutual fund units on behalf of Asset Management Companies. We are <strong>NOT a SEBI-registered Investment Adviser (RIA)</strong> under SEBI (Investment Advisers) Regulations, 2013, and we do not provide personalised investment advice, portfolio management, or financial planning services.</p>

    <SH>3. No Investment Advice Disclaimer</SH>
    <p>All content on this website - including calculators, fund tables, educational articles, and SIP illustrations - is for <strong>general informational and educational purposes only</strong>. It does not constitute investment advice, a recommendation, or solicitation to buy or sell any financial instrument. Investment decisions must be made based on your personal financial situation, risk profile, goals, and after consulting a SEBI-registered Investment Adviser if required.</p>

    <SH>4. Risk Disclosure</SH>
    <p><strong>Mutual fund investments are subject to market risks. Past performance is not indicative of future results.</strong> The value of investments and income therefrom may fall as well as rise. You may not get back the amount originally invested. NAVs fluctuate based on market conditions. Please read all Scheme Information Documents (SID), Statement of Additional Information (SAI), and Key Information Memorandum (KIM) carefully before investing.</p>

    <SH>5. Calculator Illustrations</SH>
    <p>SIP, lumpsum, retirement, education, and inflation calculators on this website use assumed rates of return for illustration purposes only. Actual returns may differ materially. Calculations do not account for taxes, exit loads, expense ratios, or market volatility unless explicitly stated.</p>

    <SH>6. KYC Requirement</SH>
    <p>Investing in Mutual Funds requires completion of Know Your Customer (KYC) formalities. We will assist with KYC through SEBI-authorised KYC Registration Agencies (KRAs). KYC is mandatory for all investments.</p>

    <SH>7. Accuracy of Information</SH>
    <p>While we endeavour to keep all information accurate and current, We make no warranties about the completeness or accuracy of website content. Fund data, NAVs, and performance figures sourced from AMFI or AMCs may be delayed. Always verify with the respective AMC before transacting.</p>

    <SH>8. Third-Party Links</SH>
    <p>Links to external sites (SEBI SCORES, AMFI, AMC websites, SMART ODR) are provided for reference. We do not endorse or control external sites and is not responsible for their content or availability.</p>

    <SH>9. Intellectual Property</SH>
    <p>All content, branding, trademarks, and design elements on this website are the property of Shubh Lakshmi Wealth (RupyaNivesh). Unauthorised reproduction, distribution, or commercial use is strictly prohibited.</p>

    <SH>10. Commission Disclosure</SH>
    <p>In accordance with SEBI Circular dated June 30, 2009, we hereby disclose that we receive upfront and/or trail commissions from Asset Management Companies (AMCs) for distribution of Regular Plan units of mutual fund schemes. Commission rates vary across AMCs, schemes, and AUM levels and are not fixed. Clients may request detailed transaction-level commission information at any time.</p>

    <SH>11. Regulatory Compliance</SH>
    <p>The Firm operates in full compliance with: SEBI (Mutual Funds) Regulations, 1996; AMFI Code of Conduct for Intermediaries; PMLA 2002 and AML/CFT guidelines; Information Technology Act, 2000; Digital Personal Data Protection Act, 2023; and all other applicable SEBI/AMFI circulars.</p>

    <SH>12. Limitation of Liability</SH>
    <p>The Firm shall not be liable for any investment losses, indirect, incidental, or consequential damages arising from reliance on information on this website or from market movements. Total liability, if any, shall not exceed the distribution commission earned on your specific transaction.</p>

    <SH>13. Governing Law &amp; Dispute Resolution</SH>
    <p>These Terms are governed by Indian law. Disputes shall first be addressed through our grievance redressal mechanism, then through SEBI SCORES, SMART ODR, and finally through courts of competent jurisdiction in Hisar, Haryana.</p>

    <SH>14. Modifications</SH>
    <p>We reserve the right to update these Terms at any time. Continued use of the website after changes constitutes acceptance of the revised Terms.</p>
  </>
);

// Investor Charter
export const InvestorCharterContent = () => (
  <>
    <InfoBox>
      <strong>SEBI Circular Ref:</strong> SEBI/HO/IMD/DF1/P/CIR/2021/665 dated December 03, 2021<br />
      <strong>AMFI Ref:</strong> AMFI Best Practices Guidelines Circular No. 135 - Investor Charter for Mutual Fund Distributors
    </InfoBox>

    <SH>A. Vision &amp; Mission</SH>
    <p><strong>Vision:</strong> To be a trusted, transparent, and fully compliant Mutual Fund Distributor, enabling every Indian family to access mutual fund investment options aligned to their financial goals and risk profile.</p>
    <p className="mt-1.5"><strong>Mission:</strong> To provide unbiased, need-based mutual fund distribution with complete transparency about our commissions, regulatory status, and limitations - enabling investors to make informed decisions.</p>

    <SH>B. Services We Offer</SH>
    <ul className="list-disc pl-5 space-y-1">
      <li>Distribution of Mutual Fund units across all SEBI-regulated categories</li>
      <li>KYC / eKYC facilitation through authorised KRAs</li>
      <li>SIP registration, modification, and cancellation assistance</li>
      <li>Redemption, switch, and systematic withdrawal (SWP) facilitation</li>
      <li>Goal-based investment planning assistance (not personalised advice)</li>
      <li>Free access to investment calculators and investor education resources</li>
      <li>Portfolio statement and investment tracking support</li>
    </ul>

    <SH>C. Rights of Investors</SH>
    <ul className="list-disc pl-5 space-y-1">
      <li>Receive complete, accurate information about every scheme before investing</li>
      <li>Know the commission/trail fee RupyaNivesh earns on your investment</li>
      <li>Receive all scheme documents (SID, SAI, KIM) free of cost</li>
      <li>Switch to Direct Plans at any time without distributor permission</li>
      <li>Redeem investments at prevailing NAV (subject to applicable exit load and settlement timelines)</li>
      <li>Nominate a person for your investments</li>
      <li>Receive regular Consolidated Account Statements (CAS) from CAMS/KFintech</li>
      <li>File a complaint and receive fair, timely resolution</li>
      <li>Access SEBI SCORES and SMART ODR without interference</li>
    </ul>

    <SH>D. Responsibilities of Investors</SH>
    <ul className="list-disc pl-5 space-y-1">
      <li>Complete KYC before placing any investment transaction</li>
      <li>Provide accurate, complete, and up-to-date personal and financial information</li>
      <li>Read and understand SID/SAI/KIM before investing in any scheme</li>
      <li>Invest according to your own assessed risk appetite, goals, and time horizon</li>
      <li>Keep contact details (mobile, email, bank account) updated with AMCs/RTAs</li>
      <li>Verify transaction confirmations and account statements regularly</li>
      <li>Report discrepancies or complaints promptly</li>
    </ul>

    <SH>E. Commission Disclosure (SEBI Circular June 30, 2009)</SH>
    <p>In accordance with SEBI Circular dated June 30, 2009, we hereby disclose that we receive upfront and/or trail commissions from Asset Management Companies (AMCs) for distribution of Regular Plan units of mutual fund schemes. Commission rates vary across AMCs, schemes, and AUM levels and are not fixed. Clients may request detailed transaction-level commission information at any time.</p>

    <SH>F. What We Do NOT Do</SH>
    <p>We are <strong>NOT a SEBI-registered Investment Adviser (RIA)</strong>. We do not provide:</p>
    <ul className="list-disc pl-5 space-y-1">
      <li>Personalised investment advice tailored to your individual financial situation</li>
      <li>Securities or stock trading recommendations</li>
      <li>Portfolio Management Services (PMS)</li>
      <li>Insurance, tax, or legal advisory services</li>
      <li>Guaranteed or assured return products</li>
    </ul>

    <SH>G. Grievance Redressal</SH>
    <ol className="list-decimal pl-5 space-y-1.5">
      <li>Email: <strong>info@rupyanivesh.in</strong> | Phone: <strong>+91 88899-98057</strong> - response within 10 business days</li>
      <li>Respective AMC customer care (details on AMC websites)</li>
      <li>SEBI SCORES: <a href="https://scores.sebi.gov.in" target="_blank" rel="noopener noreferrer" className="text-gold underline">scores.sebi.gov.in</a> | Toll-free: 1800-266-7575</li>
      <li>SMART ODR: <a href="https://smartodr.in" target="_blank" rel="noopener noreferrer" className="text-gold underline">smartodr.in</a></li>
      <li>AMFI Investor Helpline: <strong>1800-22-7394</strong> (toll-free)</li>
    </ol>
  </>
);

// Grievance Redressal Policy
export const GrievanceContent = () => (
  <>
    <InfoBox>
      <strong>SEBI Circular Ref:</strong> SEBI/HO/OIAE/IGRD/CIR/2023/156 - Investor Grievance Redressal &amp; Arbitration Mechanism<br />
      <strong>AMFI Circular:</strong> Best Practices Guidelines - Grievance Handling by Mutual Fund Distributors
    </InfoBox>

    <p>Rupya Nivesh is a brand operated by Shubh Lakshmi Wealth, an AMFI-Registered Mutual Fund Distributor (ARN-361484). This Grievance Redressal Policy applies to services offered through the Rupya Nivesh platform and administered by Shubh Lakshmi Wealth.</p>
    <SH>Our Commitment</SH>
    <p>We are committed to prompt, fair, and transparent resolution of all investor complaints in accordance with SEBI and AMFI guidelines. We treat every complaint as an opportunity to improve our services.</p>

    <SH>Step 1 - Contact Us</SH>
    <div className="bg-gray-50 rounded-xl p-4 space-y-1.5 text-xs">
      <p><strong>Grievance Redressal Contact</strong></p>
      <p><strong>Entity:</strong> Shubh Lakshmi Wealth</p>
      <p><strong>AMFI Registration:</strong> ARN-361484</p>
      <p><strong>Brand:</strong> RupyaNivesh</p>
      <p><strong>Email:</strong> info@rupyanivesh.in</p>
      <p><strong>Phone:</strong> +91 88899-98057 (Mon - Fri, 9:30 AM - 6:00 PM)</p>
      <p><strong>Registered Address:</strong> 2nd Floor, Plot No. 02, Sector-13, Hisar-125005 (Haryana)</p>
      <p><strong>Acknowledgement:</strong> Within 3 business days of receiving complaint</p>
      <p><strong>Resolution Target:</strong> Within 10 business days of acknowledgement</p>
    </div>

    <SH>Step 2 - Contact the AMC</SH>
    <p>If not satisfied with our response within 15 days, escalate to the respective Asset Management Company. AMC contact details are available on their official websites and at <a href="https://www.amfiindia.com" target="_blank" rel="noopener noreferrer" className="text-gold underline">www.amfiindia.com</a>.</p>

    <SH>Step 3 - SEBI SCORES (Online Complaint Portal)</SH>
    <div className="bg-gray-50 rounded-xl p-4 space-y-1.5 text-xs">
      <p>File your complaint at: <a href="https://scores.sebi.gov.in" target="_blank" rel="noopener noreferrer" className="text-gold font-bold underline">scores.sebi.gov.in</a></p>
      <p>Toll-free Helpline: <strong>1800-266-7575 / 1800-22-7575</strong></p>
      <p>Use if: complaint unresolved within 30 days by RupyaNivesh or AMC</p>
    </div>

    <SH>Step 4 - SMART ODR (Online Dispute Resolution)</SH>
    <div className="bg-gray-50 rounded-xl p-4 space-y-1.5 text-xs">
      <p>Initiate online conciliation/arbitration at: <a href="https://smartodr.in" target="_blank" rel="noopener noreferrer" className="text-gold font-bold underline">smartodr.in</a></p>
      <p>SEBI-mandated dispute resolution platform per SEBI Circular No. SEBI/HO/OIAE/IGRD/CIR/2023/156</p>
      <p>Available for all securities market disputes including mutual funds</p>
    </div>

    <SH>AMFI Investor Helpline</SH>
    <div className="bg-gray-50 rounded-xl p-4 space-y-1.5 text-xs">
      <p>Toll-free: <strong>1800-22-7394</strong> (all working days)</p>
      <p>Website: <a href="https://www.amfiindia.com" target="_blank" rel="noopener noreferrer" className="text-gold underline">www.amfiindia.com</a></p>
      <p>Investor education: <a href="https://www.amfiindia.com/investor-corner" target="_blank" rel="noopener noreferrer" className="text-gold underline">amfiindia.com/investor-corner</a></p>
    </div>

    <SH>How to File a Complaint - Checklist</SH>
    <ol className="list-decimal pl-5 space-y-1.5">
      <li>Write to us with: full name, PAN, folio number (if any), nature of complaint, date of incident</li>
      <li>Attach supporting documents: account statement, transaction confirmation, correspondence</li>
      <li>Await acknowledgement within 3 business days</li>
      <li>If unresolved in 10 business days, escalate to AMC or SEBI SCORES</li>
      <li>If still unresolved after 30 days, use SMART ODR for arbitration</li>
    </ol>

    <SH>Regulatory Timelines (per SEBI guidelines)</SH>
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse mt-1.5">
        <thead>
          <tr className="bg-navy-900/5">
            <th className="border border-gray-200 px-3 py-2 text-left font-bold text-navy-900">Stage</th>
            <th className="border border-gray-200 px-3 py-2 text-left font-bold text-navy-900">Timeline</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['RupyaNivesh acknowledgement', '3 business days'],
            ['RupyaNivesh resolution', '10 business days'],
            ['AMC resolution', '30 days'],
            ['SEBI SCORES review', '21 calendar days'],
            ['SMART ODR conciliation', '21 calendar days'],
          ].map(([stage, timeline]) => (
            <tr key={stage}>
              <td className="border border-gray-200 px-3 py-2">{stage}</td>
              <td className="border border-gray-200 px-3 py-2">{timeline}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

// Main Footer Component
const Footer = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [openCalcCategory, setOpenCalcCategory] = useState(null);
  const openModal = (id) => setActiveModal(id);
  const closeModal = () => setActiveModal(null);

  const whatsappUrl = `https://api.whatsapp.com/send/?phone=918889998057&text=${encodeURIComponent('Hi RupyaNivesh, I would like to know more about your mutual fund distribution services.')}&type=phone_number&app_absent=0`;

  const exploreLinks = [
    { label: 'About RupyaNivesh', to: '/#why-us' },
    { label: 'Our Services', to: '/#services' },
    { label: 'How It Works', to: '/#how-it-works' },
    { label: 'Learn Finance', to: '/learn-finance' },
    { label: 'Explore Funds', to: '/explore-funds' },
    { label: 'Contact Us', to: '/contact' },
  ];

  const calculatorCategories = [
    {
      label: 'Core Investment',
      tools: [
        { label: 'SIP Calculator', to: '/sip-calculator' },
        { label: 'Lumpsum Calculator', to: '/lumpsum-calculator' },
        { label: 'SWP Calculator', to: '/swp-calculator' },
        { label: 'Step-Up SIP', to: '/step-up-sip-calculator' },
        { label: 'SIP vs Lumpsum', to: '/sip-vs-lumpsum-calculator' },
      ],
    },
    {
      label: 'Goal Based',
      tools: [
        { label: 'Retirement Planner', to: '/retirement-calculator' },
        { label: 'Education Goal', to: '/education-calculator' },
        { label: 'Inflation Tracker', to: '/inflation-calculator' },
        { label: 'Wedding Goal', to: '/wedding-goal-calculator' },
        { label: 'House Purchase Goal', to: '/house-goal-calculator' },
      ],
    },
    {
      label: 'Fund-Based Returns',
      tools: [
        { label: 'Fund CAGR Return', to: '/fund-cagr-return-calculator' },
        { label: 'Fund SIP Return', to: '/fund-sip-return-calculator' },
        { label: 'Fund Lumpsum Return', to: '/fund-lumpsum-return-calculator' },
        { label: 'Fund Comparison', to: '/fund-comparison-calculator' },
        { label: 'Category Return', to: '/best-category-return-calculator' },
      ],
    },
  ];

  const regulatoryLinks = [
    { label: 'AMFI India', href: 'https://www.amfiindia.com' },
    { label: 'SEBI', href: 'https://www.sebi.gov.in' },
    { label: 'SEBI SCORES', href: 'https://scores.sebi.gov.in' },
    { label: 'SMART ODR', href: 'https://smartodr.in' },
    { label: 'RBI', href: 'https://www.rbi.org.in' },
  ];

  return (
    <>
      {activeModal === 'privacy' && (
        <PolicyModal title="Privacy Policy" icon={Shield} onClose={closeModal}>
          <PrivacyPolicyContent />
        </PolicyModal>
      )}
      {activeModal === 'terms' && (
        <PolicyModal title="Terms &amp; Conditions" icon={Scale} onClose={closeModal}>
          <TermsContent />
        </PolicyModal>
      )}
      {activeModal === 'charter' && (
        <PolicyModal title="Investor Charter" icon={BookOpen} onClose={closeModal}>
          <InvestorCharterContent />
        </PolicyModal>
      )}
      {activeModal === 'grievance' && (
        <PolicyModal title="Grievance Redressal Policy" icon={AlertTriangle} onClose={closeModal}>
          <GrievanceContent />
        </PolicyModal>
      )}

      <footer id="issue-footer-root" className="bg-navy-900 text-white pt-24 pb-12 border-t border-white/5">
        <div className="container-custom">

          {/* Pre-Footer CTA */}
          <div className="bg-gold p-6 md:p-10 rounded-3xl md:rounded-[32px] mb-12 md:mb-20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
            <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center text-navy-900">
              <div>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold mb-3 md:mb-4 leading-tight">
                  Start Your Mutual Fund Investment Journey.
                </h2>
                <p className="text-navy-900/70 text-base mb-5">
                  Connect with our AMFI-registered distributor to explore mutual fund options suited to your goals and risk profile.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-navy-900 text-gold text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">AMFI-registered Mutual Fund Distributor</span>
                  <span className="bg-navy-900 text-gold text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">ARN-361484</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact" className="bg-navy-900 text-center text-gold px-10 py-4 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all inline-block">
                  Talk to Us
                </Link>
                <Link to="/learn-finance" className="bg-transparent text-center border-2 border-navy-900 text-navy-900 px-10 py-4 rounded-xl font-bold hover:bg-navy-900 hover:text-white transition-all inline-block">
                  Learn about Mutual Funds
                </Link>
              </div>
            </div>
          </div>

          {/* 4-Column Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-8">

            {/* Col 1 - Brand */}
            <div>
              <Link to="/" className="flex items-center gap-2 mb-5 group w-fit" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
                  <span className="text-navy-900 font-serif font-bold italic">RN</span>
                </div>
                <span className="text-xl font-serif font-bold tracking-tight">Rupya<span style={{color:'#B0894A'}}>Nivesh</span></span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-2">
                RupyaNivesh is a brand operated by Shubh Lakshmi Wealth, a Partnership Firm and AMFI-Registered Mutual Fund Distributor.
              </p>

              <p className="text-gray-500 text-xs leading-relaxed mb-6">
                Mutual Fund investments are subject to market risks, read all scheme related documents carefully.
              </p>
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 mb-6">
                <Shield size={12} className="text-gold" />
                <span className="text-[10px] font-bold text-gold uppercase tracking-widest">AMFI-registered · ARN-361484</span>
              </div>
              <div className="flex gap-3">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" title="WhatsApp"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#25D366] hover:border-[#25D366] transition-all text-white">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
                <a href="https://www.instagram.com/rupyanivesh" target="_blank" rel="noopener noreferrer" aria-label="Follow on Instagram" title="Instagram"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-pink-500 hover:to-orange-400 hover:border-pink-500 transition-all text-white">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="https://www.linkedin.com/company/rupyanivesh" target="_blank" rel="noopener noreferrer" aria-label="Connect on LinkedIn" title="LinkedIn"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#0A66C2] hover:border-[#0A66C2] transition-all text-white">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://www.youtube.com/@rupyanivesh" target="_blank" rel="noopener noreferrer" aria-label="Watch on YouTube" title="YouTube"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all text-white">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>

            {/* Col 2 - Explore */}
            <div>
              <h4 className="font-serif font-bold text-lg mb-7 text-gold">Explore</h4>
              <ul className="space-y-3.5 text-gray-400 text-sm font-medium">
                {exploreLinks.map(item => (
                  <li key={item.label}>
                    <Link to={item.to} className="hover:text-gold transition-colors flex items-center gap-2 group">
                      <ChevronRight size={12} className="text-gold/40 group-hover:text-gold transition-colors shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 - Calculators (accordion by category) */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-serif font-bold text-lg text-gold">Free Calculators</h4>
                <Link to="/#calculators" className="text-[10px] font-bold text-gray-500 hover:text-gold transition-colors uppercase tracking-widest flex items-center gap-1">
                  All <ExternalLink size={9} />
                </Link>
              </div>
              <div className="space-y-1">
                {calculatorCategories.map(cat => {
                  const isOpen = openCalcCategory === cat.label;
                  return (
                    <div key={cat.label} className="border border-white/8 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenCalcCategory(isOpen ? null : cat.label)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors group"
                      >
                        <span className="text-[11px] font-black uppercase tracking-[0.15em] text-gray-300 group-hover:text-gold transition-colors">
                          {cat.label}
                        </span>
                        <ChevronRight
                          size={13}
                          className={`text-gold/50 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-90' : ''}`}
                        />
                      </button>
                      {isOpen && (
                        <ul className="px-4 pb-3 space-y-2 border-t border-white/5">
                          {cat.tools.map(tool => (
                            <li key={tool.label} className="pt-2">
                              <Link to={tool.to} className="flex items-center gap-2 text-gray-400 text-xs font-medium hover:text-gold transition-colors group">
                                <ChevronRight size={10} className="text-gold/30 group-hover:text-gold transition-colors shrink-0" />
                                {tool.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Col 4 - Contact */}
            <div className="pb-6">
              <h4 className="font-serif font-bold text-lg mb-7 text-gold">Contact Us</h4>
              <ul className="space-y-5 text-gray-400 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-300 font-semibold text-xs uppercase tracking-wider mb-1">Registered Address</p>
                    <p>2nd Floor, Plot No. 02, Sector-13,<br />Hisar-125005 (Haryana)</p>
                  </div>
                </li>
                <li>
                  <a href="tel:+918889998057" className="flex items-center gap-3 hover:text-gold transition-colors group">
                    <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center shrink-0 group-hover:bg-gold/10 transition-colors">
                      <Phone size={14} className="text-gold" />
                    </div>
                    +91 88899-98057
                  </a>
                </li>
                <li>
                  <a href="mailto:info@rupyanivesh.in" className="flex items-center gap-3 hover:text-gold transition-colors group">
                    <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center shrink-0 group-hover:bg-gold/10 transition-colors">
                      <Mail size={14} className="text-gold" />
                    </div>
                    info@rupyanivesh.in
                  </a>
                </li>
                <li>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] rounded-lg px-4 py-2.5 text-xs font-bold hover:bg-[#25D366]/20 transition-colors">
                    <MessageCircle size={13} />
                    WhatsApp Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Regulatory Portal Links */}
          <div className="-mt-2 mb-8 p-5 bg-white/3 rounded-2xl border border-white/5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 text-center">Regulatory &amp; Investor Resources</p>
            <div className="flex flex-wrap justify-center gap-3">
              {regulatoryLinks.map(link => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-gold transition-colors border border-white/8 hover:border-gold/20 rounded-lg px-3 py-1.5 bg-white/3 hover:bg-white/5">
                  {link.label} <ExternalLink size={9} />
                </a>
              ))}
            </div>
          </div>

          {/* Full Compliance Disclosure Block */}
          <div className="p-7 bg-white/5 rounded-2xl border border-white/10 mb-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-gold" />
                  <span id="issue-footer-arn-placeholder" className="text-xs font-black tracking-widest uppercase text-gold">AMFI-registered Distributor &nbsp;·&nbsp; ARN-361484</span>
                </div>
                <span className="text-[10px] text-gray-500 uppercase tracking-tighter block">
                  ARN Validity: 25/05/2029 &nbsp;|&nbsp; Regn. State: Haryana
                </span>
              </div>
              <div className="flex items-center gap-5 flex-wrap">
                <a href="https://scores.sebi.gov.in/" target="_blank" rel="noopener noreferrer"
                  className="text-[11px] font-bold text-gray-400 hover:text-gold transition-colors flex items-center gap-1.5 underline decoration-gray-700 underline-offset-4">
                  SEBI SCORES <ExternalLink size={10} />
                </a>
                <a href="https://smartodr.in/" target="_blank" rel="noopener noreferrer"
                  className="text-[11px] font-bold text-gray-400 hover:text-gold transition-colors flex items-center gap-1.5 underline decoration-gray-700 underline-offset-4">
                  SMART ODR <ExternalLink size={10} />
                </a>
                <a href="https://www.amfiindia.com" target="_blank" rel="noopener noreferrer"
                  className="text-[11px] font-bold text-gray-400 hover:text-gold transition-colors flex items-center gap-1.5 underline decoration-gray-700 underline-offset-4">
                  AMFI India <ExternalLink size={10} />
                </a>
              </div>
            </div>

            <div className="text-[11px] text-gray-500 leading-relaxed space-y-3.5 text-center md:text-left">
              <p id="issue-footer-risk-line" className="font-bold text-gray-300 text-sm">
                Mutual fund investments are subject to market risks. Read all scheme-related documents carefully before investing. Past performance is not an indicator of future returns.
              </p>
              <p><strong className="text-gray-400">Risk Disclosure:</strong> The value of investments and the income therefrom are subject to market fluctuations and may go up or down based on various factors including but not limited to interest rate movements, credit events, liquidity conditions, and macroeconomic developments. Investors may not get back the principal amount invested.</p>
              <p id="issue-footer-commission-disclosure"><strong className="text-gray-400">Commission Disclosure (SEBI Circular SEBI/IMD/CIR No.4/168230/09 dated June 30, 2009):</strong> RupyaNivesh is a brand operated by Shubh Lakshmi Wealth, an AMFI-Registered Mutual Fund Distributor (ARN-361484). We receive upfront and/or trail commissions from Asset Management Companies (AMCs) for distributing Regular Plan mutual fund units. Transaction-specific commission disclosure is available on request.</p>
              <p id="issue-footer-nonadvisory-disclosure"><strong className="text-gray-400">Non-Advisory Disclosure:</strong> RupyaNivesh is NOT a SEBI-registered Investment Adviser (RIA) under SEBI (Investment Advisers) Regulations, 2013. We do not provide personalised investment advice, portfolio management, financial planning, or securities trading recommendations. All content on this website is for general informational and educational purposes only and shall not be construed as investment advice or a solicitation to invest.</p>
              <p><strong className="text-gray-400">KYC Requirement:</strong> KYC (Know Your Customer) is a mandatory one-time exercise. Investors should complete KYC with any SEBI-registered KYC Registration Agency (KRA) before investing. For KYC-related grievances, contact SEBI SCORES at <a href="https://scores.sebi.gov.in" target="_blank" rel="noopener noreferrer" className="text-gold underline">scores.sebi.gov.in</a>.</p>
              <p><strong className="text-gray-400">Direct Plan Option:</strong> Investors have the option to invest directly through the AMC's Direct Plan, which has a lower expense ratio. By choosing Regular Plans through RupyaNivesh, investors benefit from our distribution and servicing support, for which we receive the commission disclosed above.</p>
              <p><strong className="text-gray-400">Regulatory Oversight:</strong> RupyaNivesh operates under the regulatory framework of the Securities and Exchange Board of India (SEBI) and the Association of Mutual Funds in India (AMFI). We adhere to the AMFI Code of Conduct for Intermediaries, SEBI (Mutual Funds) Regulations 1996, Prevention of Money Laundering Act 2002, and all applicable SEBI circulars and AMFI best practice guidelines.</p>
            </div>

            <div className="mt-6 pt-5 border-t border-white/5 flex flex-wrap gap-4 justify-center md:justify-start">
              <Link to="/privacy-policy" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-400 hover:text-gold transition-colors">
                <Shield size={11} className="text-gold/50" /> Privacy Policy
              </Link>
              <Link to="/terms-and-conditions" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-400 hover:text-gold transition-colors">
                <Scale size={11} className="text-gold/50" /> Terms &amp; Conditions
              </Link>
              <Link to="/investor-charter" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-400 hover:text-gold transition-colors">
                <BookOpen size={11} className="text-gold/50" /> Investor Charter
              </Link>
              <Link to="/grievance-redressal" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-400 hover:text-gold transition-colors">
                <AlertTriangle size={11} className="text-gold/50" /> Grievance Redressal
              </Link>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="text-[10px] text-gray-600 font-medium flex flex-col md:flex-row items-center justify-between gap-3">
            <span>© {new Date().getFullYear()} RupyaNivesh. All rights reserved.</span>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/privacy-policy" className="hover:text-gold transition-colors uppercase tracking-[0.15em]">Privacy Policy</Link>
              <span className="opacity-20">|</span>
              <Link to="/terms-and-conditions" className="hover:text-gold transition-colors uppercase tracking-[0.15em]">Terms &amp; Conditions</Link>
              <span className="opacity-20">|</span>
              <Link to="/investor-charter" className="hover:text-gold transition-colors uppercase tracking-[0.15em]">Investor Charter</Link>
              <span className="opacity-20">|</span>
              <Link to="/grievance-redressal" className="hover:text-gold transition-colors uppercase tracking-[0.15em]">Grievance Redressal</Link>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;



