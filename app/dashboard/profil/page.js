'use client';

import { useSession, signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [birthdate, setBirthdate] = useState('');
  const [nik, setNik] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (session) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
      setPreview(session.user.image || '');
      setBirthdate(session.user.birthdate || '');
      setNik(session.user.nik || '');
    }
  }, [session, status, router]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('birthdate', birthdate);
    formData.append('nik', nik);
    if (photo) formData.append('photo', photo);
    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        alert('Profil berhasil diperbarui!');
        // Force refresh session NextAuth agar foto langsung update
        await fetch('/api/auth/session?update', { method: 'POST' });
        router.refresh();
      } else {
        alert(data.message || 'Gagal menyimpan data.');
      }
    } catch (err) {
      alert('Terjadi kesalahan.');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading') return null;

  return (
    <main className="min-h-screen bg-blue-50 flex items-center justify-center">
      <section className="w-full max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold text-blue-700 mb-4 text-center">Profil Akun</h1>
        <div className="flex flex-col items-center mb-4">
          {preview ? (
            <img src={preview} alt="Foto Profil" className="w-20 h-20 rounded-full object-cover mb-2" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl text-blue-400 mb-2">?
            </div>
          )}
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
        </div>
        <div className="mb-3">
          <label className="block text-sm mb-1">Email</label>
          <input type="email" value={email} readOnly className="w-full border px-3 py-2 rounded bg-gray-100" />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Nama Lengkap</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Tanggal Lahir</label>
          <input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">NIK</label>
          <input type="text" value={nik} onChange={e => setNik(e.target.value)} className="w-full border px-3 py-2 rounded" maxLength={16} />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </section>
    </main>
  );
}
