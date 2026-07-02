import { useState, useEffect } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import { useAuth } from "../../context/AuthContext";
import { uploadFileWithProgress } from "../../services/storageService";
import { compressImage } from "../../utils/imageCompression";
import { getIssues } from "../../services/dbService";
import { getUserDonations } from "../../services/donationService";

export default function ProfilePage() {
  const { profile, logout, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    wardNumber: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [activities, setActivities] = useState({ issues: [], donations: [] });
  const [fetchingActivities, setFetchingActivities] = useState(true);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        wardNumber: profile.wardNumber || "",
        phoneNumber: profile.phoneNumber || "",
      });
      loadActivityHistory();
    }
  }, [profile]);

  const loadActivityHistory = async () => {
    if (!profile?.uid) return;
    setFetchingActivities(true);
    try {
      const [issues, donations] = await Promise.all([
        getIssues({ userId: profile.uid }),
        getUserDonations(profile.uid)
      ]);
      setActivities({ issues, donations });
    } catch (error) {
      console.error("Error loading activity history:", error);
    } finally {
      setFetchingActivities(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoLoading(true);
    setMessage(null);
    try {
      const compressed = await compressImage(file, { maxWidth: 400, maxHeight: 400, quality: 0.8 });
      const result = await uploadFileWithProgress({
        file: compressed,
        onProgress: (p) => console.log(`Upload progress: ${p}%`)
      });

      if (result?.downloadURL) {
        await updateUserProfile({ photoURL: result.downloadURL });
        setMessage({ type: "success", text: "Profile photo updated!" });
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      setMessage({ type: "error", text: "Failed to upload photo." });
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await updateUserProfile({
        name: formData.name,
        wardNumber: formData.wardNumber,
        phoneNumber: formData.phoneNumber,
      });
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "Failed to update profile." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="My profile"
        title="Account settings"
        description="Update contact info, ward details, and preferences."
      />

      <form onSubmit={handleSubmit}>
        <section className="rounded-3xl border border-slate-200 bg-white p-8 mb-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-blue-100 bg-blue-50 flex items-center justify-center text-3xl font-bold text-blue-600">
                  {profile?.photoURL ? (
                    <img src={profile.photoURL} alt={profile.name} className="h-full w-full object-cover" />
                  ) : (
                    profile?.name?.charAt(0) || "C"
                  )}
                  {photoLoading && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center transition-opacity">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                    </div>
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 cursor-pointer rounded-full bg-blue-600 p-1.5 text-white shadow-lg transition hover:bg-blue-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={photoLoading} />
                </label>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Citizen Profile</p>
                <h2 className="text-2xl font-semibold text-slate-900">{profile?.name ?? "Citizen"}</h2>
                <p className="text-sm text-slate-500">
                  Ward {profile?.wardNumber ?? "—"} • {profile?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ward Number</label>
              <select
                name="wardNumber"
                value={formData.wardNumber}
                onChange={handleChange}
                className="w-full rounded-xl border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Ward</option>
                {[...Array(32)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Ward {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="98XXXXXXXX"
                className="w-full rounded-xl border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8">
          <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded border-slate-300" /> Issue status updates
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded border-slate-300" /> Weekly ward digest
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded border-slate-300" /> Sponsor announcements
            </label>
          </div>

          {message && (
            <div className={`mt-4 p-3 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
            
            <button
              type="button"
              onClick={logout}
              className="ml-auto text-sm font-semibold text-rose-500 hover:text-rose-400"
            >
              Log out
            </button>
          </div>
        </section>
      </form>

      <section className="rounded-3xl border border-slate-200 bg-white p-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Activity History</h3>
        
        <div className="space-y-6">
          {/* Recent Issues */}
          <div>
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Reported Issues</h4>
            {fetchingActivities ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                 <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-transparent"></div>
                 Loading issues...
              </div>
            ) : activities.issues.length > 0 ? (
              <div className="grid gap-3">
                {activities.issues.slice(0, 3).map(issue => (
                  <div key={issue.id} className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50/50">
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{issue.title}</p>
                      <p className="text-xs text-slate-500">{new Date(issue.createdAt).toLocaleDateString()} • {issue.category}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      issue.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      issue.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {issue.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">No issues reported yet.</p>
            )}
          </div>

          {/* Recent Donations */}
          <div>
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Donations</h4>
            {fetchingActivities ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                 <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-transparent"></div>
                 Loading donations...
              </div>
            ) : activities.donations.length > 0 ? (
              <div className="grid gap-3">
                {activities.donations.slice(0, 3).map(donation => (
                  <div key={donation.id} className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50/50">
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">To Ward {donation.toWard}</p>
                      <p className="text-xs text-slate-500">{new Date(donation.timestamp).toLocaleDateString()}</p>
                    </div>
                    <span className="font-bold text-slate-900">Rs. {donation.amount}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">No donations made yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

