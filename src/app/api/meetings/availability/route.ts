import { z } from "zod";
import { supabaseAdmin } from "@/lib/database/supabase-admin";
import type { MeetingSlot } from "@/lib/meetings/conflicts";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const parsed = z.object({ date: z.iso.date(), owner: z.string().trim().min(1).max(200) }).safeParse({ date: params.get("date"), owner: params.get("owner") });
  if (!parsed.success) return Response.json({ error: "Choisissez une date et un responsable." }, { status: 400 });
  const day = Date.parse(`${parsed.data.date}T00:00:00Z`);
  const meetings: MeetingSlot[] = [];
  for (let offset = 0; ; offset += 100) {
    const { data, error } = await supabaseAdmin.from("meetings")
      .select("id,owner,scheduled_date,scheduled_time,duration,status")
      .gte("scheduled_date", new Date(day - 86400000).toISOString().slice(0, 10))
      .lte("scheduled_date", new Date(day + 86400000).toISOString().slice(0, 10))
      .in("status", ["pending", "confirmed"]).is("archived_at", null).order("id").range(offset, offset + 99);
    if (error) return Response.json({ error: "Impossible de vérifier les disponibilités. Réessayez." }, { status: 503 });
    for (const row of data ?? []) {
      if (row.owner.trim().toLowerCase() === parsed.data.owner.toLowerCase()) meetings.push({ id: row.id, owner: row.owner, date: row.scheduled_date, time: row.scheduled_time, duration: row.duration, status: row.status });
    }
    if (!data || data.length < 100) break;
  }
  return Response.json({ meetings }, { headers: { "Cache-Control": "no-store" } });
}
