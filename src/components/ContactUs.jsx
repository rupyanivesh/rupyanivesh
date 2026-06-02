import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Shield, ArrowRight, CheckCircle, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

const ContactUs = () => {
  const [num1, setNum1] = useState(3);
  const [num2, setNum2] = useState(4);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
  }, []);

  const captchaSolution = (num1 + num2).toString();

  const inputCls = 'w-full bg-[#F8F6F2] border border-gray-200 rounded-xl px-4 py-3 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all placeholder-gray-400';
  const labelCls = 'block text-[10px] font-bold uppercase tracking-[0.2em] text-navy-900/50 mb-2';

  return (
    <div className="min-h-screen bg-[#F5F2EC]">

      {/* ── Hero ── */}
      <div className="relative bg-navy-900 overflow-hidden">
        <div className="container-custom relative z-10 pt-36 pb-12 text-center">
          <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-gold/60" />
            <span className="text-gold font-bold text-lg uppercase tracking-[0.3em]">Contact Us</span>
            <span className="w-8 h-px bg-gold/60" />
          </motion.div>
        </div>
        <div className="h-10 bg-[#F5F2EC] rounded-t-[40px] -mb-1" />
      </div>

      {/* ── Main ── */}
      <div className="container-custom max-w-5xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 items-start">

          {/* ── Left Panel ── */}
          <motion.div {...fadeUp(0.1)} className="space-y-3">

            {/* Contact details */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {[
                { icon: Phone, label: 'Phone', value: '+91 95181-07944', href: 'tel:+919518107944' },
                { icon: Mail, label: 'Email', value: 'info@rupyanivesh.in', href: 'mailto:info@rupyanivesh.in' },
                { icon: MapPin, label: 'Address', value: '2nd Floor, Plot No. 02, Sector-13, Hisar-125005 (Haryana)', href: null },
                { icon: Clock, label: 'Hours', value: 'Mon – Fri, 9:30 AM – 6:00 PM', href: null },
              ].map(({ icon: Icon, label, value, href }, i, arr) => (
                <div key={label} className={`flex items-start gap-4 px-6 py-5 ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <div className="w-9 h-9 rounded-xl bg-navy-900 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={15} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} className="text-navy-900 font-semibold text-sm hover:text-gold transition-colors">{value}</a>
                    ) : (
                      <p className="text-navy-900 font-semibold text-sm leading-relaxed">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp */}
            <motion.a
              {...fadeUp(0.2)}
              href="https://wa.me/919518107944?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20mutual%20fund%20investments."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-[#25D366] rounded-2xl px-6 py-4 group hover:bg-[#1fbc5b] transition-colors"
            >
              <div className="flex items-center gap-3">
                <MessageCircle size={20} className="text-white" />
                <div>
                  <p className="text-white font-bold text-sm">Chat on WhatsApp</p>
                  <p className="text-white/70 text-xs">Typically replies within minutes</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-white/70 group-hover:translate-x-1 transition-transform" />
            </motion.a>

            {/* AMFI badge */}
            <motion.div {...fadeUp(0.28)} className="bg-navy-900 rounded-2xl px-6 py-4 flex items-center gap-3">
              <Shield size={18} className="text-gold shrink-0" />
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-[0.18em] font-bold mb-0.5">AMFI-Registered Distributor</p>
                <p className="text-gold font-bold text-sm">ARN-361484 · Shubh Lakshmi Wealth</p>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right — Form ── */}
          <motion.div {...fadeUp(0.18)} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-navy-900 via-gold to-navy-900" />
            <div className="p-8 lg:p-10">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-5">
                    <CheckCircle size={32} className="text-gold" />
                  </div>
                  <h3 className="text-navy-900 font-serif font-bold text-2xl mb-2">Message Sent!</h3>
                  <p className="text-gray-400 text-sm">We'll get back to you within 1 business day.</p>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="text-navy-900 font-serif font-bold text-2xl lg:text-3xl mb-1">Send a Message</h3>
                    <p className="text-gray-400 text-sm">We'll respond within 1 business day.</p>
                  </div>

                  <form
                    action="https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse"
                    method="POST"
                    target="_blank"
                    className="space-y-5"
                    onSubmit={() => setSubmitted(true)}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelCls}>Your Name <span className="text-red-400">*</span></label>
                        <input type="text" name="entry.YOUR_NAME_ID" required placeholder="Ramesh Kumar" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Phone Number <span className="text-red-400">*</span></label>
                        <input type="tel" name="entry.YOUR_PHONE_ID" required placeholder="+91 98765 43210" className={inputCls} />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Email Address <span className="text-red-400">*</span></label>
                      <input type="email" name="entry.YOUR_EMAIL_ID" required placeholder="you@example.com" className={inputCls} />
                    </div>

                    <div>
                      <label className={labelCls}>Subject <span className="text-red-400">*</span></label>
                      <input type="text" name="entry.YOUR_SUBJECT_ID" required placeholder="e.g. SIP Investment Query" className={inputCls} />
                    </div>

                    <div>
                      <label className={labelCls}>Message</label>
                      <textarea name="entry.YOUR_MESSAGE_ID" rows="4" placeholder="Tell us how we can help..." className={`${inputCls} resize-none`} />
                    </div>

                    <div>
                      <label className={labelCls}>
                        What is {num1} + {num2}? <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="entry.YOUR_CAPTCHA_ID"
                        required
                        pattern={`^${captchaSolution}$`}
                        title={`Please enter ${captchaSolution}`}
                        placeholder="Your answer"
                        className={inputCls}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-4 rounded-xl transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
                    >
                      Send Message <ArrowRight size={16} />
                    </button>

                    <p className="text-[10px] text-gray-400 leading-relaxed text-center pt-1">
                      By submitting, you consent to RupyaNivesh (Shubh Lakshmi Wealth) collecting your contact information for communication purposes in accordance with SEBI and AMFI guidelines. Your data is kept strictly confidential.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ContactUs;
