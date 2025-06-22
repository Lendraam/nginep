'use client';

import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.css';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ClientOnly from '@/components/ClientOnly';

const hotelsBandungTimur = [
  { nama: 'Hotel Santika Bandung Timur', alamat: 'Jl. Soekarno Hatta No.123, Bandung' },
  { nama: 'Grand Cordela Hotel', alamat: 'Jl. Soekarno Hatta No. 791, Bandung' },
  { nama: 'Hotel Cemerlang', alamat: 'Jl. A. Yani No. 123, Bandung' },
  { nama: 'Hotel Benua', alamat: 'Jl. Pelajar Pejuang 45 No. 111, Bandung' },
  { nama: 'Hotel Antapani', alamat: 'Jl. Antapani Lama No. 45, Bandung' },
];

const rooms = [
  'Deluxe',
  'Superior',
  'Family',
  'Single',
  'Suite'
];

export default function KalenderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [hotel, setHotel] = useState(hotelsBandungTimur[0].nama);
  const [room, setRoom] = useState(rooms[0]);
  const [occupancy, setOccupancy] = useState(null);

  // Redirect jika belum login atau bukan pelanggan
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'pelanggan') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  // Live occupancy fetch
  useEffect(() => {
    const fetchOccupancy = async () => {
      if (!date || !hotel || !room) return;
      const res = await fetch(`/api/occupancy?date=${date.toISOString().split('T')[0]}&hotel=${encodeURIComponent(hotel)}&room=${encodeURIComponent(room)}`);
      const data = await res.json();
      setOccupancy(data.count);
    };
    fetchOccupancy();
  }, [date, hotel, room]);

  const handleBooking = async () => {
    if (!time) return alert('Silakan pilih jam terlebih dahulu.');
    setLoading(true);

    const res = await fetch('/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: date.toISOString().split('T')[0], // Format YYYY-MM-DD
        time,
        hotel,
        room,
      }),
    });

    setLoading(false);

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      setTime('');
      // Setelah booking berhasil, redirect ke riwayat booking untuk pembayaran
      router.push('/dashboard/riwayat');
    } else {
      alert(data.message || 'Gagal booking.');
    }
  };

  const timeOptions = [
    '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00',
    '16:00', '17:00', '18:00', '19:00'
  ];

  if (status === 'loading') return <p className="text-center mt-10">Memuat...</p>;

  return (
    <main className="min-h-screen bg-blue-50 py-10 px-6">
      <section className="max-w-xl mx-auto bg-white rounded-xl shadow p-6 text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Kalender Booking</h1>
        <p className="text-gray-600 mb-6">Pilih tanggal, hotel, dan jam untuk booking hotel.</p>

        <ClientOnly>
          <div className="flex justify-center mb-6">
            <Calendar
              onChange={setDate}
              value={date}
              className="REACT-CALENDAR p-4 rounded-lg"
            />
          </div>

          <p className="mb-4 text-gray-700">
            Tanggal dipilih:{' '}
            <span className="font-semibold text-blue-700">
              {date.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </p>

          <div className="mb-6">
            <label htmlFor="hotel" className="block mb-2 text-sm font-medium text-gray-700">
              Pilih Hotel Bandung Timur:
            </label>
            <select
              id="hotel"
              value={hotel}
              onChange={e => setHotel(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            >
              {hotelsBandungTimur.map((h, i) => (
                <option key={i} value={h.nama}>{h.nama} - {h.alamat}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="time" className="block mb-2 text-sm font-medium text-gray-700">
              Pilih Jam Booking:
            </label>
            <select
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">-- Pilih Jam --</option>
              {timeOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="room" className="block mb-2 text-sm font-medium text-gray-700">
              Pilih Tipe Ruangan:
            </label>
            <select
              id="room"
              value={room}
              onChange={e => setRoom(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            >
              {rooms.map((r, i) => (
                <option key={i} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="mb-2 text-sm text-blue-700">
            {occupancy !== null && (
              <span>Terbooking: <b>{occupancy}</b> orang</span>
            )}
          </div>

          <button
            onClick={handleBooking}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? 'Memproses...' : 'Booking Sekarang'}
          </button>
        </ClientOnly>
      </section>
    </main>
  );
}
