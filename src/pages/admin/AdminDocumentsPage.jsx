import { useState } from "react";
import SectionHeader from "../../components/common/SectionHeader";
import { documents } from "../../data/seedData";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { updateDocument } from "../../services/documentService";

export default function AdminDocumentsPage() {
  const { data: fetchedDocs } = useFirestoreCollection("documents", { fallbackData: documents });
  
  // Use seed data if Firestore returns empty list (not yet seeded)
  const documentEntries = fetchedDocs.length > 0 ? fetchedDocs : documents;
  
  const [editingDocId, setEditingDocId] = useState(null);
  const [formState, setFormState] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const startEditing = (docEntry) => {
    setEditingDocId(docEntry.id);
    setFeedback(null);
    setFormState({
      fee: docEntry.fee ?? "",
      processingTime: docEntry.processingTime ?? "",
      office: docEntry.office ?? "",
      contact: docEntry.contact ?? "",
      requirements: Array.isArray(docEntry.requirements) ? docEntry.requirements.join("\n") : "",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!editingDocId || !formState) return;
    setFeedback(null);
    try {
      await updateDocument(editingDocId, {
        fee: formState.fee,
        processingTime: formState.processingTime,
        office: formState.office,
        contact: formState.contact,
        requirements: formState.requirements
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      });
      setFeedback("Document updated");
      setEditingDocId(null);
      setFormState(null);
    } catch (error) {
      console.error("Document update failed", error);
      setFeedback("Failed to update document. Try again.");
    }
  };
  return (
    <div className="space-y-8 text-slate-50">
      <SectionHeader
        eyebrow="Documents"
        title="Edit service info"
        description="Update requirements, fees, and processing timelines without code changes."
        theme="dark"
      />

      {feedback ? (
        <p className="rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
          {feedback}
        </p>
      ) : null}

      <div className="space-y-4">
        {documentEntries.map((doc) => {
          const isEditing = editingDocId === doc.id;
          return (
            <article key={doc.id} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{doc.id}</p>
                  <h2 className="text-xl font-semibold text-white">{doc.title}</h2>
                  <p className="text-sm text-slate-400">
                    {doc.requirements?.length || 0} requirements • {doc.processingTime}
                  </p>
                </div>
                <button
                  className="rounded-full border border-blue-500/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-200 hover:bg-blue-500/10"
                  onClick={() => startEditing(doc)}
                >
                  {isEditing ? "Editing…" : "Edit"}
                </button>
              </div>

              {isEditing && formState ? (
                <form className="grid gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4 md:grid-cols-2" onSubmit={handleSave}>
                  <label className="text-sm font-medium text-slate-200">
                    Fee
                    <input
                      type="text"
                      name="fee"
                      value={formState.fee}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-white"
                    />
                  </label>
                  <label className="text-sm font-medium text-slate-200">
                    Processing time
                    <input
                      type="text"
                      name="processingTime"
                      value={formState.processingTime}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-white"
                    />
                  </label>
                  <label className="text-sm font-medium text-slate-200">
                    Office
                    <input
                      type="text"
                      name="office"
                      value={formState.office}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-white"
                    />
                  </label>
                  <label className="text-sm font-medium text-slate-200">
                    Contact
                    <input
                      type="text"
                      name="contact"
                      value={formState.contact}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-white"
                    />
                  </label>
                  <label className="text-sm font-medium text-slate-200 md:col-span-2">
                    Requirements (one per line)
                    <textarea
                      name="requirements"
                      rows={4}
                      value={formState.requirements}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-white"
                    />
                  </label>
                  <div className="md:col-span-2 flex gap-3">
                    <button
                      type="submit"
                      className="rounded-full border border-emerald-500/50 px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200 hover:bg-emerald-500/10"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-slate-700 px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300 hover:bg-slate-800/60"
                      onClick={() => {
                        setEditingDocId(null);
                        setFormState(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}

