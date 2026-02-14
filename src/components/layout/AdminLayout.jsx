import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const adminLinks = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/issues", label: "Issues" },
  { to: "/admin/videos", label: "Videos" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/documents", label: "Documents" },
  { to: "/admin/sponsors", label: "Sponsors" },
];

import Logo from "../common/Logo";

export default function AdminLayout() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <div className="flex">
        <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-950/60 px-4 py-8 lg:flex">
          <p className="text-xs uppercase tracking-[0.3em] text-blue-400">Admin</p>
          <h2 className="mt-1 text-2xl font-semibold">Ward Control</h2>
          <nav className="mt-8 space-y-1 text-sm">
            {adminLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  [
                    "block rounded-md px-3 py-2 font-medium transition",
                    isActive
                      ? "bg-blue-500/20 text-white"
                      : "text-slate-300 hover:bg-slate-800/60",
                  ].join(" ")
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="border-b border-slate-800 bg-slate-900/60 px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Logo className="h-8 w-8" />
                <div className="hidden md:block">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Officer Panel</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <button 
                  onClick={() => navigate('/')}
                  className="rounded-full border border-slate-700 px-3 py-1 text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Back to Home
                </button>
                <NavLink 
                  to="/wards"
                  className="rounded-full border border-slate-700 px-3 py-1 text-slate-300 hover:text-white transition"
                >
                  Ward {profile?.wardNumber || "..."}
                </NavLink>
                <NavLink 
                  to="/notifications"
                  className="rounded-full border border-slate-700 px-3 py-1 text-slate-300 transition hover:border-blue-400 hover:text-blue-300"
                >
                  Notifications
                </NavLink>
              </div>
            </div>
            <div className="mt-4 flex gap-3 text-xs font-medium text-slate-400 lg:hidden">
              {adminLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    [
                      "rounded-full px-3 py-1",
                      isActive ? "bg-blue-500/20 text-white" : "bg-slate-800/60",
                    ].join(" ")
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </header>
          <main className="flex-1 px-4 py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

