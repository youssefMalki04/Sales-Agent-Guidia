import {
  ArrowLeft,
  Boxes,
  CalendarClock,
  FileText,
  Headphones,
  LayoutGrid,
  MessageSquareText,
  Settings,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { AgentDetailTab as DetailTab, AgentProfile } from "./agent-types";
import {
  Blueprint,
  Overview,
  ProfileSkills,
  Prompts,
  Technical,
} from "./advanced-agent-profile-tabs";

export function ProfileDetails({
  profile,
  tab,
  onTabChange,
  onBack,
}: {
  profile: AgentProfile;
  tab: DetailTab;
  onTabChange: (tab: DetailTab) => void;
  onBack: () => void;
}) {
  const detailTabs: Array<[DetailTab, string, typeof LayoutGrid]> = [
    ["overview", "Overview", LayoutGrid],
    ["prompts", "Prompts & identity", MessageSquareText],
    ["skills", "Skills & Live panel", Boxes],
    ["blueprint", "Business blueprint", FileText],
    ["technical", "Technical", Settings],
  ];
  return (
    <section className="mt-7">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-[#666670]"
      >
        <ArrowLeft className="size-4" /> Agent Studio profiles
      </button>
      <div className="mt-6 flex justify-between border-b pb-7">
        <div>
          <h1 className="text-3xl font-semibold">{profile.name}</h1>
          <p className="mt-2 text-sm text-[#7b7b85]">
            Lynara ERP · {profile.template === "support" ? "Support" : "Sales"}
          </p>
        </div>
        <div className="flex gap-2">
          {profile.isDefault && <Badge>DEFAULT PROFILE</Badge>}
          <Badge variant="outline">
            {profile.selectedSkills.length} skills
          </Badge>
          <Badge variant="outline">{profile.members.length} participant</Badge>
        </div>
      </div>
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        <StatCard
          icon={Headphones}
          label="Business domain"
          value={profile.template === "support" ? "Support" : "Sales"}
        />
        <StatCard
          icon={Boxes}
          label="Active skill packs"
          value={String(profile.selectedSkills.length)}
        />
        <StatCard
          icon={CalendarClock}
          label="Updated"
          value={profile.updatedAt}
        />
      </div>
      <div className="mt-7 flex flex-wrap gap-2">
        {detailTabs.map(([value, label, Icon]) => (
          <button
            key={value}
            onClick={() => onTabChange(value)}
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-md px-4 text-sm font-semibold",
              tab === value ? "bg-[#f1f1f3]" : "text-[#6f6f78]",
            )}
          >
            <Icon className="size-[18px]" />
            {label}
          </button>
        ))}
      </div>
      <div className="mt-5">
        {tab === "overview" && <Overview profile={profile} />}
        {tab === "prompts" && <Prompts profile={profile} />}
        {tab === "skills" && <ProfileSkills profile={profile} />}
        {tab === "blueprint" && <Blueprint profile={profile} />}
        {tab === "technical" && <Technical profile={profile} />}
      </div>
      <Button variant="outline" onClick={onBack} className="mt-7">
        <ArrowLeft className="size-4" /> Back to studio
      </Button>
    </section>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Headphones;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg border bg-white p-5">
      <div className="flex size-11 items-center justify-center rounded-md bg-[#f1f1f3]">
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-xs font-bold uppercase text-[#777780]">{label}</p>
        <p className="mt-1 text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}
