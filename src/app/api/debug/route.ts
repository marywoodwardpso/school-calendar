import { NextResponse } from 'next/server';
import { parseEvents } from '../../../lib/ical';

export async function GET() {
  try {
    const { raw } = await parseEvents();
    // Note: Using JSON.stringify with a replacer to handle BigInt serialization if present
    // Although the provided snippet for parseEvents doesn't explicitly show BigInt,
    // raw event data from libraries can sometimes contain types not directly serializable.
    const serializedRaw = JSON.stringify(
      raw,
      (key, value) => (typeof value === 'bigint' ? value.toString() : value), // return everything else unchanged
    );
    return new NextResponse(serializedRaw, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching raw calendar events:', error);
    return NextResponse.json({ error: 'Failed to fetch raw calendar events' }, { status: 500 });
  }
}
