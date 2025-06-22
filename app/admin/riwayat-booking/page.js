'use client';

import { getRiwayatDiterima } from './fetchRiwayat';
import BookingRiwayatTable from './BookingRiwayatTable';

export default async function AdminRiwayatBookingPage() {
  const bookings = await getRiwayatDiterima();
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
