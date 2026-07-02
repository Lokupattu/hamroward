import SectionHeader from "../../components/common/SectionHeader";
import { NavLink } from "react-router-dom";
import { documents } from "../../data/seedData";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { HiOutlineDocumentSearch, HiOutlineClock, HiOutlineCurrencyRupee, HiOutlineArrowRight } from "react-icons/hi";

export default function DocumentsList() {
  const { data: fetchedDocs } = useFirestoreCollection("documents", {
    fallbackData: documents,
  });

  const documentEntries = fetchedDocs.length > 0 ? fetchedDocs : documents;

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SectionHeader
        eyebrow="Ward Services"
        title="Knowledge Base"
        description="Comprehensive requirements, official timelines, and verified guidance for all municipal services and registrations."
      />

      <div className="grid gap-8 md:grid-cols-2">
        {documentEntries.map((doc) => (
          <NavLink
            key={doc.id}
            to={`/documents/${doc.id}`}
            className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/5 hover:border-blue-100"
          >
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-50 transition-transform duration-500 group-hover:scale-150 group-hover:bg-blue-100/50"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="rounded-2xl bg-blue-50 p-4 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <HiOutlineDocumentSearch className="h-7 w-7" />
                </div>
                <span className="rounded-full bg-slate-100 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-blue-600 transition-colors">
                  {doc.id.replace("-", " ")}
                </span>
              </div>

              <h2 className="text-2xl font-black text-slate-900 font-serif leading-tight group-hover:text-blue-600 transition-colors duration-500">
                {doc.title}
              </h2>

              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                   <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <HiOutlineClock className="h-5 w-5" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Processing</p>
                      <p className="text-sm font-bold text-slate-700">{doc.processingTime}</p>
                   </div>
                </div>
                <div className="flex items-center space-x-3">
                   <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                      <HiOutlineCurrencyRupee className="h-5 w-5" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Service Fee</p>
                      <p className="text-sm font-bold text-slate-700">{doc.fee}</p>
                   </div>
                </div>
              </div>

              <div className="mt-auto pt-10 flex items-center justify-between border-t border-slate-50 group-hover:border-blue-50 transition-colors">
                <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-blue-600 transition-all">
                  Access Guidance
                </span>
                <HiOutlineArrowRight className="h-6 w-6 text-slate-300 transition-all duration-500 group-hover:translate-x-2 group-hover:text-blue-600" />
              </div>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

