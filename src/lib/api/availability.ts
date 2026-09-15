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

export const availabilityOptionSchema = z.object({
  physiotherapistId: z.number().int().positive(),
  startAt: z.string(),
});

export type AvailabilityOption = z.infer<
  typeof availabilityOptionSchema
>;

export const availabilitySearchResponseSchema = z.object({
  options: z.array(availabilityOptionSchema),
  nextCursor: z.string().nullable(),
});

export type AvailabilitySearchResponse = z.infer<
  typeof availabilitySearchResponseSchema
>;