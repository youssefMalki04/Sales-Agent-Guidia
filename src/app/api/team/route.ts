import { z } from "zod";

import { requireServerAuth } from "@/lib/auth/server-auth";
import { supabaseAdmin } from "@/lib/database/supabase-admin";

export const runtime = "nodejs";

const roleSchema = z.enum(["admin", "manager", "sales"]);
const statusSchema = z.enum(["active", "pending", "disabled"]);

const teamMemberSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  role: roleSchema,
  status: statusSchema.default("pending"),
  activeLeads: z.number().int().min(0).default(0),
  meetings: z.number().int().min(0).default(0),
  conversion: z.number().int().min(0).max(100).default(0),
  capacity: z.number().int().min(0).default(0),
});

const teamMembersSchema = z.array(teamMemberSchema);

const DEFAULT_TEAM_MEMBERS = [
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
] as const;

function normalizeMember(input: unknown, fallbackId?: string) {
  const parsed = teamMemberSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error("Invalid team member");
  }

  return {
    ...parsed.data,
    id: parsed.data.id ?? fallbackId ?? crypto.randomUUID(),
  };
}

function isMissingTableError(value: unknown) {
  const message = value instanceof Error ? value.message : String(value ?? "");
  return /relation .*team_members.* does not exist|does not exist|not exist/i.test(message);
}

async function listMembersFromDatabase() {
  const { data, error } = await supabaseAdmin
    .from("team_members")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    status: row.status,
    activeLeads: Number(row.active_leads ?? 0),
    meetings: Number(row.meetings ?? 0),
    conversion: Number(row.conversion ?? 0),
    capacity: Number(row.capacity ?? 0),
  }));
}

export async function GET(request: Request) {
  const auth = await requireServerAuth(request, { requireOrg: true });
  if (!auth.ok) return auth.response;

  try {
    const members = await listMembersFromDatabase();
    return Response.json({ members }, { status: 200 });
  } catch (error) {
    if (isMissingTableError(error)) {
      return Response.json({ members: [...DEFAULT_TEAM_MEMBERS] }, { status: 200 });
    }
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unable to load team members",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireServerAuth(request, { requireOrg: true });
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const member = normalizeMember({
      ...body,
      status: body?.status ?? "pending",
      role: body?.role ?? "sales",
    });

    try {
      const { data, error } = await supabaseAdmin
        .from("team_members")
        .insert({
          id: member.id,
          name: member.name,
          email: member.email,
          role: member.role,
          status: member.status,
          active_leads: member.activeLeads,
          meetings: member.meetings,
          conversion: member.conversion,
          capacity: member.capacity,
          organization_id: auth.auth.orgId ?? "demo-org",
        })
        .select("*")
        .single();

      if (error) throw new Error(error.message);
      return Response.json({ member: { ...member, id: data?.id ?? member.id } }, { status: 201 });
    } catch (databaseError) {
      if (isMissingTableError(databaseError)) {
        return Response.json({ member }, { status: 201 });
      }
      throw databaseError;
    }
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Invalid team member payload",
      },
      { status: 400 },
    );
  }
}

export async function PUT(request: Request) {
  const auth = await requireServerAuth(request, { requireOrg: true });
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as { members?: unknown };
    const members = teamMembersSchema.parse(body.members ?? []);

    try {
      for (const member of members) {
        await supabaseAdmin.from("team_members").upsert(
          {
            id: member.id ?? crypto.randomUUID(),
            name: member.name,
            email: member.email,
            role: member.role,
            status: member.status,
            active_leads: member.activeLeads,
            meetings: member.meetings,
            conversion: member.conversion,
            capacity: member.capacity,
            organization_id: auth.auth.orgId ?? "demo-org",
          },
          { onConflict: "id" },
        );
      }
      return Response.json({ ok: true, members }, { status: 200 });
    } catch (databaseError) {
      if (isMissingTableError(databaseError)) {
        return Response.json({ ok: true, members }, { status: 200 });
      }
      throw databaseError;
    }
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Invalid team payload",
      },
      { status: 400 },
    );
  }
}

export async function PATCH(request: Request) {
  const auth = await requireServerAuth(request, { requireOrg: true });
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as { id?: string; patch?: unknown };
    if (!body.id) {
      return Response.json({ error: "Member id is required" }, { status: 400 });
    }

    const member = normalizeMember({
      id: body.id,
      ...(body.patch ?? {}),
    });

    try {
      const { error } = await supabaseAdmin
        .from("team_members")
        .update({
          name: member.name,
          email: member.email,
          role: member.role,
          status: member.status,
          active_leads: member.activeLeads,
          meetings: member.meetings,
          conversion: member.conversion,
          capacity: member.capacity,
        })
        .eq("id", body.id);

      if (error) throw new Error(error.message);
      return Response.json({ member }, { status: 200 });
    } catch (databaseError) {
      if (isMissingTableError(databaseError)) {
        return Response.json({ member }, { status: 200 });
      }
      throw databaseError;
    }
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unable to update team member",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  const auth = await requireServerAuth(request, { requireOrg: true });
  if (!auth.ok) return auth.response;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return Response.json({ error: "Member id is required" }, { status: 400 });
  }

  try {
    const { error } = await supabaseAdmin.from("team_members").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return Response.json({ ok: true }, { status: 200 });
  } catch (databaseError) {
    if (isMissingTableError(databaseError)) {
      return Response.json({ ok: true }, { status: 200 });
    }
    return Response.json(
      {
        error:
          databaseError instanceof Error
            ? databaseError.message
            : "Unable to delete team member",
      },
      { status: 500 },
    );
  }
}
