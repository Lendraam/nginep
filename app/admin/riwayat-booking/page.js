'use client';

import { useEffect, useState } from 'react';
import BookingRiwayatTable from './BookingRiwayatTable';

export default function AdminRiwayatBookingPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch('/api/riwayat-diterima');
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
    <main className="min-h-screen bg-yellow-50 p-8">
      <section className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-yellow-800 mb-4">Riwayat Booking Pengguna</h1>
        <p className="mb-6 text-yellow-700">Menampilkan hanya booking yang sudah diterima.</p>
        <BookingRiwayatTable bookings={bookings} />
      </section>
    </main>
  );
}
