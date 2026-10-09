import { supabaseAdmin } from "@/lib/database/supabase-admin";
import { overlapsMeeting, type MeetingSlot } from "./conflicts";

export async function checkMeetingConflict(slot: MeetingSlot): Promise<Response | null> {
  if (slot.status === "cancelled" || slot.status === "completed" || slot.status === "no_show") return null;
  const day = Date.parse(`${slot.date}T00:00:00Z`);
  const from = new Date(day - 86400000).toISOString().slice(0, 10);
  const to = new Date(day + 86400000).toISOString().slice(0, 10);
  for (let offset = 0; ; offset += 100) {
    const { data, error } = await supabaseAdmin.from("meetings")
      .select("id,owner,scheduled_date,scheduled_time,duration,status")
      .gte("scheduled_date", from).lte("scheduled_date", to)
      .in("status", ["pending", "confirmed"]).is("archived_at", null).order("id").range(offset, offset + 99);
    if (error) return Response.json({ error: "Impossible de vérifier les disponibilités. Réessayez." }, { status: 503 });
    const conflict = (data ?? []).find((row) => overlapsMeeting(slot, { id: row.id, owner: row.owner, date: row.scheduled_date, time: row.scheduled_time, duration: row.duration, status: row.status }));
    if (conflict) return Response.json({ code: "MEETING_CONFLICT", error: `${slot.owner} a déjà un rendez-vous le ${conflict.scheduled_date} à ${String(conflict.scheduled_time).slice(0, 5)} (${conflict.duration} min). Choisissez un autre créneau ou responsable.` }, { status: 409 });
    if (!data || data.length < 100) return null;
  }
}
