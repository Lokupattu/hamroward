import { useState, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { sponsorSpots } from "../../data/seedData";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/wards", label: "Wards" },
  { to: "/documents", label: "Documents" },
  { to: "/feed", label: "Videos" },
  { to: "/todays-issues", label: "Today's Issues" },
  { to: "/notifications", label: "Notifications" },
  { to: "/report-issue", label: "Report Issue" },
];

const priorityOrder = ["top", "middle", "footer"];

import Logo from "../common/Logo";

export default function RootLayout() {
  const navigate = useNavigate();
  const { user, profile, role, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [donationsOpen, setDonationsOpen] = useState(false);
  const { data: fetchedSponsors } = useFirestoreCollection("sponsors", {
    fallbackData: sponsorSpots,
  });
  
  const liveSponsors = fetchedSponsors.length > 0 ? fetchedSponsors : sponsorSpots;
  const orderedSponsors = [...liveSponsors].sort(
    (a, b) => priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
  );

   const closeTimeout = useRef(null);
  
  const handleDonationMouseEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setDonationsOpen(true);
  };

  const handleDonationMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setDonationsOpen(false);
    }, 300);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 w-full glass border-b border-slate-200/50 px-4 md:px-0">
        <div className="mx-auto flex max-w-7xl items-center justify-between py-5 md:px-8">
          <NavLink to="/" className="group transition-transform hover:scale-105 active:scale-95">
            <Logo className="h-10 w-auto" />
          </NavLink>
          
          <nav className="hidden gap-1 text-sm font-bold text-slate-600 lg:flex items-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl transition-all hover:bg-slate-100 hover:text-blue-600 ${
                    isActive ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-100/50" : ""
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            
            {/* Donations Dropdown */}
            <div 
              className="relative"
              onMouseEnter={handleDonationMouseEnter}
              onMouseLeave={handleDonationMouseLeave}
            >
              <button 
                onClick={() => setDonationsOpen(!donationsOpen)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all hover:bg-slate-100 hover:text-blue-600 font-bold focus:outline-none ${
                    donationsOpen ? "bg-slate-100 text-blue-600" : "text-slate-600"
                }`}
              >
                Donations
                <svg className={`w-4 h-4 transition-transform duration-300 ${donationsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {donationsOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-[1.5rem] border border-slate-200 bg-white p-2 shadow-2xl ring-1 ring-black ring-opacity-5 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <NavLink
                    to="/donate"
                    onClick={() => setDonationsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div className="h-2 w-2 rounded-full bg-blue-400" />
                    Make a Donation
                  </NavLink>
                  <NavLink
                    to="/donors"
                    onClick={() => setDonationsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div className="h-2 w-2 rounded-full bg-emerald-400" />
                    View Donors
                  </NavLink>
                </div>
              )}
            </div>
          </nav>
          
          <div className="flex items-center gap-4">
            {/* Search Toggle (Desktop Only for now) */}
            <div className="hidden xl:block relative">
               <button onClick={() => navigate('/search')} className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100 group">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
               </button>
            </div>

            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden lg:flex flex-col items-end text-right mr-2">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Welcome Back</span>
                  <span className="text-sm font-bold text-slate-900 leading-none">{profile?.name || user.email?.split("@")[0]}</span>
                </div>
                
                {role === "admin" && (
                  <NavLink
                    to="/admin"
                    className="hidden md:flex items-center rounded-2xl bg-blue-600 px-5 py-2.5 text-xs font-black text-white shadow-xl shadow-blue-900/20 transition-all hover:bg-blue-500 hover:-translate-y-0.5"
                  >
                    Admin Portal
                  </NavLink>
                )}

                <button
                  onClick={() => navigate("/profile")}
                  className="hidden md:flex items-center justify-center h-11 w-11 rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200 hover:scale-105 active:scale-95 transition-all"
                  title="Profile"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </button>

                <button
                  onClick={handleLogout}
                  className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-black text-slate-600 transition-all hover:bg-red-50 hover:text-red-600 hover:border-red-100 active:scale-95"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink
                  to="/login"
                  className="px-6 py-2.5 text-sm font-black text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/signup"
                  className="rounded-2xl bg-blue-600 px-6 py-2.5 text-sm font-black text-white shadow-xl shadow-blue-900/20 transition-all hover:bg-blue-500 hover:-translate-y-0.5 active:scale-95"
                >
                  Join Today
                </NavLink>
              </div>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-3 rounded-2xl bg-slate-100 text-slate-600 transition-all active:scale-90"
            >
               <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 animate-in slide-in-from-top-4 duration-300">
             <div className="flex flex-col gap-2 p-6">
                {role === "admin" && (
                  <NavLink
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex justify-between items-center rounded-2xl px-6 py-4 font-black bg-blue-600 text-white shadow-xl shadow-blue-900/20 transition-all active:scale-95 mb-2"
                  >
                    GO TO ADMIN PORTAL
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </NavLink>
                )}
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="flex justify-between items-center rounded-2xl px-6 py-4 font-bold bg-slate-50 transition-all active:scale-95"
                  >
                    {link.label}
                    <svg className="w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                  </NavLink>
                ))}
             </div>
          </div>
        )}


        {/* Live Sponsor Ticker */}
        <div className="bg-slate-900 py-2.5 overflow-hidden whitespace-nowrap">
           <div className="inline-block animate-marquee-slow">
              {orderedSponsors.concat(orderedSponsors).map((sponsor, idx) => (
                <span key={`${sponsor.id}-${idx}`} className="inline-flex items-center mx-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group cursor-default">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3 animate-pulse"></span>
                  Supported by <span className="text-slate-300 ml-2 group-hover:text-blue-400 transition-colors uppercase">{sponsor.name}</span>
                </span>
              ))}
           </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8 animate-in fade-in duration-700">
        <Outlet />
      </main>

      {/* Premium Footer */}
      <footer className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-8 grid gap-12 md:grid-cols-4 lg:grid-cols-5">
           <div className="md:col-span-2 lg:col-span-2 space-y-6">
              <Logo className="h-10 w-auto" />
              <p className="max-w-xs text-sm font-medium leading-relaxed text-slate-500 italic">
                Empowering Nepal's local governance through digital transparency and citizen engagement.
              </p>
              <div className="flex gap-4">
                 <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all cursor-pointer"><svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></div>
                 <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all cursor-pointer"><svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-8 lg:col-span-3 lg:grid-cols-3">
              <div className="space-y-6">
                 <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 leading-none">Platform</h4>
                 <ul className="space-y-3 text-sm font-bold text-slate-500">
                    <li><NavLink to="/wards" className="hover:text-blue-600 transition-colors">Wards Hub</NavLink></li>
                    <li><NavLink to="/documents" className="hover:text-blue-600 transition-colors">Documents</NavLink></li>
                    <li><NavLink to="/feed" className="hover:text-blue-600 transition-colors">Citizen Feed</NavLink></li>
                 </ul>
              </div>

              <div className="space-y-6">
                 <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 leading-none">Support</h4>
                 <ul className="space-y-3 text-sm font-bold text-slate-500">
                    <li><NavLink to="/donate" className="hover:text-blue-600 transition-colors">Donate Now</NavLink></li>
                    <li><NavLink to="/sponsors" className="hover:text-blue-600 transition-colors">Partnership</NavLink></li>
                    <li><NavLink to="/contact" className="hover:text-blue-600 transition-colors">Contact Us</NavLink></li>
                 </ul>
              </div>

              <div className="space-y-6">
                 <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 leading-none">Admin</h4>
                 <ul className="space-y-3 text-sm font-bold text-slate-500">
                    <li><NavLink to="/admin/login" className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-blue-600 transition-all inline-block">Portal Login</NavLink></li>
                 </ul>
              </div>
           </div>
        </div>

        <div className="mx-auto max-w-7xl px-8 mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
           <p>© {new Date().getFullYear()} HamroWard Tech. Crafted with pride for Nepal.</p>
           <div className="flex gap-8">
              <NavLink to="/privacy" className="hover:text-blue-600">Privacy Policy</NavLink>
              <NavLink to="/terms" className="hover:text-blue-600">Terms of Service</NavLink>
           </div>
        </div>
      </footer>
    </div>
  );
}

