"use client";
import { useEffect } from "react";

export function useUnsavedChanges(dirty: boolean, saving = false) {
  useEffect(() => {
    if (!dirty && !saving) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, saving]);
  return () => !saving && (!dirty || window.confirm("Des modifications ne sont pas enregistrées. Les abandonner ?"));
}
