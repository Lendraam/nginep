'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminNavbar() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session || session.user.role !== 'admin') return null;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/admin/dashboard');
  };

  return (
    <header className="bg-white shadow-md w-full z-50 top-0">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-xl font-bold text-blue-700">
          Admin Dashboard
        </Link>
        <div className="flex items-center gap-3">
          {session.user.image ? (
            <img
              src={session.user.image}
              alt="Foto Admin"
              className="w-8 h-8 rounded-full object-cover border border-blue-300"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-lg text-blue-400">?</div>
          )}
          <span className="font-semibold text-blue-700">{session.user.name || session.user.email}</span>
          <button
            type="button"
            onClick={handleLogout}
            className="text-red-600 hover:underline ml-2"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
