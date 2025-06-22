import { useEffect, useState } from 'react';
import BookingTableWrapper from './BookingTableWrapper';

export default function AdminKelolaBookingPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch('/api/all-bookings');
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err) {
        setError('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <main className="min-h-screen bg-blue-50 p-8">
      <section className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">Kelola Booking</h1>
        <p className="mb-6 text-blue-700">Periksa, terima, atau hapus semua booking pelanggan di sini.</p>
        <BookingTableWrapper bookings={bookings} />
      </section>
    </main>
  );
}
