import { useState } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);
    try {
      await resetPassword(email);
      setMessage({ type: "success", text: "Password reset link sent! Check your inbox." });
      setStatus("success");
    } catch (err) {
      console.error("Reset password failed", err);
      setMessage({ type: "error", text: err.message || "Failed to send reset link." });
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100">
      <SectionHeader
        eyebrow="Account Recovery"
        title="Reset Password"
        description="Enter your email address and we'll send you a link to reset your password."
      />

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-slate-700">
          Email Address
          <input
            type="email"
            required
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@citizen.com"
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-400 focus:outline-none"
          />
        </label>

        {message && (
          <p className={`text-sm ${message.type === "success" ? "text-green-600" : "text-rose-600"}`}>
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="w-full rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {status === "loading" ? "Sending link…" : status === "success" ? "Link Sent" : "Send Reset Link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Remembered your password?{" "}
        <NavLink to="/login" className="font-semibold text-blue-600 hover:text-blue-500">
          Return to login
        </NavLink>
      </p>
    </div>
  );
}
