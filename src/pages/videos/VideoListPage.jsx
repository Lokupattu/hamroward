import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { isUserAdmin } from "../../services/adminService";
import { FiTrash2, FiPlay, FiClock, FiAlertCircle } from "react-icons/fi";
import {
  fetchVideos,
  deleteVideo,
} from "../../services/videoService";

const VideoListPage = () => {
  const { user, profile } = useAuth();
  const [videos, setVideos] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const filters = {};
      
      // If not admin, filter by approved status
      if (!isAdmin) {
        filters.status = "approved";
        // Filter by user's ward if available
        if (profile?.wardNumber) {
          filters.ward = profile.wardNumber.toString();
        }
      }

      const videosData = await fetchVideos(filters);
      setVideos(videosData);
    } catch (err) {
      console.error("Error loading videos:", err);
      setError("Failed to load videos. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [isAdmin, profile]);

  useEffect(() => {
    const init = async () => {
      if (user) {
        const adminStatus = await isUserAdmin(user.uid);
        setIsAdmin(adminStatus);
      }
      // Load videos after checking admin status
    };
    init();
  }, [user]);

  // Trigger loadVideos when isAdmin or profile changes
  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const handleDelete = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      setLoading(true);
      await deleteVideo(videoId);
      setVideos((prev) => prev.filter((v) => v.id !== videoId));
    } catch (err) {
      console.error("Error deleting video:", err);
      setError("Failed to delete video.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && videos.length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            {profile?.wardNumber ? `Ward ${profile.wardNumber} Videos` : "Community Videos"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {profile?.wardNumber 
              ? `Showing videos from Ward ${profile.wardNumber}` 
              : "Share and watch videos"}
          </p>
        </div>

        {isAdmin && (
          <div className="text-sm bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full">
            <FiAlertCircle className="inline mr-1" /> Admin Mode
          </div>
        )}
        
        {!isAdmin && (
           <a href="/upload" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition flex items-center gap-2">
             <FiPlay className="w-4 h-4" /> Upload Video
           </a>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button 
            onClick={loadVideos}
            className="text-sm font-semibold underline hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}

      {videos.length === 0 && !loading ? (
        <div className="text-center py-12 text-slate-500">
          No videos found for this ward. Be the first to upload!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative pt-[56.25%] bg-black">
                {video.videoUrl ? (
                  <>
                    <video
                      src={`${video.videoUrl}#t=0.1`}
                      className="absolute inset-0 w-full h-full object-cover"
                      controls
                      playsInline
                      preload="metadata"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                      <FiClock className="mr-1" />
                      {Math.ceil(video.duration || 15)}s
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
                    <FiPlay className="w-8 h-8 text-slate-400" />
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{video.title}</h3>
                    <p className="text-sm text-slate-600">Ward {video.ward}</p>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>

                {video.caption && (
                  <p className="mt-2 text-sm text-slate-700">{video.caption}</p>
                )}
                
                <div className="mt-2 text-xs text-slate-400">
                  {new Date(video.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoListPage;
