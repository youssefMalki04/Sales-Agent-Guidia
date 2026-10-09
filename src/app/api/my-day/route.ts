import { supabaseAdmin } from "@/lib/database/supabase-admin";
import { safeMeetingUrl } from "@/lib/meetings/video-url";

export const runtime = "nodejs";

export async function GET() {
  const now = new Date();
  const today = localDate(now);
  const currentOwnerEmail = "yosra@leadia.ai";

  const [tasksResult, leadsResult, meetingsResult, unplannedResult] = await Promise.all([
    supabaseAdmin
      .from("follow_up_reminders")
      .select(
        "id,lead_id,title,due_at,priority,status,assigned_to,assigned_to_email,leads(name,email,company)",
      )
      .eq("status", "upcoming")
      .or(
        `assigned_to_email.eq.${currentOwnerEmail},assigned_to_email.is.null`,
      )
      .order("due_at", { ascending: true })
      .limit(20),
    supabaseAdmin
      .from("leads")
      .select(
        "id,name,email,company,conversion_score,lead_temperature,suggested_next_action",
      )
      .or("lead_temperature.eq.hot,conversion_score.gte.70")
      .order("conversion_score", { ascending: false })
      .limit(5),
    supabaseAdmin
      .from("meetings")
      .select(
        "*",
      )
      .gte("scheduled_date", today)
      .in("status", ["confirmed", "pending"])
      .is("archived_at", null)
      .order("scheduled_date", { ascending: true })
      .order("scheduled_time", { ascending: true })
      .limit(5),
    // Filter before limiting: a reminder assigned to any teammate, including
    // an overdue one, already provides a next action for this lead.
    supabaseAdmin
      .from("leads")
      .select("id,name,email,company,conversion_score,pipeline_stage,open_follow_ups:follow_up_reminders()", { count: "exact" })
      .in("pipeline_stage", ["new", "qualified", "meeting", "proposal"])
      .eq("open_follow_ups.status", "upcoming")
      .is("open_follow_ups", null)
      .order("conversion_score", { ascending: false })
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .limit(5),
  ]);

  const error = tasksResult.error || leadsResult.error || meetingsResult.error || unplannedResult.error;
  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({
    generatedAt: now.toISOString(),
    unplannedLeads: (unplannedResult.data ?? []).map((lead) => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      company: lead.company,
      score: lead.conversion_score ?? 0,
      stage: lead.pipeline_stage,
    })),
    unplannedLeadCount: unplannedResult.count ?? unplannedResult.data?.length ?? 0,
    hotLeads: (leadsResult.data ?? []).map((lead) => ({
      company: lead.company,
      email: lead.email,
      id: lead.id,
      name: lead.name,
      nextAction: lead.suggested_next_action,
      score: lead.conversion_score ?? 0,
      temperature: lead.lead_temperature,
    })),
    meetings: (meetingsResult.data ?? []).map((meeting) => ({
      company: meeting.company,
      date: meeting.scheduled_date,
      duration: meeting.duration,
      id: meeting.id,
      prospect: meeting.prospect,
      status: meeting.status,
      time: String(meeting.scheduled_time).slice(0, 5),
      title: meeting.title,
      videoUrl: safeMeetingUrl(meeting.video_url),
    })),
    tasks: (tasksResult.data ?? []).map((task) => ({
      assignedTo: task.assigned_to,
      dueAt: task.due_at,
      id: task.id,
      lead: Array.isArray(task.leads) ? task.leads[0] : task.leads,
      leadId: task.lead_id,
      priority: task.priority,
      title: task.title,
    })),
  });
}

function localDate(date: Date) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}
