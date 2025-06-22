import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.redirect('/admin/dashboard', 303);
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.redirect('/admin/dashboard', 303);
    }

    const client = await clientPromise;
    const db = client.db('nginepaja');
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (e) {
      console.error('Invalid ObjectId:', id);
      return NextResponse.redirect('/admin/dashboard', 303);
    }
    const result = await db.collection('bookings').deleteOne({ _id: objectId });
    if (result.deletedCount === 0) {
      console.error('Booking not found or not deleted:', id);
    }
    return NextResponse.redirect('/admin/dashboard', 303);
  } catch (err) {
    console.error('Error delete booking:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
