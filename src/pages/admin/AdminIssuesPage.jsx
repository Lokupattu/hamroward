import { useMemo, useState } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import { sampleIssues } from "../../data/seedData";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { useAuth } from "../../context/AuthContext";
import { updateIssueStatus, toggleIssuePublicStatus, deleteIssue } from "../../services/issueService";
import { HiOutlineTrash } from "react-icons/hi";

const statusOptions = ["pending", "inprogress", "resolved"];

export default function AdminIssuesPage() {
  const { profile } = useAuth();
  const { data: issues } = useFirestoreCollection("issues", {
    fallbackData: sampleIssues,
    filters: profile?.wardNumber
      ? [
          {
            field: "ward",
            value: Number(profile.wardNumber),
          },
        ]
      : [],
  });
  const [optimisticStatuses, setOptimisticStatuses] = useState({});
  const [feedback, setFeedback] = useState(null);

  const sortedIssues = useMemo(
    () =>
      [...issues].sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA;
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

  const handleDelete = async (issue) => {
    if (!window.confirm(`Are you sure you want to delete "${issue.title}"?`)) return;
    try {
      await deleteIssue(issue.id);
      setFeedback("Issue deleted successfully");
    } catch (err) {
      setFeedback("Failed to delete issue");
    }
  };

  return (
    <div className="space-y-8 text-slate-50 pb-20">
      <SectionHeader
        eyebrow="Issues"
        title="Manage citizen reports"
        description="Update status, request more info, or escalate to metro departments."
        theme="dark"
      />
      {feedback ? (
        <div className="flex items-center justify-between rounded-2xl border border-blue-500/40 bg-blue-500/10 px-6 py-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">
            {feedback}
          </p>
          <button onClick={() => setFeedback(null)} className="text-blue-400 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[2.5rem] border border-slate-800 bg-slate-900/40 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-800 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 bg-slate-900/60">
              <tr>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Issue Details</th>
                <th className="px-6 py-5">Ward</th>
                <th className="px-6 py-5">Evidence</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {sortedIssues.map((issue) => (
                <tr key={issue.id} className="group hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-6 whitespace-nowrap">
                    <p className="text-xs font-bold text-slate-400">
                      {issue.createdAt 
                        ? (issue.createdAt.toDate ? issue.createdAt.toDate().toLocaleDateString() : new Date(issue.createdAt).toLocaleDateString())
                        : "No Date"}
                    </p>
                  </td>
                  <td className="px-6 py-6 max-w-md">
                    <p className="font-bold text-white mb-1">{issue.title}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {issue.description || "No description provided."}
                    </p>
                    <div className="mt-2 inline-block rounded-full bg-slate-800 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-slate-400">
                      {issue.category}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-xs font-black text-slate-400">WARD {issue.ward}</span>
                  </td>
                  <td className="px-6 py-6">
                    {issue.evidenceUrl ? (
                      <a 
                        href={issue.evidenceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-xl bg-blue-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:bg-blue-500 hover:text-white transition-all"
                      >
                        Evidence
                      </a>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 italic">No File</span>
                    )}
                  </td>
                  <td className="px-6 py-6">
                    <select
                      value={currentStatus(issue)}
                      className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-300 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                      onChange={(event) => handleStatusChange(issue, event.target.value)}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={async () => {
                          try {
                            const newStatus = !issue.isPublic;
                            await toggleIssuePublicStatus(issue.id, newStatus);
                            setFeedback(newStatus ? "Issue published to Today's Issues" : "Issue removed from public view");
                          } catch (err) {
                            setFeedback("Failed to update public status");
                          }
                        }}
                        className={`min-w-[120px] rounded-xl border px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                          issue.isPublic 
                            ? "bg-green-500/10 border-green-500/50 text-green-400 hover:bg-green-500 font-bold hover:text-white shadow-lg shadow-green-900/20" 
                            : "border-blue-500/50 text-blue-200 hover:bg-blue-600 hover:border-blue-500 hover:text-white"
                        }`}
                      >
                        {issue.isPublic ? "Published" : "Notify citizen"}
                      </button>
                      
                      <button 
                        onClick={() => handleDelete(issue)}
                        className="p-2.5 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white transition-all group"
                        title="Delete Issue"
                      >
                        <HiOutlineTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


