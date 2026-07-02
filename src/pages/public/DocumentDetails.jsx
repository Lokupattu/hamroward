import SectionHeader from "../../components/common/SectionHeader";
import { useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { documents } from "../../data/seedData";
import { useFirestoreDocument } from "../../hooks/useFirestoreCollection";
import { 
  HiOutlineChevronLeft, 
  HiOutlineClock, 
  HiOutlineCurrencyRupee, 
  HiOutlineOfficeBuilding,
  HiOutlineClipboardList,
  HiOutlineQuestionMarkCircle
} from "react-icons/hi";

export default function DocumentDetails() {
  const { docId } = useParams();
  const navigate = useNavigate();
  const fallbackDoc = useMemo(
    () => documents.find((doc) => doc.id === docId),
    [docId]
  );
  const { data: documentData, loading } = useFirestoreDocument("documents", docId, {
    fallbackData: fallbackDoc,
  });

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!documentData) {
    return (
      <div className="mx-auto max-w-2xl py-20 px-4 text-center">
        <div className="rounded-[2.5rem] border border-rose-100 bg-rose-50 p-12 shadow-xl shadow-rose-900/5">
           <h2 className="text-2xl font-black text-rose-900 font-serif mb-4">Service Guidance Unavailable</h2>
           <p className="text-rose-600 font-medium leading-relaxed">
             We couldn't locate the specific service guide you're looking for. It might have been relocated or updated.
           </p>
           <button
             className="mt-10 rounded-2xl bg-rose-600 px-8 py-4 text-sm font-black text-white shadow-lg shadow-rose-900/20 hover:bg-rose-500 transition-all hover:-translate-y-1 active:scale-95"
             onClick={() => navigate("/documents")}
           >
             Return to Knowledge Base
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-12 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header Section */}
      <header className="space-y-6">
        <Link 
          to="/documents" 
          className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest"
        >
          <HiOutlineChevronLeft className="mr-1 h-4 w-4" />
          BACK TO SERVICES
        </Link>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-2">
            <p className="text-[10px] font-black tracking-[0.4em] text-blue-600 uppercase">
               Service Guide • {documentData.id.replace("-", " ")}
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 font-serif tracking-tight leading-[1.1]">
              {documentData.title}
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100 italic">
             <span className="text-xs font-bold text-blue-800 opacity-70">Official Ward Resource</span>
          </div>
        </div>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="group rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-blue-900/5">
           <div className="mb-4 inline-flex rounded-xl bg-blue-50 p-3 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <HiOutlineClock className="h-6 w-6" />
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Processing Time</p>
           <p className="mt-1 text-xl font-black text-slate-900 font-serif">{documentData.processingTime}</p>
        </div>
        <div className="group rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-blue-900/5">
           <div className="mb-4 inline-flex rounded-xl bg-amber-50 p-3 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <HiOutlineCurrencyRupee className="h-6 w-6" />
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Official Fee</p>
           <p className="mt-1 text-xl font-black text-slate-900 font-serif">{documentData.fee}</p>
        </div>
        <div className="group rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-blue-900/5">
           <div className="mb-4 inline-flex rounded-xl bg-emerald-50 p-3 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <HiOutlineOfficeBuilding className="h-6 w-6" />
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned Desk</p>
           <p className="mt-1 text-xl font-black text-slate-900 font-serif">{documentData.office}</p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Requirements Card */}
        <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 h-24 w-24 bg-blue-50/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
               <HiOutlineClipboardList className="h-7 w-7 text-blue-600" />
               <h2 className="text-2xl font-black text-slate-900 font-serif tracking-tight">Required Documents</h2>
            </div>
            <ul className="space-y-4">
              {documentData.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-4 text-slate-600 font-medium">
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500 shadow-sm shadow-blue-200" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Workflow Card */}
        <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent"></div>
           <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8 text-blue-400">
               <HiOutlineClipboardList className="h-7 w-7" />
               <h2 className="text-2xl font-black text-white font-serif tracking-tight">Step-by-Step Flow</h2>
            </div>
            <ol className="space-y-6">
              {documentData.workflow.map((step, idx) => (
                <li key={idx} className="flex items-start gap-5">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black shadow-lg shadow-blue-900/50 italic border border-blue-400/30">
                    0{idx + 1}
                  </span>
                  <span className="font-bold text-slate-100 pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
           </div>
        </section>
      </div>

      {/* FAQs Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
           <HiOutlineQuestionMarkCircle className="h-7 w-7 text-blue-600" />
           <h2 className="text-2xl font-black text-slate-900 font-serif tracking-tight">Common Inquiries</h2>
        </div>
        <div className="grid gap-4">
          {documentData.faqs.map((faq, index) => (
            <div key={index} className="rounded-[1.5rem] border border-slate-100 bg-white p-8 transition-all hover:bg-slate-50/50 hover:border-blue-100">
              <p className="text-lg font-black text-slate-900 leading-snug">{faq.q}</p>
              <div className="mt-4 pt-4 border-t border-slate-50">
                 <p className="text-slate-600 font-medium leading-relaxed italic">“{faq.a}”</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


