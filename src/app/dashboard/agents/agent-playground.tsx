"use client";

import {
  Bot,
  Loader2,
  Monitor,
  RotateCcw,
  Send,
  Smartphone,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { appendDemoMessage } from "@/lib/demo-conversations";
import type { AgentProfile } from "./agent-types";

type Message = { id: string; role: "agent" | "user"; content: string };
type PreviewMode = "desktop" | "mobile";

const suggestions = [
  "What can you help me with?",
  "Show me the main features",
  "I need help getting started",
];

export function AgentPlayground({
  profile,
  onClose,
}: {
  profile: AgentProfile | null;
  onClose: () => void;
}) {
  const initialMessage: Message[] = profile
    ? [{ id: "welcome", role: "agent", content: profile.welcomeMessage }]
    : [];
  const [messages, setMessages] = useState<Message[]>(initialMessage);
  const [input, setInput] = useState("");
  const [replying, setReplying] = useState(false);
  const [mode, setMode] = useState<PreviewMode>("desktop");
  const [sessionId] = useState(() => crypto.randomUUID());

  if (!profile) return null;

  function reset() {
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "agent",
        content: profile!.welcomeMessage,
      },
    ]);
    setInput("");
    setReplying(false);
  }

  function send(content = input) {
    const value = content.trim();
    if (!value || replying) return;
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content: value },
    ]);
    appendDemoMessage(
      { id: sessionId, agentId: profile!.id, agentName: profile!.name },
      {
        id: crypto.randomUUID(),
        role: "user",
        content: value,
        createdAt: new Date().toISOString(),
      },
    );
    setInput("");
    setReplying(true);
    window.setTimeout(() => {
      const content = `I’m ${profile!.name}. Connect the AI service to enable live responses for this request.`;
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "agent", content },
      ]);
      appendDemoMessage(
        { id: sessionId, agentId: profile!.id, agentName: profile!.name },
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content,
          createdAt: new Date().toISOString(),
        },
      );
      setReplying(false);
    }, 700);
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-[980px] overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <DialogTitle>Test {profile.name}</DialogTitle>
              <p className="mt-1 text-sm text-[#777780]">
                Review the agent experience before activation
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-md border bg-white p-1">
                <button
                  type="button"
                  onClick={() => setMode("desktop")}
                  className={cn(
                    "rounded p-2",
                    mode === "desktop" && "bg-[#f1f1f3]",
                  )}
                  aria-label="Desktop preview"
                >
                  <Monitor className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setMode("mobile")}
                  className={cn(
                    "rounded p-2",
                    mode === "mobile" && "bg-[#f1f1f3]",
                  )}
                  aria-label="Mobile preview"
                >
                  <Smartphone className="size-4" />
                </button>
              </div>
              <Button size="sm" variant="outline" onClick={reset}>
                <RotateCcw className="size-4" /> Reset
              </Button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-2 hover:bg-[#f1f1f3]"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        </DialogHeader>
        <div className="bg-[#f5f5f7] p-6">
          <div
            className={cn(
              "mx-auto flex h-[620px] flex-col overflow-hidden border bg-white shadow-xl transition-all",
              mode === "mobile"
                ? "max-w-[390px] rounded-[28px]"
                : "max-w-[760px] rounded-xl",
            )}
          >
            <header className="flex items-center gap-3 border-b px-5 py-4">
              <span className="flex size-10 items-center justify-center rounded-full bg-[#17171a] text-white">
                <Bot className="size-5" />
              </span>
              <div>
                <p className="font-semibold">{profile.name}</p>
                <p className="text-xs text-emerald-600">Preview online</p>
              </div>
            </header>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2",
                    message.role === "user" && "justify-end",
                  )}
                >
                  {message.role === "agent" && (
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#ededf0]">
                      <Bot className="size-3.5" />
                    </span>
                  )}
                  <p
                    className={cn(
                      "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6",
                      message.role === "user"
                        ? "bg-[#17171a] text-white"
                        : "bg-[#f1f1f3] text-[#3f3f46]",
                    )}
                  >
                    {message.content}
                  </p>
                  {message.role === "user" && (
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#ededf0]">
                      <User className="size-3.5" />
                    </span>
                  )}
                </div>
              ))}
              {replying && (
                <div className="flex items-center gap-2 text-sm text-[#777780]">
                  <Loader2 className="size-4 animate-spin" /> {profile.name} is
                  typing…
                </div>
              )}
            </div>
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 px-5 pb-3">
                {suggestions.map((suggestion) => (
                  <button
                    type="button"
                    key={suggestion}
                    onClick={() => send(suggestion)}
                    className="rounded-full border px-3 py-2 text-xs font-medium hover:bg-[#f7f7f8]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            <form
              className="flex gap-2 border-t p-4"
              onSubmit={(event) => {
                event.preventDefault();
                send();
              }}
            >
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask the agent…"
                disabled={replying}
              />
              <Button
                type="submit"
                disabled={!input.trim() || replying}
                className="bg-[#17171a] text-white"
              >
                <Send className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
