import { useState } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import { NavLink, useNavigate } from "react-router-dom";
import { wardSelectOptions } from "../../data/wardNumbers";
import { useAuth } from "../../context/AuthContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  // Always use the full 50 ward options for dropdowns
  const wardOptions = wardSelectOptions;
  const [form, setForm] = useState({
    name: "",
    wardNumber: "",
    email: "",
    password: "",
    photoURL: "",
    agreed: false,
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.agreed) {
      setError("Please accept the community guidelines.");
      return;
    }
    setStatus("loading");
    setError(null);
    try {
      await signup({
        email: form.email,
        password: form.password,
        name: form.name,
        wardNumber: form.wardNumber,
        photoURL: form.photoURL || null,
      });
      navigate("/feed", { replace: true });
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100">
      <SectionHeader
        eyebrow="Citizen onboarding"
        title="Create your HamroWard account"
        description="Connect with your ward, share updates, and access verified documents instantly."
      />

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Full name
            <input
              type="text"
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-400 focus:outline-none"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Ward number
            <select
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-400 focus:outline-none"
              name="wardNumber"
              value={form.wardNumber}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select ward
              </option>
              {wardOptions.map((ward) => (
                <option key={ward.id} value={ward.id}>
                  {ward.label ?? `Ward ${ward.id}`}
                </option>
              ))}
            </select>
          </label>
        </div>
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
        <label className="block text-sm font-medium text-slate-700">
          Profile photo URL (optional)
          <input
            type="url"
            name="photoURL"
            value={form.photoURL}
            onChange={handleChange}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-400 focus:outline-none"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            required
            name="agreed"
            checked={form.agreed}
            onChange={handleChange}
            className="rounded border-slate-300"
          />
          I agree to HamroWard community guidelines.
        </label>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {status === "loading" ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <NavLink to="/login" className="font-semibold text-blue-600 hover:text-blue-500">
          Login here
        </NavLink>
      </p>
    </div>
  );
}

