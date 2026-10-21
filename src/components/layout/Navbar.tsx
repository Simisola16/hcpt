import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  ShieldCheck,
  Menu,
  X,
  ArrowRight,
  Layers,
  FileText,
  Sliders,
  Cpu,
  Building2,
  HelpCircle,
  Mail
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const location = useLocation();

  const isDemoActive = location.pathname.startsWith('/platform-demo');

  const navLinks = [
    { label: 'Industries', href: '/industries' },
    { label: 'Technology', href: '/technology' },
    { label: 'Capabilities', href: '/capabilities' },
    { label: 'Verify Seal', href: '/verify' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ];

  const solutionLinks = [
    {
      title: 'Halal Certification Portals',
      description: 'Online intake portals for applicants, manufacturers, and audit bodies.',
      href: '/solutions/halal-certification-portals',
      icon: Layers
    },
    {
      title: 'Electronic Application Processing',
      description: 'Automate document intake, ingredient verification, and fee reconciliation.',
      href: '/solutions/electronic-processing',
      icon: FileText
    },
    {
      title: 'Certification Workflow Management',
      description: 'Orchestrate technical review, inspection scheduling, and approval gates.',
      href: '/solutions/certification-management',
      icon: Sliders
    }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo with strict preservation (Left) */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-emerald-600 rounded">
            <img
              src="/hcpt-logo.jpg"
              alt="HCPT — Halal Certification Processing Technologies"
              className="h-12 sm:h-13 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              loading="eager"
            />
          </Link>

          {/* Desktop Navigation (Center) */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main Navigation">
            
            {/* Solutions Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setSolutionsOpen(true)}
              onMouseLeave={() => setSolutionsOpen(false)}
            >
              <button
                type="button"
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors py-2 ${
                  location.pathname.startsWith('/solutions')
                    ? 'text-emerald-700'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
                aria-expanded={solutionsOpen}
              >
                Solutions
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${solutionsOpen ? 'rotate-180' : ''}`} />
              </button>

              {solutionsOpen && (
                <div className="absolute top-full -left-4 w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-3 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-2 border-b border-slate-100 mb-2">
                    <Link
                      to="/solutions"
                      onClick={() => setSolutionsOpen(false)}
                      className="text-xs font-bold text-emerald-800 uppercase tracking-wider hover:underline flex items-center justify-between"
                    >
                      All Solutions Overview
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <div className="space-y-1">
                    {solutionLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setSolutionsOpen(false)}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                          <div className="p-2 rounded-md bg-emerald-50 text-emerald-800 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900 group-hover:text-emerald-800">
                              {item.title}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Other Main Links */}
            {navLinks.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm font-semibold transition-colors ${
                  location.pathname === item.href
                    ? 'text-emerald-700'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Action CTAs (Right) */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/contact"
              className="text-sm font-semibold text-slate-700 hover:text-emerald-800 transition-colors px-3 py-2"
            >
              Discuss Requirements
            </Link>
            
            <Link
              to="/platform-demo"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-xs transition-all duration-200 ${
                isDemoActive
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-[#006837] text-white hover:bg-[#00522b] shadow-emerald-900/10'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Explore Platform Demo</span>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-4 pb-6 space-y-4">
          <div className="space-y-1">
            <Link
              to="/solutions"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-base font-semibold text-slate-900 rounded-md hover:bg-slate-50"
            >
              Solutions
            </Link>
            <div className="pl-4 space-y-1">
              {solutionLinks.map((sub) => (
                <Link
                  key={sub.href}
                  to={sub.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-1.5 text-sm text-slate-600 hover:text-emerald-700"
                >
                  {sub.title}
                </Link>
              ))}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-base font-semibold text-slate-900 rounded-md hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-2">
            <Link
              to="/platform-demo"
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#006837] text-white rounded-lg text-sm font-semibold"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Explore Platform Demo</span>
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="w-full block text-center py-2.5 text-sm font-semibold text-slate-700 border border-slate-300 rounded-lg"
            >
              Discuss Your Requirements
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
