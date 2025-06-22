import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import clientPromise from '@/lib/mongodb';
import AdminNavbar from '@/components/admin-navbar';

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  if (session.user.role !== 'admin') redirect('/dashboard');

  const client = await clientPromise;
  const db = client.db('nginepaja');
  const bookings = await db.collection('bookings').find().sort({ tanggal: -1 }).toArray();

  return (
    <>
      <AdminNavbar />
      <main className="min-h-screen bg-gray-50 p-8">
        <section className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Admin</h1>
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Daftar Booking</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border">
              <thead>
                <tr className="bg-blue-100 text-left text-sm">
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Tanggal</th>
                  <th className="p-2 border">Jam</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="text-sm">
                    <td className="p-2 border">{b.userEmail}</td>
                    <td className="p-2 border">{b.tanggal}</td>
                    <td className="p-2 border">{b.jam}</td>
                    <td className="p-2 border capitalize">{b.status}</td>
                    <td className="p-2 border space-x-2">
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                        onClick={async () => {
                          await fetch(`/api/admin/bookings/accept?id=${b._id}`, { method: 'POST' });
                          window.location.reload();
                        }}
                      >
                        Terima
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                        onClick={async () => {
                          await fetch(`/api/admin/bookings/delete?id=${b._id}`, { method: 'POST' });
                          window.location.reload();
                        }}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="mt-10 text-center text-gray-400 text-sm">
            &copy; 2025 NginepAja - Admin Dashboard
          </footer>
        </section>
      </main>
    </>
  );
}
