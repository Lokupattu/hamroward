import { useState } from "react";
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
  const { data: fetchedSponsors } = useFirestoreCollection("sponsors", {
    fallbackData: sponsorSpots,
  });
  
  // Use seed data if Firestore returns empty list
  const liveSponsors = fetchedSponsors.length > 0 ? fetchedSponsors : sponsorSpots;
  const orderedSponsors = [...liveSponsors].sort(
    (a, b) => priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
  );

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <NavLink to="/">
            <Logo className="h-10 w-10" />
          </NavLink>
          <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `transition hover:text-blue-600 ${isActive ? "text-blue-600" : ""}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          
          {/* Search Bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const q = e.target.search.value;
              if (q.trim()) navigate(`/search?q=${encodeURIComponent(q)}`);
            }}
            className="hidden md:block relative mx-4"
          >
            <input
              type="search"
              name="search"
              placeholder="Search..."
              className="rounded-full border border-slate-300 py-1.5 pl-4 pr-10 text-sm focus:border-blue-500 focus:outline-none w-48 focus:w-64 transition-all"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <NavLink to="/profile" className="hidden text-sm text-slate-600 md:block hover:text-blue-600">
                  Hello, <span className="font-semibold text-slate-900">{profile?.name || user.email?.split("@")[0]}</span>{" "}
                  <span className="text-xs text-blue-600">({role === "admin" ? "Admin" : "User"})</span>
                </NavLink>
                <button
                  onClick={() => navigate("/profile")}
                  className="hidden md:block rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
                >
                  Profile
                </button>
                <button
                  onClick={() => navigate("/my-videos")}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
                >
                  My Videos
                </button>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:text-red-600"
                >
                  Logout
                </button>
                {role === "admin" ? (
                  <NavLink
                    to="/admin"
                    className="hidden rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 md:block"
                  >
                    Admin Panel
                  </NavLink>
                ) : null}
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="hidden rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 md:block"
                >
                  Create account
                </NavLink>
              </>
            )}
            <button
              type="button"
              className="ml-2 inline-flex items-center justify-center rounded-full border border-slate-300 p-2 text-slate-600 transition hover:border-blue-200 hover:text-blue-600 md:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              <span className="sr-only">Open menu</span>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
        {mobileOpen ? (
          <div className="border-t border-slate-200 bg-white px-4 py-4 text-sm font-medium text-slate-700 md:hidden">
            {user ? (
              <div className="mb-3 rounded-2xl bg-blue-50 px-4 py-2 text-sm">
                <p className="text-slate-600">
                  Hello, <span className="font-semibold text-slate-900">{profile?.name || user.email?.split("@")[0]}</span>
                </p>
                <p className="mt-1 text-xs text-blue-600">{role === "admin" ? "Admin" : "User"}</p>
              </div>
            ) : null}
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    [
                      "rounded-2xl px-4 py-2 transition",
                      isActive ? "bg-blue-50 text-blue-600" : "bg-slate-50",
                    ].join(" ")
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {user ? (
                <>
                  {role === "admin" ? (
                    <NavLink
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-2xl bg-slate-800 px-4 py-2 text-white transition hover:bg-slate-700"
                    >
                      Admin Panel
                    </NavLink>
                  ) : null}
                    <button
                    onClick={() => {
                      navigate("/profile");
                      setMobileOpen(false);
                    }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 transition hover:bg-slate-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/my-videos");
                      setMobileOpen(false);
                    }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 transition hover:bg-slate-100"
                  >
                    My Videos
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-red-700 transition hover:bg-red-100"
                  >
                    Logout
                  </button>
                </>
              ) : null}
            </div>
          </div>
        ) : null}
        <div className="flex items-center gap-4 overflow-x-auto border-t border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500">
          {orderedSponsors.map((sponsor) => (
            <span key={sponsor.id} className="flex items-center gap-2 whitespace-nowrap">
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] uppercase tracking-wide text-blue-600">
                {sponsor.priority}
              </span>
              {sponsor.name}
            </span>
          ))}
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-slate-500 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} HamroWard. All rights reserved.</p>
          <div className="flex gap-6">
            <NavLink to="/privacy" className="hover:text-blue-600">
              Privacy
            </NavLink>
            <NavLink to="/terms" className="hover:text-blue-600">
              Terms
            </NavLink>
            <NavLink to="/sponsors" className="hover:text-blue-600">
              Sponsors
            </NavLink>
            <NavLink to="/admin/login" className="font-medium text-blue-600 hover:text-blue-500">
              Ward admin
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
}

