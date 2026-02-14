import { useState } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      await login(form.email, form.password);
      const redirectTo = location.state?.from?.pathname ?? "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100">
      <SectionHeader
        eyebrow="Welcome back"
        title="Login to HamroWard"
        description="Use your citizen credentials. Ward admins can switch from the toggle below."
      />

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            required
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-400 focus:outline-none"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            required
            name="password"
            value={form.password}
            onChange={handleChange}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-400 focus:outline-none"
          />
        </label>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-600">
            <input type="checkbox" className="rounded border-slate-300" /> Stay signed in
          </label>
          <NavLink to="/reset-password" className="text-blue-600 hover:text-blue-500">
            Forgot password?
          </NavLink>
        </div>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {status === "loading" ? "Signing in…" : "Login"}
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm text-blue-700">
        <p className="font-semibold">Ward Admin?</p>
        <p>
          Use your ward-issued email via the dedicated{" "}
          <NavLink to="/admin/login" className="underline">
            admin portal
          </NavLink>
          .
        </p>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        New here?{" "}
        <NavLink to="/signup" className="font-semibold text-blue-600 hover:text-blue-500">
          Create a citizen profile
        </NavLink>
      </p>
    </div>
  );
}

