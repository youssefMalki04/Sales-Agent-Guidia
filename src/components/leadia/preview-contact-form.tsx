"use client";
import { useRef, useState, type FormEvent } from "react";

export type Contact = { name: string | null; email: string | null; company: string | null };
export function PreviewContactForm({ leadId, contact, onSaved, onCancel }: { leadId: string; contact: Contact; onSaved: (contact: Contact) => void; onCancel: () => void }) {
  const [name, setName] = useState(contact.name ?? "");
  const [email, setEmail] = useState(contact.email ?? "");
  const [company, setCompany] = useState(contact.company ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  async function save(event: FormEvent) {
    event.preventDefault();
    if (lock.current || !name.trim()) return;
    lock.current = true; setSaving(true); setError("");
    try {
      const response = await fetch("/api/leads/contact", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: leadId, name: name.trim(), email: email.trim(), company: company.trim() }) });
      const payload = await response.json() as { lead?: Contact & { id: string } };
      if (!response.ok || payload.lead?.id !== leadId) throw new Error("Save failed");
      onSaved(payload.lead);
    } catch { setError("L’enregistrement n’a pas pu être confirmé. Vérifiez la connexion et réessayez."); }
    finally { lock.current = false; setSaving(false); }
  }
  return <form onSubmit={save} className="space-y-3">
    <fieldset disabled={saving} className="space-y-3">
      {([{ label: "Nom", value: name, set: setName, type: "text", required: true }, { label: "E-mail", value: email, set: setEmail, type: "email", required: false }, { label: "Entreprise", value: company, set: setCompany, type: "text", required: false }]).map((field) => <label key={field.label} className="block text-xs font-medium text-slate-600">{field.label}<input type={field.type} required={field.required} maxLength={500} value={field.value} onChange={(event) => field.set(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-indigo-500" /></label>)}
      <div className="flex gap-2"><button type="submit" disabled={!name.trim()} className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white disabled:opacity-50">{saving ? "Enregistrement…" : "Enregistrer"}</button><button type="button" onClick={onCancel} className="rounded-lg px-3 py-2 text-xs text-slate-600">Annuler</button></div>
    </fieldset>
    {error ? <p role="alert" className="text-xs text-red-600">{error}</p> : null}
  </form>;
}
