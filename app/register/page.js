'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (res.ok) {
      alert('Pendaftaran berhasil! Silakan login.');
      router.push('/login');
    } else {
      const data = await res.json();
      alert(data.message || 'Gagal mendaftar.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded-lg shadow-md space-y-4 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700">Daftar Akun Pelanggan</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Mendaftar...' : 'Daftar'}
        </button>
        <p className="text-center text-sm">
          Sudah punya akun? <a href="/login" className="text-blue-600 underline">Login di sini</a>
        </p>
      </form>
    </div>
  );
}
