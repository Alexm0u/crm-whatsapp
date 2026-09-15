import { calculateSlots } from "../src/lib/availability/calculate-slots";
import type {
  CalculateSlotsInput,
} from "../src/lib/availability/calculate-slots";

const input: CalculateSlotsInput = {
  schedules: [
    {
      id: 1,
      physiotherapistId: 1,
      dayOfWeek: "MONDAY",
      startTime: "09:00",
      endTime: "14:00",
      createdAt: "",
      updatedAt: "",
    },
  ],
  exceptions: [],
  appointments: [],
  from: "2026-09-15T08:00:00+02:00",
  limit: 3,
};

console.log(calculateSlots(input));