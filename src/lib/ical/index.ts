import { hackPacificTime, schoolYear, timeZone } from '@/lib/dates';
import { compareAsc, getDay, getMonth, getWeekOfMonth, isAfter, isBefore } from 'date-fns';
import { format as formatTz, toZonedTime } from 'date-fns-tz';

import ical from 'node-ical';

// Public URL for Google Calendar
const url = process.env.PUBLIC_CALENDAR_URL ?? '';

interface Event {
  start: Date;
  title: string;
  location: string;
}

const formatDates = (events: Event[]) => {
  const sortedEvents = events.sort((a, b) => compareAsc(a.start, b.start));
  return sortedEvents.map((event) => {
    return {
      ...event,
      dow: getDay(event.start),
      month: formatTz(event.start, 'MMMM', { timeZone }),
      monthIdx: getMonth(event.start),
      start: event.start,
      shortDate: formatTz(event.start, 'M/d', {
        timeZone,
      }),
      weekOfMonth: getWeekOfMonth(event.start),
    };
  });
};

export const parseEvents = async () => {
  const { start, end } = schoolYear();
  const events = await ical.async.fromURL(url);

  const yearsEvents = [];
  const rawEvents = [];

  for (const event of Object.values(events)) {
    if (event.type !== 'VEVENT') continue;
    const eventStart = event.start;
    if (!eventStart) continue;
    if (isBefore(eventStart, start)) continue;
    if (isAfter(eventStart, end)) continue;

    rawEvents.push({
      ...event,
      startTz: toZonedTime(event.start, timeZone),
    });

    yearsEvents.push({
      start: event.datetype === 'date' ? hackPacificTime(event.start) : toZonedTime(event.start, timeZone),
      dateType: event.datetype,
      title: event.summary,
      location: event.location,
    } as Event);
  }

  return { formatted: formatDates(yearsEvents), raw: rawEvents };
};
