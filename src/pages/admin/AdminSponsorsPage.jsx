import SectionHeader from "../../components/common/SectionHeader";
import { sponsorSpots } from "../../data/seedData";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { useState } from "react";
import { createSponsor, deleteSponsor, updateSponsor } from "../../services/sponsorService";

import { uploadFileWithProgress } from "../../services/storageService";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export default function AdminSponsorsPage() {
  const { data: fetchedSponsors, status } = useFirestoreCollection("sponsors", { fallbackData: sponsorSpots });
  const sponsors = fetchedSponsors.length > 0 ? fetchedSponsors : sponsorSpots;

  const isLoading = status === "loading";
  const [form, setForm] = useState({
    name: "",
    priority: "top",
    startDate: "",
    endDate: "",
    imageURL: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!CLOUD_NAME) {
      alert("Cloudinary configuration missing. Please check your .env file.");
      return;
    }

    try {
      setUploading(true);
      const result = await uploadFileWithProgress({ 
        file, 
        onProgress: (progress) => console.log('Upload progress:', progress) 
      });
      
      if (result?.downloadURL) {
        setForm(prev => ({ ...prev, imageURL: result.downloadURL }));
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      priority: "top",
      startDate: "",
      endDate: "",
      imageURL: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const payload = {
        name: form.name,
        priority: form.priority,
        startDate: form.startDate,
        endDate: form.endDate,
        imageURL: form.imageURL,
      };

      // AUTO-HEAL: Ensure all seed sponsors exist in the database.
      // If the database is partial (some missing), or empty, we restore the missing ones.
      
      const existingIds = new Set(fetchedSponsors.map(s => s.id));
      
      await Promise.all(sponsorSpots.map(async (spot) => {
        // Case 1: This is the sponsor we are currently editing/saving
        if (spot.id === editingId) {
          return updateSponsor(spot.id, payload);
        }
        
        // Case 2: This is a seed sponsor that is MISSING from the database
        // We must restore it so it doesn't disappear.
        if (!existingIds.has(spot.id)) {
           return updateSponsor(spot.id, {
            name: spot.name,
            priority: spot.priority,
            startDate: spot.startDate,
            endDate: spot.endDate,
            imageURL: spot.imageURL,
            link: spot.link || "#", 
          });
        }
        
        // Case 3: Sponsor already exists in DB and we aren't editing it
        // Do nothing.
        return Promise.resolve();
      }));

      // If we are creating a COMPLETELY NEW sponsor (not a seed ID), handle it here
      if (editingId && !sponsorSpots.find(s => s.id === editingId)) {
         await updateSponsor(editingId, payload);
      } else if (!editingId) {
         await createSponsor(payload);
      }

      setFeedback("Sponsor saved (and list synchronized).");
      resetForm();
    } catch (error) {
      console.error("Sponsor save failed", error);
      setFeedback("Failed to save sponsor. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (sponsorId) => {
    setDeleting(sponsorId);
    setFeedback(null);
    try {
      await deleteSponsor(sponsorId);
      setFeedback("Sponsor removed.");
    } catch (error) {
      console.error("Sponsor delete failed", error);
      setFeedback("Failed to remove sponsor.");
    } finally {
      setDeleting(null);
      if (editingId === sponsorId) {
        resetForm();
      }
    }
  };

  return (
    <div className="space-y-8 text-slate-50">
      <SectionHeader
        eyebrow="Sponsors"
        title="Manage ad banners"
        description="Control placement, duration, and creatives."
        theme="dark"
      />

      {isLoading && (
        <div className="flex items-center gap-3 rounded-lg bg-blue-500/10 p-4 text-blue-200">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <p className="text-sm font-medium">Connecting to database...</p>
        </div>
      )}

      {feedback ? (
        <p className="rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
          {feedback}
        </p>
      ) : null}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="text-sm font-medium text-slate-200">
            Sponsor name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
            />
          </label>
          <label className="text-sm font-medium text-slate-200">
            Placement priority
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
            >
              <option value="top">Top</option>
              <option value="middle">Middle</option>
              <option value="footer">Footer</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-200">
            Start date
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
            />
          </label>
          <label className="text-sm font-medium text-slate-200">
            End date
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
            />
          </label>
          
          <div className="md:col-span-2 space-y-3">
            <label className="block text-sm font-medium text-slate-200">
              Banner Image
            </label>
            
            <div className="flex items-start gap-4">
              {form.imageURL && (
                <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
                  <img 
                    src={form.imageURL} 
                    alt="Preview" 
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, imageURL: "" }))}
                    className="absolute right-1 top-1 rounded-full bg-slate-900/80 p-1 text-white hover:bg-rose-500"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-full file:border-0 file:bg-slate-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-400 hover:file:bg-slate-700"
                />
                <p className="mt-1 text-xs text-slate-500">
                  {uploading ? "Uploading..." : "Upload a PNG or JPG file"}
                </p>
              </div>
            </div>
            
            {/* Hidden URL input fallback */}
            <input
              type="hidden"
              name="imageURL"
              value={form.imageURL}
            />
          </div>
          <div className="md:col-span-2 mt-4 flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-2xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-slate-600"
            disabled={saving}
          >
            {editingId ? (saving ? "Updating…" : "Update sponsor") : saving ? "Saving…" : "Save sponsor"}
          </button>
          {editingId ? (
            <button
              type="button"
              className="rounded-2xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
              onClick={resetForm}
            >
              Cancel edit
            </button>
          ) : null}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {sponsors.map((sponsor) => (
          <article key={sponsor.id} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{sponsor.priority}</p>
                <h2 className="text-xl font-semibold text-white">{sponsor.name}</h2>
                <p className="text-sm text-slate-400">
                  {sponsor.startDate} → {sponsor.endDate}
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                <button
                  className="rounded-full border border-blue-500/40 px-4 py-1 text-blue-200 hover:bg-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                  onClick={() => {
                    setEditingId(sponsor.id);
                    setForm({
                      name: sponsor.name,
                      priority: sponsor.priority,
                      startDate: sponsor.startDate ?? "",
                      endDate: sponsor.endDate ?? "",
                      imageURL: sponsor.imageURL ?? "",
                    });
                  }}
                >
                  Edit
                </button>
                <button
                  className="rounded-full border border-rose-500/40 px-4 py-1 text-rose-200 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:text-slate-500"
                  disabled={deleting === sponsor.id || isLoading}
                  onClick={() => handleDelete(sponsor.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

