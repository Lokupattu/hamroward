import { NavLink } from "react-router-dom";
import { quickStats } from "../../data/seedData";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { sponsorSpots } from "../../data/seedData";
import { 
  HiOutlineShieldCheck, 
  HiOutlineDocumentText, 
  HiOutlineVideoCamera, 
  HiOutlineArrowRight 
} from "react-icons/hi";

const featureTiles = [
  {
    title: "15-sec Ward Stories",
    detail: "Short form updates and celebrations straight from your neighbors.",
    icon: <HiOutlineVideoCamera className="w-8 h-8" />,
    color: "blue"
  },
  {
    title: "Guided Documents",
    detail: "Step-by-step requirements for every ward service in one central hub.",
    icon: <HiOutlineDocumentText className="w-8 h-8" />,
    color: "emerald"
  },
  {
    title: "Issue Tracker",
    detail: "Report and follow-up on road, water, waste, and safety cases in real-time.",
    icon: <HiOutlineShieldCheck className="w-8 h-8" />,
    color: "amber"
  },
];

export default function LandingPage() {
  const { data: sponsors } = useFirestoreCollection("sponsors", {
    fallbackData: sponsorSpots,
  });

  const topSponsor = sponsors.find(s => s.priority === "top");

  return (
    <div className="space-y-24 pb-20 animate-in fade-in duration-1000">
      {/* Top Sponsor Banner */}
      {topSponsor && (
        <div className="flex justify-center -mb-8">
           <div className="group flex items-center gap-4 rounded-full border border-blue-100 bg-white/50 px-8 py-3 backdrop-blur-md shadow-sm transition-all hover:shadow-md hover:scale-105">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Official Partner</span>
             <div className="h-4 w-px bg-slate-200"></div>
             {topSponsor.imageURL ? (
               <img src={topSponsor.imageURL} alt={topSponsor.name} className="h-6 object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
             ) : (
               <span className="font-bold text-slate-600 tracking-tight">{topSponsor.name}</span>
             )}
           </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden rounded-[3rem] bg-slate-950 text-white shadow-2xl">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2071&auto=format&fit=crop" 
            alt="Nepal Landscapes" 
            className="h-full w-full object-cover opacity-40 scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_rgba(59,130,246,0.15),_transparent_50%)]" />
        </div>

        <div className="relative z-10 grid gap-16 px-8 py-20 md:grid-cols-2 md:px-16 lg:py-32 w-full max-w-7xl mx-auto">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-300 backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
              </span>
              Digital Nepal Hub
            </div>
            
            <h1 className="text-5xl font-black leading-[1.1] tracking-tight md:text-7xl font-serif">
              Connecting <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 hero-text-glow">Citizens</span> <br />
              & Local Wards
            </h1>
            
            <p className="max-w-xl text-lg text-slate-300/90 leading-relaxed font-medium">
              A premium digital gateway for shared accountability. Access verified documents, real-time ward stories, and transparent governance at your fingertips.
            </p>
            
            <div className="flex flex-col gap-6 sm:flex-row">
              <NavLink
                to="/signup"
                className="group relative flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-10 py-5 text-center font-bold text-white shadow-xl shadow-blue-900/40 transition-all hover:-translate-y-1 hover:bg-blue-500 hover:shadow-blue-600/50 active:scale-95"
              >
                Start Journey
                <HiOutlineArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
              </NavLink>
              <NavLink
                to="/admin/login"
                className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-10 py-5 text-center font-bold text-white backdrop-blur-xl transition-all hover:bg-white/10 hover:-translate-y-1 active:scale-95 border-b-4 border-b-white/5"
              >
                Ward Admin Portal
              </NavLink>
            </div>
          </div>

          {/* Stats Visual */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="w-full max-w-md space-y-4 animate-in slide-in-from-right-12 duration-1000">
              <div className="rounded-[2.5rem] border border-white/10 bg-slate-900/40 p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                 
                 <div className="flex items-center justify-between border-b border-white/10 pb-8 mb-8">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Community Metrics</p>
                      <p className="mt-1 text-2xl font-black text-white font-serif">Live Accountability</p>
                    </div>
                    <div className="rounded-2xl bg-emerald-500/20 p-3 ring-1 ring-emerald-500/50">
                      <div className="h-3 w-3 bg-emerald-400 rounded-full animate-pulse transition-all"></div>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-x-12 gap-y-10 relative z-10">
                    <div className="space-y-1">
                       <p className="text-4xl font-black text-white">{quickStats.totalIssues}</p>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Cases</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-4xl font-black text-emerald-400">{quickStats.resolvedIssues}</p>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Resolved</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-4xl font-black text-amber-400">{quickStats.inProgressIssues}</p>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Ongoing</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-4xl font-black text-blue-400">{quickStats.pendingIssues}</p>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Discovery</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16 space-y-4">
           <h2 className="text-sm font-black uppercase tracking-[0.4em] text-blue-600">Core Features</h2>
           <p className="text-3xl md:text-4xl font-black text-slate-900 font-serif">Everything your ward needs.</p>
        </div>
        <div className="grid gap-10 md:grid-cols-3">
          {featureTiles.map((feature) => (
            <article 
              key={feature.title} 
              className="group relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/5 hover:border-blue-100"
            >
              <div className={`mb-8 inline-flex rounded-[1.5rem] bg-${feature.color}-50 p-5 text-${feature.color}-600 transition-all duration-500 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white shadow-sm ring-1 ring-${feature.color}-100/50`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-900 font-serif">{feature.title}</h3>
              <p className="mt-4 text-slate-500 leading-relaxed font-medium">{feature.detail}</p>
              
              <div className="mt-8 flex items-center text-sm font-bold text-blue-600 opacity-0 -translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
                 Explore More <HiOutlineArrowRight className="ml-2" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-700 px-8 py-20 text-center text-white md:px-16 shadow-2xl shadow-blue-200 group">
        <div className="absolute -left-20 -top-20 h-64 w-64 bg-white/10 rounded-full blur-3xl transition-all duration-1000 group-hover:scale-150 group-hover:-translate-x-10"></div>
        <div className="absolute -right-20 -bottom-20 h-64 w-64 bg-indigo-500/20 rounded-full blur-3xl transition-all duration-1000 group-hover:scale-150 group-hover:translate-x-10"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-10">
          <h2 className="text-4xl font-black md:text-5xl font-serif leading-tight">
            Ready to empower your <br /> local community?
          </h2>
          <p className="text-blue-100 text-lg font-medium max-w-2xl mx-auto opacity-90">
            Join the digital revolution in local governance. HamroWard brings transparency and efficiency to every ward in Nepal.
          </p>
          <div className="flex flex-col justify-center gap-6 sm:flex-row pt-4">
            <NavLink
              to="/wards"
              className="rounded-2xl bg-white px-10 py-5 font-black text-blue-600 shadow-xl shadow-blue-900/20 transition-all hover:shadow-2xl hover:scale-105 active:scale-95"
            >
              Explore Ward Directory
            </NavLink>
            <NavLink
              to="/signup"
              className="rounded-2xl border-2 border-white/20 bg-white/10 px-10 py-5 font-black text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
            >
              Join the Network
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  );
}


