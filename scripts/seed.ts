import { db } from "../src/prisma/db";

const physiotherapists = await db.orm.public.Physiotherapist.createAll([
  {
    fullName: "Carmen P",
  },
  {
    fullName: "Alex M",
  },
]);

await db.orm.public.WeeklySchedule.createAll([
  {
    physiotherapistId: physiotherapists[0].id,
    dayOfWeek: "MONDAY",
    startTime: "09:00",
    endTime: "14:00",
  },
  {
    physiotherapistId: physiotherapists[0].id,
    dayOfWeek: "TUESDAY",
    startTime: "09:00",
    endTime: "14:00",
  },
  {
    physiotherapistId: physiotherapists[1].id,
    dayOfWeek: "MONDAY",
    startTime: "15:00",
    endTime: "20:00",
  },
  {
    physiotherapistId: physiotherapists[1].id,
    dayOfWeek: "TUESDAY",
    startTime: "15:00",
    endTime: "20:00",
  },
]);