import SectionHeader from "../../components/common/SectionHeader";
import { sampleIssues } from "../../data/seedData";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { useAuth } from "../../context/AuthContext";

const statusColors = {
  pending: "text-amber-600 bg-amber-50",
  inprogress: "text-blue-600 bg-blue-50",
  resolved: "text-emerald-600 bg-emerald-50",
};

export default function MyIssuesPage() {
  const { user } = useAuth();
  const { data: issues } = useFirestoreCollection("issues", {
    fallbackData: sampleIssues,
    filters: user?.uid
      ? [
          {
            field: "userId",
            value: user.uid,
          },
        ]
      : [],
  });
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="My submissions"
        title="Issues I reported"
        description="Track progress, officer responses, and escalation history."
      />

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Ward</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Reported</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id} className="border-b border-slate-100 last:border-none">
                <td className="px-4 py-4 text-slate-900">{issue.title}</td>
                <td className="px-4 py-4 text-slate-600">{issue.category}</td>
                <td className="px-4 py-4 text-slate-600">Ward {issue.ward}</td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[issue.status]}`}
                  >
                    {issue.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-500">{issue.reportedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

