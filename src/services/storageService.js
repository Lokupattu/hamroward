import axios from 'axios';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export async function uploadFileWithProgress({ file, onProgress }) {
  if (!file) return null;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('cloud_name', CLOUD_NAME);
  // Optional: Add folder or tags
  // formData.append('folder', 'hamroward_videos');

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      }
    );

    return {
      downloadURL: response.data.secure_url,
      publicId: response.data.public_id,
      format: response.data.format,
      resourceType: response.data.resource_type,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}

// Helper to get optimized URL (optional)
export function getOptimizedUrl(publicId, options = {}) {
    // Basic implementation, can be expanded with Cloudinary SDK or URL construction logic
    // For now, we just return the publicId if it's a full URL, or construct it
    if (publicId && publicId.startsWith('http')) return publicId;
    return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${publicId}`;
}
