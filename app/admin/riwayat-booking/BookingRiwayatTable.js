'use client';
import { useState } from 'react';

export default function BookingRiwayatTable({ bookings }) {
  const [filter, setFilter] = useState('');
  const filtered = bookings.filter(b =>
    b.name.toLowerCase().includes(filter.toLowerCase()) ||
    b.email.toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <div>
      <input
        type="text"
        placeholder="Cari nama/email..."
        className="mb-4 px-3 py-2 border rounded w-full max-w-xs"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-yellow-100 text-yellow-800">
              <th className="py-2 px-4 border">No</th>
              <th className="py-2 px-4 border">Nama</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Tanggal</th>
              <th className="py-2 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-6 text-gray-400">Tidak ada data</td></tr>
            ) : filtered.map((b, i) => (
              <tr key={b._id} className="text-center">
                <td className="py-2 px-4 border">{i + 1}</td>
                <td className="py-2 px-4 border">{b.name}</td>
                <td className="py-2 px-4 border">{b.email}</td>
                <td className="py-2 px-4 border">{b.date}</td>
                <td className="py-2 px-4 border">{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
