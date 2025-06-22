'use client';
import BookingTable from '@/components/BookingTable';
import { useState } from 'react';

export default function BookingTableWrapper({ bookings: initialBookings }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [refreshing, setRefreshing] = useState(false);

  async function handleAccept(id) {
    setRefreshing(true);
    await fetch(`/api/admin/bookings/accept?id=${id}`, { method: 'POST' });
    await refreshBookings();
  }

  async function handleDelete(id) {
    setRefreshing(true);
    await fetch(`/api/admin/bookings/delete?id=${id}`, { method: 'POST' });
    await refreshBookings();
  }

  async function handleReject(id) {
    setRefreshing(true);
    await fetch(`/api/admin/bookings/reject?id=${id}`, { method: 'POST' });
    await refreshBookings();
  }

  async function refreshBookings() {
    const res = await fetch('/api/admin/booking-list');
    const data = await res.json();
    setBookings(data.bookings || []);
    setRefreshing(false);
  }

  return (
    <div>
      <BookingTable bookings={bookings} onAccept={handleAccept} onDelete={handleDelete} onReject={handleReject} />
      {refreshing && <div className="text-center text-blue-500 mt-2">Memuat ulang data...</div>}
    </div>
  );
}
