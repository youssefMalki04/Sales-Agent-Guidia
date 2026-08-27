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

import type { TicketForm, TicketPriority } from "./ticket-types";

export function TicketCreateSheet({
  open,
  setOpen,
  form,
  setForm,
  busy,
  onCreate,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  form: TicketForm;
  setForm: (value: TicketForm) => void;
  busy: boolean;
  onCreate: () => void;
}) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col overflow-hidden p-0 sm:max-w-[700px]">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle>Create support ticket</SheetTitle>
        </SheetHeader>
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <Field label="Subject">
            <Input
              value={form.subject}
              onChange={(event) =>
                setForm({ ...form, subject: event.target.value })
              }
            />
          </Field>
          <Field label="Description">
            <Textarea
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Requester name">
              <Input
                value={form.requesterName}
                onChange={(event) =>
                  setForm({ ...form, requesterName: event.target.value })
                }
              />
            </Field>
            <Field label="Requester email">
              <Input
                type="email"
                value={form.requesterEmail}
                onChange={(event) =>
                  setForm({ ...form, requesterEmail: event.target.value })
                }
              />
            </Field>
            <Field label="Priority">
              <select
                value={form.priority}
                onChange={(event) =>
                  setForm({
                    ...form,
                    priority: event.target.value as TicketPriority,
                  })
                }
                className="h-10 w-full rounded-xl border px-3"
              >
                {(["low", "medium", "high", "urgent"] as const).map(
                  (priority) => (
                    <option key={priority}>{priority}</option>
                  ),
                )}
              </select>
            </Field>
            <Field label="Assigned to">
              <Input
                value={form.assignedTo}
                onChange={(event) =>
                  setForm({ ...form, assignedTo: event.target.value })
                }
              />
            </Field>
            <Field label="Lead ID (optional)">
              <Input
                value={form.leadId}
                onChange={(event) =>
                  setForm({ ...form, leadId: event.target.value })
                }
              />
            </Field>
            <Field label="Conversation session (optional)">
              <Input
                value={form.sessionId}
                onChange={(event) =>
                  setForm({ ...form, sessionId: event.target.value })
                }
              />
            </Field>
          </div>
        </div>
        <SheetFooter className="border-t px-6 py-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={onCreate}
            disabled={!form.subject.trim() || busy}
            className="bg-[#5964d6] text-white"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : null}
            Create ticket
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
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}
