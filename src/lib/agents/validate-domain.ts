/**
 * Valide qu'une origine (ex: "https://app.client-a.com") correspond au
 * pattern allowedDomains stocké pour un agent (ex: "*.client-a.com" ou
 * une liste séparée par virgules "client-a.com,client-b.com").
 *
 * Le wildcard "*" seul autorise tout (utile en dev / agents publics).
 */
export function isOriginAllowed(
  origin: string | null,
  allowedDomains: string,
): boolean {
  if (allowedDomains.trim() === "*") {
    return true;
  }

  if (!origin) {
    return false;
  }

  let hostname: string;

  try {
    hostname = new URL(origin).hostname.toLowerCase();
  } catch {
    return false;
  }

  const patterns = allowedDomains
    .split(",")
    .map((pattern) => pattern.trim().toLowerCase())
    .filter(Boolean);

  return patterns.some((pattern) => matchesDomainPattern(hostname, pattern));
}

function matchesDomainPattern(hostname: string, pattern: string): boolean {
  if (pattern.startsWith("*.")) {
    const baseDomain = pattern.slice(2);
    return hostname === baseDomain || hostname.endsWith(`.${baseDomain}`);
  }

  return hostname === pattern;
}