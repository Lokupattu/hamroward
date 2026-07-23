import { useEffect, useState } from "react";
import { useSearchParams, NavLink } from "react-router-dom";
import SectionHeader from "../../components/common/SectionHeader";
import { fetchVideos } from "../../services/videoService";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { documents } from "../../data/seedData";
import { FiPlay, FiFileText } from "react-icons/fi";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch documents using hook (fallback to seed data)
  const { data: allDocuments } = useFirestoreCollection("documents", {
    fallbackData: documents,
  });

  useEffect(() => {
    const performSearch = async () => {
      setLoading(true);
      try {
        // Fetch all approved videos
        // Note: In a real app with many videos, we'd use a search service like Algolia
        // For now, we fetch all and filter client-side as per "fix this project" scope
        const allVideos = await fetchVideos({ status: "approved" });
        setVideos(allVideos);
      } catch (error) {
        console.error("Error searching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, []);

  // Filter results
  const filteredVideos = videos.filter(v => 
    v.title?.toLowerCase().includes(query.toLowerCase()) || 
    v.caption?.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDocuments = allDocuments.filter(d => 
    d.title?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Search Results"
        title={`Results for "${query}"`}
        description={`Found ${filteredVideos.length} videos and ${filteredDocuments.length} documents.`}
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Videos Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiPlay className="text-blue-600" /> Videos
            </h3>
            {filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                  <div key={video.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                     <div className="relative pt-[56.25%] bg-black">
                        {video.videoUrl ? (
                          <video
                            src={`${video.videoUrl}#t=0.1`}
                            className="absolute inset-0 w-full h-full object-cover"
                            controls
                            playsInline
                            preload="metadata"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
                            <FiPlay className="w-8 h-8 text-slate-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-slate-900">{video.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">Ward {video.ward}</p>
                      </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">No matching videos found.</p>
            )}
          </section>

          {/* Documents Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiFileText className="text-blue-600" /> Documents
            </h3>
            {filteredDocuments.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredDocuments.map((doc) => (
                  <NavLink 
                    key={doc.id} 
                    to={`/documents/${doc.id}`}
                    className="block p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition"
                  >
                    <h4 className="font-semibold text-slate-900">{doc.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">
                      {doc.requirements.length} requirements • {doc.processingTime}
                    </p>
                  </NavLink>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">No matching documents found.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
