import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import SectionHeader from "../../components/common/SectionHeader";
import { 
  prepareEsewaPayment, 
  saveDonation, 
  subscribeToDonations 
} from "../../services/donationService";
import { useAuth } from "../../context/AuthContext";

export default function DonationPage() {
  const [searchParams] = useSearchParams();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(searchParams.get("status"));
  
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    fromWard: profile?.ward || "",
    toWard: "1",
    amount: "",
  });

  const wardOptions = useMemo(() => {
    return [...Array(50)].map((_, i) => (
      <option key={i + 1} value={i + 1}>Ward {i + 1}</option>
    ));
  }, []);

  useEffect(() => {
    if (status === "success") {
      const lastDonation = localStorage.getItem("pending_donation");
      if (lastDonation) {
        const data = JSON.parse(lastDonation);
        saveDonation(data).then(() => {
          localStorage.removeItem("pending_donation");
        });
      }
    }
  }, [status]);

  const [paymentStep, setPaymentStep] = useState("form");
  const [mockCredentials, setMockCredentials] = useState({ phone: "", password: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMockInputChange = (e) => {
    const { name, value } = e.target;
    setMockCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSimulatedPay = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const donationData = {
        ...formData,
        userId: profile?.uid || "guest",
        amount: formData.amount.toString(),
        transaction_uuid: `SIM-${Date.now()}`,
        timestamp: new Date().toISOString(),
        payment_method: "Simulated eSewa"
      };

      await saveDonation(donationData);
      setPaymentStep("success");
      setStatus("success");
    } catch (err) {
      console.error("Payment failed", err);
      alert("Failed to save donation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <SectionHeader
        eyebrow="Support Our Community"
        title="Make a Donation"
        description="Your contribution helps build a better, more transparent ward for everyone. Donate easily via eSewa."
      />

      {status === "success" && (
        <div className="rounded-xl bg-green-50 p-4 text-green-700 border border-green-200 text-center font-semibold">
          Thank you! Your donation was successful.
        </div>
      )}

      <div className="max-w-2xl mx-auto w-full">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {paymentStep === "form" ? (
            <form onSubmit={(e) => { e.preventDefault(); setPaymentStep("mock_esewa"); }} className="space-y-4">
               <h2 className="text-xl font-bold text-slate-900 mb-6">Donation Details</h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Ex: Ram Bahadur (Optional)"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Your Ward No.</label>
                    <input
                      type="number"
                      name="fromWard"
                      required
                      value={formData.fromWard}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="Ex: 5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Donating To Ward</label>
                    <select
                      name="toWard"
                      value={formData.toWard}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none transition-colors bg-white"
                    >
                      {wardOptions}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Amount (NPR)</label>
                  <input
                    type="number"
                    name="amount"
                    required
                    min="10"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Ex: 500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#60bb46] py-3 font-bold text-white shadow-lg transition hover:bg-[#52a63b]"
                >
                  <img src="https://esewa.com.np/common/images/esewa_logo.png" alt="eSewa" className="h-5 invert brightness-0" />
                  Proceed to eSewa (Simulated)
                </button>
            </form>
          ) : paymentStep === "mock_esewa" ? (
            <div className="space-y-6">
              <div className="flex justify-center mb-4"><img src="https://esewa.com.np/common/images/esewa_logo.png" alt="eSewa" className="h-10" /></div>
              <div className="bg-[#60bb46] text-white p-4 rounded-xl text-center mb-4">
                <p className="text-sm">Total Amount </p>
                <p className="text-2xl font-bold">NPR. {formData.amount}</p>
              </div>
              <form onSubmit={handleSimulatedPay} className="space-y-4">
                <input type="text" name="phone" required value={mockCredentials.phone} onChange={handleMockInputChange} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none" placeholder="eSewa ID (98XXXXXXXX)" />
                <input type="password" name="password" required value={mockCredentials.password} onChange={handleMockInputChange} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none" placeholder="Password" />
                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#60bb46] py-3 font-bold text-white shadow-lg transition hover:bg-[#52a63b] disabled:opacity-50">
                  {loading ? "Processing..." : "Confirm & Pay (Test Mode)"}
                </button>
                <button type="button" onClick={() => setPaymentStep("form")} className="w-full text-sm text-slate-500">Cancel</button>
              </form>
            </div>
          ) : (
            <div className="py-12 text-center space-y-4">
              <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto">✓</div>
              <h2 className="text-2xl font-bold text-slate-900">Donation Complete!</h2>
              <p className="text-slate-600">Your donation of Rs. {formData.amount} has been successfully recorded.</p>
              <button onClick={() => { setPaymentStep("form"); setFormData({ ...formData, amount: "" }); setStatus(null); }} className="rounded-xl border border-blue-600 px-6 py-2 text-blue-600 font-semibold">Make Another Donation</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
