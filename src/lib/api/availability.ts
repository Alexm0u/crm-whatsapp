import { z } from "zod";

export const availabilitySearchRequestSchema = z.object({
  physiotherapistId: z.number().int().positive().optional(),
  from: z.string(),
  limit: z.number().int().positive(),
  cursor: z.string().optional(),
});

export type AvailabilitySearchRequest = z.infer<
  typeof availabilitySearchRequestSchema
>;