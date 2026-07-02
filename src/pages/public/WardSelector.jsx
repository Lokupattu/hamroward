import { Link } from "react-router-dom";
import SectionHeader from "../../components/common/SectionHeader";
import { wards } from "../../data/seedData";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { HiOutlineOfficeBuilding, HiOutlineArrowNarrowRight } from "react-icons/hi";

export default function WardSelector() {
  const { data: fetchedWards } = useFirestoreCollection("wards", {
    fallbackData: wards,
  });
  
  const wardEntries = fetchedWards.length > 0 ? fetchedWards : wards;

  return (
    <div className="space-y-12 pb-16">
      <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 px-8 py-20 text-center shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent opacity-50"></div>
        <div className="relative z-10 mx-auto max-w-2xl space-y-6">
          <SectionHeader
            eyebrow="Ward Directory"
            title="Discover Your Community Hub"
            description="Access real-time updates, official documents, and direct accountability stats for your specific ward."
            dark
          />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {wardEntries.map((ward) => (
          <Link
            to={`/wards/${ward.id}`}
            key={ward.id}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-100"
          >
            {/* Background Accent */}
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-50 transition-all duration-500 group-hover:scale-150"></div>
            
            <div className="relative z-10 flex flex-col h-full space-y-6">
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-200 transition-transform duration-500 group-hover:rotate-12">
                  <HiOutlineOfficeBuilding className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 border border-slate-200">
                  {ward.population.toLocaleString()} Residents
                </span>
              </div>

              <div>
                <p className="text-sm font-bold tracking-[0.3em] text-blue-600 uppercase mb-1">Ward {ward.id}</p>
                <h2 className="text-3xl font-black text-slate-900 font-serif tracking-tight">{ward.name}</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 text-sm leading-relaxed">
                <div className="space-y-2">
                  <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Recent Highlights</p>
                  <div className="flex flex-wrap gap-2 child:transition-colors">
                    {ward.highlights.slice(0, 2).map((item) => (
                      <span key={item} className="rounded-lg bg-emerald-50 px-3 py-1 text-emerald-700 font-semibold border border-emerald-100 italic">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Needs Attention</p>
                  <div className="flex flex-wrap gap-2">
                    {ward.needs.slice(0, 2).map((item) => (
                      <span key={item} className="rounded-lg bg-amber-50 px-3 py-1 text-amber-700 font-semibold border border-amber-100 italic">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between group-hover:text-blue-600 transition-colors">
                <span className="text-sm font-black uppercase tracking-widest">Enter Ward Hub</span>
                <HiOutlineArrowNarrowRight className="h-6 w-6 transition-transform duration-500 group-hover:translate-x-2" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


