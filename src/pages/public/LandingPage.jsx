import { NavLink } from "react-router-dom";
import { quickStats } from "../../data/seedData";

const featureTiles = [
  {
    title: "15-sec Ward Stories",
    detail: "Short form updates and celebrations straight from neighbors.",
    icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Guided Documents",
    detail: "Step-by-step requirements for every ward service in one hub.",
    icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "Issue Tracker",
    detail: "Report and follow-up on road, water, waste, and safety cases.",
    icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
];

import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { sponsorSpots } from "../../data/seedData";

export default function LandingPage() {
  const { data: sponsors } = useFirestoreCollection("sponsors", {
    fallbackData: sponsorSpots,
  });

  const topSponsor = sponsors.find(s => s.priority === "top");

  return (
    <div className="space-y-16">
      {/* Top Sponsor Banner */}
      {topSponsor && (
        <div className="flex justify-center">
           <div className="flex items-center gap-3 rounded-full border border-blue-100 bg-blue-50/50 px-6 py-2 backdrop-blur-sm">
             <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Sponsored By</span>
             {topSponsor.imageURL ? (
               <img src={topSponsor.imageURL} alt={topSponsor.name} className="h-8 object-contain" />
             ) : (
               <span className="font-semibold text-slate-700">{topSponsor.name}</span>
             )}
           </div>
        </div>
      )}
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2071&auto=format&fit=crop" 
            alt="Nepal Mountains" 
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
        </div>

        <div className="relative grid gap-12 px-8 py-20 md:grid-cols-2 md:px-12 lg:py-32">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-300 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
              </span>
              Digital Nepal Initiative
            </div>
            
            <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              Connecting <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Citizens</span> <br />
              & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Local Wards</span>
            </h1>
            
            <p className="max-w-lg text-lg text-slate-300 leading-relaxed">
              A unified digital command center for Nepal. Watch ward updates, access verified documents, and hold public services accountable—all in one place.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row">
              <NavLink
                to="/signup"
                className="group relative flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-center font-semibold text-white shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-blue-600/30"
              >
                Get Started
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </NavLink>
              <NavLink
                to="/admin/login"
                className="flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-center font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/10"
              >
                Ward Admin Portal
              </NavLink>
            </div>
          </div>

          {/* Stats Card */}
          <div className="relative hidden md:block">
            <div className="absolute -right-4 top-1/2 w-full max-w-md -translate-y-1/2 rounded-3xl border border-white/10 bg-slate-800/50 p-8 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-400">Live Impact</p>
                  <p className="mt-1 text-2xl font-semibold text-white">Real-time Stats</p>
                </div>
                <div className="rounded-full bg-emerald-500/20 p-2">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-8">
                <div>
                  <p className="text-4xl font-bold text-white">{quickStats.totalIssues}</p>
                  <p className="text-sm text-slate-400 mt-1">Total Cases</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-emerald-400">{quickStats.resolvedIssues}</p>
                  <p className="text-sm text-slate-400 mt-1">Resolved</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-amber-400">{quickStats.inProgressIssues}</p>
                  <p className="text-sm text-slate-400 mt-1">In Progress</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-blue-400">{quickStats.pendingIssues}</p>
                  <p className="text-sm text-slate-400 mt-1">Pending</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid gap-8 md:grid-cols-3">
        {featureTiles.map((feature) => (
          <article key={feature.title} className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/5">
            <div className="mb-6 inline-flex rounded-2xl bg-blue-50 p-4 transition-colors group-hover:bg-blue-600 group-hover:text-white">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
            <p className="mt-3 text-slate-500 leading-relaxed">{feature.detail}</p>
          </article>
        ))}
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden rounded-3xl bg-blue-600 px-8 py-16 text-center text-white md:px-16">
        <div className="absolute inset-0 opacity-10">
           <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
           </svg>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to improve your community?
          </h2>
          <p className="text-blue-100 text-lg">
            Join thousands of citizens and ward officers working together for a better Nepal.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <NavLink
              to="/feed"
              className="rounded-2xl bg-white px-8 py-4 font-bold text-blue-600 shadow-lg transition hover:bg-blue-50 hover:scale-105"
            >
              Explore Ward Feed
            </NavLink>
            <NavLink
              to="/documents"
              className="rounded-2xl border-2 border-white/30 bg-transparent px-8 py-4 font-bold text-white transition hover:bg-white/10"
            >
              View Documents
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  );
}

