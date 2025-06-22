'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Menu, X, Home, Info, CalendarDays, LayoutDashboard, LogIn, LogOut, BedDouble,
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-white shadow-md fixed w-full z-50 top-0">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        
        {/* LOGO + BRAND */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-700">
          <BedDouble size={24} className="text-blue-600" />
          NginepAja
        </Link>

        {/* MOBILE MENU TOGGLE */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* NAV LINKS */}
        <nav
          className={`${
            menuOpen ? 'block' : 'hidden'
          } md:flex gap-6 items-center md:static absolute top-16 left-0 w-full bg-white md:bg-transparent md:w-auto md:top-auto md:left-auto z-40 px-4 md:px-0 py-2 md:py-0 shadow md:shadow-none`}
        >
          <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 py-1" onClick={closeMenu}>
            <Home size={18} /> Beranda
          </Link>
          <Link href="/tentang" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 py-1" onClick={closeMenu}>
            <Info size={18} /> Tentang
          </Link>
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 py-1" onClick={closeMenu}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/kalender" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 py-1" onClick={closeMenu}>
            <CalendarDays size={18} /> Kalender
          </Link>

          {/* Tampilkan link dashboard admin jika role admin */}
          {session?.user?.role === 'admin' && (
            <Link
              href="/dashboard/admin"
              className="flex items-center gap-2 text-purple-700 hover:text-purple-900 font-semibold py-1"
              onClick={closeMenu}
            >
              <LayoutDashboard size={18} /> Admin
            </Link>
          )}

          {session ? (
            <div className="flex items-center gap-2">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt="Foto Profil"
                  className="w-8 h-8 rounded-full object-cover border border-blue-300"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-lg text-blue-400">?</div>
              )}
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  signOut();
                }}
                className="flex items-center gap-2 text-red-600 hover:underline py-1"
              >
                <LogOut size={18} /> Logout ({session.user.name})
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                closeMenu();
                router.push('/login');
              }}
              className="flex items-center gap-2 text-blue-600 hover:underline py-1"
            >
              <LogIn size={18} /> Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
