"use client";

import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

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

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `session_${crypto.randomUUID()}`;
  }

  return `session_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function useChatWidget() {
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
  const [meetingSaved, setMeetingSaved] = useState(false);
  const [meeting, setMeeting] = useState({ date: "", time: "10:00" });

  function trackEvent(
    eventType:
      | "page_view"
      | "chat_opened"
      | "chat_closed"
      | "contact_saved"
      | "demo_requested"
      | "meeting_booked",
  ) {
    if (!sessionId) return;
    fetch("/api/replay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        eventType,
        pagePath: window.location.pathname,
      }),
    })
      .then((response) => {
        if (!response.ok)
          console.error("Replay event was not recorded", response.status);
      })
      .catch((reason) =>
        console.error("Replay event was not recorded", reason),
      );
  }

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
    if (!sessionId) return;
    trackEvent("page_view");
    // The session id is created once, then this records the current page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

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

  useEffect(() => {
    if (!open || !sessionId) return;
    const refresh = async () => {
      try {
        const response = await fetch(
          `/api/inbox?sessionId=${encodeURIComponent(sessionId)}`,
        );
        if (!response.ok) return;
        const result = (await response.json()) as {
          conversations?: Array<{
            messages: Array<{
              author: "visitor" | "ai" | "agent";
              id: string;
              text: string;
            }>;
          }>;
        };
        const persisted = result.conversations?.[0]?.messages;
        if (!persisted?.length) return;
        setMessages(
          persisted.map((message) => ({
            id: message.id,
            role: message.author === "visitor" ? "visitor" : "assistant",
            content: message.text,
          })),
        );
      } catch {
        // Keep the current messages when background synchronization fails.
      }
    };
    const interval = window.setInterval(refresh, 4000);
    return () => window.clearInterval(interval);
  }, [open, sessionId]);

  async function sendMessage(content: string) {
    if (!content || isTyping || !sessionId) {
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

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, sessionId }),
      });

      if (!response.ok) throw new Error("Chat request failed");

      const result = (await response.json()) as {
        answer?: string | null;
        handledBy?: "human";
      };
      if (result.handledBy === "human") return;
      if (!result.answer) throw new Error("Empty chat response");

      setMessages((current) => [
        ...current,
        {
          id: `assistant_${crypto.randomUUID()}`,
          role: "assistant",
          content: result.answer as string,
        },
      ]);
    } catch {
      setError("Impossible d’obtenir une réponse. Veuillez réessayer.");
    } finally {
      setIsTyping(false);
    }
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
    setContact({ name: "", email: "", company: "" });
    setContactSaved(false);
    setMeetingSaved(false);
    setMeeting({ date: "", time: "10:00" });
    const nextSessionId = createSessionId();
    window.localStorage.removeItem(CONTACT_STORAGE_KEY);
    window.localStorage.setItem(SESSION_STORAGE_KEY, nextSessionId);
    setSessionId(nextSessionId);
  }

  async function saveContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!contact.name.trim() || !/^\S+@\S+\.\S+$/.test(contact.email)) return;
    setError("");
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "contact", sessionId, ...contact }),
      });
      if (!response.ok) throw new Error("Contact persistence failed");
      window.localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(contact));
      setContactSaved(true);
    } catch {
      setError("Coordonnées non enregistrées");
    }
  }

  async function saveMeeting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: contact.company,
          date: meeting.date,
          duration: 30,
          email: contact.email,
          notes: "Demonstration requested from the Leadia chatbot.",
          owner: "Yosra",
          prospect: contact.name,
          sessionId,
          source: "AI Widget",
          time: meeting.time,
          title: "Product demonstration",
        }),
      });
      if (!response.ok) throw new Error("Meeting persistence failed");
      setMeetingSaved(true);
    } catch {
      setError("Rendez-vous non enregistré");
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();
    formRef.current?.requestSubmit();
  }

  return {
    contact,
    contactSaved,
    draft,
    error,
    formRef,
    handleKeyDown,
    handleSubmit,
    inputRef,
    isTyping,
    lastSent,
    meeting,
    meetingSaved,
    messages,
    messagesEndRef,
    open,
    resetConversation,
    saveContact,
    saveMeeting,
    sendMessage,
    sessionId,
    setContact,
    setDraft,
    setMeeting,
    setOpen,
    trackEvent,
  };
}
