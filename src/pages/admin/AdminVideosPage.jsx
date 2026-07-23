import { useState, useEffect } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import { useAuth } from "../../context/AuthContext";
import {
  updateVideoStatus,
  fetchVideos,
  getVideoWithUrl,
} from "../../services/videoService";
import { FiAlertCircle, FiCheck, FiX } from "react-icons/fi";

export default function AdminVideosPage() {
  const { profile } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        const videosData = await fetchVideos();

        // Always replace blob URLs with real Storage URLs
        const videosWithUrls = await Promise.all(
          videosData.map(async (video) => {
            try {
              const refreshed = await getVideoWithUrl(video.id);
              return refreshed || video;
            } catch {
              return video;
            }
          })
        );

        // Filter by ward if admin has wardNumber
        const filtered = profile?.wardNumber
          ? videosWithUrls.filter((v) => v.ward === profile.wardNumber)
          : videosWithUrls;

        setVideos(filtered);
      } catch (err) {
        console.error("Error loading videos:", err);
        setFeedback(`Failed to load videos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [profile]);

  const handleModeration = async (video, status) => {
    setProcessing((prev) => ({ ...prev, [video.id]: true }));
    setFeedback(null);

    try {
      await updateVideoStatus(video.id, status);
      setFeedback(`Video marked ${status}`);

      // Update UI
      setVideos((prev) =>
        prev.map((v) => (v.id === video.id ? { ...v, status } : v))
      );
    } catch (error) {
      console.error("Video moderation failed", error);
      setFeedback("Failed to update video. Try again.");
    } finally {
      setProcessing((prev) => ({ ...prev, [video.id]: false }));
    }
  };

  return (
    <div className="space-y-8 text-slate-50">
      <SectionHeader
        eyebrow="Video moderation"
        title="Review uploads"
        description="Approve, reject, or feature 15-second ward stories."
        theme="dark"
      />

      {feedback && (
        <p className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
          {feedback}
        </p>
      )}

      {loading ? (
        <p className="text-slate-400">Loading videos…</p>
      ) : videos.length === 0 ? (
        <p className="text-slate-400">No videos found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {videos.map((video) => (
            <article
              key={video.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6"
            >
              {/* HEADER */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-[0.3em] text-blue-300">
                  Ward {video.ward}
                </span>
                <span
                  className={`capitalize px-2 py-1 rounded-full text-xs font-medium ${
                    video.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : video.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {video.status || "pending"}
                </span>
              </div>

              {/* TITLE */}
              <h2 className="mt-4 text-lg font-semibold text-white">
                {video.title || "Untitled Video"}
              </h2>
              <p className="text-sm text-slate-400">
                By {video.userId || "Unknown"}
              </p>

              {/* VIDEO PLAYER */}
              <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg bg-black">
                {video.videoUrl ? (
                  <video
                    src={`${video.videoUrl}#t=0.1`}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                    onError={async () => {
                      console.warn("Video failed, fetching fresh URL…");
                      const refreshed = await getVideoWithUrl(video.id);
                      if (refreshed?.videoUrl) {
                        setVideos((prev) =>
                          prev.map((v) =>
                            v.id === video.id
                              ? { ...v, videoUrl: refreshed.videoUrl }
                              : v
                          )
                        );
                      }
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500">
                    <FiAlertCircle className="mr-2" />
                    Video unavailable
                  </div>
                )}
              </div>

              {/* ACTIONS */}
              <div className="mt-6 flex gap-3 text-sm">
                <button
                  disabled={processing[video.id] || video.status === "approved"}
                  onClick={() => handleModeration(video, "approved")}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-2xl border px-4 py-2 font-semibold ${
                    video.status === "approved"
                      ? "border-emerald-500 bg-emerald-500/20 text-white"
                      : "border-emerald-500/40 text-emerald-200 hover:bg-emerald-500/10"
                  }`}
                >
                  {video.status === "approved" ? (
                    <>
                      <FiCheck />
                      Approved
                    </>
                  ) : (
                    "Approve"
                  )}
                </button>

                <button
                  disabled={processing[video.id] || video.status === "rejected"}
                  onClick={() => handleModeration(video, "rejected")}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-2xl border px-4 py-2 font-semibold ${
                    video.status === "rejected"
                      ? "border-rose-500 bg-rose-500/20 text-white"
                      : "border-rose-500/40 text-rose-200 hover:bg-rose-500/10"
                  }`}
                >
                  {video.status === "rejected" ? (
                    <>
                      <FiX />
                      Rejected
                    </>
                  ) : (
                    "Reject"
                  )}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
