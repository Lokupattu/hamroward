import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { wardSelectOptions } from "../../data/wardNumbers";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "../../components/layout/AuthLayout";
import { 
  HiOutlineMail, 
  HiOutlineLockClosed, 
  HiOutlineUser, 
  HiOutlineIdentification, 
  HiOutlinePhotograph,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineCheckCircle,
  HiExclamationCircle
} from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth();
  const wardOptions = wardSelectOptions;

  const handleGoogleSignUp = async () => {
    setStatus("loading");
    setError(null);
    try {
      await loginWithGoogle();
      navigate("/feed", { replace: true });
    } catch (err) {
      setError(err.message || "Google sign up failed. Please try again.");
      setStatus("error");
    }
  };

  const [form, setForm] = useState({
    name: "",
    wardNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    photoURL: "",
    agreed: false,
  });

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user types
    if (error) setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!form.agreed) {
      setError("You must agree to the community guidelines.");
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
      setError(err.message || "Failed to create account. Please try again.");
      setStatus("error");
    }
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join your local ward community today"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 animate-slide-down">
            <HiExclamationCircle className="text-xl flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <HiOutlineUser className="text-lg" />
              </div>
              <input
                type="text"
                required
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
              />
            </div>
          </div>

          {/* Ward Number */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Ward Number</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <HiOutlineIdentification className="text-lg" />
              </div>
              <select
                name="wardNumber"
                value={form.wardNumber}
                onChange={handleChange}
                required
                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none appearance-none"
              >
                <option value="" disabled>Select Ward</option>
                {wardOptions.map((ward) => (
                  <option key={ward.id} value={ward.id}>
                    {ward.label ?? `Ward ${ward.id}`}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

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

        <div className="grid gap-5 md:grid-cols-2">
          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
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

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Confirm Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <HiOutlineLockClosed className="text-lg" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                name="confirmPassword"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                className="block w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-500 transition-colors"
                tabIndex="-1"
              >
                {showConfirmPassword ? <HiOutlineEyeOff className="text-lg" /> : <HiOutlineEye className="text-lg" />}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Photo */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 ml-1">Profile Photo URL (Optional)</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <HiOutlinePhotograph className="text-lg" />
            </div>
            <input
              type="url"
              name="photoURL"
              placeholder="https://..."
              value={form.photoURL}
              onChange={handleChange}
              className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
            />
          </div>
        </div>

        {/* Agreement Checkbox */}
        <div className="py-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center mt-0.5">
              <input
                type="checkbox"
                name="agreed"
                checked={form.agreed}
                onChange={handleChange}
                required
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-lg border-2 border-slate-300 bg-white checked:bg-blue-600 checked:border-blue-600 transition-all"
              />
              <HiOutlineCheckCircle className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <span className="text-sm text-slate-600 select-none">
              I agree to the <span className="text-blue-600 font-semibold hover:underline">Community Guidelines</span> and believe in making my ward better.
            </span>
          </label>
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
              <span>Creating Account...</span>
            </div>
          ) : (
            <>
              <span>Join HamroWard</span>
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
          onClick={handleGoogleSignUp}
          disabled={status === "loading"}
          className="w-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold py-4 px-6 rounded-2xl shadow-sm transition-all transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none flex items-center justify-center gap-3 cursor-pointer"
        >
          <FcGoogle className="text-xl" />
          <span>Sign Up with Google</span>
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-slate-100 text-center">
        <p className="text-slate-500">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="font-bold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1 group"
          >
            Login here
            <span className="block w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
          </NavLink>
        </p>
      </div>
    </AuthLayout>
  );
}
