import { Check, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { steps } from "./skill-data";
import type { SkillForm } from "./skill-types";
import {
  BehaviorStep,
  DescriptionStep,
  FocusStep,
  IdentityStep,
  ValidationStep,
} from "./skill-wizard-steps";

export function CreateSkillWizard({
  open,
  step,
  form,
  canContinue,
  onOpenChange,
  onFormChange,
  onBack,
  onNext,
  onCancel,
  onCreate,
}: {
  open: boolean;
  step: number;
  form: SkillForm;
  canContinue: boolean;
  onOpenChange: (open: boolean) => void;
  onFormChange: (form: SkillForm) => void;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
  onCreate: () => void;
}) {
  const currentStep = steps[step - 1];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-hidden p-0 sm:max-w-[560px]">
        <SheetHeader className="border-b border-[#e4e4e8] px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#62626c]">
                Assistant · Step {step}/5
              </p>
              <SheetTitle className="mt-2 text-xl">New skill pack</SheetTitle>
              <p className="mt-1 text-sm text-[#7b7b85]">
                {currentStep.subtitle}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-5 gap-2">
            {steps.map((item, index) => {
              const itemStep = index + 1;
              const active = itemStep <= step;

              return (
                <div key={item.title}>
                  <div
                    className={cn(
                      "h-1 rounded-full",
                      active ? "bg-[#5964d6]" : "bg-[#ececef]",
                    )}
                  />
                  <p
                    className={cn(
                      "mt-2 text-center text-[10px] font-semibold",
                      itemStep === step ? "text-[#24242a]" : "text-[#8e8e97]",
                    )}
                  >
                    {item.title}
                  </p>
                </div>
              );
            })}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {step === 1 ? (
            <IdentityStep form={form} onChange={onFormChange} />
          ) : null}
          {step === 2 ? (
            <DescriptionStep form={form} onChange={onFormChange} />
          ) : null}
          {step === 3 ? (
            <BehaviorStep form={form} onChange={onFormChange} />
          ) : null}
          {step === 4 ? (
            <FocusStep form={form} onChange={onFormChange} />
          ) : null}
          {step === 5 ? <ValidationStep form={form} /> : null}
        </div>

        <SheetFooter className="border-t border-[#e4e4e8] bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>

          <div className="flex gap-2">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={onBack}>
                <ChevronLeft className="size-4" />
                Back
              </Button>
            ) : null}

            {step < 5 ? (
              <Button
                type="button"
                disabled={!canContinue}
                onClick={onNext}
                className="rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            ) : (
              <Button
                type="button"
                disabled={!form.label.trim()}
                onClick={onCreate}
                className="rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
              >
                <Check className="size-4" />
                Create skill pack
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
