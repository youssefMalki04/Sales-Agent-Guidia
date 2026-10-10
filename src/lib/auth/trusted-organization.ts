/** Organization assignments must be written by a trusted server/admin only. */
export function trustedOrganizationId(
  appMetadata: Record<string, unknown> | undefined,
): string | null {
  const value = appMetadata?.organization_id;
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
