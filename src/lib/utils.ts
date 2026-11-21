/** Joins class names, skipping falsy values. */
export function cn(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(' ');
}

/** True for absolute http(s) or protocol-relative URLs. */
export function isExternalHref(href: string): boolean {
  return /^(https?:)?\/\//i.test(href);
}

/** True for in-app routes such as "/contact". */
export function isInternalHref(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//');
}