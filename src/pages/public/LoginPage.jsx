import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "../../components/layout/AuthLayout";
import { 
  HiOutlineMail, 
  HiOutlineLockClosed, 
  HiOutlineEye, 
  HiOutlineEyeOff,
  HiExclamationCircle 
} from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignIn = async () => {
    setStatus("loading");
    setError(null);
    try {
      await loginWithGoogle();
      const redirectTo = location.state?.from?.pathname ?? "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Google sign in failed.");
      setStatus("error");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
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
      setError(err.message || "Login failed. Please check your credentials.");
      setStatus("error");
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to your citizen account"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 animate-slide-down">
            <HiExclamationCircle className="text-xl flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <HiOutlineMail className="text-lg" />
            </div>
            <input
              type="email"
              required
              name="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange}
              className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center px-1">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <NavLink to="/reset-password" name="reset-password-link" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              Forgot?
            </NavLink>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <HiOutlineLockClosed className="text-lg" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="block w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-500 transition-colors"
              tabIndex="-1"
            >
              {showPassword ? <HiOutlineEyeOff className="text-lg" /> : <HiOutlineEye className="text-lg" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 px-1">
          <input 
            type="checkbox" 
            id="remember" 
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shadow-sm" 
          />
          <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">Stay signed in</label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none flex items-center justify-center gap-2 group"
        >
          {status === "loading" ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Signing In...</span>
            </div>
          ) : (
            <>
              <span>Sign In</span>
              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg className="w-3 h-3 fill-white" viewBox="0 0 20 20">
                  <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
                </svg>
              </div>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-xs font-semibold uppercase tracking-wider">or continue with</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={status === "loading"}
          className="w-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold py-4 px-6 rounded-2xl shadow-sm transition-all transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none flex items-center justify-center gap-3 cursor-pointer"
        >
          <FcGoogle className="text-xl" />
          <span>Sign In with Google</span>
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-slate-100">
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 mb-6">
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Ward Authority?</p>
          <p className="text-sm text-blue-800">
            Access the{" "}
            <NavLink to="/admin/login" className="font-bold underline hover:text-blue-900">
              Admin Portal
            </NavLink>
            {" "}for ward management tools.
          </p>
        </div>

        <p className="text-center text-slate-500">
          New to HamroWard?{" "}
          <NavLink
            to="/signup"
            className="font-bold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1 group"
          >
            Create account
            <span className="block w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
          </NavLink>
        </p>
      </div>
    </AuthLayout>
  );
}

