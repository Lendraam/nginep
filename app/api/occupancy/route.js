import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

// GET /api/occupancy?date=YYYY-MM-DD&hotel=Hotel&room=Room
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');
  const hotel = searchParams.get('hotel');
  const room = searchParams.get('room');

  if (!date || !hotel || !room) {
    return NextResponse.json({ count: 0 });
  }

  const client = await clientPromise;
  const db = client.db('nginepaja');
  const count = await db.collection('bookings').countDocuments({
    tanggal: date,
    hotel,
    room,
    status: { $ne: 'dibatalkan' },
  });
  return NextResponse.json({ count });
}
