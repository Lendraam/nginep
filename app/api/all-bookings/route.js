import { getAllBookings } from '@/app/admin/booking/fetchBookings';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const bookings = await getAllBookings();
    return NextResponse.json({ bookings });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
