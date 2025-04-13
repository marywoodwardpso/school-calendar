import { NextResponse } from 'next/server';
import { parseEvents } from '../../../lib/ical';

export async function GET() {
  try {
    const { formatted } = await parseEvents();
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json({ error: 'Failed to fetch calendar events' }, { status: 500 });
  }
}
