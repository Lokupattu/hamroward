import SectionHeader from "../../components/common/SectionHeader";
import { NavLink } from "react-router-dom";
import { sampleVideos } from "../../data/seedData";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { useAuth } from "../../context/AuthContext";

export default function FeedPage() {
  const { profile } = useAuth();
  const { data: videos, status } = useFirestoreCollection("videos", {
    fallbackData: sampleVideos,
    filters: profile?.wardNumber
      ? [
          {
            field: "ward",
            value: profile.wardNumber,
          },
        ]
      : [],
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SectionHeader
          eyebrow="Ward feed"
          title="Short stories near you"
          description="15-second videos from residents and verified field officers."
        />
        <NavLink
          to="/upload"
          className="rounded-2xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5"
        >
          Upload video
        </NavLink>
      </div>

      {status === "loading" ? (
        <p className="text-sm text-slate-500">Loading ward videos…</p>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <article
            key={video.id}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-[0.3em] text-blue-600">
                Ward {video.ward}
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5">
                {video.status}
              </span>
            </div>
            {video.videoURL && video.videoURL.startsWith("http") ? (
              <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
                <video
                  src={video.videoURL}
                  controls
                  className="h-full w-full object-cover"
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : video.videoURL && video.videoURL.startsWith("blob:") ? (
              <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
                <video
                  src={video.videoURL}
                  controls
                  className="h-full w-full object-cover"
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="mt-4 aspect-video w-full rounded-xl bg-gradient-to-br from-blue-100 to-slate-100 flex items-center justify-center">
                <p className="text-xs text-slate-500">
                  Video preview unavailable
                </p>
              </div>
            )}
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              {video.title}
            </h2>
            <p className="text-sm text-slate-500">
              By {video.userId || "Anonymous"}
            </p>
            {video.caption ? (
              <p className="mt-2 text-sm text-slate-600">{video.caption}</p>
            ) : null}
            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs font-semibold">
              <button className="rounded-xl bg-slate-100 px-3 py-2 text-slate-600 hover:bg-slate-200">
                Like {video.likes || 0}
              </button>
              <button className="rounded-xl bg-slate-100 px-3 py-2 text-slate-600 hover:bg-slate-200">
                Comment
              </button>
              <button className="rounded-xl bg-slate-100 px-3 py-2 text-slate-600 hover:bg-slate-200">
                Share
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
