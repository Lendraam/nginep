import { getRiwayatDiterima } from '@/app/admin/riwayat-booking/fetchRiwayat.server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const bookings = await getRiwayatDiterima();
    return NextResponse.json({ bookings });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
