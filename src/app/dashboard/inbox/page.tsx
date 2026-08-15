"use client";

import {
  Bot,
  Check,
  CheckCircle2,
  Clock3,
  Flame,
  Mail,
  MessageSquareText,
  MoreHorizontal,
  Search,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Mode = "ai" | "human" | "waiting" | "resolved";
type Filter = "all" | Mode;
type Message = {
  id: string;
  author: "visitor" | "ai" | "agent";
  text: string;
  time: string;
};
type InboxConversation = {
  id: string;
  visitor: string;
  company: string;
  email: string;
  mode: Mode;
  score: number;
  temperature: "hot" | "warm" | "cold";
  owner: string | null;
  unread: number;
  lastActivity: string;
  need: string;
  messages: Message[];
};

const STORAGE_KEY = "leadia-live-inbox-v1";
const initialConversations: InboxConversation[] = [
  {
    id: "chat-1",
    visitor: "Amira Ben Salah",
    company: "Nexa Retail",
    email: "amira@nexa.tn",
    mode: "waiting",
    score: 87,
    temperature: "hot",
    owner: null,
    unread: 2,
    lastActivity: "Now",
    need: "Automate lead qualification for 3 websites",
    messages: [
      {
        id: "m1",
        author: "visitor",
        text: "Nous cherchons une solution pour qualifier environ 400 prospects par mois.",
        time: "10:38",
      },
      {
        id: "m2",
        author: "ai",
        text: "Je peux vous aider. Souhaitez-vous connecter les prospects à votre CRM actuel ?",
        time: "10:39",
      },
      {
        id: "m3",
        author: "visitor",
        text: "Oui, nous utilisons HubSpot. Je voudrais parler à quelqu’un pour organiser une démo.",
        time: "10:41",
      },
      {
        id: "m4",
        author: "ai",
        text: "Je transfère votre demande à un membre de notre équipe commerciale.",
        time: "10:42",
      },
    ],
  },
  {
    id: "chat-2",
    visitor: "Thomas Martin",
    company: "Flowdesk",
    email: "thomas@flowdesk.fr",
    mode: "human",
    score: 76,
    temperature: "warm",
    owner: "Yosra",
    unread: 1,
    lastActivity: "3 min",
    need: "Pricing and Salesforce integration",
    messages: [
      {
        id: "m5",
        author: "visitor",
        text: "Le connecteur Salesforce est-il inclus dans le forfait Pro ?",
        time: "10:31",
      },
      {
        id: "m6",
        author: "agent",
        text: "Bonjour Thomas, oui. Je vais vous envoyer le détail des fonctionnalités incluses.",
        time: "10:34",
      },
      {
        id: "m7",
        author: "visitor",
        text: "Merci, pouvez-vous aussi me confirmer le délai d’installation ?",
        time: "10:36",
      },
    ],
  },
  {
    id: "chat-3",
    visitor: "Sara Trabelsi",
    company: "Kite Finance",
    email: "sara@kite.tn",
    mode: "ai",
    score: 64,
    temperature: "warm",
    owner: null,
    unread: 0,
    lastActivity: "8 min",
    need: "Security and data hosting",
    messages: [
      {
        id: "m8",
        author: "visitor",
        text: "Où sont hébergées les données des conversations ?",
        time: "10:25",
      },
      {
        id: "m9",
        author: "ai",
        text: "Les options d’hébergement dépendent du forfait. Je peux vous présenter les choix disponibles.",
        time: "10:26",
      },
    ],
  },
  {
    id: "chat-4",
    visitor: "Hugo Leroy",
    company: "Maison Data",
    email: "hugo@maisondata.fr",
    mode: "resolved",
    score: 55,
    temperature: "cold",
    owner: "Sami",
    unread: 0,
    lastActivity: "1 h",
    need: "Product documentation",
    messages: [
      {
        id: "m10",
        author: "visitor",
        text: "Merci, j’ai trouvé la documentation dont j’avais besoin.",
        time: "09:42",
      },
      {
        id: "m11",
        author: "agent",
        text: "Parfait. N’hésitez pas à revenir vers nous si nécessaire.",
        time: "09:43",
      },
    ],
  },
];

export default function InboxPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState(initialConversations[0].id);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setConversations(JSON.parse(stored) as InboxConversation[]);
      } catch {
        // Keep the demo inbox when local storage is unavailable.
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const visible = useMemo(
    () =>
      conversations.filter((conversation) => {
        const term = query.trim().toLowerCase();
        const matchesFilter = filter === "all" || conversation.mode === filter;
        const matchesQuery =
          !term ||
          [
            conversation.visitor,
            conversation.company,
            conversation.email,
            conversation.need,
          ].some((value) => value.toLowerCase().includes(term));
        return matchesFilter && matchesQuery;
      }),
    [conversations, filter, query],
  );

  const selected =
    conversations.find((conversation) => conversation.id === selectedId) ??
    visible[0] ??
    conversations[0];
  const waitingCount = conversations.filter(
    (conversation) => conversation.mode === "waiting",
  ).length;

  function updateConversation(id: string, update: Partial<InboxConversation>) {
    setConversations((current) => {
      const next = current.map((conversation) =>
        conversation.id === id ? { ...conversation, ...update } : conversation,
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function selectConversation(id: string) {
    setSelectedId(id);
    updateConversation(id, { unread: 0 });
  }

  function sendMessage(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || selected.mode !== "human") return;
    const messages = [
      ...selected.messages,
      {
        id: `message-${Date.now()}`,
        author: "agent" as const,
        text,
        time: new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ];
    updateConversation(selected.id, { messages, lastActivity: "Now" });
    setDraft("");
    window.setTimeout(
      () => endRef.current?.scrollIntoView({ behavior: "smooth" }),
      0,
    );
  }

  return (
    <main className="min-h-[calc(100vh-76px)] bg-white p-3 text-[#171717] sm:p-6 lg:h-[calc(100vh-76px)] lg:min-h-[760px]">
      <div className="soft-page-enter mx-auto flex h-full max-w-[1500px] flex-col">
        <header className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e1e4f8] bg-[#f1f2ff] px-3 py-1.5 text-xs font-semibold text-[#626cd1]">
              <Sparkles className="size-3.5" /> Human handoff
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-slate-950">
              Live inbox
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Join active conversations and help high-intent visitors at the
              right moment.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
            <p className="text-xl font-semibold text-amber-800">
              {waitingCount}
            </p>
            <p className="text-xs font-medium text-amber-700">
              Waiting for a human
            </p>
          </div>
        </header>
        <div className="grid min-h-0 flex-1 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,.055)] lg:grid-cols-[330px_minmax(420px,1fr)_300px]">
          <aside className="flex max-h-[520px] min-h-0 flex-col border-b border-[#e5e5e9] lg:max-h-none lg:border-b-0 lg:border-r">
            <div className="border-b border-[#e9e9ed] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Conversations</h2>
                  <p className="mt-1 text-xs text-[#82828b]">
                    Live customer activity
                  </p>
                </div>
                <button
                  aria-label="Inbox options"
                  className="flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-[#f5f6ff]"
                >
                  <MoreHorizontal className="size-4" />
                </button>
              </div>
              <label className="relative mt-4 block">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#92929b]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search conversations…"
                  className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-[#939ae2] focus:ring-2 focus:ring-[#f1f2ff]"
                />
              </label>
              <div className="mt-3 flex gap-1 overflow-x-auto">
                {(
                  ["all", "waiting", "human", "ai", "resolved"] as Filter[]
                ).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold capitalize transition ${filter === item ? "bg-[#f1f2ff] text-[#5964d6] shadow-sm" : "bg-[#f3f3f5] text-[#6f6f78]"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {visible.map((conversation) => (
                <button
                  type="button"
                  key={conversation.id}
                  onClick={() => selectConversation(conversation.id)}
                  className={`w-full border-b border-slate-100 p-4 text-left transition hover:bg-[#fafaff] ${selected.id === conversation.id ? "border-l-2 border-l-[#5964d6] bg-[#f5f6ff]" : "bg-white"}`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar name={conversation.visitor} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold">
                          {conversation.visitor}
                        </p>
                        <span className="shrink-0 text-[10px] text-[#9999a2]">
                          {conversation.lastActivity}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-xs text-[#777780]">
                        {conversation.company}
                      </p>
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#65656e]">
                        {conversation.messages.at(-1)?.text}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <ModeBadge mode={conversation.mode} />
                        {conversation.unread ? (
                          <span className="flex size-5 items-center justify-center rounded-full bg-[#5964d6] text-[10px] font-bold text-white">
                            {conversation.unread}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              {!visible.length ? (
                <p className="p-8 text-center text-sm text-[#85858e]">
                  No conversation matches these filters.
                </p>
              ) : null}
            </div>
          </aside>

          <section className="flex min-h-[650px] flex-col border-b border-[#e5e5e9] lg:min-h-0 lg:border-b-0 lg:border-r">
            <header className="flex min-h-20 flex-wrap items-center justify-between gap-3 border-b border-[#e7e7eb] px-5 py-3">
              <div className="flex items-center gap-3">
                <Avatar name={selected.visitor} />
                <div>
                  <h2 className="text-sm font-semibold">{selected.visitor}</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-[#7e7e87]">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    Online · {selected.company}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {selected.mode !== "human" && selected.mode !== "resolved" ? (
                  <button
                    type="button"
                    onClick={() =>
                      updateConversation(selected.id, {
                        mode: "human",
                        owner: "Yosra",
                      })
                    }
                    className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#5964d6] px-3 text-xs font-semibold text-white hover:bg-[#4f5acb]"
                  >
                    <UserRound className="size-4" />
                    Take over
                  </button>
                ) : null}
                {selected.mode === "human" ? (
                  <button
                    type="button"
                    onClick={() =>
                      updateConversation(selected.id, {
                        mode: "ai",
                        owner: null,
                      })
                    }
                    className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-[#f5f6ff]"
                  >
                    <Bot className="size-4" />
                    Return to AI
                  </button>
                ) : null}
                {selected.mode !== "resolved" ? (
                  <button
                    type="button"
                    onClick={() =>
                      updateConversation(selected.id, { mode: "resolved" })
                    }
                    className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-[#f5f6ff]"
                  >
                    <Check className="size-4" />
                    Resolve
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      updateConversation(selected.id, {
                        mode: "human",
                        owner: "Yosra",
                      })
                    }
                    className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold"
                  >
                    Reopen
                  </button>
                )}
              </div>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto bg-[#fafafd] px-5 py-6">
              <div className="mx-auto max-w-3xl space-y-4">
                <p className="text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-[#a0a0a8]">
                  Today
                </p>
                {selected.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.author === "visitor" ? "justify-start" : "justify-end"}`}
                  >
                    {message.author === "visitor" ? (
                      <span className="mt-auto flex size-7 items-center justify-center rounded-full bg-[#e9e9ed]">
                        <UserRound className="size-3.5" />
                      </span>
                    ) : null}
                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${message.author === "visitor" ? "rounded-bl-sm border border-[#e2e2e7] bg-white text-[#45454e]" : message.author === "ai" ? "rounded-br-sm bg-[#eef0ff] text-[#404a9f]" : "rounded-br-sm bg-[#5964d6] text-white"}`}
                    >
                      <p>{message.text}</p>
                      <p
                        className={`mt-1 text-[10px] ${message.author === "agent" ? "text-white/55" : "text-[#9999a2]"}`}
                      >
                        {message.author === "ai"
                          ? "AI · "
                          : message.author === "agent"
                            ? "You · "
                            : ""}
                        {message.time}
                      </p>
                    </div>
                    {message.author !== "visitor" ? (
                      <span
                        className={`mt-auto flex size-7 items-center justify-center rounded-full ${message.author === "ai" ? "bg-[#dfe2ff] text-[#5964d6]" : "bg-[#5964d6] text-white"}`}
                      >
                        {message.author === "ai" ? (
                          <Bot className="size-3.5" />
                        ) : (
                          <UserRound className="size-3.5" />
                        )}
                      </span>
                    ) : null}
                  </div>
                ))}
                <div ref={endRef} />
              </div>
            </div>
            <form
              onSubmit={sendMessage}
              className="border-t border-[#e5e5e9] bg-white p-4"
            >
              {selected.mode === "human" ? (
                <div className="flex items-end gap-3">
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        event.currentTarget.form?.requestSubmit();
                      }
                    }}
                    rows={2}
                    placeholder="Write a reply…"
                    className="max-h-28 min-h-12 flex-1 resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#939ae2] focus:ring-2 focus:ring-[#f1f2ff]"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    aria-label="Send message"
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb] disabled:opacity-40"
                  >
                    <Send className="size-4" />
                  </button>
                </div>
              ) : (
                <div className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#f3f3f5] text-sm font-medium text-[#74747d]">
                  {selected.mode === "resolved" ? (
                    <CheckCircle2 className="size-4 text-emerald-600" />
                  ) : (
                    <Bot className="size-4" />
                  )}
                  {selected.mode === "resolved"
                    ? "This conversation is resolved."
                    : "The AI is handling this conversation. Take over to reply."}
                </div>
              )}
            </form>
          </section>

          <aside className="min-h-0 overflow-y-auto bg-white p-5">
            <div className="text-center">
              <Avatar name={selected.visitor} large />
              <h2 className="mt-3 font-semibold">{selected.visitor}</h2>
              <p className="mt-1 text-xs text-[#81818a]">{selected.company}</p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <InfoMetric
                icon={<Flame className="size-4 text-red-500" />}
                label="Score"
                value={`${selected.score}/100`}
              />
              <InfoMetric
                icon={<Clock3 className="size-4 text-indigo-500" />}
                label="Status"
                value={selected.mode}
              />
            </div>
            <Info title="Contact">
              <p className="flex items-center gap-2">
                <Mail className="size-4" />
                {selected.email}
              </p>
            </Info>
            <Info title="Identified need">
              <p>{selected.need}</p>
            </Info>
            <Info title="Assigned to">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-full bg-[#5964d6] text-[10px] font-bold text-white">
                  {selected.owner?.[0] ?? "AI"}
                </span>
                <span>{selected.owner ?? "AI Assistant"}</span>
              </div>
            </Info>
            <Info title="Suggested action">
              <p className="flex gap-2">
                <MessageSquareText className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                Confirm the business need and propose a 20-minute demo.
              </p>
            </Info>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Avatar({ name, large = false }: { name: string; large?: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[#f1f2ff] font-bold text-[#5964d6] ring-1 ring-[#e1e4f8] ${large ? "size-14 text-base" : "size-10 text-xs"}`}
    >
      {name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}
function ModeBadge({ mode }: { mode: Mode }) {
  const styles: Record<Mode, string> = {
    ai: "bg-indigo-50 text-indigo-700",
    human: "bg-emerald-50 text-emerald-700",
    waiting: "bg-amber-50 text-amber-700",
    resolved: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${styles[mode]}`}
    >
      {mode}
    </span>
  );
}
function Info({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5 border-t border-[#eeeeF1] pt-5">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#95959e]">
        {title}
      </h3>
      <div className="mt-3 text-xs leading-5 text-[#5f5f68]">{children}</div>
    </section>
  );
}
function InfoMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-[#fafafd] p-3 ring-1 ring-slate-100">
      <div className="flex items-center gap-1.5 text-[10px] uppercase text-[#898992]">
        {icon}
        {label}
      </div>
      <p className="mt-2 truncate text-sm font-semibold capitalize">{value}</p>
    </div>
  );
}
