import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ title, subtitle, children }) => (
  <section className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4 py-10">
    <div className="w-full max-w-md rounded-3xl border border-navy-900/10 bg-white p-8 shadow-[0_30px_80px_rgba(11,19,43,0.1)]">
      <Link to="/" className="inline-flex items-center gap-2 mb-6">
        <span className="w-8 h-8 rounded-lg bg-navy-900 text-gold grid place-items-center font-serif font-bold text-xl">F</span>
        <span className="font-serif font-bold text-navy-900 text-xl">FinGrow<span className="text-gold">X</span></span>
      </Link>
      <h1 className="text-2xl font-serif font-bold text-navy-900">{title}</h1>
      {subtitle ? <p className="mt-2 text-sm text-navy-900/60">{subtitle}</p> : null}
      <div className="mt-6">{children}</div>
    </div>
  </section>
);

export default AuthLayout;

