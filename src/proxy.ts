import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "font-src 'self' data:",
  "img-src 'self' data: https:",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "connect-src 'self' https://t.me https://api.whatsapp.com",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
]
  .join("; ")
  .trim();

const permissionPolicy = [
  "accelerometer=()",
  "ambient-light-sensor=()",
  "autoplay=()",
  "battery=()",
  "camera=()",
  "display-capture=()",
  "fullscreen=(self)",
  "geolocation=()",
  "gyroscope=()",
  "magnetometer=()",
  "microphone=()",
  "payment=()",
  "usb=()",
].join(", ");

const isProd = process.env.NODE_ENV === "production";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("Permissions-Policy", permissionPolicy);
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");

  if (isProd && request.headers.get("x-forwarded-proto") === "http") {
    const url = request.nextUrl.clone();
    url.protocol = "https";
    return NextResponse.redirect(url, 308);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
