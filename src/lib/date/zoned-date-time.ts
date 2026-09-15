import {
  addDays as addDateDays,
  addMinutes as addDateMinutes,
} from "date-fns";
import {
  formatInTimeZone,
  fromZonedTime,
} from "date-fns-tz";

export const CLINIC_TIME_ZONE = "Europe/Madrid";

export function parseDate(value: string): Date {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }

  return date;
}

export function addDays(
  date: Date,
  days: number,
): Date {
  return addDateDays(date, days);
}

export function addMinutes(
  date: Date,
  minutes: number,
): Date {
  return addDateMinutes(date, minutes);
}

export function addCalendarDays(
  date: string,
  days: number,
): string {
  const value = new Date(`${date}T12:00:00Z`);

  value.setUTCDate(value.getUTCDate() + days);

  return value.toISOString().slice(0, 10);
}

export function getZonedDate(date: Date): string {
  return formatInTimeZone(
    date,
    CLINIC_TIME_ZONE,
    "yyyy-MM-dd",
  );
}

export function getZonedWeekday(date: Date): string {
  return formatInTimeZone(
    date,
    CLINIC_TIME_ZONE,
    "EEEE",
  ).toUpperCase();
}

export function createZonedDateTime(
  date: string,
  time: string,
): Date {
  return fromZonedTime(
    `${date}T${time}:00`,
    CLINIC_TIME_ZONE,
  );
}

export function toMinutes(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);

  return hours * 60 + minutes;
}

export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours.toString().padStart(2, "0")}:${remainingMinutes
    .toString()
    .padStart(2, "0")}`;
}