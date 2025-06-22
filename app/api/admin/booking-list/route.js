import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db('nginepaja');
  const bookings = await db.collection('bookings').find({}).sort({ createdAt: -1 }).toArray();
  return NextResponse.json({
    bookings: bookings.map(b => ({
      _id: b._id.toString(),
      name: b.nama,
      email: b.userEmail,
      date: b.tanggal,
      status: b.status || 'menunggu',
    })),
  });
}
