import { Globe2, Loader2, NotebookPen, Sparkles } from "lucide-react";

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
import { cn } from "@/lib/utils";
import type { NoteForm, Scope, UrlForm } from "./knowledge-data";
import { categories, initialNoteForm, templates } from "./knowledge-data";

export function BusinessNoteSheet({
  open,
  form,
  busy,
  onOpenChange,
  onFormChange,
  onTemplateChange,
  onCreate,
}: {
  open: boolean;
  form: NoteForm;
  busy: boolean;
  onOpenChange: (open: boolean) => void;
  onFormChange: (form: NoteForm) => void;
  onTemplateChange: (templateId: string) => void;
  onCreate: () => void;
}) {
  const canCreate =
    form.title.trim().length > 1 && form.content.trim().length > 5;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-hidden p-0 sm:max-w-[820px]">
        <SheetHeader className="border-b border-[#e5e5e8] px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg border border-[#dedee3] bg-[#f7f7f8]">
              <NotebookPen className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#777780]">
                Business note
              </p>
              <SheetTitle className="mt-1 text-xl">
                Create a business note
              </SheetTitle>
            </div>
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <section className="rounded-lg bg-[#f4f4f5] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#777780]">
              How do you want to start?
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <ChoiceCard
                active={form.mode === "scratch"}
                title="From scratch"
                description="Write the title and content freely with no pre-filled template."
                onClick={() =>
                  onFormChange({ ...initialNoteForm, mode: "scratch" })
                }
              />
              <ChoiceCard
                active={form.mode === "template"}
                title="From a template"
                description="Pick a template below to pre-fill title, content, scope, and category."
                onClick={() => onFormChange({ ...form, mode: "template" })}
              />
            </div>
          </section>

          {form.mode === "template" ? (
            <section className="mt-4 rounded-lg bg-[#f4f4f5] p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 items-center justify-center rounded-md border bg-white">
                  <Sparkles className="size-4" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Quick templates</p>
                  <p className="mt-1 text-sm text-[#777780]">
                    Pre-fill the knowledge blocks the agent must master to
                    become autonomous.
                  </p>
                  <label className="mt-4 block">
                    <span className="text-sm font-semibold">
                      Quick template
                    </span>
                    <select
                      value={form.template}
                      onChange={(event) => onTemplateChange(event.target.value)}
                      className="mt-2 h-11 w-full rounded-md border border-[#dedee3] bg-white px-3 text-sm"
                    >
                      <option value="">Choose a template...</option>
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            </section>
          ) : null}

          <div className="mt-5 space-y-5">
            <Field label="Title">
              <Input
                value={form.title}
                onChange={(event) =>
                  onFormChange({ ...form, title: event.target.value })
                }
                placeholder="Installation FAQ"
                className="h-11"
              />
            </Field>
            <Field label="Content">
              <Textarea
                value={form.content}
                onChange={(event) =>
                  onFormChange({ ...form, content: event.target.value })
                }
                placeholder="Document content..."
                className="min-h-[260px] font-mono text-sm"
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Scope">
                <ScopeSelect
                  value={form.scope}
                  onChange={(value) => onFormChange({ ...form, scope: value })}
                />
              </Field>
              <Field label="Category">
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
            <Field label="Source URL (optional)">
              <Input
                value={form.sourceUrl}
                onChange={(event) =>
                  onFormChange({ ...form, sourceUrl: event.target.value })
                }
                placeholder="https://help.example.com/pricing"
                className="h-11"
              />
            </Field>
          </div>
        </div>
        <SheetFooter className="border-t border-[#e5e5e8] px-6 py-4 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!canCreate || busy}
            onClick={onCreate}
            className="rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : null}Create
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#34343b]">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
function ChoiceCard({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border bg-white p-4 text-left transition",
        active
          ? "border-[#939ae2] bg-[#f5f6ff] shadow-[inset_0_0_0_1px_#939ae2]"
          : "border-[#dedee3] hover:border-[#b8b8bf]",
      )}
    >
      <p className={cn("font-semibold", active && "text-[#5964d6]")}>{title}</p>
      <p className="mt-1 text-sm leading-5 text-[#777780]">{description}</p>
    </button>
  );
}
function ScopeSelect({
  value,
  onChange,
}: {
  value: Scope;
  onChange: (value: Scope) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as Scope)}
      className="h-11 w-full rounded-md border border-[#dedee3] bg-white px-3 text-sm"
    >
      <option value="Support">Support</option>
      <option value="Demo">Demo</option>
      <option value="Training">Training</option>
      <option value="Pre-sales">Pre-sales</option>
    </select>
  );
}
function CategorySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-full rounded-md border border-[#dedee3] bg-white px-3 text-sm"
    >
      <option value="">Choose a category...</option>
      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
}
