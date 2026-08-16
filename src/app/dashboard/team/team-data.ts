export type Role = "admin" | "manager" | "sales";
export type MemberStatus = "active" | "pending" | "disabled";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: MemberStatus;
  activeLeads: number;
  meetings: number;
  conversion: number;
  capacity: number;
};

export const STORAGE_KEY = "leadia-team-v1";

export const initialMembers: TeamMember[] = [
  {
    id: "member-1",
    name: "Yosra Gadhgadhi",
    email: "yosra@leadia.ai",
    role: "admin",
    status: "active",
    activeLeads: 18,
    meetings: 12,
    conversion: 38,
    capacity: 72,
  },
  {
    id: "member-2",
    name: "Sami Ben Amor",
    email: "sami@leadia.ai",
    role: "manager",
    status: "active",
    activeLeads: 14,
    meetings: 9,
    conversion: 42,
    capacity: 56,
  },
  {
    id: "member-3",
    name: "Lina Mansour",
    email: "lina@leadia.ai",
    role: "sales",
    status: "active",
    activeLeads: 21,
    meetings: 11,
    conversion: 34,
    capacity: 84,
  },
  {
    id: "member-4",
    name: "Thomas Leroy",
    email: "thomas@leadia.ai",
    role: "sales",
    status: "pending",
    activeLeads: 0,
    meetings: 0,
    conversion: 0,
    capacity: 0,
  },
];
