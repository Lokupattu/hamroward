import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { notificationService } from "../../services/notificationService";

export default function NotificationsPage() {
  const { role } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      setError("Failed to load notifications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await notificationService.updateNotification(currentId, { title, content });
      } else {
        await notificationService.addNotification(title, content);
      }
      resetForm();
      fetchNotifications();
    } catch (err) {
      console.error("Failed to save notification", err);
      alert("Failed to save notification");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;
    try {
      await notificationService.deleteNotification(id);
      fetchNotifications();
    } catch (err) {
      console.error("Failed to delete notification", err);
      alert("Failed to delete notification");
    }
  };

  const handleEdit = (notification) => {
    setIsEditing(true);
    setCurrentId(notification.id);
    setTitle(notification.title);
    setContent(notification.content);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setTitle("");
    setContent("");
    setShowForm(false);
  };

  if (loading) return <div className="text-center py-10">Loading notifications...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
        {role === "admin" && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
          >
            Add Notification
          </button>
        )}
      </div>

      {/* Admin Form */}
      {role === "admin" && showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-4">{isEditing ? "Edit Notification" : "New Notification"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="Important Announcement"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="Details about the notification..."
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                {isEditing ? "Update" : "Post"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-center text-slate-500 py-10">No notifications yet.</p>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 transition hover:shadow-md">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{notification.title}</h3>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                      {notification.createdAt?.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 whitespace-pre-wrap">{notification.content}</p>
                </div>
                
                {role === "admin" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(notification)}
                      className="p-2 text-slate-400 hover:text-blue-600 transition"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="p-2 text-slate-400 hover:text-red-600 transition"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
