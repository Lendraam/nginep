"use client";

import { useState } from "react";

export default function BookingTable({ bookings, onAccept, onDelete, onReject }) {
  const [loadingId, setLoadingId] = useState(null);

  const handleAccept = async (id) => {
    setLoadingId(id);
    try {
      await onAccept(id);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    setLoadingId(id);
    try {
      await onDelete(id);
    } finally {
      setLoadingId(null);
    }
  };

  if (!bookings || bookings.length === 0) {
    return <div className="text-center py-8 text-gray-500">Tidak ada booking.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded shadow">
        <thead>
          <tr className="bg-blue-100 text-blue-700">
            <th className="py-2 px-4 border">No</th>
            <th className="py-2 px-4 border">Nama</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Tanggal</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => (
            <tr key={b._id} className="text-center">
              <td className="py-2 px-4 border">{i + 1}</td>
              <td className="py-2 px-4 border">{b.name}</td>
              <td className="py-2 px-4 border">{b.email}</td>
              <td className="py-2 px-4 border">{b.date}</td>
              <td className="py-2 px-4 border">{b.status}</td>
              <td className="py-2 px-4 border space-x-2">
                {b.status !== "diterima" && b.status !== "ditolak" && (
                  <>
                    <button
                      onClick={() => handleAccept(b._id)}
                      disabled={loadingId === b._id}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition disabled:opacity-50"
                    >
                      {loadingId === b._id ? "Memproses..." : "Terima"}
                    </button>
                    <button
                      onClick={() => onReject && onReject(b._id)}
                      disabled={loadingId === b._id}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition disabled:opacity-50"
                    >
                      {loadingId === b._id ? "Memproses..." : "Tolak"}
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(b._id)}
                  disabled={loadingId === b._id}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition disabled:opacity-50"
                >
                  {loadingId === b._id ? "Menghapus..." : "Hapus"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
