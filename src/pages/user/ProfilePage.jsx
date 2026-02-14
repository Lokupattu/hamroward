import { useState, useEffect } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const { profile, logout, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    wardNumber: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        wardNumber: profile.wardNumber || "",
        phoneNumber: profile.phoneNumber || "",
      });
    }
  }, [profile]);

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
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Citizen</p>
              <h2 className="text-2xl font-semibold text-slate-900">{profile?.name ?? "Citizen"}</h2>
              <p className="text-sm text-slate-500">
                Ward {profile?.wardNumber ?? "—"} • {profile?.email}
              </p>
            </div>
            {/* Photo upload could go here */}
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
    </div>
  );
}

