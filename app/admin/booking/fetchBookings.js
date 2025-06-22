import clientPromise from '@/lib/mongodb';

export async function getAllBookings() {
  const client = await clientPromise;
  const db = client.db('nginepaja');
  // Ambil semua data booking
  const bookings = await db.collection('bookings').find({}).sort({ createdAt: -1 }).toArray();
  // Normalisasi field agar konsisten
  return bookings.map(b => ({
    _id: b._id.toString(),
    name: b.nama,
    email: b.userEmail,
    date: b.tanggal,
    time: b.jam,
    hotel: b.hotel,
    room: b.room,
    status: b.status || 'menunggu',
  }));
}
