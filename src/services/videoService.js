import {
  saveVideo,
  getVideo as getVideoFromDB,
  getAllVideos,
  deleteVideo as deleteVideoFromDB,
  updateVideoStatus as updateVideoStatusInDB,
} from "./dbService";
import { uploadFileWithProgress } from "./storageService";

// Get video duration
const getVideoDuration = (file) => {
  return new Promise((resolve) => {
    if (!file) return resolve(15);

    const video = document.createElement("video");
    video.preload = "metadata";

    const onLoadedMetadata = () => {
      URL.revokeObjectURL(video.src);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      resolve(video.duration || 15);
    };

    video.addEventListener("error", () => {
      URL.revokeObjectURL(video.src);
      resolve(15);
    });

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.src = URL.createObjectURL(file);
  });
};

// SUBMIT VIDEO
export const submitVideo = async ({
  file,
  title,
  ward,
  userId,
  caption,
  onProgress,
}) => {
  try {
    if (!file || !title || !ward || !userId) {
      throw new Error("Missing required fields");
    }

    // Upload to Cloudinary
    const uploadResult = await uploadFileWithProgress({
      file,
      onProgress
    });

    const duration = await getVideoDuration(file);

    const video = {
      title,
      ward,
      userId,
      caption: caption || "",
      status: "pending",
      duration,
      fileType: file.type,
      fileName: file.name,
      fileSize: file.size,
      videoUrl: uploadResult.downloadURL,
      publicId: uploadResult.publicId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const savedVideo = await saveVideo(video);
    return savedVideo.id;
  } catch (error) {
    console.error("Error submitting video:", error);
    throw error;
  }
};

// FETCH ALL VIDEOS
export const fetchVideos = async (filters = {}) => {
  try {
    const videos = await getAllVideos(filters);
    return videos || [];
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
};

// GET VIDEO WITH URL (Now just returns the video object as URL is stored in it)
export const getVideoWithUrl = async (videoId) => {
  try {
    const video = await getVideoFromDB(videoId);
    return video;
  } catch (error) {
    console.error("Error getting video with URL:", error);
    return null;
  }
};

// DELETE VIDEO
export const deleteVideo = async (videoId) => {
  try {
    // Note: We should also delete from Cloudinary here, but for now just deleting from DB
    await deleteVideoFromDB(videoId);
    return true;
  } catch (error) {
    console.error("Error deleting video:", error);
    throw error;
  }
};

// GET SINGLE VIDEO
export const getVideo = async (videoId) => {
  try {
    return await getVideoFromDB(videoId);
  } catch (error) {
    console.error("Error getting video:", error);
    throw error;
  }
};

// UPDATE STATUS
export const updateVideoStatus = async (videoId, status) => {
  try {
    await updateVideoStatusInDB(videoId, status);
    return true;
  } catch (error) {
    console.error("Error updating video status:", error);
    throw error;
  }
};
