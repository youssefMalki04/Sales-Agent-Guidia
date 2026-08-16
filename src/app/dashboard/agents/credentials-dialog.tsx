import { KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Integration } from "./tool-types";

export function CredentialsDialog({
  integration,
  values,
  onValueChange,
  onClose,
  onSave,
}: {
  integration: Integration | null;
  values: Record<string, string>;
  onValueChange: (key: string, value: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  if (!integration) return null;

  const canSave = integration.credentialFields.every((field) =>
    values[field.key]?.trim(),
  );

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[470px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Configure: {integration.name}
          </DialogTitle>
          <p className="text-sm leading-6 text-[#777780]">
            {integration.tools.join(", ")}
          </p>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {integration.credentialFields.map((field) => (
            <label key={field.key} className="block">
              <span className="text-sm font-semibold text-[#3c3c44]">
                {field.label}
              </span>
              <Input
                type={field.type ?? "text"}
                value={values[field.key] ?? ""}
                onChange={(event) =>
                  onValueChange(field.key, event.target.value)
                }
                placeholder={field.placeholder}
                className="mt-2 h-11"
              />
            </label>
          ))}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!canSave}
            onClick={onSave}
            className="rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
          >
            <KeyRound className="size-4" />
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
