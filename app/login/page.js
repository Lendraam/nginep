'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // ⏩ Redirect jika sudah login
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/'); // Selalu ke home, tidak auto ke dashboard admin
    }
  }, [status, session, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.ok) {
      router.refresh();
    } else {
      setErrorMsg(res?.error || 'Login gagal. Periksa email dan password Anda.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-6">
        <h1 className="text-2xl font-bold text-blue-700 text-center">Login ke NginepAja</h1>

        {/* 🔐 Google Login */}
        <button
          onClick={() => signIn('google', { callbackUrl: '/google-redirect' })}
          className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-100 transition flex items-center justify-center gap-2 font-semibold"
          disabled={loading}
        >
          <FcGoogle size={22} /> Login dengan Google
        </button>

        <div className="text-center text-gray-500">atau</div>

        {/* 📧 Email & Password Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>

        {/* 🚨 Error Message */}
        {errorMsg && <p className="text-sm text-red-500 text-center">{errorMsg}</p>}

        <p className="text-center text-sm text-gray-600">
          Belum punya akun?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Daftar di sini
          </a>
        </p>
      </div>
    </div>
  );
}
