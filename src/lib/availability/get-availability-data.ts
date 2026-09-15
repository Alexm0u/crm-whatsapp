import { db } from "@/prisma/db";

export async function getAvailabilityData(
  physiotherapistId?: number,
) {
  const filter = physiotherapistId
    ? { physiotherapistId }
    : undefined;

  const [schedules, exceptions, appointments] =
    await Promise.all([
      filter
        ? db.orm.public.WeeklySchedule.where(filter).all()
        : db.orm.public.WeeklySchedule.all(),

      filter
        ? db.orm.public.ScheduleException.where(filter).all()
        : db.orm.public.ScheduleException.all(),

      filter
        ? db.orm.public.Appointment.where(filter).all()
        : db.orm.public.Appointment.all(),
    ]);

  return {
    schedules,
    exceptions,
    appointments,
  };
}