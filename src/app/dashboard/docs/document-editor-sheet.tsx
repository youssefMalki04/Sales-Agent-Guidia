"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { KnowledgeDocumentDetails } from "./docs-types";

type DocumentEditorSheetProps = {
  open: boolean;
  loading: boolean;
  saving: boolean;
  document: KnowledgeDocumentDetails | null;
  onOpenChange: (open: boolean) => void;
  onDocumentChange: (document: KnowledgeDocumentDetails) => void;
  onSave: () => void;
};

export function DocumentEditorSheet({
  open,
  loading,
  saving,
  document,
  onOpenChange,
  onDocumentChange,
  onSave,
}: DocumentEditorSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-hidden p-0 sm:max-w-[820px]">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle>Edit knowledge document</SheetTitle>
          <p className="text-sm text-slate-500">
            Saving regenerates the Gemini embeddings automatically.
          </p>
        </SheetHeader>
        {loading || !document ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="size-7 animate-spin text-[#5964d6]" />
          </div>
        ) : (
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            <Field label="Title">
              <Input
                value={document.title}
                onChange={(event) =>
                  onDocumentChange({ ...document, title: event.target.value })
                }
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category">
                <Input
                  value={document.category ?? ""}
                  onChange={(event) =>
                    onDocumentChange({
                      ...document,
                      category: event.target.value,
                    })
                  }
                />
              </Field>
              <Field label="Source">
                <Input
                  value={document.source ?? ""}
                  onChange={(event) =>
                    onDocumentChange({
                      ...document,
                      source: event.target.value,
                    })
                  }
                />
              </Field>
            </div>
            <Field label="Content">
              <Textarea
                value={document.content}
                onChange={(event) =>
                  onDocumentChange({ ...document, content: event.target.value })
                }
                className="min-h-[430px] font-mono text-sm"
              />
            </Field>
          </div>
        )}
        <SheetFooter className="border-t px-6 py-4 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!document || saving}
            onClick={onSave}
            className="bg-[#5964d6] text-white hover:bg-[#4f5acb]"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : null} Save
            and reindex
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}
