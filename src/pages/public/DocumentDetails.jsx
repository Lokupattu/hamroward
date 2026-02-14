import SectionHeader from "../../components/common/SectionHeader";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { documents } from "../../data/seedData";
import { useFirestoreDocument } from "../../hooks/useFirestoreCollection";

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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!documentData) {
    return (
      <div className="rounded-3xl border border-rose-100 bg-rose-50 p-8">
        <p className="text-sm font-semibold text-rose-600">Document not found.</p>
        <p className="mt-2 text-sm text-rose-500">
          Please go back to the documents list and pick an available service guide.
        </p>
        <button
          className="mt-6 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
          onClick={() => navigate("/documents")}
        >
          Back to list
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Document Guide"
        title={documentData.title}
        description="Updated by ward officials for accuracy."
      />

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Processing</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {documentData.processingTime}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Fee</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{documentData.fee}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Office & Contact
          </p>
          <p className="mt-2 font-semibold text-slate-900">{documentData.office}</p>
          <p className="text-sm text-slate-500">{documentData.contact}</p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Requirements</p>
          <ul className="mt-4 list-disc space-y-2 pl-4 text-sm text-slate-600">
            {documentData.requirements.map((req) => (
              <li key={req}>{req}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Workflow</p>
          <ol className="mt-4 list-decimal space-y-2 pl-4 text-sm text-slate-600">
            {documentData.workflow.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">FAQs</p>
        <div className="mt-4 space-y-4">
          {documentData.faqs.map((faq, index) => (
            <div key={index} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">{faq.q}</p>
              <p className="mt-2 text-sm text-slate-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

