"use client";

import { useRef, useState } from "react";
import { useUnsavedChanges } from "./use-unsaved-changes";
import {
  CheckCircle2,
  Languages,
  LoaderCircle,
  Mail,
  Send,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MeetingReportSource } from "./meeting-report-source";

type LeadEmailActionProps = {
  initialReport?: string;
  initiallyOpen?: boolean;
  triggerLabel?: string;
  compact?: boolean;
  company?: string;
  email?: string;
  initialLanguage?: EmailLanguage;
  leadId: string;
  meetingId?: string;
  onDeliveryAttempt?: () => void;
  name?: string;
  need?: string;
  meetingContext?: { title: string; date: string };
};

type EmailLanguage = "ar" | "en" | "fr";

function createDraft(
  language: EmailLanguage,
  name?: string,
  company?: string,
  need?: string,
  meetingContext?: { title: string; date: string },
) {
  const firstName = name?.trim().split(/\s+/)[0];
  if (meetingContext) {
    const context = `${meetingContext.title} (${meetingContext.date})`;
    if (language === "ar") return {
      subject: "متابعة اجتماعنا",
      message: `مرحبًا ${firstName || ""}،\n\nشكرًا على وقتك خلال اجتماعنا: ${context}.\n\nما الخطوة التالية الأنسب لك؟\n\nمع تحيات،\nفريق Leadia`,
    };
    if (language === "en") return {
      subject: "Following up on our meeting",
      message: `Hello ${firstName || "there"},\n\nThank you for your time during our meeting: ${context}.\n\nWhat would be the best next step for you?\n\nBest regards,\nThe Leadia team`,
    };
    return {
      subject: "Suite à notre rendez-vous",
      message: `Bonjour${firstName ? ` ${firstName}` : ""},\n\nMerci pour votre temps lors de notre rendez-vous : ${context}.\n\nQuelle serait la prochaine étape la plus adaptée pour vous ?\n\nBien cordialement,\nL’équipe Leadia`,
    };
  }
  if (language === "ar") {
    return {
      subject: `متابعة${company ? ` — ${company}` : ""}`,
      message: `مرحبًا ${firstName ?? "بك"}،\n\nشكرًا لاهتمامك بمنصة Leadia.${need ? ` لقد فهمنا أن أولويتك هي: ${need}.` : ""}\n\nهل يناسبك إجراء مكالمة قصيرة لمناقشة الخطوة التالية؟\n\nمع تحيات،\nفريق Leadia`,
    };
  }
  if (language === "fr") {
    return {
      subject: `Suite à votre demande${company ? ` — ${company}` : ""}`,
      message: `Bonjour${firstName ? ` ${firstName}` : ""},\n\nMerci pour votre intérêt pour Leadia.${need ? ` Nous avons compris que votre priorité est : ${need}.` : ""}\n\nSeriez-vous disponible pour un court échange afin de discuter de la prochaine étape ?\n\nBien cordialement,\nL’équipe Leadia`,
    };
  }
  return {
    subject: `Following up${company ? ` — ${company}` : ""}`,
    message: `Hello ${firstName ?? "there"},\n\nThank you for your interest in Leadia.${need ? ` We understand that your priority is: ${need}.` : ""}\n\nWould you be available for a short call to discuss the best next step?\n\nBest regards,\nThe Leadia team`,
  };
}

