import React from 'react';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AppHeader />
      <main>{children}</main>
      <AppFooter />
    </div>
  );
}
