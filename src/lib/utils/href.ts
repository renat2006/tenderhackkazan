import type { UrlObject } from "url";

export function toRouteHref(href: string): UrlObject {
  if (href.startsWith("/#")) {
    return {
      pathname: "/",
      hash: href.slice(2),
    } satisfies UrlObject;
  }

  return {
    pathname: href,
  } satisfies UrlObject;
}
