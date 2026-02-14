import { sponsorSpots } from "../../data/seedData";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import SectionHeader from "../../components/common/SectionHeader";

export default function SponsorsPage() {
  const { data: fetchedSponsors, loading } = useFirestoreCollection("sponsors", {
    fallbackData: sponsorSpots,
  });

  const sponsors = fetchedSponsors.length > 0 ? fetchedSponsors : sponsorSpots;

  // Sort by priority: top > middle > footer
  const priorityOrder = ["top", "middle", "footer"];
  const sortedSponsors = [...sponsors].sort(
    (a, b) => priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
  );

  return (
    <div className="space-y-12">
      <SectionHeader
        eyebrow="Our Partners"
        title="Sponsors & Supporters"
        description="We are grateful for the support of these organizations that help make HamroWard possible."
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sortedSponsors.map((sponsor) => (
            <a
              key={sponsor.id}
              href={sponsor.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
                {sponsor.imageURL ? (
                  <img
                    src={sponsor.imageURL}
                    alt={sponsor.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                    <span className="text-4xl font-bold opacity-20">
                      {sponsor.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] uppercase tracking-wide text-blue-600">
                    {sponsor.priority} Sponsor
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600">
                  {sponsor.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {sponsor.startDate} — {sponsor.endDate}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}

      {sortedSponsors.length === 0 && !loading && (
        <div className="text-center py-12 text-slate-500">
          <p>No sponsors found at the moment.</p>
        </div>
      )}
    </div>
  );
}
