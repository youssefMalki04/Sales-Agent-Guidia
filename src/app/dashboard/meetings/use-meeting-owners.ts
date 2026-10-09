"use client";
import { useEffect, useState } from "react";
import { initialMembers, STORAGE_KEY, type TeamMember } from "../team/team-data";

export function useMeetingOwners() {
  const [members, setMembers] = useState(initialMembers);
  useEffect(() => {
    function read() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) { setMembers(initialMembers); return; }
        const values: unknown = JSON.parse(stored);
        if (Array.isArray(values)) setMembers(values.filter((value): value is TeamMember => value && typeof value.name === "string" && typeof value.status === "string"));
      } catch { /* Keep the available team if local storage cannot be read. */ }
    }
    const timer = window.setTimeout(read, 0);
    window.addEventListener("focus", read);
    window.addEventListener("storage", read);
    return () => { clearTimeout(timer); window.removeEventListener("focus", read); window.removeEventListener("storage", read); };
  }, []);
  return [...new Set(members.filter((member) => member.status === "active").map((member) => member.name))];
}
