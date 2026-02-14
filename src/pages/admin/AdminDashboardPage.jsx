import { useMemo } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import { quickStats, sampleIssues, sampleVideos } from "../../data/seedData";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";

export default function AdminDashboardPage() {
  const { data: issues } = useFirestoreCollection("issues", { fallbackData: sampleIssues });
  const { data: videos } = useFirestoreCollection("videos", { fallbackData: sampleVideos });

  const stats = useMemo(() => {
    const base = {
      totalIssues: issues.length,
      pendingIssues: issues.filter((issue) => issue.status === "pending").length,
      inProgressIssues: issues.filter((issue) => issue.status === "inprogress").length,
      resolvedIssues: issues.filter((issue) => issue.status === "resolved").length,
    };
    return base.totalIssues ? base : quickStats;
  }, [issues]);

  return (
    <div className="space-y-8 text-slate-50">
      <SectionHeader
        eyebrow="Live metrics"
        title="Ward dashboard"
        description="Monitor issues, videos, and sponsor impact."
        theme="dark"
      />

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total issues", value: stats.totalIssues },
          { label: "Pending", value: stats.pendingIssues },
          { label: "In progress", value: stats.inProgressIssues },
          { label: "Resolved", value: stats.resolvedIssues },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Latest issues</p>
              <h2 className="mt-2 text-lg font-semibold">Needs attention</h2>
            </div>
            <span className="text-xs font-semibold text-blue-300">Auto notify</span>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {issues.map((issue) => (
              <li key={issue.id} className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-4">
                <p className="font-semibold text-white">{issue.title}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {issue.category} • Ward {issue.ward}
                </p>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Video queue</p>
              <h2 className="mt-2 text-lg font-semibold">Moderation</h2>
            </div>
            <span className="text-xs font-semibold text-blue-300">Avg. 4 hrs</span>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {videos.map((video) => (
              <li key={video.id} className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-4">
                <p className="font-semibold text-white">{video.title}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Ward {video.ward} • {video.status}
                </p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}

