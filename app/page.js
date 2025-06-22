'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { FaHotel, FaMapMarkerAlt, FaRegSmile } from 'react-icons/fa';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      router.replace('/dashboard/admin');
    }
  }, [session, status, router]);

  // Animasi statistik
  const [stat, setStat] = useState({ booking: 0, pelanggan: 0, hotel: 0 });
  useEffect(() => {
    let b = 0, p = 0, h = 0;
    const interval = setInterval(() => {
      b = Math.min(b + 41, 1234);
      p = Math.min(p + 33, 987);
      h = Math.min(h + 1, 5);
      setStat({ booking: b, pelanggan: p, hotel: h });
      if (b === 1234 && p === 987 && h === 5) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100">
      {/* SLIDER GAMBAR */}
      <section className="w-full flex justify-center">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          loop={true}
          speed={600}
          className="w-full max-w-2xl h-[220px] md:h-[350px] lg:h-[420px] rounded-xl shadow"
        >
          {['slide1.jpg', 'slide2.jpg', 'slide3.jpg'].map((img, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={`/${img}`}
                alt={`Hotel Bandung Timur ${idx + 1}`}
                className="object-cover w-full h-full rounded-xl"
                loading="lazy"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* KONTEN UTAMA */}
      <section className="p-6 max-w-5xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-700 mb-4 leading-tight">
          Selamat Datang di <span className="text-blue-900">NginepAja</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-6">
          Platform booking hotel khusus <strong>Bandung Timur</strong>: Cileunyi, Jatinangor, Rancaekek, dan sekitarnya.
        </p>
        <a
          href="/login"
          className="inline-block bg-blue-600 text-white px-7 py-4 rounded-full text-xl hover:bg-blue-700 transition"
        >
          Jelajahi Lebih Lanjut
        </a>
      </section>

      {/* FITUR */}
      <section className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 p-6">
        {[
          {
            icon: <FaHotel className="text-4xl text-blue-600 mb-3" />,
            title: 'Hotel Terkurasi',
            desc: 'Pilihan hotel terverifikasi hanya di Bandung Timur.',
          },
          {
            icon: <FaMapMarkerAlt className="text-4xl text-green-600 mb-3" />,
            title: 'Info Lokal Akurat',
            desc: 'Detail lokasi, akses, dan area sekitar yang relevan.',
          },
          {
            icon: <FaRegSmile className="text-4xl text-yellow-500 mb-3" />,
            title: 'Pengalaman Terpersonalisasi',
            desc: 'Cocok bagi wisatawan, pelajar, dan pebisnis lokal.',
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white shadow-xl rounded-2xl p-8 text-center transition duration-300"
          >
            <div className="flex justify-center">{item.icon}</div>
            <h2 className="text-2xl font-bold text-blue-700 mb-2">{item.title}</h2>
            <p className="text-gray-600 text-base md:text-lg">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* STATISTIK BOOKING */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-blue-700 mb-2">{stat.booking.toLocaleString()}</span>
          <span className="text-gray-600 text-lg">Total Booking</span>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-green-600 mb-2">{stat.pelanggan.toLocaleString()}</span>
          <span className="text-gray-600 text-lg">Pelanggan Unik</span>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-yellow-500 mb-2">{stat.hotel}</span>
          <span className="text-gray-600 text-lg">Hotel Terdaftar</span>
        </div>
      </section>
    </main>
  );
}
