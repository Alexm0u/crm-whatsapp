import { NextResponse } from "next/server";
import {
  availabilitySearchRequestSchema,
} from "@/lib/api/availability";

export async function POST(request: Request) {
  const body: unknown = await request.json();

  const result = availabilitySearchRequestSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Invalid request body",
        details: result.error.issues,
      },
      { status: 400 },
    );
  }

  const availabilityRequest = result.data;

  return NextResponse.json({
    received: availabilityRequest,
  });
}