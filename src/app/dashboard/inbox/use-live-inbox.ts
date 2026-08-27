"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import type { Filter, InboxConversation, Message } from "./inbox-types";

const EMPTY_CONVERSATION: InboxConversation = {
  company: "No conversation selected",
  email: "-",
  id: "",
  lastActivity: "-",
  messages: [],
  mode: "ai",
  need: "No active conversation.",
  owner: null,
  score: 0,
  temperature: "cold",
  unread: 0,
  visitor: "Visitor",
};

export function useLiveInbox() {
  const [conversations, setConversations] = useState<InboxConversation[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    async function loadInbox() {
      try {
        const response = await fetch("/api/inbox");
        if (!response.ok) throw new Error("Inbox request failed");
        const result = (await response.json()) as {
          conversations: InboxConversation[];
        };
        if (!active) return;
        setConversations(result.conversations);
        setSelectedId(
          (current) => current || result.conversations[0]?.id || "",
        );
        setError("");
      } catch {
        if (active) {
          setError(
            "Unable to load inbox. Apply migration 010_live_inbox.sql in Supabase.",
          );
        }
      }
    }

    void loadInbox();
    const interval = window.setInterval(loadInbox, 5000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
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
    EMPTY_CONVERSATION;
  const waitingCount = conversations.filter(
    (conversation) => conversation.mode === "waiting",
  ).length;

  async function updateConversation(
    id: string,
    update: Partial<InboxConversation>,
  ) {
    const current = conversations;
    setConversations((items) =>
      items.map((conversation) =>
        conversation.id === id ? { ...conversation, ...update } : conversation,
      ),
    );
    if (update.mode) {
      const response = await fetch("/api/inbox", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: update.mode,
          owner: update.owner,
          sessionId: id,
        }),
      });
      if (!response.ok) {
        setConversations(current);
        setError("Unable to update this conversation.");
      }
    }
  }

  function selectConversation(id: string) {
    setSelectedId(id);
    void updateConversation(id, { unread: 0 });
  }

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || selected.mode !== "human") return;
    const response = await fetch("/api/inbox", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, sessionId: selected.id }),
    });
    if (!response.ok) {
      setError("Unable to send this reply.");
      return;
    }
    const result = (await response.json()) as { message: Message };
    await updateConversation(selected.id, {
      messages: [...selected.messages, result.message],
      lastActivity: "Now",
    });
    setDraft("");
    window.setTimeout(
      () => endRef.current?.scrollIntoView({ behavior: "smooth" }),
      0,
    );
  }

  return {
    draft,
    endRef,
    error,
    filter,
    query,
    selected,
    visible,
    waitingCount,
    setDraft,
    setFilter,
    setQuery,
    selectConversation,
    sendMessage,
    updateConversation,
  };
}
