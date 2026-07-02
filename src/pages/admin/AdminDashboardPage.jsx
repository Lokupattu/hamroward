import { useMemo } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import { quickStats, sampleIssues, sampleVideos } from "../../data/seedData";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { useAuth } from "../../context/AuthContext";
import { HiOutlineLightBulb, HiOutlineVideoCamera, HiOutlineUserGroup, HiOutlineCheckCircle } from "react-icons/hi";

export default function AdminDashboardPage() {
  const { profile } = useAuth();
  const wardFilter = profile?.wardNumber ? [
    {
      field: "ward",
      value: Number(profile.wardNumber),
    }
  ] : [];

  const { data: issues } = useFirestoreCollection("issues", { 
    fallbackData: sampleIssues,
    filters: wardFilter
  });

  const { data: videos } = useFirestoreCollection("videos", { 
    fallbackData: sampleVideos,
    filters: wardFilter
  });

  const stats = useMemo(() => {
    const base = {
      totalIssues: issues.length,
      pendingIssues: issues.filter((issue) => issue.status === "pending").length,
      inProgressIssues: issues.filter((issue) => issue.status === "inprogress").length,
      resolvedIssues: issues.filter((issue) => issue.status === "resolved").length,
    };
    return base.totalIssues > 0 ? base : quickStats;
  }, [issues]);

  const sortedIssues = useMemo(() => {
    return [...issues].sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
      return dateB - dateA;
    });
  }, [issues]);

  return (
    <div className="space-y-12 text-slate-50 pb-20 animate-in fade-in duration-700">
      <SectionHeader
        eyebrow={profile?.wardNumber ? `Ward ${profile.wardNumber} Control` : "Live metrics"}
        title="Admin Overview"
        description="Consolidated monitoring of citizen reports, media queue, and infrastructure status."
        theme="dark"
      />

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total issues", value: stats.totalIssues, icon: HiOutlineLightBulb, color: "blue" },
          { label: "Pending", value: stats.pendingIssues, icon: HiOutlineCheckCircle, color: "amber" },
          { label: "In progress", value: stats.inProgressIssues, icon: HiOutlineUserGroup, color: "emerald" },
          { label: "Resolved", value: stats.resolvedIssues, icon: HiOutlineCheckCircle, color: "indigo" },
        ].map((stat) => (
          <div key={stat.label} className="group relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/40 p-8 shadow-2xl transition-all hover:-translate-y-1">
            <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-${stat.color}-500/10 blur-2xl group-hover:scale-150 transition-transform`}></div>
            <div className="relative z-10">
              <div className={`mb-4 inline-flex rounded-xl bg-${stat.color}-500/10 p-3 text-${stat.color}-400`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{stat.label}</p>
              <p className="mt-2 text-4xl font-black font-serif tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <article className="rounded-[2.5rem] border border-slate-800 bg-slate-900/40 p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Latest issues</p>
                <h2 className="mt-1 text-2xl font-black font-serif text-white">Needs Immediate Attention</h2>
              </div>
              <span className="rounded-full bg-blue-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-400 border border-blue-500/20">
                Live Feed
              </span>
            </div>
            
            <div className="space-y-4 flex-grow">
              {sortedIssues.slice(0, 5).map((issue) => (
                <div key={issue.id} className="group flex items-center gap-5 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5 hover:bg-slate-800/60 transition-all cursor-default">
                   <div className="h-2 w-2 rounded-full bg-blue-500 shadow-lg shadow-blue-900/50" />
                   <div className="flex-grow">
                      <p className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{issue.title}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">
                        {issue.category} • {issue.createdAt?.toDate ? issue.createdAt.toDate().toLocaleDateString() : new Date(issue.createdAt || 0).toLocaleDateString()}
                      </p>
                   </div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                      W{issue.ward}
                   </div>
                </div>
              ))}
              {issues.length === 0 && (
                <div className="py-20 text-center italic text-slate-600 font-medium">No active reports in this ward.</div>
              )}
            </div>
          </div>
        </article>

        <article className="rounded-[2.5rem] border border-slate-800 bg-slate-900/40 p-10 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 bg-emerald-500/5 rounded-full blur-3xl"></div>
           <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Video queue</p>
                <h2 className="mt-1 text-2xl font-black font-serif text-white">Media Moderation</h2>
              </div>
              <div className="flex items-center gap-2">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Moderating</span>
              </div>
            </div>

            <div className="space-y-4 flex-grow">
              {videos.slice(0, 5).map((video) => (
                <div key={video.id} className="group flex items-center gap-5 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5 hover:bg-slate-800/60 transition-all">
                   <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400">
                      <HiOutlineVideoCamera className="h-4 w-4" />
                   </div>
                   <div className="flex-grow">
                      <p className="font-bold text-slate-100">{video.title}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">
                        Status: <span className="text-white italic">{video.status}</span>
                      </p>
                   </div>
                </div>
              ))}
              {videos.length === 0 && (
                <div className="py-20 text-center italic text-slate-600 font-medium">Clear queue. Good job.</div>
              )}
            </div>
           </div>
        </article>
      </section>
    </div>
  );
}


