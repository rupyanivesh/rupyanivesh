import React, { useState, useEffect, useMemo } from 'react';
import { Menu, X, ChevronDown, TrendingUp, Target, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { tools } from './Calculators';
import logoSrc from '../assets/logo.png';


const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // On non-home pages the hero is dark, so always show the solid header
  const alwaysSolid = pathname !== '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const solid = alwaysSolid || isScrolled;
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

  const isActive = (path) => pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${solid ? 'bg-white/90 backdrop-blur-md shadow-premium' : 'bg-transparent'}`}
    >
      {/* Gold accent bar */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className={`transition-all duration-500 ${solid ? 'py-4' : 'py-6'}`}>
      <div className="container-custom relative z-10">
        <nav className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 group cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img
              src={logoSrc}
              alt="RupyaNivesh"
              className="h-16 w-auto object-contain transition-opacity group-hover:opacity-85"
              style={{ maxWidth: 260 }}
            />
          </Link>

          <div className="hidden lg:flex items-center gap-8 xl:gap-10">
            {[
              { to: '/', label: 'Home' },
              { to: '/learn-finance', label: 'Learn Finance' },
              { to: '/explore-funds', label: 'Explore Funds' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`relative text-[13px] font-bold uppercase tracking-widest transition-colors whitespace-nowrap pb-1 group ${isActive(to) ? 'text-gold' : 'text-navy-900/60 hover:text-gold'}`}
              >
                {label}
                <span className={`absolute bottom-0 left-0 h-px bg-gold transition-all duration-300 ${isActive(to) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}

            {/* Tools Dropdown */}
            <div className="relative group/dropdown py-4 flex items-center">
              <button className="relative flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-widest text-navy-900/60 group-hover/dropdown:text-gold transition-colors whitespace-nowrap pb-1">
                Tools <ChevronDown size={14} className="group-hover/dropdown:-rotate-180 transition-transform duration-300" />
                <span className="absolute bottom-0 left-0 h-px bg-gold w-0 group-hover/dropdown:w-full transition-all duration-300" />
              </button>

              <div className="absolute top-12 left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-300 delay-75">
                <div className="bg-white rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 p-4 min-w-[620px]">
                  <div className="grid grid-cols-2 gap-4">
                    {groupedTools.map((group) => (
                      <div key={group.category} className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-navy-900/55 px-2 mb-2">
                          {group.category}
                        </p>
                        <div className="space-y-1">
                          {group.items.map((tool) => (
                            <Link
                              key={tool.id}
                              to={`/${tool.id}-calculator`}
                              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FAF9F6] text-navy-900 text-sm font-bold group/item transition-all"
                            >
                              <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
                                <tool.icon size={14} className="text-gold group-hover/item:scale-110 transition-transform" />
                              </div>
                              <span className="group-hover/item:text-gold transition-colors leading-tight">{tool.title}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/#why-us"
              onClick={(e) => {
                const el = document.getElementById('why-us');
                if (el) {
                  e.preventDefault();
                  const offset = el.getBoundingClientRect().top + window.scrollY - 80;
                  window.scrollTo({ top: offset, behavior: 'smooth' });
                }
              }}
              className="relative text-[13px] font-bold uppercase tracking-widest text-navy-900/60 hover:text-gold transition-colors whitespace-nowrap pb-1 group">
              Why Us
              <span className="absolute bottom-0 left-0 h-px bg-gold w-0 group-hover:w-full transition-all duration-300" />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/contact" className="hidden md:block btn-primary py-2.5">
              Contact Us
            </Link>
            <button
              className="lg:hidden p-2 text-navy-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 p-8 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top duration-300">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-lg font-serif font-bold text-navy-900">Home</Link>
          <Link to="/learn-finance" onClick={() => setMobileMenuOpen(false)} className="text-lg font-serif font-bold text-navy-900">Learn Finance</Link>
          <Link to="/explore-funds" onClick={() => setMobileMenuOpen(false)} className="text-lg font-serif font-bold text-navy-900">Explore Funds</Link>
          <Link to="/#why-us" onClick={() => setMobileMenuOpen(false)} className="text-lg font-serif font-bold text-navy-900">Why Us</Link>
          <div className="flex flex-col gap-2">
            <span className="text-lg font-serif font-bold text-navy-900">Tools</span>
            <div className="rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
              {[
                { category: 'Core Investment Calculators', icon: TrendingUp, subtitle: 'SIP, SWP, Lumpsum & more' },
                { category: 'Goal Based Calculators', icon: Target, subtitle: 'Retirement, Education & more' },
              ].map(({ category, icon: Icon, subtitle }) => (
                <Link
                  key={category}
                  to="/#calculators"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setTimeout(() => {
                      const el = document.getElementById('calculators');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className="flex items-center gap-3 px-4 py-3.5 bg-white active:bg-[#FAF9F6] transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#8B6914] shadow-sm flex items-center justify-center shrink-0">
                    <Icon size={17} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-navy-900 leading-tight">{category}</p>
                    <p className="text-[11px] text-navy-900/40 mt-0.5">{subtitle}</p>
                  </div>
                  <ChevronRight size={14} className="text-gold/60 shrink-0" />
                </Link>
              ))}
            </div>
          </div>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="btn-primary w-full text-center">
            Contact Us
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
