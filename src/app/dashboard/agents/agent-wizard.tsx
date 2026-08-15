import { Check, ChevronLeft, ChevronRight, Plus, Trash2, Wrench } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { agentSkills, agentTools, agentWizardSteps, salesAgentForm, supportAgentForm } from "./agent-presets";
import type { AgentBlueprintTab, AgentForm } from "./agent-types";

type AgentWizardProps = {
  open: boolean;
  step: number;
  form: AgentForm;
  blueprintTab: AgentBlueprintTab;
  onOpenChange: (open: boolean) => void;
  onStepChange: (step: number) => void;
  onBlueprintTabChange: (tab: AgentBlueprintTab) => void;
  onFormChange: (form: AgentForm) => void;
  onCreate: () => void;
};

export function AgentWizard({ open, step, form, blueprintTab, onOpenChange, onStepChange, onBlueprintTabChange, onFormChange, onCreate }: AgentWizardProps) {
  const canNext = step !== 2 || (form.name.trim().length > 1 && form.description.trim().length > 5);
  return <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent className="flex w-full flex-col overflow-hidden p-0 sm:max-w-[720px]">
      <SheetHeader className="border-b px-6 py-5">
        <SheetTitle>Configure before creating</SheetTitle>
        <p className="mt-4 text-xs font-bold uppercase text-[#777780]">Step {step} of 6</p>
        <p className="mt-1 text-sm font-semibold">{agentWizardSteps[step - 1]}</p>
        <div className="mt-3 grid grid-cols-6 gap-1.5">{agentWizardSteps.map((title, index) => <div key={title} className={cn("h-1 rounded-full", index + 1 <= step ? "bg-black" : "bg-[#ececef]")} />)}</div>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {step === 1 && <TemplateStep form={form} onChange={onFormChange} />}
        {step === 2 && <ProfileStep form={form} onChange={onFormChange} />}
        {step === 3 && <BlueprintStep form={form} tab={blueprintTab} onTabChange={onBlueprintTabChange} onChange={onFormChange} />}
        {step === 4 && <SkillsStep form={form} onChange={onFormChange} />}
        {step === 5 && <ToolsStep form={form} onChange={onFormChange} />}
        {step === 6 && <TeamStep form={form} onChange={onFormChange} />}
      </div>
      <SheetFooter className="border-t px-6 py-4 sm:flex-row sm:justify-between">
        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        <div className="flex gap-2">
          {step > 1 && <Button variant="outline" onClick={() => onStepChange(step - 1)}><ChevronLeft className="size-4" /> Back</Button>}
          {step < 6 ? <Button disabled={!canNext} onClick={() => onStepChange(step + 1)} className="bg-black text-white">Next <ChevronRight className="size-4" /></Button> : <Button onClick={onCreate} className="bg-black text-white"><Check className="size-4" /> Create agent</Button>}
        </div>
      </SheetFooter>
    </SheetContent>
  </Sheet>;
}

type StepProps = { form: AgentForm; onChange: (form: AgentForm) => void };

function TemplateStep({ form, onChange }: StepProps) {
  return <Field label="Template"><select value={form.template} onChange={(event) => onChange(event.target.value === "support" ? supportAgentForm : salesAgentForm)} className="h-11 w-full rounded-md border bg-white px-3 text-sm"><option value="support">Agent support</option><option value="sales">Agent commercial</option></select></Field>;
}

function ProfileStep({ form, onChange }: StepProps) {
  return <div className="space-y-5">
    <Field label="Profile name"><Input value={form.name} onChange={(e) => onChange({ ...form, name: e.target.value })} /></Field>
    <Field label="Description"><Textarea value={form.description} onChange={(e) => onChange({ ...form, description: e.target.value })} className="min-h-24" /></Field>
    <Field label="Welcome message"><Textarea value={form.welcomeMessage} onChange={(e) => onChange({ ...form, welcomeMessage: e.target.value })} className="min-h-24" /></Field>
    <Field label="Business prompt"><Textarea value={form.businessPrompt} onChange={(e) => onChange({ ...form, businessPrompt: e.target.value })} className="min-h-48 font-mono text-xs" /></Field>
  </div>;
}

function BlueprintStep({ form, tab, onTabChange, onChange }: StepProps & { tab: AgentBlueprintTab; onTabChange: (tab: AgentBlueprintTab) => void }) {
  return <div>
    <div className="flex gap-2">{(["context", "targets", "rules"] as const).map((item) => <button key={item} onClick={() => onTabChange(item)} className={cn("rounded-md px-4 py-2 text-sm font-semibold", tab === item ? "bg-[#f1f1f3]" : "text-[#777780]")}>{item === "rules" ? "Rules & UI" : item}</button>)}</div>
    {tab === "context" && <div className="mt-5 space-y-5"><Field label="Business context"><Textarea value={form.businessContext} onChange={(e) => onChange({ ...form, businessContext: e.target.value })} className="min-h-28" /></Field><Field label="Offers & services"><Textarea value={form.offers} onChange={(e) => onChange({ ...form, offers: e.target.value })} className="min-h-28" /></Field></div>}
    {tab === "targets" && <div className="mt-5 space-y-5"><Field label="Target users"><Textarea value={form.targetUsers} onChange={(e) => onChange({ ...form, targetUsers: e.target.value })} className="min-h-28" /></Field><Field label="Expected outcomes"><Textarea value={form.expectedOutcomes} onChange={(e) => onChange({ ...form, expectedOutcomes: e.target.value })} className="min-h-28" /></Field></div>}
    {tab === "rules" && <div className="mt-5 space-y-5"><Field label="Guardrails"><Textarea value={form.guardrails} onChange={(e) => onChange({ ...form, guardrails: e.target.value })} className="min-h-28" /></Field><Field label="Escalation rules"><Textarea value={form.escalationRules} onChange={(e) => onChange({ ...form, escalationRules: e.target.value })} className="min-h-28" /></Field><Field label="UI & workflow notes"><Textarea value={form.uiNotes} onChange={(e) => onChange({ ...form, uiNotes: e.target.value })} className="min-h-28" /></Field><Field label="Execution policy"><Textarea value={form.executionPolicy} onChange={(e) => onChange({ ...form, executionPolicy: e.target.value })} className="min-h-28" /></Field></div>}
  </div>;
}

