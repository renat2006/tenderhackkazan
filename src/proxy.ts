import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Content Security Policy — разрешаем нужные источники
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

export function proxy(_request: NextRequest) {
  const response = NextResponse.next();

  // Security headers для всех запросов
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("Permissions-Policy", permissionPolicy);
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");

  // HTTPS редирект делает Caddy, не Next.js
  // Это позволяет health check работать по HTTP внутри Docker/сервера

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
