import { z } from "zod";

import { supabaseAdmin } from "@/lib/database/supabase-admin";

export const runtime = "nodejs";

const allowedFields = ["name", "email", "company", "country", "sector", "score", "temperature", "status"] as const;
const rowSchema = z.object({
  name: z.string().trim().max(500).optional().default(""),
  email: z.string().trim().email(),
  company: z.string().trim().max(500).optional().default(""),
  country: z.string().trim().max(200).optional().default(""),
  sector: z.string().trim().max(300).optional().default(""),
  score: z.coerce.number().int().min(0).max(100).optional().default(0),
  temperature: z.string().trim().optional().default("cold"),
  status: z.string().trim().optional().default("new"),
});

function temperature(value: string) {
  const normalized = value.toLowerCase();
  if (["hot", "chaud"].includes(normalized)) return "hot";
  if (["warm", "tiède", "tiede"].includes(normalized)) return "warm";
  return "cold";
}

function status(row: Record<string, unknown>) {
  const crm = String(row.crm_status ?? "not_sent");
  if (crm === "sent") return "Won";
  if (crm === "failed") return "Failed";
  return Number(row.conversion_score ?? 0) >= 70 ? "Qualified" : "New";
}

function csvCell(value: unknown) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function xmlCell(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const format = url.searchParams.get("format") ?? "csv";
  const requested = (url.searchParams.get("fields") ?? allowedFields.join(",")).split(",");
  const fields = requested.filter((field): field is (typeof allowedFields)[number] => allowedFields.includes(field as never));
  const selection = url.searchParams.get("ids");
  const parsedIds = selection === null ? null : z.array(z.string().uuid()).min(1).max(50).safeParse(selection.split(","));
  if (parsedIds && !parsedIds.success) return Response.json({ error: "Select between 1 and 50 valid leads." }, { status: 400 });
  let query = supabaseAdmin.from("leads").select("name,email,company,country,sector,conversion_score,lead_temperature,crm_status,created_at", { count: "exact" }).order("created_at", { ascending: false });
  if (parsedIds?.success) query = query.in("id", [...new Set(parsedIds.data)]);
  const { data, error, count } = await query;
  if (error) return Response.json({ error: error.message }, { status: 502 });
  if (format === "count") return Response.json({ count: count ?? data.length });
  const rows = data.map((lead) => ({ name: lead.name, email: lead.email, company: lead.company, country: lead.country, sector: lead.sector, score: lead.conversion_score, temperature: lead.lead_temperature, status: status(lead) }));
  await supabaseAdmin.from("agent_events").insert({ event_type: "leads.exported", payload: { count: rows.length, fields, format } });
  if (format === "json") return Response.json({ leads: rows });
  if (format === "xls") {
    const tableRows = [
      fields.map((field) => `<Cell><Data ss:Type="String">${xmlCell(field)}</Data></Cell>`),
      ...rows.map((row) => fields.map((field) => `<Cell><Data ss:Type="String">${xmlCell(row[field])}</Data></Cell>`)),
    ];
    const workbook = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Leads"><Table>${tableRows.map((cells) => `<Row>${cells.join("")}</Row>`).join("")}</Table></Worksheet></Workbook>`;
    return new Response(workbook, {
      headers: {
        "Content-Disposition": `attachment; filename="leadia-leads-${new Date().toISOString().slice(0, 10)}.xls"`,
        "Content-Type": "application/vnd.ms-excel; charset=utf-8",
      },
    });
  }
  const csv = [fields.join(","), ...rows.map((row) => fields.map((field) => csvCell(row[field])).join(","))].join("\n");
  return new Response(`\uFEFF${csv}`, { headers: { "Content-Disposition": `attachment; filename="leadia-leads-${new Date().toISOString().slice(0, 10)}.csv"`, "Content-Type": "text/csv; charset=utf-8" } });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { rows?: unknown[]; duplicateMode?: "skip" | "update" };
    if (!Array.isArray(body.rows) || body.rows.length > 5000) return Response.json({ error: "Provide between 1 and 5000 rows." }, { status: 400 });
    const parsed = body.rows.map((row, index) => ({ index: index + 2, result: rowSchema.safeParse(row) }));
    const invalid = parsed.filter((item) => !item.result.success).map((item) => ({ row: item.index, error: item.result.error?.issues[0]?.message ?? "Invalid row" }));
    const valid = parsed.flatMap((item) => item.result.success ? [item.result.data] : []);
    const emails = [...new Set(valid.map((row) => row.email.toLowerCase()))];
    const { data: existing, error: lookupError } = await supabaseAdmin.from("leads").select("id,email").in("email", emails);
    if (lookupError) throw new Error(lookupError.message);
    const byEmail = new Map((existing ?? []).map((lead) => [String(lead.email).toLowerCase(), lead.id]));
    let imported = 0, updated = 0, skipped = 0;
    for (const row of valid) {
      const email = row.email.toLowerCase();
      const lead = { name: row.name || email.split("@")[0], email, company: row.company || null, country: row.country || null, sector: row.sector || null, conversion_score: row.score, lead_temperature: temperature(row.temperature) };
      const existingId = byEmail.get(email);
      if (existingId && body.duplicateMode !== "update") { skipped += 1; continue; }
      const result = existingId
        ? await supabaseAdmin.from("leads").update(lead).eq("id", existingId).select("id").single()
        : await supabaseAdmin.from("leads").insert({ ...lead, session_id: `import-${crypto.randomUUID()}` }).select("id").single();
      if (result.error) invalid.push({ row: parsed.find((item) => item.result.success && item.result.data.email.toLowerCase() === email)?.index ?? 0, error: result.error.message });
      else if (existingId) updated += 1;
      else { imported += 1; byEmail.set(email, result.data.id); }
    }
    await supabaseAdmin.from("agent_events").insert({ event_type: "leads.imported", payload: { imported, updated, skipped, invalid: invalid.length } });
    return Response.json({ imported, updated, skipped, invalid, total: body.rows.length });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Import failed" }, { status: 502 }); }
}
