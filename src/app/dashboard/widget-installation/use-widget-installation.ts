"use client";

import { useMemo, useState } from "react";
import type { Device, Position } from "./widget-types";

export function useWidgetInstallation() {
  const [name, setName] = useState("Leadia Sales Assistant");
  const [welcome, setWelcome] = useState(
    "Bonjour ! Comment puis-je vous aider aujourd’hui ?",
  );
  const [color, setColor] = useState("#5964d6");
  const [position, setPosition] = useState<Position>("bottom-right");
  const [device, setDevice] = useState<Device>("desktop");
  const [copied, setCopied] = useState(false);
  const [verified, setVerified] = useState(false);

  const snippet = useMemo(
    () => `<script
  src="https://cdn.leadia.ai/widget.js"
  data-agent-id="agent_9b64f780"
  data-color="${color}"
  data-position="${position}"
  defer
></script>`,
    [color, position],
  );

  async function copySnippet() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return {
    name,
    setName,
    welcome,
    setWelcome,
    color,
    setColor,
    position,
    setPosition,
    device,
    setDevice,
    copied,
    verified,
    setVerified,
    snippet,
    copySnippet,
  };
}
