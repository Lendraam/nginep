import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  // 🔐 Redirect jika belum login
  if (!session) {
    redirect('/login');
  }

  // 🚫 Redirect jika bukan admin
  if (!session.user || session.user.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <section className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Selamat Datang di Admin Dashboard
        </h1>
        <p className="text-gray-600 mb-8">
          Ini adalah dashboard khusus admin. Anda dapat mengelola semua booking pelanggan dan data pengguna.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kelola Booking */}
          <a
            href="/admin/booking"
            className="bg-blue-100 p-5 rounded-lg shadow hover:shadow-md transition block"
          >
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Kelola Booking</h2>
            <p className="text-sm text-blue-700">
              Periksa, terima, atau hapus semua booking pelanggan.
            </p>
          </a>

          {/* Profil Admin */}
          <a
            href="/admin/profil"
            className="bg-purple-100 p-5 rounded-lg shadow hover:shadow-md transition block"
          >
            <h2 className="text-xl font-semibold text-purple-800 mb-2">Profil Admin</h2>
            <p className="text-sm text-purple-700">
              Lihat dan edit profil admin.
            </p>
          </a>
        </div>

        <footer className="mt-10 text-center text-gray-400 text-sm">
          &copy; 2025 NginepAja - Admin Dashboard
        </footer>
      </section>
    </main>
  );
}
