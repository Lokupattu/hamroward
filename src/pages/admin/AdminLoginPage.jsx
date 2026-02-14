import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, isFirebaseEnabled, auth } from "../../lib/firebase";
import SectionHeader from "../../components/common/SectionHeader";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(form.email, form.password);
      // Check if email contains "admin" - if not, show error
      if (!form.email.toLowerCase().includes("admin")) {
        setError("Admin access requires an email with 'admin' in the address.");
        setLoading(false);
        return;
      }
      // Update user role in Firestore if needed
      if (db && isFirebaseEnabled && auth?.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid);
        const snapshot = await getDoc(userDoc);
        if (snapshot.exists()) {
          const currentRole = snapshot.data().role;
          if (currentRole !== "admin") {
            await setDoc(
              userDoc,
              {
                ...snapshot.data(),
                role: "admin",
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            );
          }
        } else {
          // Create admin profile if it doesn't exist
          await setDoc(userDoc, {
            uid: auth.currentUser.uid,
            email: auth.currentUser.email,
            name:
              auth.currentUser.displayName ||
              auth.currentUser.email?.split("@")[0],
            role: "admin",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      }
      // Wait a moment for profile to update, then navigate
      setTimeout(() => {
        navigate("/admin", { replace: true });
      }, 500);
    } catch (err) {
      setError(err.message || "Login failed. Check your email and password.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100">
      <SectionHeader
        eyebrow="Ward officer"
        title="Admin login"
        description="Use your ward-issued admin email. For testing, use any email containing 'admin' (e.g., admin@ward.test)."
      />

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-slate-700">
          Official email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="admin@ward.test"
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-400 focus:outline-none"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-400 focus:outline-none"
          />
        </label>
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? "Logging in…" : "Access admin panel"}
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-xs text-blue-700">
        <p className="font-semibold">💡 Testing Admin Access:</p>
        <p className="mt-1">
          1. First, create an account at{" "}
          <code className="rounded bg-blue-100 px-1">/signup</code> with an
          email containing "admin" (e.g.,{" "}
          <code className="rounded bg-blue-100 px-1">admin@ward.test</code>)
        </p>
        <p className="mt-1">
          2. Then log in here with the same credentials. The system will grant
          admin role automatically.
        </p>
      </div>
    </div>
  );
}
