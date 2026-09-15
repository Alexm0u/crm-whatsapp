import type { FieldOutputTypes } from "@/prisma/contract.d";

import {
  addCalendarDays,
  addMinutes,
  createZonedDateTime,
  formatTime,
  getZonedDate,
  getZonedWeekday,
  parseDate,
  toMinutes,
} from "@/lib/date/zoned-date-time";

import {
  decodeAvailabilityCursor,
  encodeAvailabilityCursor,
} from "@/lib/availability/cursor";

type WeeklySchedule =
  FieldOutputTypes["public"]["WeeklySchedule"];

type ScheduleException =
  FieldOutputTypes["public"]["ScheduleException"];

type Appointment =
  FieldOutputTypes["public"]["Appointment"];

export type AvailabilityOption = {
  physiotherapistId: number;
  startAt: string;
};

export type CalculateSlotsInput = {
  schedules: readonly WeeklySchedule[];
  exceptions: readonly ScheduleException[];
  appointments: readonly Appointment[];
  from: string;
  limit: number;
  cursor?: string;
};

export type CalculateSlotsResult = {
  options: AvailabilityOption[];
  nextCursor: string | null;
};

const SLOT_DURATION_MINUTES = 60;
const SLOT_START_MINUTE = 30;
const MAX_SEARCH_DAYS = 60;

export function calculateSlots(
  input: CalculateSlotsInput,
): CalculateSlotsResult {
  const from = parseDate(input.from);
  const cursor = input.cursor
    ? decodeAvailabilityCursor(input.cursor)
    : null;

  const exceptions = new Map(
    input.exceptions.map((exception) => [
      `${exception.physiotherapistId}:${exception.date}`,
      exception,
    ]),
  );

  const appointments = new Map<
    number,
    readonly Appointment[]
  >();

  for (const appointment of input.appointments) {
    const current =
      appointments.get(appointment.physiotherapistId) ?? [];

    appointments.set(
      appointment.physiotherapistId,
      [...current, appointment],
    );
  }

  const options: AvailabilityOption[] = [];

  for (
    let dayOffset = 0;
    dayOffset < MAX_SEARCH_DAYS;
    dayOffset += 1
  ) {
    const date = addCalendarDays(
      getZonedDate(from),
      dayOffset,
    );

    const dayOfWeek = getZonedWeekday(
      createZonedDateTime(date, "12:00"),
    );

    for (const schedule of input.schedules) {
      if (schedule.dayOfWeek !== dayOfWeek) {
        continue;
      }

      const exception = exceptions.get(
        `${schedule.physiotherapistId}:${date}`,
      );

      const range = getEffectiveRange(
        schedule,
        exception,
      );

      if (!range) {
        continue;
      }

      const start = toMinutes(range.startTime);
      const end = toMinutes(range.endTime);

      const firstSlot =
        start +
        ((SLOT_START_MINUTE - (start % 60) + 60) % 60);

      for (
        let minute = firstSlot;
        minute + SLOT_DURATION_MINUTES <= end;
        minute += 60
      ) {
        const slot = createZonedDateTime(
          date,
          formatTime(minute),
        );

        if (slot <= from) {
          continue;
        }

        if (
          isOccupied(
            slot,
            schedule.physiotherapistId,
            appointments.get(
              schedule.physiotherapistId,
            ) ?? [],
          )
        ) {
          continue;
        }

        const option: AvailabilityOption = {
          physiotherapistId:
            schedule.physiotherapistId,
          startAt: slot.toISOString(),
        };

        if (isAfterCursor(option, cursor)) {
          options.push(option);
        }
      }
    }
  }

  options.sort(
    (a, b) =>
      a.startAt.localeCompare(b.startAt) ||
      a.physiotherapistId - b.physiotherapistId,
  );

  const page = options.slice(0, input.limit);
  const last = page.at(-1);

  return {
    options: page,
    nextCursor: last
      ? encodeAvailabilityCursor(last)
      : null,
  };
}

function isAfterCursor(
  option: AvailabilityOption,
  cursor: AvailabilityOption | null,
): boolean {
  if (!cursor) {
    return true;
  }

  return (
    option.startAt > cursor.startAt ||
    (
      option.startAt === cursor.startAt &&
      option.physiotherapistId > cursor.physiotherapistId
    )
  );
}

function getEffectiveRange(
  schedule: WeeklySchedule,
  exception: ScheduleException | undefined,
): Pick<WeeklySchedule, "startTime" | "endTime"> | null {
  if (!exception) {
    return schedule;
  }

  if (exception.type === "CLOSED") {
    return null;
  }

  if (
    exception.startTime === null ||
    exception.endTime === null
  ) {
    return schedule;
  }

  return {
    startTime: exception.startTime,
    endTime: exception.endTime,
  };
}

function isOccupied(
  slot: Date,
  physiotherapistId: number,
  appointments: readonly Appointment[],
): boolean {
  const slotEnd = addMinutes(
    slot,
    SLOT_DURATION_MINUTES,
  );

  return appointments.some((appointment) => {
    if (
      appointment.physiotherapistId !==
      physiotherapistId
    ) {
      return false;
    }

    const appointmentStart = parseDate(
      appointment.startAt,
    );

    const appointmentEnd = addMinutes(
      appointmentStart,
      SLOT_DURATION_MINUTES,
    );

    return (
      slot < appointmentEnd &&
      slotEnd > appointmentStart
    );
  });
}