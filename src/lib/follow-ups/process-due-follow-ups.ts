import { supabaseAdmin } from "@/lib/database/supabase-admin";
import { createNotification } from "@/lib/notifications/create-notification";

type DueReminder = {
  assigned_to_email: string | null;
  due_at: string;
  id: string;
  lead_id: string;
  notes: string | null;
  priority: "low" | "medium" | "high" | "urgent";
  title: string;
};

export async function processDueFollowUps(now = new Date()) {
  const soonCutoff = new Date(now.getTime() + 60 * 60 * 1_000);
  const { data: upcomingData, error: upcomingError } = await supabaseAdmin
    .from("follow_up_reminders")
    .select("id,lead_id,title,notes,due_at,assigned_to_email,priority")
    .eq("status", "upcoming")
    .is("upcoming_notified_at", null)
    .gt("due_at", now.toISOString())
    .lte("due_at", soonCutoff.toISOString())
    .order("due_at", { ascending: true })
    .limit(100);
  if (upcomingError) throw new Error(upcomingError.message);

  const { data: overdueData, error } = await supabaseAdmin
    .from("follow_up_reminders")
    .select("id,lead_id,title,notes,due_at,assigned_to_email,priority")
    .eq("status", "upcoming")
    .is("notified_at", null)
    .lte("due_at", now.toISOString())
    .order("due_at", { ascending: true })
    .limit(100);

  if (error) throw new Error(error.message);
  const upcoming = (upcomingData ?? []) as DueReminder[];
  const overdue = (overdueData ?? []) as DueReminder[];
  const reminders = [...upcoming, ...overdue];
  if (!reminders.length) return { processed: 0 };

  const leadIds = [...new Set(reminders.map((item) => item.lead_id))];
  const { data: leads, error: leadsError } = await supabaseAdmin
    .from("leads")
    .select("id,name,email,company")
    .in("id", leadIds);
  if (leadsError) throw new Error(leadsError.message);

  const leadById = new Map(
    (leads ?? []).map((lead) => [String(lead.id), lead]),
  );
  let processed = 0;

  for (const reminder of upcoming) {
    const lead = leadById.get(reminder.lead_id);
    const leadName = lead?.name || lead?.company || lead?.email || "Lead";
    await createNotification({
      actionUrl: `/dashboard/tasks?task=${reminder.id}`,
      eventKey: `follow-up-soon:${reminder.id}:${reminder.due_at}`,
      eventType: "follow-up-due",
      emailRecipients: reminder.assigned_to_email
        ? [reminder.assigned_to_email]
        : undefined,
      leadId: reminder.lead_id,
      message: `${leadName}: ${reminder.title} · ${new Date(reminder.due_at).toLocaleString("fr-FR")} · ${reminder.priority.toUpperCase()}`,
      severity: "warning",
      taskId: reminder.id,
      title: "Task due soon",
    });
    const { error: updateError } = await supabaseAdmin
      .from("follow_up_reminders")
      .update({ upcoming_notified_at: now.toISOString() })
      .eq("id", reminder.id)
      .is("upcoming_notified_at", null);
    if (updateError) throw new Error(updateError.message);
    processed += 1;
  }

  for (const reminder of overdue) {
    const lead = leadById.get(reminder.lead_id);
    const leadName = lead?.name || lead?.company || lead?.email || "Lead";
    const details = reminder.notes ? `\n${reminder.notes}` : "";

    await createNotification({
      actionUrl: `/dashboard/tasks?task=${reminder.id}`,
      eventKey: `follow-up-due:${reminder.id}:${reminder.due_at}`,
      eventType: "follow-up-due",
      emailRecipients: reminder.assigned_to_email
        ? [reminder.assigned_to_email]
        : undefined,
      leadId: reminder.lead_id,
      message: `${leadName}: ${reminder.title}\nPriority: ${reminder.priority.toUpperCase()}${details}`,
      severity: "error",
      taskId: reminder.id,
      title: "Task overdue",
    });

    const { error: updateError } = await supabaseAdmin
      .from("follow_up_reminders")
      .update({ notified_at: now.toISOString() })
      .eq("id", reminder.id)
      .is("notified_at", null);
    if (updateError) throw new Error(updateError.message);
    processed += 1;
  }

  return { processed };
}
