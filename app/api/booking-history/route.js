import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json([], { status: 401 });

  const client = await clientPromise;
  const db = client.db('nginepaja');

  // Ambil semua field booking
  const bookings = await db
    .collection('bookings')
    .find({ userEmail: session.user.email })
    .sort({ createdAt: -1 })
    .toArray();

  // Pastikan field nama, tanggal, jam, status, dan _id/kode ada
  const bookingsWithFallback = bookings.map(b => ({
    nama: b.nama || b.userEmail,
    tanggal: b.tanggal || b.date || '',
    jam: b.jam || b.time || '',
    status: b.status || '',
    room: b.room || '',
    _id: b._id?.toString?.() || '',
    kode: b.kode || '',
  }));

  return NextResponse.json(bookingsWithFallback);
}
