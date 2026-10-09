export type MeetingStatus = "confirmed" | "pending" | "completed" | "cancelled" | "no_show";
export type Meeting = {
  archivedAt?: string | null;
  reportCount?: number;
  leadId?: string | null;
  videoUrl?: string | null;
  id: string;
  title: string;
  prospect: string;
  company: string;
  email: string;
  owner: string;
  date: string;
  time: string;
  duration: number;
  status: MeetingStatus;
  source: string;
  notes: string;
};

export const STORAGE_KEY = "leadia-sales-meetings-v1";
export const today = new Date();
export const year = today.getFullYear();
export const month = today.getMonth();
export const isoDate = (day: number) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

export const initialMeetings: Meeting[] = [
  {
    id: "meeting-1",
    title: "Product discovery",
    prospect: "Amira Ben Salah",
    company: "Nexa Retail",
    email: "amira@nexa.tn",
    owner: "Yosra",
    date: isoDate(Math.min(today.getDate() + 1, 27)),
    time: "10:00",
    duration: 30,
    status: "confirmed",
    source: "AI Widget",
    notes: "Discuss HubSpot integration and qualification volume.",
  },
  {
    id: "meeting-2",
    title: "Technical demo",
    prospect: "Thomas Martin",
    company: "Flowdesk",
    email: "thomas@flowdesk.fr",
    owner: "Sami",
    date: isoDate(Math.min(today.getDate() + 2, 28)),
    time: "14:30",
    duration: 45,
    status: "pending",
    source: "Live Inbox",
    notes: "Salesforce connector and deployment timeline.",
  },
  {
    id: "meeting-3",
    title: "Security review",
    prospect: "Sara Trabelsi",
    company: "Kite Finance",
    email: "sara@kite.tn",
    owner: "Yosra",
    date: isoDate(Math.min(today.getDate() + 4, 28)),
    time: "11:00",
    duration: 30,
    status: "confirmed",
    source: "AI Widget",
    notes: "Data hosting, retention and access controls.",
  },
  {
    id: "meeting-4",
    title: "Follow-up",
    prospect: "Lina Mansour",
    company: "Atlas Cloud",
    email: "lina@atlas.io",
    owner: "Sami",
    date: isoDate(Math.max(today.getDate() - 2, 1)),
    time: "09:30",
    duration: 30,
    status: "completed",
    source: "Manual",
    notes: "Proposal follow-up completed.",
  },
];
