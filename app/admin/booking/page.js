import { getAllBookings } from './fetchBookings';
import BookingTableWrapper from './BookingTableWrapper';

export default async function AdminKelolaBookingPage() {
  const bookings = await getAllBookings();

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
