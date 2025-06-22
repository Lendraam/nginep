import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'pelanggan') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { date, time, hotel, room } = await req.json();
    if (!date || !time || !hotel || !room) {
      return NextResponse.json({ message: 'Tanggal, jam, hotel, dan ruangan wajib diisi' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('nginepaja');

    // Ambil nama user dari session
    const userName = session.user.name || session.user.email;

    await db.collection('bookings').insertOne({
      userEmail: session.user.email,
      nama: userName,
      tanggal: date,
      jam: time,
      hotel,
      room,
      status: 'menunggu', // default
      createdAt: new Date(),
    });

    return NextResponse.json({ message: 'Booking berhasil!' }, { status: 201 });
  } catch (err) {
    console.error('Gagal simpan booking:', err);
    return NextResponse.json({ message: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}
