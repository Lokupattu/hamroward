import { useRef, useState, useCallback } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import { wardSelectOptions } from "../../data/wardNumbers";
import { useAuth } from "../../context/AuthContext";
import { submitVideo } from "../../services/videoService";
import { FiUpload, FiX, FiCheck } from "react-icons/fi";

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to get video duration
const getVideoDuration = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      
      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject(new Error('Failed to load video metadata'));
      };
      
      video.src = URL.createObjectURL(file);
    } catch (err) {
      reject(err);
    }
  });
};

export default function UploadVideoPage() {
  const { profile, user } = useAuth();
  // Always use the full 50 ward options for dropdowns
  const wardOptions = wardSelectOptions;
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    title: "",
    ward: profile?.wardNumber ?? "",
    caption: "",
    file: null,
  });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileInfo, setFileInfo] = useState({
    name: '',
    size: 0,
    duration: 0,
    type: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateVideo = useCallback(async (file) => {
    if (!file) return false;

    // Check file type
    if (!file.type.startsWith('video/')) {
      throw new Error('Please upload a valid video file (MP4, MOV, AVI, etc.)');
    }
    
    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new Error(`Video must be smaller than 50MB. Current size: ${formatFileSize(file.size)}`);
    }
    
    // Check video duration (15 seconds limit)
    try {
      const duration = await getVideoDuration(file);
      if (duration > 15) {
        throw new Error(`Video must be 15 seconds or shorter. Current duration: ${Math.ceil(duration)}s`);
      }
      return { duration };
    } catch (err) {
      console.error('Error getting video duration:', err);
      throw new Error('Could not verify video duration. Please try another file.');
    }
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0] ?? null;
    
    if (!file) {
      setFileInfo({ name: '', size: 0, duration: 0, type: '' });
      setForm(prev => ({ ...prev, file: null }));
      return;
    }

    setStatus('validating');
    setMessage('Validating video...');
    
    try {
      const { duration } = await validateVideo(file);
      
      setFileInfo({
        name: file.name,
        size: file.size,
        duration: Math.ceil(duration),
        type: file.type
      });
      
      setForm(prev => ({ ...prev, file }));
      setMessage(null);
      setStatus('idle');
    } catch (err) {
      console.error('Validation error:', err);
      setStatus('error');
      setMessage(err.message);
      event.target.value = ''; // Reset file input
      setFileInfo({ name: '', size: 0, duration: 0, type: '' });
      setForm(prev => ({ ...prev, file: null }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.file) {
      setMessage("Attach a short video to continue.");
      setStatus("error");
      return;
    }
    if (!form.title || !form.ward) {
      setMessage("Please fill in title and select a ward.");
      setStatus("error");
      return;
    }
    setStatus("uploading");
    setMessage(null);
    setUploadProgress(0);
    try {
      if (!user?.uid) {
        throw new Error("You must be logged in to upload.");
      }

      const result = await submitVideo({
        file: form.file,
        title: form.title,
        ward: form.ward,
        caption: form.caption,
        userId: user.uid,
        onProgress: setUploadProgress,
      });
      console.log("Video submitted:", result);
      setStatus("success");
      setMessage("Submitted for moderation. You will see it in My Videos soon.");
      setForm((prev) => ({ ...prev, title: "", caption: "", file: null }));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setUploadProgress(0);
    } catch (err) {
      console.error("Upload error:", err);
      setStatus("error");
      setMessage(err.message || "Upload failed. Please try again.");
      setUploadProgress(0);
    }
  };

  const isApproved = profile?.isApproved || profile?.role === 'admin';

  if (!isApproved) {
    return (
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Share update"
          title="Upload a 15-sec ward video"
          description="Your account is pending approval."
        />
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Account Pending Approval</h3>
            <p className="text-slate-600">
                You must be approved by an administrator before you can upload videos. 
                Please contact your ward admin or wait for approval.
            </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Share update"
        title="Upload a 15-sec ward video"
        description="Keep it positive, factual, and under 50MB. Videos are reviewed before publishing."
      />

      <form className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-slate-700">
          Title
          <input
            type="text"
            required
            name="title"
            value={form.title}
            onChange={handleChange}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-400 focus:outline-none"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Ward
          <select
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-400 focus:outline-none"
            name="ward"
            value={form.ward}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select ward
            </option>
            {wardOptions.map((ward) => (
              <option key={ward.id} value={ward.id}>
                {ward.label ?? `Ward ${ward.id}`}
              </option>
            ))}
          </select>
        </label>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Video file (max 15 seconds, 50MB)
            <div className="mt-1 flex items-center justify-center w-full">
              <label className="flex flex-col w-full h-32 border-2 border-dashed hover:bg-slate-50 hover:border-blue-300 group cursor-pointer">
                <div className="flex flex-col items-center justify-center pt-7">
                  <FiUpload className="w-8 h-8 text-slate-400 group-hover:text-blue-400" />
                  <p className="pt-1 text-sm text-slate-500 group-hover:text-blue-400">
                    {form.file ? fileInfo.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    MP4, MOV, or AVI (max 15s, 50MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/x-msvideo"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="opacity-0 absolute"
                  disabled={status === 'uploading' || status === 'validating'}
                />
              </label>
            </div>
          </label>
          
          {form.file && (
            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex items-center space-x-2">
                <FiCheck className="text-green-500" />
                <span>File: {fileInfo.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiCheck className="text-green-500" />
                <span>Size: {formatFileSize(fileInfo.size)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiCheck className="text-green-500" />
                <span>Duration: {fileInfo.duration} seconds</span>
              </div>
            </div>
          )}
        </div>
        <label className="block text-sm font-medium text-slate-700">
          Supporting caption
          <textarea
            rows={3}
            name="caption"
            value={form.caption}
            onChange={handleChange}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-400 focus:outline-none"
          />
        </label>
        {status === "uploading" ? (
          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm text-blue-700">
            <p className="font-semibold">Uploading… {uploadProgress}%</p>
            <div className="mt-2 h-2 rounded-full bg-blue-200">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : null}
        {message ? (
          <div
            className={`rounded-2xl px-4 py-2 text-sm ${
              status === "error"
                ? "border border-red-200 bg-red-50 text-red-700"
                : status === "success"
                ? "border border-green-200 bg-green-50 text-green-700"
                : "bg-slate-50 text-slate-600"
            }`}
          >
            {message}
          </div>
        ) : null}
        <button
          type="submit"
          disabled={status === "uploading" || status === "validating" || !form.file}
          className="w-full rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-300 flex items-center justify-center gap-2"
        >
          {status === "uploading" ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : status === "validating" ? (
            'Validating...'
          ) : !form.file ? (
            'Select a video to upload'
          ) : (
            'Submit for review'
          )}
        </button>
      </form>
    </div>
  );
}

