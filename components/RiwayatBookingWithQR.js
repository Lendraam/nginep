import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { QRCodeCanvas } from 'qrcode.react';

export default function RiwayatBooking() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await fetch('/api/booking-history');
      const data = await res.json();
      setBookings(data);
    };
    fetchBookings();
  }, []);

  // Nomor WA admin
  const waNumber = '6282219598542';

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Riwayat Booking</h1>
      {bookings.length === 0 ? (
        <p>Belum ada booking.</p>
      ) : (
        <ul className="space-y-2">
          {bookings.map((booking, i) => {
            // Pesan otomatis WA
            const waMsg = encodeURIComponent(
              `Halo Admin, saya sudah booking dengan kode: ${booking.kode || booking._id || ''}`
            );
            const waUrl = `https://wa.me/${waNumber}?text=${waMsg}`;
            return (
              <li key={i} className="border p-4 rounded bg-white shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <p><strong>Tanggal:</strong> {booking.tanggal}</p>
                  <p><strong>Jam:</strong> {booking.jam}</p>
                  <p><strong>Tipe Ruangan:</strong> {booking.room || '-'}</p>
                  <p><strong>Status:</strong> {booking.status}</p>
                  <a href={waUrl} target="_blank" rel="noopener" className="text-green-600 underline block mt-2">
                    Verifikasi via WhatsApp
                  </a>
                </div>
                <div className="flex-shrink-0 flex justify-center md:justify-end">
                  <QRCodeCanvas value={waUrl} size={80} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
