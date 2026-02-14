import SectionHeader from "../../components/common/SectionHeader";
import { NavLink } from "react-router-dom";
import { documents } from "../../data/seedData";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";

export default function DocumentsList() {
  const { data: fetchedDocs } = useFirestoreCollection("documents", {
    fallbackData: documents,
  });

  // Use seed data if Firestore returns empty list (not yet seeded)
  const documentEntries = fetchedDocs.length > 0 ? fetchedDocs : documents;

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Ward Services"
        title="Documents Knowledge Base"
        description="Requirements, processing timelines, and verified contact points for each ward service."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {documentEntries.map((doc) => (
          <article key={doc.id} className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
              {doc.id.replace("-", " ")}
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">{doc.title}</h2>
            <p className="mt-2 text-sm text-slate-500">
              {doc.requirements?.length || 0} requirements • {doc.processingTime}
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-semibold">Fee:</span> {doc.fee}
              </p>
              <p>
                <span className="font-semibold">Office:</span> {doc.office}
              </p>
            </div>
            <NavLink
              to={`/documents/${doc.id}`}
              className="mt-6 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-500"
            >
              View details →
            </NavLink>
          </article>
        ))}
      </div>
    </div>
  );
}
