import { useState } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import { issueCategories } from "../../data/seedData";
import { wardSelectOptions } from "../../data/wardNumbers";
import { useAuth } from "../../context/AuthContext";
import { createIssue } from "../../services/issueService";

export default function ReportIssuePage() {
  const { user, profile } = useAuth();
  // Always use the full 50 ward options for dropdowns
  const wardOptions = wardSelectOptions;
  const [form, setForm] = useState({
    category: "",
    ward: profile?.wardNumber ?? "",
    title: "",
    description: "",
    evidence: null,
    notify: true,
  });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState(null);
  const [evidenceProgress, setEvidenceProgress] = useState(0);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const VIDEO_LIMIT_SEC = 15;

  const handleFileChange = async (event) => {
    let file = event.target.files?.[0] ?? null;
    if (!file) return;

    // File size limit (20MB)
    const MAX_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setMessage("File is too large. Please select a file smaller than 20MB.");
      event.target.value = "";
      setForm((prev) => ({ ...prev, evidence: null }));
      return;
    }

    if (file.type.startsWith('image/')) {
      try {
        const { compressImage } = await import("../../utils/imageCompression");
        file = await compressImage(file);
        setMessage(null);
        setForm((prev) => ({ ...prev, evidence: file }));
      } catch (err) {
        console.error("Compression error:", err);
        setForm((prev) => ({ ...prev, evidence: file }));
      }
    } else if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > VIDEO_LIMIT_SEC) {
          setMessage(`Video duration must be ${VIDEO_LIMIT_SEC} seconds or less.`);
          setForm((prev) => ({ ...prev, evidence: null }));
          event.target.value = ""; 
        } else {
          setMessage(null);
          setForm((prev) => ({ ...prev, evidence: file }));
        }
      };
      video.src = URL.createObjectURL(file);
    } else {
      setMessage(null);
      setForm((prev) => ({ ...prev, evidence: file }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("saving");
    setMessage(null);
    setEvidenceProgress(0);
    try {
      await createIssue({
        userId: user?.uid ?? "guest",
        ward: form.ward,
        category: form.category,
        title: form.title,
        description: form.description,
        notify: form.notify,
        evidenceFile: form.evidence,
        onEvidenceProgress: setEvidenceProgress,
      });
      setStatus("success");
      setMessage("Issue submitted. We will notify you when ward officers update the status.");
      setForm((prev) => ({ ...prev, title: "", description: "", evidence: null }));
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Escalate issue"
        title="Report a ward problem"
        description="Provide evidence with images or video so the ward team can act faster."
      />

      <form className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-slate-700">
          Issue category
          <select
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-400 focus:outline-none"
            required
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select category
            </option>
            {issueCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Ward
          <select
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-400 focus:outline-none"
            required
            name="ward"
            value={form.ward}
            onChange={handleChange}
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
          Description
          <textarea
            rows={4}
            required
            name="description"
            value={form.description}
            onChange={handleChange}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-400 focus:outline-none"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Upload evidence
          <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="mt-1 w-full text-sm" />
        </label>
        
        {/* Evidence Preview */}
        {form.evidence && (
          <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 relative max-w-xs">
             <button 
               type="button"
               onClick={() => setForm(prev => ({ ...prev, evidence: null }))}
               className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition"
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
             {form.evidence.type.startsWith('image/') ? (
               <img src={URL.createObjectURL(form.evidence)} alt="Evidence preview" className="w-full h-auto object-cover" />
             ) : (
               <video src={URL.createObjectURL(form.evidence)} controls className="w-full h-auto" />
             )}
          </div>
        )}

        {status === "saving" && form.evidence ? (
          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm text-blue-700">
            <p className="font-semibold">Evidence upload… {evidenceProgress}%</p>
            <div className="mt-2 h-2 rounded-full bg-blue-200">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all"
                style={{ width: `${evidenceProgress}%` }}
              />
            </div>
          </div>
        ) : null}
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            name="notify"
            checked={form.notify}
            onChange={handleChange}
            className="rounded border-slate-300"
          />{" "}
          Notify me about progress via email
        </label>
        {message ? <p className="rounded-2xl bg-slate-50 px-4 py-2 text-sm text-slate-600">{message}</p> : null}
        <button
          type="submit"
          disabled={status === "saving"}
          className="w-full rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {status === "saving" ? "Submitting…" : "Submit issue"}
        </button>
      </form>
    </div>
  );
}

