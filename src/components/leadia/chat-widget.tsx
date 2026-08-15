"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  MessageCircle,
  RotateCcw,
  Send,
  UserRound,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "assistant" | "visitor";
  content: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "Bonjour, je suis l'agent Leadia. Comment puis-je vous aider ?",
  },
];

const SESSION_STORAGE_KEY = "leadia_session_id";
const CONTACT_STORAGE_KEY = "leadia_visitor_contact";
const suggestions = [
  "Que fait votre solution ?",
  "Quels sont vos tarifs ?",
  "Je souhaite une démonstration",
];

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `session_${crypto.randomUUID()}`;
  }

  return `session_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function ChatWidget() {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [error, setError] = useState("");
  const [lastSent, setLastSent] = useState("");
  const [contact, setContact] = useState({ name: "", email: "", company: "" });
  const [contactSaved, setContactSaved] = useState(false);

  useEffect(() => {
    const initialize = window.setTimeout(() => {
      const storedSessionId = window.localStorage.getItem(SESSION_STORAGE_KEY);
      const nextSessionId = storedSessionId || createSessionId();
      window.localStorage.setItem(SESSION_STORAGE_KEY, nextSessionId);
      setSessionId(nextSessionId);
      try {
        const savedContact = window.localStorage.getItem(CONTACT_STORAGE_KEY);
        if (savedContact) {
          setContact(JSON.parse(savedContact));
          setContactSaved(true);
        }
      } catch {
        window.localStorage.removeItem(CONTACT_STORAGE_KEY);
      }
    }, 0);
    return () => window.clearTimeout(initialize);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, open]);

  function sendMessage(content: string) {
    if (!content || isTyping) {
      return;
    }

    const visitorMessage: ChatMessage = {
      id: `visitor_${crypto.randomUUID()}`,
      role: "visitor",
      content,
    };

    setMessages((current) => [...current, visitorMessage]);
    setDraft("");
    setLastSent(content);
    setError("");
    setIsTyping(true);

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `assistant_${crypto.randomUUID()}`,
          role: "assistant",
          content:
            "Merci. Je vais vérifier les informations disponibles et vous poser une question pour qualifier votre besoin.",
        },
      ]);
      setIsTyping(false);
    }, 900);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(draft.trim());
  }

  function resetConversation() {
    setMessages(initialMessages);
    setDraft("");
    setError("");
    setLastSent("");
    const nextSessionId = createSessionId();
    window.localStorage.setItem(SESSION_STORAGE_KEY, nextSessionId);
    setSessionId(nextSessionId);
  }

  function saveContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!contact.name.trim() || !/^\S+@\S+\.\S+$/.test(contact.email)) return;
    window.localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(contact));
    setContactSaved(true);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();
    formRef.current?.requestSubmit();
  }

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open ? (
        <section className="soft-panel-enter flex h-[min(630px,calc(100vh-40px))] w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-[22px] border border-[#e1e4f8] bg-white shadow-[0_20px_55px_rgba(45,51,91,0.16)]">
          <header className="flex min-h-[70px] items-center justify-between border-b border-[#eceefe] bg-[#fafaff] px-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#5964d6] text-white shadow-[0_6px_16px_rgba(89,100,214,0.22)]">
                <MessageCircle className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-[-0.01em] text-slate-800">
                  Leadia assistant
                </p>
                <p className="mt-1 flex items-center gap-2 text-[11px] font-medium text-slate-500">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  {sessionId ? "Online" : "Initialising…"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Réinitialiser la conversation"
                onClick={resetConversation}
                className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-[#f1f2ff] hover:text-[#5964d6]"
              >
                <RotateCcw className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Fermer le chat"
                onClick={() => setOpen(false)}
                className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-[#f1f2ff] hover:text-[#5964d6]"
              >
                <X className="size-4" />
              </button>
            </div>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto bg-white px-4 py-5 [scrollbar-width:thin]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "visitor" ? "justify-end" : "justify-start",
                )}
              >
                <p
                  className={cn(
                    "max-w-[84%] px-3.5 py-2.5 text-sm leading-6",
                    message.role === "visitor"
                      ? "rounded-2xl rounded-br-md bg-[#5964d6] text-white"
                      : "rounded-2xl rounded-bl-md border border-slate-100 bg-[#f6f7fa] text-slate-700",
                  )}
                >
                  {message.content}
                </p>
              </div>
            ))}

            {messages.length === 1 ? (
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Suggested questions
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      type="button"
                      key={suggestion}
                      onClick={() => sendMessage(suggestion)}
                      className="rounded-xl border border-[#e1e4f8] bg-white px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:border-[#cfd4f4] hover:bg-[#f8f9ff] hover:text-[#5964d6]"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.filter((message) => message.role === "visitor").length >=
              2 && !contactSaved ? (
              <form
                onSubmit={saveContact}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-center gap-2 text-[#5964d6]">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-[#f1f2ff]">
                    <UserRound className="size-4" />
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    Être recontacté
                  </p>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Laissez vos coordonnées pour préparer la suite.
                </p>
                <div className="mt-3 space-y-2">
                  <input
                    value={contact.name}
                    onChange={(event) =>
                      setContact((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Nom *"
                    required
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#5964d6]"
                  />
                  <input
                    value={contact.email}
                    onChange={(event) =>
                      setContact((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    placeholder="Email professionnel *"
                    type="email"
                    required
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#5964d6]"
                  />
                  <input
                    value={contact.company}
                    onChange={(event) =>
                      setContact((current) => ({
                        ...current,
                        company: event.target.value,
                      }))
                    }
                    placeholder="Entreprise"
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#5964d6]"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="h-10 w-full rounded-lg bg-[#5964d6] text-white hover:bg-[#4f5acb]"
                  >
                    Enregistrer
                  </Button>
                </div>
              </form>
            ) : null}

            {contactSaved ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-700">
                Coordonnées enregistrées pour cette démonstration.
              </div>
            ) : null}

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertCircle className="size-4" /> Message non envoyé
                </div>
                <button
                  type="button"
                  onClick={() => sendMessage(lastSent)}
                  className="mt-2 text-xs font-bold underline"
                >
                  Réessayer
                </button>
              </div>
            ) : null}

            {isTyping ? (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-slate-100 px-3.5 py-3">
                  <span className="size-1.5 animate-bounce rounded-full bg-[#5964d6] [animation-delay:-.2s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-[#5964d6] [animation-delay:-.1s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-[#5964d6]" />
                </div>
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex items-end gap-2 border-t border-[#eceefe] bg-[#fafaff] p-3.5"
          >
            <textarea
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écrire un message..."
              rows={1}
              disabled={isTyping}
              className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm leading-6 shadow-sm outline-none transition focus:border-[#5964d6] focus:ring-2 focus:ring-[#5964d6]/10"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!draft.trim() || isTyping}
              aria-label="Envoyer"
              className="size-11 shrink-0 rounded-xl bg-[#5964d6] text-white shadow-[0_6px_14px_rgba(89,100,214,0.22)] hover:bg-[#4f5acb]"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        aria-label="Ouvrir le chat"
        onClick={() => setOpen((current) => !current)}
        className="group relative flex size-14 items-center justify-center rounded-2xl bg-[#5964d6] text-white shadow-[0_14px_32px_rgba(89,100,214,0.3)] transition hover:-translate-y-0.5 hover:bg-[#4f5acb]"
      >
        <span className="absolute right-0.5 top-0.5 size-2.5 rounded-full border-2 border-white bg-emerald-500" />
        {open ? (
          <X className="size-6" />
        ) : (
          <MessageCircle className="size-6 transition group-hover:scale-105" />
        )}
      </button>
    </div>
  );
}
