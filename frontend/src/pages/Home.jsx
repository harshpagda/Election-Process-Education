import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiMapPin, FiMessageCircle, FiShield, FiUsers, FiClock } from 'react-icons/fi';
import { useAuthStore } from '../store';

const featureCards = [
  {
    icon: <FiMessageCircle className="text-2xl text-blue-600" />,
    title: 'Ask questions in plain language',
    description: 'Get quick answers about voting, eligibility, and documents without reading long legal text.',
  },
  {
    icon: <FiMapPin className="text-2xl text-emerald-600" />,
    title: 'Find your nearest booth',
    description: 'Use the map view to see nearby polling booths and choose the most convenient one.',
  },
  {
    icon: <FiCheckCircle className="text-2xl text-orange-600" />,
    title: 'Track election steps clearly',
    description: 'See what is happening now, what is next, and what each phase means for you.',
  },
];

const trustItems = [
  'Secure login and verified sessions',
  'Six language support for wider accessibility',
  'Helpful timelines and FAQ guidance',
  'Mobile-friendly, responsive interface',
];

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_80px_-35px_rgba(15,23,42,0.35)]">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-8 sm:p-12 lg:p-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <FiShield /> Clear voting help in one place
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Understand elections without confusion.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Election Process Assistant gives you simple guidance, live election updates, polling booth maps,
              and multilingual support so you can act with confidence.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate('/register')}
                    className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
                  >
                    Get started
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    I already have an account
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
                  >
                    Open dashboard
                  </button>
                  <button
                    onClick={() => navigate('/live-elections')}
                    className="rounded-full border border-red-200 bg-red-50 px-6 py-3 font-semibold text-red-700 transition hover:bg-red-100"
                  >
                    View live elections
                  </button>
                </>
              )}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ['Live updates', 'Election status and timelines'],
                ['Booth finder', 'Map and nearby polling locations'],
                ['AI assistant', 'Simple answers in your language'],
              ].map(([title, description]) => (
                <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-900">{title}</p>
                  <p className="mt-1 text-sm text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-8 text-white sm:p-12 lg:p-16">
            <div className="rounded-[1.75rem] bg-white/10 p-6 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Today’s focus</p>
                  <p className="mt-2 text-2xl font-bold">One place for every voting step</p>
                </div>
                <div className="rounded-2xl bg-orange-500/20 px-3 py-2 text-sm font-semibold text-orange-200">
                  6 languages
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  'Check if an election is live or upcoming',
                  'Find booths near your location on a map',
                  'Read FAQs without jargon',
                  'Chat with the AI assistant for help',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/8 p-4">
                    <FiClock className="mt-1 shrink-0 text-orange-300" />
                    <p className="text-sm leading-6 text-slate-100">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-7xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">How it helps</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">A simpler path to voting information</h2>
          </div>
          <button
            onClick={() => navigate('/faq')}
            className="hidden rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 md:inline-flex"
          >
            Browse FAQ
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {featureCards.map((card) => (
            <article
              key={card.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-3xl bg-blue-600 p-8 text-white shadow-xl shadow-blue-200">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">Why people stay here</p>
          <h2 className="mt-3 text-3xl font-bold">Fast answers, fewer steps, less confusion</h2>
          <div className="mt-6 space-y-3 text-sm leading-7 text-blue-50">
            {trustItems.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <FiUsers className="mt-1 shrink-0" />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Recommended actions</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Start with the task you need right now</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Check live elections', to: '/live-elections', color: 'bg-red-50 text-red-700 border-red-200' },
              { label: 'Find polling booth', to: '/polling-booths', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
              { label: 'Ask AI assistant', to: '/chat', color: 'bg-blue-50 text-blue-700 border-blue-200' },
              { label: 'Read FAQs', to: '/faq', color: 'bg-slate-50 text-slate-700 border-slate-200' },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.to)}
                className={`rounded-2xl border px-5 py-4 text-left text-sm font-semibold transition hover:shadow-md ${action.color}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-7xl rounded-3xl border border-slate-200 bg-slate-950 px-8 py-10 text-center text-white shadow-xl">
        <h2 className="text-3xl font-bold">Ready to make voting easier?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-300">
          Open the dashboard for live announcements, or register to keep your profile and booth details in one place.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
            className="rounded-full bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            {isAuthenticated ? 'Go to dashboard' : 'Create account'}
          </button>
          <button
            onClick={() => navigate('/live-elections')}
            className="rounded-full border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/15"
          >
            Explore live elections
          </button>
        </div>
      </section>
    </div>
  );
}
