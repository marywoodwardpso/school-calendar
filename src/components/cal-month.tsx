'use client';

import { type CalendarEvent, buildDates } from '@/lib/dates';

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

interface Props {
  events: CalendarEvent[];
  month: string;
}

export const CalMonth = ({ events = [], month }: Props) => {
  const days = buildDates(events, month);

  return (
    <article className='overflow-hidden rounded-2xl bg-white p-4 shadow-[0_0_0_1px_rgba(15,23,42,0.06),0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_rgba(15,23,42,0.04)] sm:grid sm:grid-cols-[minmax(0,1.1fr)_minmax(10rem,0.9fr)] sm:gap-5 sm:p-5 dark:bg-slate-900 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.09)]'>
      <div>
        <h2 className='text-center text-base font-bold text-slate-950 dark:text-white'>{month}</h2>
        <div className='mt-3 grid grid-cols-7 text-center text-xs font-semibold text-slate-500 dark:text-slate-400'>
          <div>S</div>
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
        </div>
        <div className='mt-1 grid grid-cols-7 text-sm tabular-nums'>
          {days.map((day, dayIdx) => (
            <div
              key={day.date}
              className={classNames(
                dayIdx > 6 && 'border-t border-slate-200 dark:border-slate-700',
                'flex min-h-10 items-center justify-center py-1',
              )}
            >
              <time
                dateTime={day.date}
                className={classNames(
                  day.hasEvent && 'text-white',
                  !day.hasEvent && day.isToday && 'text-amber-600 dark:text-amber-400',
                  !day.hasEvent && !day.isToday && day.isCurrentMonth && 'text-slate-800 dark:text-slate-200',
                  !day.isToday && !day.isCurrentMonth && 'text-slate-300 dark:text-slate-700',
                  day.hasEvent &&
                    day.isCurrentMonth &&
                    day.isToday &&
                    'bg-amber-500 dark:bg-amber-400 dark:text-amber-950',
                  day.hasEvent && day.isCurrentMonth && !day.isToday && 'bg-sky-600 dark:bg-sky-400 dark:text-sky-950',
                  (day.hasEvent || day.isToday) && 'font-semibold',
                  'flex size-7 items-center justify-center rounded-full',
                )}
              >
                {day.isCurrentMonth && day.day}
              </time>
            </div>
          ))}
        </div>
      </div>
      <section className='mt-5 border-t border-slate-200 pt-4 sm:mt-0 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5 dark:border-slate-700'>
        <h3 className='text-sm font-semibold text-slate-950 dark:text-white'>Schedule</h3>
        {events.length > 0 ? (
          <ol className='mt-2 space-y-2'>
            {events.map((event, eventIdx) => (
              <li
                // biome-ignore lint/suspicious/noArrayIndexKey: Events do not include a stable identifier.
                key={eventIdx}
                className='text-pretty text-sm leading-5 text-slate-600 dark:text-slate-300'
              >
                <span className='font-semibold tabular-nums text-slate-950 dark:text-slate-100'>{event.shortDate}</span>{' '}
                {event.title}
              </li>
            ))}
          </ol>
        ) : (
          <p className='mt-2 text-sm text-slate-500 dark:text-slate-400'>No events scheduled.</p>
        )}
      </section>
    </article>
  );
};
