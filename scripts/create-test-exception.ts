import { db } from "../src/prisma/db";

await db.orm.public.ScheduleException.createAll([
  {
    physiotherapistId: 1,
    date: "2026-09-15",
    type: "CLOSED",
    startTime: null,
    endTime: null,
    notes: "Test exception",
  },
]);

console.log("Test exception created");