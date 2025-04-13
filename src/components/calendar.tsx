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
    <div className='px-6 w-auto text-sm' ref={componentRef}>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-sm'>
          <img src={logo.src} alt='logo' />
        </div>
      </div>

      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-3xl flex flex-row justify-center my-2'>
          <span className='text-center font-extrabold text-xl'>
            PSO Event Calendar {start.getFullYear()} to {end.getFullYear()}{' '}
            {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button onClick={handlePdf}>
              <PrinterIcon className='text-sky-800 ml-2 inline-block w-4 h-4' />
            </button>
          </span>
        </div>
      </div>

      {events ? (
        <div className='md:grid md:grid-cols-2 md:divide-x md:divide-gray-200'>
          {events && (
            <>
              <div>
                {months.slice(0, 6).map((month, monthIdx) => (
                  <div key={month}>
                    <CalMonth events={events[month]} month={month} monthIdx={monthIdx} />
                  </div>
                ))}
              </div>
              <div>
                {months.slice(6).map((month, monthIdx) => (
                  <div key={month}>
                    <CalMonth events={events[month]} month={month} monthIdx={monthIdx + 6} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
