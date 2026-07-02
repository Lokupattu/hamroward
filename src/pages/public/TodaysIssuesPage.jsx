import { useState } from "react";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import SectionHeader from "../../components/common/SectionHeader";
import IssueDetailsModal from "../../components/common/IssueDetailsModal";

export default function TodaysIssuesPage() {
  const [activeTab, setActiveTab] = useState("video"); // "video" | "other"
  const [selectedIssue, setSelectedIssue] = useState(null);

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

  // Client-side sort by date descending
  const sortedIssues = [...issues].sort((a, b) => {
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
    return dateB - dateA;
  });

  // Categorize
  const videoIssues = sortedIssues.filter(issue => {
    return issue.evidenceType === "video" || (issue.evidenceUrl && issue.evidenceUrl.includes("video"));
  });

  const otherIssues = sortedIssues.filter(issue => {
    return !(issue.evidenceType === "video" || (issue.evidenceUrl && issue.evidenceUrl.includes("video")));
  });

  return (
    <div className="space-y-8 pb-16">
      <SectionHeader
        eyebrow="Live Updates"
        title="Today's Issues"
        description="Real-time updates on critical issues affecting your ward."
      />

      {/* Tab Segment Selector */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("video")}
          className={`flex items-center gap-2.5 px-6 py-4 border-b-2 font-bold text-sm transition-all cursor-pointer ${
            activeTab === "video"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
          }`}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>Video Evidence</span>
          <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-black ${
            activeTab === "video" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
          }`}>
            {videoIssues.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("other")}
          className={`flex items-center gap-2.5 px-6 py-4 border-b-2 font-bold text-sm transition-all cursor-pointer ${
            activeTab === "other"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
          }`}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Other Updates</span>
          <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-black ${
            activeTab === "other" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
          }`}>
            {otherIssues.length}
          </span>
        </button>
      </div>

      {issues.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <p className="text-slate-500">No public issues reported at the moment.</p>
        </div>
      ) : (
        <div className="mt-6">
          {activeTab === "video" ? (
            videoIssues.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
                <p className="text-slate-400">No video reports filed today.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {videoIssues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} isVideo={true} onOpen={() => setSelectedIssue(issue)} />
                ))}
              </div>
            )
          ) : (
            otherIssues.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
                <p className="text-slate-400">No other public reports filed today.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {otherIssues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} isVideo={false} onOpen={() => setSelectedIssue(issue)} />
                ))}
              </div>
            )
          )}
        </div>
      )}

      {selectedIssue && (
        <IssueDetailsModal issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
      )}
    </div>
  );
}

function IssueCard({ issue, isVideo, onOpen }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col h-full">
      {issue.evidenceUrl ? (
        <div className="aspect-video w-full bg-slate-100 relative group overflow-hidden cursor-pointer" onClick={onOpen}>
          {isVideo ? (
            <video 
              src={issue.evidenceUrl} 
              className="h-full w-full object-cover" 
              preload="metadata"
            />
          ) : (
            <img 
              src={issue.evidenceUrl} 
              alt={issue.title} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
          )}
          {/* Video indicator badge overlay */}
          {isVideo && (
            <div className="absolute top-3 left-3 bg-red-600/90 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1.5 shadow-sm backdrop-blur-sm z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              Video Evidence
            </div>
          )}
          {/* Hover overlay play/zoom effect */}
          <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
            <span className="bg-white/90 text-slate-800 text-xs font-black uppercase tracking-wider px-3.5 py-2 rounded-xl shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              {isVideo ? "Play Video" : "View Photo"}
            </span>
          </div>
        </div>
      ) : (
        <div className="aspect-video w-full bg-gradient-to-br from-slate-50 to-slate-100/50 flex flex-col items-center justify-center text-slate-400 border-b border-slate-100 cursor-pointer" onClick={onOpen}>
          <svg className="w-8 h-8 opacity-40 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-xs font-medium">No visual evidence attached</p>
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
            Ward {issue.ward}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
            issue.status === 'resolved' ? 'bg-green-50 border border-green-100 text-green-700' :
            issue.status === 'inprogress' ? 'bg-amber-50 border border-amber-100 text-amber-700' :
            'bg-slate-50 border border-slate-100 text-slate-600'
          }`}>
            {issue.status}
          </span>
        </div>
        <h3 className="mb-2 text-lg font-bold text-slate-900 line-clamp-1 cursor-pointer" onClick={onOpen}>{issue.title}</h3>
        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed flex-grow">{issue.description}</p>
        
        {/* Comment trigger and details */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button 
            onClick={onOpen}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer group/btn"
          >
            <svg className="w-4 h-4 text-blue-600 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>View & Comment</span>
          </button>
          
          <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
            <span>{issue.category}</span>
            <span>
              {issue.createdAt 
                ? (issue.createdAt.toDate ? issue.createdAt.toDate().toLocaleDateString() : new Date(issue.createdAt).toLocaleDateString())
                : "No Date"}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}


