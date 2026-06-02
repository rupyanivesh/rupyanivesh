import React from 'react';
import { Shield, Scale, BookOpen, AlertTriangle } from 'lucide-react';
import {
  PrivacyPolicyContent,
  TermsContent,
  InvestorCharterContent,
  GrievanceContent,
} from './Footer';

const PolicyPageShell = ({ title, icon: Icon, children }) => (
  <section className="py-16 md:py-20 bg-[#FAF9F6]">
    <div className="container-custom">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 md:px-10 py-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-gold/15 rounded-xl flex items-center justify-center">
            <Icon size={18} className="text-gold" />
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-navy-900">{title}</h1>
        </div>
        <div className="px-6 md:px-10 py-7 text-sm text-gray-700 leading-relaxed space-y-5">
          {children}
        </div>
      </div>
    </div>
  </section>
);

export const PrivacyPolicyPage = () => (
  <PolicyPageShell title="Privacy Policy" icon={Shield}>
    <PrivacyPolicyContent />
  </PolicyPageShell>
);

export const TermsPage = () => (
  <PolicyPageShell title="Terms & Conditions" icon={Scale}>
    <TermsContent />
  </PolicyPageShell>
);

export const InvestorCharterPage = () => (
  <PolicyPageShell title="Investor Charter" icon={BookOpen}>
    <InvestorCharterContent />
  </PolicyPageShell>
);

export const GrievancePolicyPage = () => (
  <PolicyPageShell title="Grievance Redressal Policy" icon={AlertTriangle}>
    <GrievanceContent />
  </PolicyPageShell>
);