function SkillsStep({ form, onChange }: StepProps) {
  return <div className="space-y-3">{agentSkills.map(([id, name, meta]) => { const active = form.selectedSkills.includes(id); return <button key={id} onClick={() => onChange({ ...form, selectedSkills: active ? form.selectedSkills.filter((item) => item !== id) : [...form.selectedSkills, id] })} className={cn("flex w-full items-center justify-between rounded-md border px-4 py-3 text-left", active ? "border-[#44444c] bg-[#f7f7f8]" : "bg-white")}><div><p className="font-semibold">{name}</p><p className="mt-1 text-xs text-[#8a8a93]">{meta}</p></div><span className={cn("rounded-md px-3 py-1 text-xs font-semibold", active ? "bg-violet-600 text-white" : "border")}>{active ? "On" : "Off"}</span></button>; })}</div>;
}

function ToolsStep({ form, onChange }: StepProps) {
  return <div><p className="text-sm text-[#777780]">Pick the integrations this agent is allowed to use.</p><div className="mt-4 flex items-center justify-between rounded-md bg-[#f4f4f5] p-4"><div className="flex gap-5"><label className="flex items-center gap-2 text-sm font-semibold"><input type="radio" checked={form.toolMode === "automatic"} onChange={() => onChange({ ...form, toolMode: "automatic" })} /> Automatic mode</label><label className="flex items-center gap-2 text-sm font-semibold"><input type="radio" checked={form.toolMode === "explicit"} onChange={() => onChange({ ...form, toolMode: "explicit" })} /> Explicit selection</label></div><Badge variant="outline" className="bg-white">{form.selectedTools.length} tool selected</Badge></div><div className="mt-4 flex gap-2"><Button size="sm" variant="outline" onClick={() => onChange({ ...form, selectedTools: agentTools.filter((item) => item[3]).map((item) => item[0]) })}>Select all configured</Button><Button size="sm" variant="outline" onClick={() => onChange({ ...form, selectedTools: [] })}>Deselect all</Button><Button size="sm" variant="outline"><Wrench className="size-4" /> Configure tools</Button></div><div className="mt-4 grid gap-3 md:grid-cols-2">{agentTools.map(([id, name, count, configured, mark]) => { const active = form.selectedTools.includes(id); return <button key={id} onClick={() => onChange({ ...form, selectedTools: active ? form.selectedTools.filter((item) => item !== id) : [...form.selectedTools, id] })} className={cn("flex items-center justify-between rounded-lg border p-4 text-left", active ? "border-[#3d3d45] bg-[#f7f7f8]" : "bg-white")}><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-md border bg-white font-bold">{mark}</div><div><p className="font-semibold">{name}</p><div className="mt-1 flex gap-2"><Badge variant="outline" className={configured ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "bg-[#f4f4f5]"}>{configured ? "Configured" : "Not configured"}</Badge><Badge variant="outline">{count}</Badge></div></div></div><input type="checkbox" checked={active} readOnly /></button>; })}</div></div>;
}

function TeamStep({ form, onChange }: StepProps) {
  return <div><div className="flex justify-end"><Button variant="outline" onClick={() => onChange({ ...form, members: [...form.members, { id: crypto.randomUUID(), title: "New team member", mission: "" }] })}><Plus className="size-4" /> Add member</Button></div><div className="mt-4 space-y-4">{form.members.map((member, index) => <section key={member.id} className="rounded-lg border p-4"><div className="flex items-center justify-between border-b pb-3"><div><p className="text-xs font-bold uppercase text-[#888892]">Member {index + 1}</p><p className="mt-1 font-semibold">{member.title}</p></div><Button size="sm" variant="outline" onClick={() => onChange({ ...form, members: form.members.filter((item) => item.id !== member.id) })} className="border-rose-200 bg-rose-50 text-rose-600"><Trash2 className="size-4" /> Remove</Button></div><div className="mt-4 space-y-4"><Field label="Display title"><Input value={member.title} onChange={(e) => onChange({ ...form, members: form.members.map((item) => item.id === member.id ? { ...item, title: e.target.value } : item) })} /></Field><Field label="Mission / focus"><Textarea value={member.mission} onChange={(e) => onChange({ ...form, members: form.members.map((item) => item.id === member.id ? { ...item, mission: e.target.value } : item) })} className="min-h-24" /></Field></div></section>)}</div></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-sm font-semibold">{label}</span><div className="mt-2">{children}</div></label>;
}
