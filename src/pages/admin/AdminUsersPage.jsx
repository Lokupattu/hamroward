import { useEffect, useState } from "react";
import { getAllUsers, updateUserStatus } from "../../services/dbService";
import { FiCheck, FiX, FiUser } from "react-icons/fi";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (userId) => {
    try {
      if (window.confirm("Approve this user?")) {
          await updateUserStatus(userId, true);
          setUsers(prev => prev.map(u => u.id === userId ? { ...u, isApproved: true } : u));
      }
    } catch (err) {
      console.error("Error approving user:", err);
      alert("Failed to approve user");
    }
  };

  const handleReject = async (userId) => {
    try {
       if (window.confirm("Reject (Revoke approval) for this user?")) {
        await updateUserStatus(userId, false);
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isApproved: false } : u));
       }
    } catch (err) {
      console.error("Error rejecting user:", err);
      alert("Failed to reject user");
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading users...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  const pendingUsers = users.filter(u => !u.isApproved && u.role !== 'admin').sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  const approvedUsers = users.filter(u => u.isApproved && u.role !== 'admin').sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  const admins = users.filter(u => u.role === 'admin');

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">User Management</h1>

      <div className="space-y-8">
        {/* Pending Users */}
        <section>
          <h2 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></span>
            Pending Approval ({pendingUsers.length})
          </h2>
          {pendingUsers.length === 0 ? (
            <p className="text-slate-500 italic">No pending users.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingUsers.map(user => (
                <UserCard 
                  key={user.id} 
                  user={user} 
                  onApprove={() => handleApprove(user.id)} 
                  onReject={null} // Can't reject pending, only approve. Or maybe reject means delete? For now just approve.
                />
              ))}
            </div>
          )}
        </section>

        {/* Approved Users */}
        <section>
          <h2 className="text-xl font-semibold text-green-400 mb-4">Approved Users ({approvedUsers.length})</h2>
           {approvedUsers.length === 0 ? (
            <p className="text-slate-500 italic">No approved users yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {approvedUsers.map(user => (
                <UserCard 
                    key={user.id} 
                    user={user} 
                    onApprove={null}
                    onReject={() => handleReject(user.id)}
                    isApproved
                />
              ))}
            </div>
          )}
        </section>

         {/* Admins */}
        <section>
          <h2 className="text-xl font-semibold text-blue-400 mb-4">Admins ({admins.length})</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {admins.map(user => (
                 <div key={user.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 opacity-75">
                    <div className="flex items-center gap-3 mb-2">
                        {user.photoURL ? (
                            <img src={user.photoURL} alt={user.name} className="w-10 h-10 rounded-full" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center">
                                <FiUser className="text-slate-300" />
                            </div>
                        )}
                        <div>
                            <p className="font-semibold text-white">{user.name || "Unnamed Admin"}</p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                    </div>
                 </div>
              ))}
            </div>
        </section>
      </div>
    </div>
  );
}

function UserCard({ user, onApprove, onReject, isApproved }) {
  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-sm transition hover:border-slate-600">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
            {user.photoURL ? (
                <img src={user.photoURL} alt={user.name} className="w-10 h-10 rounded-full bg-slate-700 object-cover" />
            ) : (
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                    <FiUser className="text-slate-300" />
                </div>
            )}
            <div>
                <p className="font-semibold text-slate-100">{user.name || "No Name"}</p>
                <p className="text-xs text-slate-400">{user.email}</p>
                {user.wardNumber && <p className="text-xs text-blue-400 mt-1">Ward {user.wardNumber}</p>}
                <p className="text-xs text-slate-500 mt-0.5">Joined: {user.createdAt?.seconds ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown'}</p>
            </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {onApprove && (
          <button 
            onClick={onApprove}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded-md flex items-center justify-center gap-2 transition"
          >
            <FiCheck /> Approve
          </button>
        )}
        {onReject && (
          <button 
            onClick={onReject}
            className="flex-1 bg-red-900/50 hover:bg-red-900 text-red-200 text-sm py-2 px-3 rounded-md flex items-center justify-center gap-2 transition font-medium border border-red-800"
          >
            <FiX /> Revoke
          </button>
        )}
      </div>
    </div>
  );
}
