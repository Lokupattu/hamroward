export default function Logo({ className = "h-8 w-auto" }) {
  return (
    <div className="flex items-center gap-2">
      <svg
        className={className}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sun */}
        <circle cx="80" cy="25" r="12" className="fill-amber-400" />
        
        {/* Mountains */}
        <path
          d="M10 80 L40 30 L60 60 L80 20 L110 80 Z"
          className="fill-slate-800"
          stroke="none"
        />
        <path
          d="M40 30 L52 50 L28 50 Z"
          className="fill-white/90"
        />
        <path
          d="M80 20 L92 45 L68 45 Z"
          className="fill-white/90"
        />
        
        {/* Base line */}
        <rect x="0" y="80" width="100" height="5" className="fill-blue-600" />
      </svg>
      <div className="flex flex-col">
        <span className="text-lg font-bold leading-none tracking-tight text-slate-900">
          Hamro<span className="text-blue-600">Ward</span>
        </span>
        <span className="text-[0.6rem] font-medium uppercase tracking-widest text-slate-500">
          Digital Nepal
        </span>
      </div>
    </div>
  );
}
