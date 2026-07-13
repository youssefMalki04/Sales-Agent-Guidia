import type { CrmExportResult, LeadExportPayload } from "./types";

function buildSlackMessage(lead: LeadExportPayload) {
  const title = lead.name ?? lead.company ?? lead.email ?? "Nouveau lead";
  const score =
    typeof lead.conversionScore === "number"
      ? `${lead.conversionScore}/100`
      : "non calcule";

  return {
    text: `Leadia - ${title}`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `Lead qualifie: ${title}`,
          emoji: false,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Score*\n${score}`,
          },
          {
            type: "mrkdwn",
            text: `*Temperature*\n${lead.leadTemperature ?? "unknown"}`,
          },
          {
            type: "mrkdwn",
            text: `*Entreprise*\n${lead.company ?? "-"}`,
          },
          {
            type: "mrkdwn",
            text: `*Urgence*\n${lead.urgency ?? "-"}`,
          },
          {
            type: "mrkdwn",
            text: `*Budget*\n${lead.budget ?? "-"}`,
          },
          {
            type: "mrkdwn",
            text: `*Secteur*\n${lead.sector ?? "-"}`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Besoin*\n${lead.need ?? lead.summary ?? "-"}`,
        },
      },
    ],
  };
}

export async function sendLeadToSlack(
  lead: LeadExportPayload,
): Promise<CrmExportResult> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    return {
      target: "slack",
      status: "skipped",
      message: "SLACK_WEBHOOK_URL is not configured",
    };
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildSlackMessage(lead)),
  });

  const responseText = await response.text();

  if (!response.ok) {
    return {
      target: "slack",
      status: "failed",
      message: `Slack responded with ${response.status}`,
      response: responseText,
    };
  }

  return {
    target: "slack",
    status: "sent",
    message: "Lead sent to Slack",
    response: responseText,
  };
}
