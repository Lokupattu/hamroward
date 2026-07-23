import { useState } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import { sampleVideos } from "../../data/seedData";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { useAuth } from "../../context/AuthContext";
import { deleteVideo } from "../../services/videoService";
import { FiTrash2, FiEye, FiClock } from "react-icons/fi";

const statusStyles = {
  approved: "text-emerald-600 bg-emerald-50",
  pending: "text-amber-600 bg-amber-50",
  rejected: "text-rose-600 bg-rose-50",
};

export default function MyVideosPage() {
  const { user } = useAuth();
  const [deleting, setDeleting] = useState(null);
  const { data: videos, refresh } = useFirestoreCollection("videos", {
    fallbackData: sampleVideos,
    filters: user?.uid
      ? [
          {
            field: "userId",
            value: user.uid,
          },
        ]
      : [],
  });

  const handleDelete = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video? This action cannot be undone.")) return;
    
    setDeleting(videoId);
    try {
      await deleteVideo(videoId);
      // The useFirestoreCollection hook should auto-update if it's listening to live data
      // If not, we might need to manually trigger a refresh or update local state
      // For now, let's assume live listener or manual reload
      window.location.reload(); // Simple reload to reflect changes if live listener isn't perfect
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Failed to delete video. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="My stories"
        title="Videos I uploaded"
        description="Track the status of your uploaded videos."
      />

      {videos.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-slate-500">You haven't uploaded any videos yet.</p>
          <a href="/upload" className="mt-4 inline-block text-blue-600 font-semibold hover:underline">
            Upload your first video
          </a>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <article key={video.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col">
              <div className="relative aspect-video bg-black">
                {video.videoUrl ? (
                  <video 
                    src={`${video.videoUrl}#t=0.1`} 
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <FiClock className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${statusStyles[video.status] || statusStyles.pending}`}>
                    {video.status || 'pending'}
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                      Ward {video.ward}
                    </span>
                    <h2 className="mt-1 text-lg font-semibold text-slate-900 line-clamp-1">{video.title}</h2>
                  </div>
                </div>
                
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                  {video.caption || "No caption provided."}
                </p>
                
                <div className="pt-4 border-t border-slate-100 flex gap-3">
                  <button 
                    onClick={() => handleDelete(video.id)}
                    disabled={deleting === video.id}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50 transition"
                  >
                    <FiTrash2 /> {deleting === video.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

