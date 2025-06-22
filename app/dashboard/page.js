import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { FaCalendarAlt, FaUserCircle, FaHistory, FaHotel } from 'react-icons/fa';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Proteksi: hanya bisa diakses jika sudah login
  if (!session || session.user.role !== 'pelanggan') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 px-4">
        <h1 className="text-3xl font-extrabold text-red-700 mb-4">⚠️ Akses Ditolak</h1>
        <p className="text-red-600 mb-6">Halaman ini hanya untuk pelanggan. Silakan login terlebih dahulu.</p>
        <Link
          href="/login"
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Ke Halaman Login
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-8">
      <section className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-10">
        <div className="flex items-center gap-4 mb-8">
          {session.user.image ? (
            <img
              src={session.user.image}
              alt="Foto Profil"
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-300 shadow"
            />
          ) : (
            <FaUserCircle className="text-blue-600 text-5xl" />
          )}
          <div>
            <h1 className="text-4xl font-extrabold text-blue-700 mb-1">
              Halo, {session.user.name ?? session.user.email} 👋
            </h1>
            <p className="text-lg text-gray-700">
              Selamat datang di Dashboard Pelanggan NginepAja!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Link ke Booking */}
          <Link href="/kalender" className="group block bg-blue-100 rounded-xl p-6 shadow hover:bg-blue-200 hover:shadow-lg transition cursor-pointer border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <FaCalendarAlt className="text-blue-600 text-2xl group-hover:scale-110 transition" />
              <h2 className="font-semibold text-blue-800 text-lg">Booking Hotel</h2>
            </div>
            <p className="text-blue-700 text-sm">
              Pilih tanggal, hotel, dan jam untuk melakukan pemesanan hotel.
            </p>
          </Link>

          {/* Link ke Profil */}
          <Link href="/dashboard/profil" className="group block bg-blue-100 rounded-xl p-6 shadow hover:bg-blue-200 hover:shadow-lg transition cursor-pointer border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <FaUserCircle className="text-blue-600 text-2xl group-hover:scale-110 transition" />
              <h2 className="font-semibold text-blue-800 text-lg">Profil Akun</h2>
            </div>
            <p className="text-blue-700 text-sm">
              Lihat dan ubah informasi akun Anda.
            </p>
          </Link>

          {/* Link ke Riwayat */}
          <Link href="/dashboard/riwayat" className="group block bg-blue-100 rounded-xl p-6 shadow hover:bg-blue-200 hover:shadow-lg transition cursor-pointer border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <FaHistory className="text-blue-600 text-2xl group-hover:scale-110 transition" />
              <h2 className="font-semibold text-blue-800 text-lg">Histori Booking</h2>
            </div>
            <p className="text-blue-700 text-sm">
              Lihat daftar pemesanan yang telah Anda buat.
            </p>
          </Link>
        </div>

        <div className="bg-gradient-to-r from-blue-200 to-blue-100 rounded-xl p-6 text-center mb-6">
          <FaHotel className="inline text-blue-400 text-3xl mb-2" />
          <p className="text-blue-700 font-semibold">Nikmati kemudahan booking hotel di Bandung Timur bersama NginepAja!</p>
        </div>

        <footer className="mt-10 text-center text-gray-500 text-sm">
          © 2025 NginepAja - Semua hak dilindungi
        </footer>
      </section>
    </main>
  );
}