export function LeadEmailAction({
  initialReport = "",
  initiallyOpen = false,
  triggerLabel = "Email lead",
  compact = false,
  company,
  email,
  initialLanguage = "fr",
  leadId,
  meetingId,
  onDeliveryAttempt,
  name,
  need,
  meetingContext,
}: LeadEmailActionProps) {
  const initialDraft = createDraft(initialLanguage, name, company, need, meetingContext);
  const [open, setOpen] = useState(initiallyOpen);
  const [language, setLanguage] = useState<EmailLanguage>(initialLanguage);
  const [subject, setSubject] = useState(initialDraft.subject);
  const [message, setMessage] = useState(initialDraft.message);
  const [sending, setSending] = useState(false);
  const sendLock = useRef(false);
  const [generating, setGenerating] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [report, setReport] = useState(initialReport);
  const [sentDraft, setSentDraft] = useState("");
  const draftKey = JSON.stringify([subject, message, report]);
  const canClose = useUnsavedChanges(open && draftKey !== sentDraft && (subject !== initialDraft.subject || message !== initialDraft.message || report !== initialReport), open && (sending || generating));
  function changeOpen(next: boolean) { if (next || canClose()) setOpen(next); }
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(
    null,
  );

  function changeLanguage(nextLanguage: EmailLanguage) {
    if (generating || sending) return;
    if (nextLanguage === language) return;
    if (meetingContext && !window.confirm("Changer de langue remplace le brouillon actuel. Continuer ?")) return;
    setNotice(null);
    if (aiGenerated) {
      void generateWithAi(nextLanguage);
      return;
    }
    setLanguage(nextLanguage);
    const draft = createDraft(nextLanguage, name, company, need, meetingContext);
    setSubject(draft.subject);
    setMessage(draft.message);
  }

  async function generateWithAi(targetLanguage: EmailLanguage = language) {
    if (generating || sending) return;
    if (meetingId && !report.trim()) {
      setNotice({ ok: false, text: "Choisissez ou saisissez un compte rendu avant de générer." });
      return;
    }
    setGenerating(true);
    setNotice(null);
    try {
      const response = await fetch("/api/leads/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: targetLanguage, leadId, ...(meetingId ? { meetingId, report } : {}) }),
      });
      const payload = (await response.json()) as {
        error?: string;
        message?: string;
        subject?: string;
      };
      if (!response.ok || !payload.subject || !payload.message) {
        setNotice({
          ok: false,
          text: payload.error ?? "Unable to generate the email",
        });
        return;
      }
      setSubject(payload.subject);
      setMessage(payload.message);
      setLanguage(targetLanguage);
      setAiGenerated(true);
      setNotice({
        ok: true,
        text: "AI draft ready — review it before sending.",
      });
    } catch {
      setNotice({ ok: false, text: "Unable to reach the AI service" });
    } finally {
      setGenerating(false);
    }
  }

  async function sendEmail() {
    if (sendLock.current || generating) return;
    sendLock.current = true;
    setSending(true);
    setNotice(null);
    try {
      const sendRequest = (confirmedPreviousEmailId?: string) => fetch("/api/leads/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, meetingId, message, subject, expectedEmail: email, confirmedPreviousEmailId }),
      });
      type DeliveryResponse = {
        error?: string;
        message?: string;
        code?: string;
        previousEmail?: { id: string; sentAt: string };
      };
      let response = await sendRequest();
      let payload = await response.json() as DeliveryResponse;
      if (response.status === 409 && payload.code === "PREVIOUS_EMAIL_CONFIRMATION_REQUIRED" && payload.previousEmail) {
        const date = new Date(payload.previousEmail.sentAt);
        const dateLabel = Number.isNaN(date.getTime()) ? "à une date inconnue" : `le ${date.toLocaleString("fr-FR")}`;
        if (!window.confirm(`Un e-mail a déjà été envoyé pour ce rendez-vous ${dateLabel}.\n\nVoulez-vous envoyer ce nouvel e-mail à ${email} ?`)) {
          setNotice({ ok: true, text: "Envoi annulé. Votre brouillon est conservé." });
          return;
        }
        response = await sendRequest(payload.previousEmail.id);
        payload = await response.json() as DeliveryResponse;
      }
      if (response.ok) setSentDraft(draftKey);
      setNotice({
        ok: response.ok,
        text: response.ok
          ? (payload.message ?? "Email sent")
          : (payload.error ?? "Unable to send email"),
      });
    } catch {
      setNotice({ ok: false, text: "L’envoi n’a pas pu être confirmé. Vérifiez l’historique avant de réessayer." });
    } finally {
      setSending(false);
      sendLock.current = false;
      onDeliveryAttempt?.();
    }
  }

  return (
    <>
      <Button
        className={compact ? "rounded-lg" : "rounded-xl bg-white"}
        variant="outline"
        size={compact ? "icon-sm" : "default"}
        aria-label={triggerLabel}
        disabled={!email}
        onClick={() => setOpen(true)}
      >
        <Mail className="size-4" /> {compact ? null : triggerLabel}
      </Button>
      <Dialog open={open} onOpenChange={changeOpen}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] gap-0 overflow-y-auto rounded-[22px] border-[#e3e5f2] p-0 shadow-2xl sm:max-w-[590px]">
          <DialogHeader className="border-b border-[#e7e8f2] bg-gradient-to-br from-[#f1f2ff] via-[#f8f8ff] to-white px-6 py-4">
            <div className="flex items-center gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#5b63dc] text-white shadow-[0_8px_20px_rgba(91,99,220,.25)]">
                <Mail className="size-5" />
              </span>
              <div>
                <DialogTitle className="text-xl font-bold tracking-[-.02em]">
                  Send a follow-up
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Review and personalize the message before sending.
                </DialogDescription>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#dfe1f0] bg-white/80 px-4 py-2.5 text-sm">
              <span className="text-[#858895]">To</span>
              <span className="font-semibold text-[#30313a]">
                {name || "Lead"}
              </span>
              <span className="min-w-0 truncate text-[#777a89]">
                &lt;{email ?? "No email"}&gt;
              </span>
            </div>
          </DialogHeader>
          <div className="space-y-3.5 px-6 py-4">
            {meetingId && <MeetingReportSource leadId={leadId} meetingId={meetingId} value={report} onChange={setReport} disabled={generating || sending} />}
            <div>
              <div className="mb-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#3d3e48]">
                  <Languages className="size-4 text-[#6068df]" /> Message
                  language
                </div>
                {(!meetingContext || meetingId) && <button
                  type="button"
                  disabled={generating || sending || Boolean(meetingId && !report.trim())}
                  onClick={() => {
                    if (meetingId && !window.confirm("Générer un nouveau brouillon remplacera le texte de l’e-mail. Continuer ?")) return;
                    void generateWithAi();
                  }}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#edeefe] px-3 text-xs font-bold text-[#555ed8] transition hover:bg-[#e3e5ff] disabled:opacity-60"
                >
                  {generating ? (
                    <LoaderCircle className="size-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="size-3.5" />
                  )}
                  {generating ? "Génération…" : meetingId ? "Générer depuis le compte rendu" : "Generate with AI"}
                </button>}
              </div>
              <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#f3f4f8] p-1.5">
                {(
                  [
                    ["fr", "Français"],
                    ["en", "English"],
                    ["ar", "العربية"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    disabled={generating || sending}
                    onClick={() => changeLanguage(value)}
                    className={`h-10 rounded-lg text-sm font-semibold transition ${language === value ? "bg-white text-[#535bd2] shadow-sm ring-1 ring-black/5" : "text-[#777985] hover:text-[#454752]"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <label className="block space-y-2 text-sm font-semibold text-[#3d3e48]">
              Email subject
              <Input
                className="h-11 rounded-xl border-[#dfe1e8] bg-[#fcfcfd] px-4 font-normal shadow-none focus-visible:border-[#7379e5] focus-visible:ring-[#7379e5]/15"
                value={subject}
                disabled={generating || sending}
                onChange={(event) => setSubject(event.target.value)}
              />
            </label>
            <label className="block space-y-2 text-sm font-semibold text-[#3d3e48]">
              Email message
              <Textarea
                className="min-h-40 resize-y rounded-xl border-[#dfe1e8] bg-[#fcfcfd] p-4 font-normal leading-7 shadow-none focus-visible:border-[#7379e5] focus-visible:ring-[#7379e5]/15"
                dir={language === "ar" ? "rtl" : "ltr"}
                value={message}
                disabled={generating || sending}
                onChange={(event) => setMessage(event.target.value)}
              />
            </label>
            <p className="text-right text-xs text-[#999ba6]">
              {message.length} characters
            </p>
            {notice ? (
              <div
                className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${notice.ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-600"}`}
              >
                {notice.ok ? <CheckCircle2 className="size-4" /> : null}
                {notice.text}
              </div>
            ) : null}
          </div>
          <DialogFooter className="sticky bottom-0 mx-0 mb-0 rounded-none border-[#e7e8f2] bg-[#fafafd] px-6 py-3.5">
            <Button
              className="rounded-xl"
              variant="ghost"
              onClick={() => changeOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="rounded-xl bg-[#5962dc] px-6 shadow-[0_6px_16px_rgba(89,98,220,.22)] hover:bg-[#4d56cf]"
              disabled={
                sending || generating || !subject.trim() || !message.trim()
              }
              onClick={sendEmail}
            >
              <Send className="size-4" /> {sending ? "Sending…" : "Send email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
