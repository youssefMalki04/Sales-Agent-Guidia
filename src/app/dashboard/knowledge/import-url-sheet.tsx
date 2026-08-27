import { Globe2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { UrlForm } from "./knowledge-data";
import { CategorySelect, Field, ScopeSelect } from "./knowledge-sheet-fields";

export function ImportUrlSheet({
  open,
  form,
  busy,
  onOpenChange,
  onFormChange,
  onStart,
}: {
  open: boolean;
  form: UrlForm;
  busy: boolean;
  onOpenChange: (open: boolean) => void;
  onFormChange: (form: UrlForm) => void;
  onStart: () => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-hidden p-0 sm:max-w-[820px]">
        <SheetHeader className="border-b border-[#e5e5e8] px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg border border-[#dedee3] bg-[#f7f7f8]">
              <Globe2 className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#777780]">
                Web documentation
              </p>
              <SheetTitle className="mt-1 text-xl">Import from URL</SheetTitle>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777780]">
                The crawler discovers internal pages from this URL, extracts
                main text, and creates indexed documents automatically.
              </p>
            </div>
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-5">
            <Field label="Start URL">
              <Input
                value={form.startUrl}
                onChange={(event) =>
                  onFormChange({ ...form, startUrl: event.target.value })
                }
                placeholder="https://docs.example.com"
                className="h-11"
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Scope">
                <ScopeSelect
                  value={form.scope}
                  onChange={(value) => onFormChange({ ...form, scope: value })}
                />
              </Field>
              <Field label="Category (optional)">
                <CategorySelect
                  value={form.category}
                  onChange={(value) =>
                    onFormChange({ ...form, category: value })
                  }
                />
              </Field>
            </div>
            <Field label="Tags (comma separated)">
              <Input
                value={form.tags}
                onChange={(event) =>
                  onFormChange({ ...form, tags: event.target.value })
                }
                placeholder="pricing, onboarding, billing, faq"
                className="h-11"
              />
              <p className="mt-2 text-xs text-[#8a8a93]">
                Tags are suggested from the category — you can edit them.
              </p>
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Max pages">
                <Input
                  type="number"
                  value={form.maxPages}
                  min={1}
                  onChange={(event) =>
                    onFormChange({
                      ...form,
                      maxPages: Number(event.target.value),
                    })
                  }
                  className="h-11"
                />
              </Field>
              <Field label="Max depth">
                <Input
                  type="number"
                  value={form.maxDepth}
                  min={0}
                  onChange={(event) =>
                    onFormChange({
                      ...form,
                      maxDepth: Number(event.target.value),
                    })
                  }
                  className="h-11"
                />
              </Field>
            </div>
            <section className="space-y-3 rounded-lg border border-[#dedee3] p-4">
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.includeSubdomains}
                  onChange={(event) =>
                    onFormChange({
                      ...form,
                      includeSubdomains: event.target.checked,
                    })
                  }
                />
                Include subdomains
              </label>
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.sameRootPath}
                  onChange={(event) =>
                    onFormChange({
                      ...form,
                      sameRootPath: event.target.checked,
                    })
                  }
                />
                Limit to same root path (e.g. /docs/)
              </label>
            </section>
          </div>
        </div>
        <SheetFooter className="border-t border-[#e5e5e8] px-6 py-4 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!form.startUrl.trim() || busy}
            onClick={onStart}
            className="rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : null}Start
            crawl
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
