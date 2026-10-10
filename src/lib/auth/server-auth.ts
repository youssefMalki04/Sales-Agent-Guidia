import { createClient } from "@supabase/supabase-js";
import { trustedOrganizationId } from "./trusted-organization";

export type ServerAuthContext = {
  isAuthenticated: boolean;
  orgId: string | null;
  role: string;
  userId: string | null;
};

export type ServerAuthResult =
  | {
      ok: true;
      auth: ServerAuthContext;
      response: Response;
    }
  | {
      ok: false;
      auth: ServerAuthContext;
      response: Response;
    };

function buildSupabaseAuthClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl.replace(/\/rest\/v1\/?$/, ""), supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function authIsRequired() {
  return process.env.NODE_ENV === "production" || process.env.REQUIRE_SERVER_AUTH === "true";
}

export async function getServerAuthContext(
  request: Request,
): Promise<ServerAuthContext> {
  if (!authIsRequired()) {
    const orgIdHeader =
      request.headers.get("x-org-id") ??
      request.headers.get("x-tenant-id") ??
      null;
    return {
      isAuthenticated: true,
      orgId: orgIdHeader?.trim() || "demo-org",
      role: "developer",
      userId: "local-dev-user",
    };
  }

  const authorization = request.headers.get("authorization") ?? "";
  const bearerToken = authorization.match(/^Bearer\s+(.+)$/i)?.[1]?.trim() ?? null;
  const orgIdHeader =
    request.headers.get("x-org-id") ??
    request.headers.get("x-tenant-id") ??
    null;
  const requestedOrgId = orgIdHeader?.trim() || null;

  if (!bearerToken) {
    return {
      isAuthenticated: false,
      orgId: requestedOrgId,
      role: "anonymous",
      userId: null,
    };
  }

  const client = buildSupabaseAuthClient();
  if (!client) {
    return {
      isAuthenticated: false,
      orgId: requestedOrgId,
      role: "anonymous",
      userId: null,
    };
  }

  try {
    const {
      data: { user },
      error,
    } = await client.auth.getUser(bearerToken);

    if (error || !user) {
      return {
        isAuthenticated: false,
        orgId: requestedOrgId,
        role: "anonymous",
        userId: null,
      };
    }

    // Only server-managed metadata can grant organization access.
    // Headers select a scope; they must never grant membership.
    const userOrgId = trustedOrganizationId(user.app_metadata);

    return {
      isAuthenticated: true,
      orgId: userOrgId,
      role: (user.app_metadata?.role as string | undefined) ?? "user",
      userId: user.id,
    };
  } catch {
    return {
      isAuthenticated: false,
      orgId: requestedOrgId,
      role: "anonymous",
      userId: null,
    };
  }
}

export async function requireServerAuth(
  request: Request,
  options: {
    requireOrg?: boolean;
    allowedRoles?: string[];
  } = {},
): Promise<ServerAuthResult> {
  const { requireOrg = true, allowedRoles = [] } = options;
  if (!authIsRequired()) {
    const localOrgId =
      request.headers.get("x-org-id") ??
      request.headers.get("x-tenant-id") ??
      "demo-org";
    return {
      ok: true,
      auth: {
        isAuthenticated: true,
        orgId: localOrgId.trim() || "demo-org",
        role: "developer",
        userId: "local-dev-user",
      },
      response: Response.json({ ok: true }),
    };
  }

  const auth = await getServerAuthContext(request);

  if (!auth.isAuthenticated) {
    return {
      ok: false,
      auth,
      response: Response.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const headerOrgId =
    request.headers.get("x-org-id") ??
    request.headers.get("x-tenant-id") ??
    null;
  const requestedOrgId = headerOrgId?.trim() || null;

  if (requireOrg && !auth.orgId) {
    return {
      ok: false,
      auth,
      response: Response.json(
        { error: "Organization scope required" },
        { status: 400 },
      ),
    };
  }

  if (requestedOrgId && requestedOrgId !== auth.orgId) {
    return {
      ok: false,
      auth,
      response: Response.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(auth.role)) {
    return {
      ok: false,
      auth,
      response: Response.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return {
    ok: true,
    auth,
    response: Response.json({ ok: true }),
  };
}
