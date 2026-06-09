import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: "Is my money safe when I invest through RupyaNivesh?",
    a: "Your investments remain in your name. We are an AMFI-registered distributor (Shubh Lakshmi Wealth, ARN-361484), and every rupee you invest goes directly from your bank account to the Mutual Fund House (AMC). We do not hold client funds. You receive statements directly from the AMC and CAMS/KFintech, ensuring full transparency of title."
  },
  {
    q: "How do SIPs (Systematic Investment Plans) work?",
    a: "A SIP allows you to invest a fixed amount regularly (monthly/quarterly) in a mutual fund scheme. It helps in Rupee Cost Averaging and builds disciplined savings. Over time, the rupee cost averaging effect means you accumulate more units during market dips, which may benefit your corpus over time. Past performance is not indicative of future results."
  },
  {
    q: "Can I start with just ₹500?",
    a: "Yes! Mutual fund investing is inclusive. Many schemes allow SIPs starting at ₹500 per month. Consistency in investing is key. Returns are subject to market conditions and are not guaranteed."
  },
  {
    q: "Do you charge any separate fees for services?",
    a: "No. As a distributor, we earn a small commission from the Asset Management Companies (AMCs) for the service and ongoing support we provide to you. This is transparently disclosed."
  },
  {
    q: "What happens if the market falls 20% suddenly?",
    a: "Market volatility is inherent to equity mutual funds. During market dips, SIP investors accumulate more units for the same amount invested. Staying invested through market cycles is a commonly discussed approach, though returns are not guaranteed and depend on market conditions."
  },
  {
    q: "Difference between Direct and Regular plans?",
    a: "Direct plans do not involve distributor commission and may have a lower expense ratio compared to regular plans. Under regular plans, investors may avail ongoing services such as transaction facilitation, operational assistance, and investor support through a mutual fund distributor, for which commission is paid by the respective AMC in accordance with applicable SEBI and AMFI regulations."
  },
  {
    q: "Can I withdraw my money anytime?",
    a: "In most open-ended mutual fund schemes, investors may redeem their units at any time, subject to applicable exit load, scheme terms, and cut-off timings. Redemption proceeds are generally processed within the timelines prescribed by SEBI. Certain schemes, such as ELSS (Tax Saver Funds), are subject to a statutory lock-in period of 3 years."
  },
  {
    q: "Is ELSS better than FD for tax saving under 80C?",
    a: "ELSS and FDs have different risk-return profiles. While FDs are fixed-income and capital-protected, ELSS funds invest in equity markets and carry market risk. ELSS has a shorter 3-year lock-in compared to 5 years for tax-saving FDs and offers equity-linked growth potential."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="text-gold font-semibold tracking-widest uppercase text-xs">Got Questions?</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-navy-900 mt-4 leading-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md">
              <button
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                className={`w-full flex items-center justify-between p-6 text-left transition-colors ${openIndex === i ? 'bg-navy-900 text-white' : 'bg-white text-navy-900'}`}
              >
                <div className="flex items-center gap-4">
                  <HelpCircle size={20} className={openIndex === i ? 'text-gold' : 'text-gray-400'} />
                  <span className="font-serif font-bold text-lg">{faq.q}</span>
                </div>
                {openIndex === i ? <ChevronUp size={20} className="text-gold" /> : <ChevronDown size={20} className="text-gray-400" />}
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-8 bg-[#FAF9F6] text-navy-900/70 leading-relaxed text-sm">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Have a specific concern?{' '}
            <a
              href="https://api.whatsapp.com/send/?phone=918889998057&text=Hi%2C+I+have+a+specific+concern+and+would+like+to+speak+with+an+expert.&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold font-bold underline underline-offset-2 hover:text-gold/80 transition-colors"
            >
              Feel free to Ask us directly on WhatsApp.
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
