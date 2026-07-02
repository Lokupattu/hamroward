import { useState, useEffect } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import { subscribeToDonations } from "../../services/donationService";

export default function DonorsPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initial data load/subscription
    const unsubscribe = subscribeToDonations((data, err) => {
      // CRITICAL FIX: Always set the data (it contains mocks/failover)
      if (data) setDonations(data);
      if (err) setError(err);
      else setError(null);
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (donation) => {
    if (donation.createdAt?.toDate) return donation.createdAt.toDate().toLocaleDateString();
    if (donation.createdAt?.seconds) return new Date(donation.createdAt.seconds * 1000).toLocaleDateString();
    if (donation.timestamp) return new Date(donation.timestamp).toLocaleDateString();
    return "N/A";
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Transparency & Gratitude"
        title="Our Generous Donors"
        description="A list of citizens who have contributed to the development of our wards. We thank you for your support."
      />
      
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm font-medium">
          Note: Showing local backups. (Data Sync Issue: {error})
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-slate-500 font-medium">Loading donation history...</p>
          </div>
        ) : donations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-sm font-bold text-slate-700">Donor Name</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-700">From Ward</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-700">To Ward</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-700">Amount (NPR)</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-700">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {donations.map((donation, idx) => (
                  <tr key={donation.id || idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold text-xs uppercase">
                          {donation.name?.charAt(0) || "A"}
                        </div>
                        <span className="font-semibold text-slate-900">{donation.name || "Anonymous"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">Ward {donation.fromWard}</td>
                    <td className="px-6 py-4 text-slate-600">Ward {donation.toWard}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">Rs. {donation.amount}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{formatDate(donation)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center space-y-4">
            <h3 className="text-lg font-bold text-slate-900">No donations yet</h3>
          </div>
        )}
      </div>
    </div>
  );
}
