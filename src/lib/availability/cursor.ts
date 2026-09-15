import { z } from "zod";

const availabilityCursorSchema = z.object({
  startAt: z.string(),
  physiotherapistId: z.number().int().positive(),
});

type AvailabilityCursor = z.infer<
  typeof availabilityCursorSchema
>;

export function encodeAvailabilityCursor(
  cursor: AvailabilityCursor,
): string {
  return encodeURIComponent(JSON.stringify(cursor));
}

export function decodeAvailabilityCursor(
  value: string,
): AvailabilityCursor {
  const parsed: unknown = JSON.parse(
    decodeURIComponent(value),
  );

  return availabilityCursorSchema.parse(parsed);
}