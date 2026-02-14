import { useMemo, useState } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import { sampleIssues } from "../../data/seedData";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { useAuth } from "../../context/AuthContext";
import { updateIssueStatus, toggleIssuePublicStatus } from "../../services/issueService";

const statusOptions = ["pending", "inprogress", "resolved"];

export default function AdminIssuesPage() {
  const { profile } = useAuth();
  const { data: issues } = useFirestoreCollection("issues", {
    fallbackData: sampleIssues,
    filters: profile?.wardNumber
      ? [
          {
            field: "ward",
            value: profile.wardNumber,
          },
        ]
      : [],
  });
  const [optimisticStatuses, setOptimisticStatuses] = useState({});
  const [feedback, setFeedback] = useState(null);

  const sortedIssues = useMemo(
    () =>
      [...issues].sort((a, b) => {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (b.status === "pending" && a.status !== "pending") return 1;
        return 0;
      }),
    [issues]
  );

  const currentStatus = (issue) => optimisticStatuses[issue.id] ?? issue.status;

  const handleStatusChange = async (issue, nextStatus) => {
    setOptimisticStatuses((prev) => ({ ...prev, [issue.id]: nextStatus }));
    setFeedback(null);
    try {
      await updateIssueStatus(issue.id, nextStatus);
      setFeedback(`Status updated to ${nextStatus}`);
    } catch (error) {
      console.error("Issue status update failed", error);
      setOptimisticStatuses((prev) => ({ ...prev, [issue.id]: issue.status }));
      setFeedback("Failed to update status. Try again.");
    }
  };
  return (
    <div className="space-y-8 text-slate-50">
      <SectionHeader
        eyebrow="Issues"
        title="Manage citizen reports"
        description="Update status, request more info, or escalate to metro departments."
        theme="dark"
      />
      {feedback ? (
        <p className="rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
          {feedback}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-800 text-xs uppercase tracking-[0.3em] text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Ward</th>
              <th className="px-4 py-3 font-semibold">Evidence</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedIssues.map((issue) => (
              <tr key={issue.id} className="border-b border-slate-800 last:border-none">
                <td className="px-4 py-4 text-white">{issue.title}</td>
                <td className="px-4 py-4 text-slate-300">{issue.category}</td>
                <td className="px-4 py-4 text-slate-300">Ward {issue.ward}</td>
                <td className="px-4 py-4 text-slate-300">
                  {issue.evidenceUrl ? (
                    <a 
                      href={issue.evidenceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline text-xs"
                    >
                      View File
                    </a>
                  ) : (
                    <span className="text-slate-600 text-xs">None</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <select
                    value={currentStatus(issue)}
                    className="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs uppercase tracking-wide"
                    onChange={(event) => handleStatusChange(issue, event.target.value)}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-4">
                  <button 
                    onClick={async () => {
                      try {
                        const newStatus = !issue.isPublic;
                        await toggleIssuePublicStatus(issue.id, newStatus);
                        // Optimistic update or refetch would be ideal, but for now we rely on real-time listener if active or just local state update if we had one.
                        // Since useFirestoreCollection is real-time, it should update automatically.
                        setFeedback(newStatus ? "Issue published to Today's Issues" : "Issue removed from public view");
                      } catch (err) {
                        setFeedback("Failed to update public status");
                      }
                    }}
                    className={`rounded-full border px-4 py-1 text-xs font-semibold transition ${
                      issue.isPublic 
                        ? "bg-green-500/10 border-green-500/50 text-green-400 hover:bg-green-500/20" 
                        : "border-blue-500/50 text-blue-200 hover:bg-blue-500/10"
                    }`}
                  >
                    {issue.isPublic ? "Published" : "Notify citizen"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

