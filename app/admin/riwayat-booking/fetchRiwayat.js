import clientPromise from '@/lib/mongodb';

export async function getRiwayatDiterima() {
  const client = await clientPromise;
  const db = client.db('nginepaja');
  const bookings = await db.collection('bookings').find({ status: 'diterima' }).sort({ createdAt: -1 }).toArray();
  return bookings.map(b => ({
    _id: b._id.toString(),
    name: b.nama,
    email: b.userEmail,
    date: b.tanggal,
    status: b.status || 'diterima',
  }));
}
