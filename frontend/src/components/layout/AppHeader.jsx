import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiGlobe, FiLogOut, FiMenu, FiUser } from 'react-icons/fi';
import { useAuthStore } from '../../store';

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'HI' },
  { code: 'ta', label: 'TA' },
  { code: 'te', label: 'TE' },
  { code: 'kn', label: 'KN' },
  { code: 'ml', label: 'ML' },
];

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Elections', to: '/live-elections' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Dashboard', to: '/dashboard', protected: true },
  { label: 'Chat', to: '/chat', protected: true },
];

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n, t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuthStore();

  const translatedNavItems = [
    { label: t('header.home'), to: '/' },
    { label: t('header.elections'), to: '/live-elections' },
    { label: t('header.faq'), to: '/faq' },
    { label: t('header.vote'), to: '/vote', protected: true },
    { label: t('header.dashboard'), to: '/dashboard', protected: true },
    { label: t('header.chat'), to: '/chat', protected: true },
  ];

  if (user?.role === 'admin') {
    translatedNavItems.push({ label: 'Admin Panel', to: '/admin', protected: true });
  }

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const visibleNavItems = translatedNavItems.filter((item) => !item.protected || isAuthenticated);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-orange-500 text-white shadow-lg shadow-blue-200">
            <span className="text-lg font-bold">🗳️</span>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-slate-500">{t('app.title')}</p>
            <p className="text-base font-bold text-slate-900">{t('header.tagline')}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {visibleNavItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
            <FiGlobe className="text-slate-400" />
            <select
              value={i18n.language?.slice(0, 2) || 'en'}
              onChange={handleLanguageChange}
              className="bg-transparent text-sm font-semibold outline-none"
              aria-label={t('header.selectLanguage')}
            >
              {languages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.label}
                </option>
              ))}
            </select>
          </label>

          {isAuthenticated ? (
            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm md:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <FiUser />
              </div>
              <div className="pr-1">
                <p className="text-xs text-slate-500">{t('header.signedInAs')}</p>
                <p className="max-w-32 truncate text-sm font-semibold text-slate-900">
                  {user?.firstName || t('header.user')}
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Logout"
              >
                <FiLogOut />
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                {t('buttons.login')}
              </button>
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                {t('buttons.register')}
              </button>
            </div>
          )}

          <button
            type="button"
            className="rounded-full border border-slate-200 p-2 text-slate-600 shadow-sm lg:hidden"
            aria-label={t('header.openMenu')}
          >
            <FiMenu />
          </button>
        </div>
      </div>
    </header>
  );
}
