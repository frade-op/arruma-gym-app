/**
 * Aceita apenas caminhos internos. Evita open redirect
 * (ex.: "//evil.com", "https://evil.com", "/\evil.com").
 */
export function getSafeRedirect(target: unknown, fallback = "/"): string {
  if (typeof target !== "string") return fallback;
  if (!target.startsWith("/") || target.startsWith("//") || target.includes("\\")) return fallback;
  return target;
}
