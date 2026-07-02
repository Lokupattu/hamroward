import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * AuthLayout provides a premium, visually stunning background and structure
 * for authentication-related pages like Login and Signup.
 */
export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-[90vh] flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-100 rounded-full blur-[100px] opacity-60 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[120px] opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-[1100px] grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Branding / Content */}
        <div className="hidden lg:flex flex-col gap-8">
          <div>
            <NavLink to="/" className="inline-flex items-center gap-2 group transition-all">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                <span className="font-bold text-xl">H</span>
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">HamroWard</span>
            </NavLink>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl font-extrabold text-slate-900 leading-tight">
              Empowering communities, <br />
              <span className="text-blue-600">digitally.</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-md leading-relaxed">
              Join thousands of citizens making their wards better through transparency, 
              communication, and shared resources.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-2xl bg-white/50 border border-white shadow-sm backdrop-blur-sm">
              <div className="text-blue-600 font-bold text-2xl mb-1">50+</div>
              <div className="text-sm text-slate-500 font-medium">Verified Wards</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/50 border border-white shadow-sm backdrop-blur-sm">
              <div className="text-blue-600 font-bold text-2xl mb-1">10k+</div>
              <div className="text-sm text-slate-500 font-medium">Active Citizens</div>
            </div>
          </div>
        </div>

        {/* Right Side: The Form Card */}
        <div className="w-full">
          <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-8 md:p-10 relative overflow-hidden">
            {/* Header for Mobile only */}
            <div className="lg:hidden mb-8 flex justify-between items-center">
              <NavLink to="/" className="text-xl font-bold text-slate-900">HamroWard</NavLink>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">{title}</h2>
              <p className="text-slate-500">{subtitle}</p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
