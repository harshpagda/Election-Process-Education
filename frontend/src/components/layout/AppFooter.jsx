import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiMapPin, FiMessageCircle } from 'react-icons/fi';

export default function AppFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Election Process Assistant</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
            Helping citizens understand election steps, find polling booths, and get trustworthy voting guidance in one place.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Quick Links</h3>
          <div className="mt-4 grid gap-3 text-sm">
            <Link className="transition hover:text-white" to="/live-elections">
              Live Elections
            </Link>
            <Link className="transition hover:text-white" to="/faq">
              FAQ
            </Link>
            <Link className="transition hover:text-white" to="/chat">
              AI Chat
            </Link>
            <Link className="transition hover:text-white" to="/polling-booths">
              Polling Booth Finder
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Built for clarity</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <div className="flex items-start gap-3">
              <FiShield className="mt-0.5 text-blue-400" />
              <p>Secure login, validation, and role-based access.</p>
            </div>
            <div className="flex items-start gap-3">
              <FiMapPin className="mt-0.5 text-orange-400" />
              <p>Location-aware booth lookup with map support.</p>
            </div>
            <div className="flex items-start gap-3">
              <FiMessageCircle className="mt-0.5 text-emerald-400" />
              <p>AI help with multilingual election guidance.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Election Process Assistant. Designed to make voting easier.
      </div>
    </footer>
  );
}
