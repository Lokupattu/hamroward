import { useParams, Link } from "react-router-dom";
import { wards } from "../../data/seedData";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { 
  HiOutlineUser, 
  HiOutlinePhone, 
  HiOutlineMail, 
  HiOutlineLocationMarker,
  HiOutlineChevronLeft,
  HiOutlineLibrary,
  HiOutlineExclamationCircle 
} from "react-icons/hi";

export default function WardDetails() {
  const { id } = useParams();
  const { data: fetchedWards } = useFirestoreCollection("wards", {
    fallbackData: wards,
  });

  const wardEntries = fetchedWards.length > 0 ? fetchedWards : wards;
  const ward = wardEntries.find((w) => w.id === parseInt(id));

  if (!ward) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 font-serif">Ward not found</h2>
        <Link 
          to="/wards" 
          className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          <HiOutlineChevronLeft className="mr-1 h-5 w-5" />
          Back to Ward Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-12 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <header className="space-y-6">
        <Link 
          to="/wards" 
          className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <HiOutlineChevronLeft className="mr-1 h-4 w-4" />
          BACK TO DIRECTORY
        </Link>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-2">
            <p className="text-sm font-bold tracking-[0.4em] text-blue-600 uppercase">
              Hub • Ward {ward.id}
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 font-serif tracking-tight">
              {ward.name}
            </h1>
          </div>
          <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-2xl shadow-sm border border-blue-100">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <span className="text-sm font-bold text-blue-900">
              {ward.population.toLocaleString()} Residents
            </span>
          </div>
        </div>
      </header>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Main Info Column */}
        <div className="md:col-span-2 space-y-8">
          {/* Highlights & Needs Section */}
          <div className="grid gap-6 sm:grid-cols-2">
            <section className="bg-emerald-50/50 rounded-3xl p-8 border border-emerald-100/50 shadow-sm transition-all hover:shadow-md hover:scale-[1.01]">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-emerald-100 p-2 rounded-xl">
                  <HiOutlineLibrary className="h-6 w-6 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 font-serif">Ward Highlights</h2>
              </div>
              <ul className="space-y-3">
                {ward.highlights.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3 text-slate-700">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-amber-50/50 rounded-3xl p-8 border border-amber-100/50 shadow-sm transition-all hover:shadow-md hover:scale-[1.01]">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-amber-100 p-2 rounded-xl">
                  <HiOutlineExclamationCircle className="h-6 w-6 text-amber-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 font-serif">Needs Attention</h2>
              </div>
              <ul className="space-y-3">
                {ward.needs.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3 text-slate-700">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Activity Placeholder */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-100/50">
             <h2 className="text-2xl font-bold text-slate-900 font-serif mb-6">Recent Ward Activity</h2>
             <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                <p className="font-medium italic">Content curation in progress for Ward {ward.id}...</p>
             </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-200 group overflow-hidden relative">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            
            <h2 className="text-2xl font-bold mb-8 relative">Ward Leadership</h2>
            
            <div className="space-y-6 relative">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
                  <HiOutlineUser className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-100">Ward Chairman</p>
                  <p className="text-lg font-bold leading-tight">{ward.chairman}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
                  <HiOutlinePhone className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-100">Contact Number</p>
                  <p className="text-lg font-bold leading-tight">{ward.phone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
                  <HiOutlineMail className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-100">Official Email</p>
                  <p className="text-md font-bold leading-tight truncate">{ward.email}</p>
                </div>
              </div>
            </div>

            <button className="mt-8 w-full bg-white text-blue-600 font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2">
              <span>Contact Office</span>
            </button>
          </section>

          <section className="bg-slate-900 rounded-3xl p-8 text-white">
            <div className="flex items-center space-x-3 mb-6">
               <HiOutlineLocationMarker className="h-6 w-6 text-blue-400" />
               <h3 className="text-xl font-bold font-serif">Ward Office</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
              Located at the heart of {ward.name}, providing essential municipal services and support to all residents.
            </p>
            <div className="aspect-video w-full bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center">
               <span className="text-slate-500 text-xs font-bold tracking-widest uppercase">Map Loading...</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
