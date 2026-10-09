import { supabaseAdmin } from "@/lib/database/supabase-admin";

type EmailNotification = {
  eventType: string;
  message: string;
  title: string;
};

export type EmailDeliveryResult = {
  message: string;
  status: "sent" | "skipped" | "failed";
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function readPreferences() {
  const { data, error } = await supabaseAdmin
    .from("notification_preferences")
    .select("enabled_events,recipient_emails")
    .eq("id", "default")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return {
    enabledEvents: (data?.enabled_events ?? []) as string[],
    recipients: (data?.recipient_emails ?? []) as string[],
  };
}

async function deliverEmail(
  recipients: string[],
  notification: EmailNotification,
): Promise<EmailDeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { status: "skipped", message: "RESEND_API_KEY is not configured" };
  }
  if (recipients.length === 0) {
    return {
      status: "skipped",
      message: "No notification recipients configured",
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:
          process.env.NOTIFICATION_EMAIL_FROM ??
          "Leadia <onboarding@resend.dev>",
        to: recipients,
        subject: `[Leadia] ${notification.title}`,
        text: `${notification.title}\n\n${notification.message}`,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#202026"><h2>${escapeHtml(notification.title)}</h2><p style="white-space:pre-wrap">${escapeHtml(notification.message)}</p><hr style="border:0;border-top:1px solid #e5e7eb"><p style="font-size:12px;color:#73737d">Sent by Leadia AI Sales</p></div>`,
      }),
    });
    const payload = (await response.json().catch(() => null)) as {
      id?: string;
      message?: string;
    } | null;

    if (!response.ok) {
      return {
        status: "failed",
        message: payload?.message ?? `Resend responded with ${response.status}`,
      };
    }
    return {
      status: "sent",
      message: payload?.id ? `Email sent (${payload.id})` : "Email sent",
    };
  } catch (error) {
    return {
      status: "failed",
      message: error instanceof Error ? error.message : "Email delivery failed",
    };
  }
}

export async function sendConfiguredNotificationEmail(
  notification: EmailNotification,
  recipientsOverride?: string[],
): Promise<EmailDeliveryResult> {
  try {
    const preferences = await readPreferences();
    if (!preferences.enabledEvents.includes(notification.eventType)) {
      return { status: "skipped", message: "Email disabled for this event" };
    }
    return deliverEmail(
      recipientsOverride ?? preferences.recipients,
      notification,
    );
  } catch (error) {
    return {
      status: "failed",
      message:
        error instanceof Error
          ? error.message
          : "Unable to read email preferences",
    };
  }
}

export async function sendTestNotificationEmail(): Promise<EmailDeliveryResult> {
  try {
    const preferences = await readPreferences();
    return deliverEmail(preferences.recipients, {
      eventType: "test-email",
      title: "Test notification",
      message: "Your Leadia email notifications are configured correctly.",
    });
  } catch (error) {
    return {
      status: "failed",
      message:
        error instanceof Error
          ? error.message
          : "Unable to read email preferences",
    };
  }
}

export async function sendLeadEmail(
  recipient: string,
  subject: string,
  message: string,
): Promise<EmailDeliveryResult> {
  return deliverEmail([recipient], {
    eventType: "lead-email",
    title: subject,
    message,
  });
}
