"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { MessageCircle, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "./types";

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "Bonjour, je suis l'agent Leadia. Comment puis-je vous aider ?",
  },
];

const SESSION_STORAGE_KEY = "leadia_session_id";

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `session_${crypto.randomUUID()}`;
  }

  return `session_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

type ChatWidgetProps = {
  embedded?: boolean;
  agentSlug?: string;
};

export function ChatWidget({
  embedded = false,
  agentSlug = "leadia-sales-agent",
}: ChatWidgetProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    const storedSessionId = window.localStorage.getItem(SESSION_STORAGE_KEY);

    if (storedSessionId) {
      return storedSessionId;
    }

    const nextSessionId = createSessionId();

    window.localStorage.setItem(SESSION_STORAGE_KEY, nextSessionId);
    return nextSessionId;
  });
  useEffect(() => {
  if (!embedded || typeof window === "undefined") {
    return;
  }

  window.parent.postMessage(
    { source: "leadia-widget", type: "resize", open },
    "*",
  );
}, [open, embedded]);
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

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = draft.trim();

    if (!content || isTyping) {
      return;
    }

    const visitorMessage: ChatMessage = {
      id: `visitor_${Date.now()}`,
      role: "visitor",
      content,
    };

    setMessages((current) => [...current, visitorMessage]);
    setDraft("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
          sessionId,
          message: content,
          agentSlug,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();

      setMessages((current) => [
        ...current,
        {
          id: `assistant_${Date.now()}`,
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      console.error("[ChatWidget] Failed to send message:", error);
      setMessages((current) => [
        ...current,
        {
          id: `assistant_error_${Date.now()}`,
          role: "assistant",
          content:
            "Désolé, une erreur est survenue. Merci de réessayer dans un instant.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();
    formRef.current?.requestSubmit();
  }

  return (
        <div
      className={
        embedded
          ? "flex h-full w-full flex-col items-end justify-end gap-3"
          : "fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3"
      }
    >
      {open ? (
        <section className="flex h-[min(620px,calc(100vh-40px))] w-[min(390px,calc(100vw-40px))] flex-col overflow-hidden rounded-lg border border-[#dedee3] bg-white shadow-[0_24px_70px_rgba(18,18,23,0.18)]">
          <header className="flex h-14 items-center justify-between border-b border-[#ededf0] px-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#202026]">
                Leadia assistant
              </p>
              <p className="text-xs font-medium text-[#7b7b85]">
                {sessionId ? "Session active" : "Initialisation"}
              </p>
            </div>
            <button
              type="button"
              aria-label="Fermer le chat"
              onClick={() => setOpen(false)}
              className="flex size-8 items-center justify-center rounded-md text-[#777780] hover:bg-[#f5f5f6] hover:text-[#202026]"
            >
              <X className="size-4" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#fbfbfc] px-4 py-4">
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
                    "max-w-[82%] rounded-lg px-3 py-2 text-sm leading-6",
                    message.role === "visitor"
                      ? "bg-[#171717] text-white"
                      : "border border-[#e7e7ea] bg-white text-[#2b2b31]",
                  )}
                >
                  {message.content}
                </p>
              </div>
            ))}

            {isTyping ? (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-lg border border-[#e7e7ea] bg-white px-3 py-3">
                  <span className="size-1.5 rounded-full bg-[#8c8c96]" />
                  <span className="size-1.5 rounded-full bg-[#8c8c96]" />
                  <span className="size-1.5 rounded-full bg-[#8c8c96]" />
                </div>
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex items-end gap-2 border-t border-[#ededf0] bg-white p-3"
          >
            <textarea
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écrire un message..."
              rows={1}
              disabled={isTyping}
              className="max-h-28 min-h-10 flex-1 resize-none rounded-md border border-[#dedee3] bg-white px-3 py-2 text-sm leading-6 outline-none transition focus:border-[#8b8b94] focus:ring-2 focus:ring-[#171717]/10"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!draft.trim() || isTyping}
              aria-label="Envoyer"
              className="size-10 shrink-0 rounded-md bg-[#171717] text-white hover:bg-[#2a2a2f]"
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
        className="flex size-14 items-center justify-center rounded-full bg-[#171717] text-white shadow-[0_18px_45px_rgba(18,18,23,0.22)] transition hover:bg-[#2a2a2f]"
      >
        <MessageCircle className="size-6" />
      </button>
    </div>
  );
}
