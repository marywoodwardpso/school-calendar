'use client';

import { type CalendarEvent, getMonths, schoolYear } from '@/lib/dates';
import { useEffect, useRef, useState } from 'react';

import { CalMonth } from '@/components/cal-month';
import { PrinterIcon } from '@heroicons/react/20/solid';
import { groupBy } from 'lodash';
import generatePDF from 'react-to-pdf';
import logo from '../../public/psologo.png';

const months = getMonths();

interface Events {
  [month: string]: CalendarEvent[];
}

export const Calendar = () => {
  const componentRef = useRef(null);

  const handlePdf = () => {
    if (!componentRef.current) return;

    generatePDF(componentRef, {
      filename: 'mwpso-calendar.pdf',
    });
  };

  const [events, setEvents] = useState<Events>();

  const { start, end } = schoolYear();

  useEffect(() => {
    fetch('/api/calendar')
      .then((res) => res.json())
      .then((data) => setEvents(groupBy(data, 'month')));
  }, []);

  return (
    <main className='min-h-screen px-4 py-6 text-sm sm:px-6 sm:py-8 lg:px-8' ref={componentRef}>
      <div className='mx-auto max-w-7xl'>
        <header className='mx-auto mb-8 flex max-w-xl flex-col items-center gap-4 text-center sm:mb-10'>
          <img
            src={logo.src}
            alt='Mary Woodward Elementary Parent Support Organization'
            className='w-full max-w-sm rounded-sm outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10'
          />

          <div className='flex items-center justify-center gap-2'>
            <h1 className='text-balance text-xl font-bold tracking-tight text-slate-950 sm:text-2xl dark:text-white'>
              PSO Event Calendar {start.getFullYear()} to {end.getFullYear()}
            </h1>
            <button
              type='button'
              onClick={handlePdf}
              aria-label='Download calendar as PDF'
              className='flex size-11 shrink-0 items-center justify-center rounded-full text-sky-700 shadow-[0_0_0_1px_rgba(14,116,144,0.18),0_1px_2px_rgba(15,23,42,0.08)] transition-[color,background-color,box-shadow,scale] duration-150 ease-out hover:bg-sky-50 hover:text-sky-800 hover:shadow-[0_0_0_1px_rgba(14,116,144,0.3),0_2px_4px_rgba(15,23,42,0.1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 active:scale-[0.96] dark:text-sky-300 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.12)] dark:hover:bg-sky-400/10 dark:hover:text-sky-200 dark:hover:shadow-[0_0_0_1px_rgba(125,211,252,0.35)]'
            >
              <PrinterIcon className='size-5' aria-hidden='true' />
            </button>
          </div>
        </header>

        {events ? (
          <div className='grid gap-4 lg:grid-cols-2 lg:gap-5'>
            {months.map((month) => (
              <CalMonth key={month} events={events[month]} month={month} />
            ))}
          </div>
        ) : (
          <p className='py-20 text-center text-base text-slate-600 dark:text-slate-300'>Loading calendar…</p>
        )}
      </div>
    </main>
  );
};
