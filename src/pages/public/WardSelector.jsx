import SectionHeader from "../../components/common/SectionHeader";
import { wards } from "../../data/seedData";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";

export default function WardSelector() {
  const { data: fetchedWards } = useFirestoreCollection("wards", {
    fallbackData: wards,
  });
  
  // Use seed data if Firestore returns empty list (not yet seeded)
  const wardEntries = fetchedWards.length > 0 ? fetchedWards : wards;
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Ward Directory"
        title="Choose your ward"
        description="Tap a ward to see video feeds, documents, and accountability stats tailored to that area."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {wardEntries.map((ward) => (
          <article
            key={ward.id}
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-100 transition hover:-translate-y-1 hover:border-blue-200"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.3em] text-blue-600">Ward {ward.id}</p>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {ward.population.toLocaleString()} residents
              </span>
            </div>
            <h2 className="text-xl font-semibold text-slate-900">{ward.name}</h2>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Highlights
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-600">
                {ward.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Needs attention
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-600">
                {ward.needs.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <button className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600">
              View ward hub
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

