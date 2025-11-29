import { NextResponse } from "next/server";

import { getHealthSnapshot } from "@/lib/runtime/health";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json(getHealthSnapshot(), {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
