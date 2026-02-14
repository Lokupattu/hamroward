import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import SectionHeader from "../../components/common/SectionHeader";

export default function TodaysIssuesPage() {
  const { data: issues, loading } = useFirestoreCollection("issues", {
    filters: [{ field: "isPublic", value: true }],
  });

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Live Updates"
        title="Today's Issues"
        description="Real-time updates on critical issues affecting your ward."
      />

      {issues.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <p className="text-slate-500">No public issues reported at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {issues.map((issue) => (
            <article key={issue.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
              {issue.evidenceUrl && (
                <div className="aspect-video w-full bg-slate-100">
                  {issue.evidenceUrl.includes("video") ? (
                    <video src={issue.evidenceUrl} controls className="h-full w-full object-cover" />
                  ) : (
                    <img src={issue.evidenceUrl} alt="Evidence" className="h-full w-full object-cover" />
                  )}
                </div>
              )}
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                    Ward {issue.ward}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                    issue.status === 'resolved' ? 'bg-green-100 text-green-700' :
                    issue.status === 'inprogress' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {issue.status}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{issue.title}</h3>
                <p className="text-sm text-slate-600 line-clamp-3">{issue.description}</p>
                <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                  Reported: {new Date(issue.createdAt?.seconds * 1000).toLocaleDateString()}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
