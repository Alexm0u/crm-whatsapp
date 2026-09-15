import { NextResponse } from "next/server";

import {
  availabilitySearchRequestSchema,
  availabilitySearchResponseSchema,
} from "@/lib/api/availability";

import { calculateSlots } from "@/lib/availability/calculate-slots";
import { getAvailabilityData } from "@/lib/availability/get-availability-data";

export async function POST(request: Request) {
  const result =
    availabilitySearchRequestSchema.safeParse(
      await request.json(),
    );

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Invalid request body",
        details: result.error.issues,
      },
      { status: 400 },
    );
  }

  const requestData = result.data;

  const data = await getAvailabilityData(
    requestData.physiotherapistId,
  );

  const response = calculateSlots({
    ...data,
    from: requestData.from,
    limit: requestData.limit,
    cursor: requestData.cursor,
  });

  return NextResponse.json(
    availabilitySearchResponseSchema.parse(response),
  );
}