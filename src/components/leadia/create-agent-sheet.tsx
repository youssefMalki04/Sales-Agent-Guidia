import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

import { FormField } from "./form-field";
import type { SalesAgentForm } from "./types";

export function CreateAgentSheet({
  open,
  form,
  onOpenChange,
  onFormChange,
  onCreate,
}: {
  open: boolean;
  form: SalesAgentForm;
  onOpenChange: (open: boolean) => void;
  onFormChange: (form: SalesAgentForm) => void;
  onCreate: () => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-[540px]">
        <SheetHeader className="border-b border-[#eeeeef] px-6 py-5">
          <SheetTitle className="text-xl font-semibold">New sales agent</SheetTitle>
        </SheetHeader>

        <div className="space-y-5 px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b8b94]">
              Context
            </p>
            <label className="mt-4 block text-sm font-semibold">Workspace</label>
            <select className="mt-2 h-10 w-full rounded-lg border border-[#dfdfe3] bg-white px-3 text-sm">
              <option>Leadia Sales Workspace</option>
            </select>
          </div>

          <FormField label="Name">
            <Input
              value={form.name}
              onChange={(event) =>
                onFormChange({
                  ...form,
                  name: event.target.value,
                  slug: event.target.value.toLowerCase().replaceAll(" ", "-"),
                })
              }
            />
          </FormField>
          <FormField label="Slug">
            <Input
              value={form.slug}
              onChange={(event) => onFormChange({ ...form, slug: event.target.value })}
            />
          </FormField>
          <FormField label="Description">
            <Input
              value={form.description}
              onChange={(event) =>
                onFormChange({ ...form, description: event.target.value })
              }
            />
          </FormField>
          <FormField label="Base URL">
            <Input
              value={form.baseUrl}
              onChange={(event) => onFormChange({ ...form, baseUrl: event.target.value })}
            />
          </FormField>
          <FormField label="Allowed domains">
            <Textarea
              value={form.allowedDomains}
              onChange={(event) =>
                onFormChange({ ...form, allowedDomains: event.target.value })
              }
              className="min-h-24"
            />
          </FormField>
        </div>

        <SheetFooter className="border-t border-[#eeeeef] px-6 py-4 sm:flex-row sm:justify-start">
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button onClick={onCreate}>Create sales agent</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
