'use client';

import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaRegLightbulb, FaHotel } from 'react-icons/fa';

export default function TentangPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-800 px-6 py-16">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-5xl mx-auto text-center"
      >
        <h1 className="text-5xl font-extrabold text-blue-700 mb-4">Tentang NginepAja</h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          <strong>NginepAja</strong> adalah platform pemesanan hotel yang berfokus pada <strong>Bandung Timur</strong>,
          menghadirkan akomodasi terbaik dan informasi lokal terpercaya.
        </p>
      </motion.section>

      <section className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
        {[
          {
            icon: <FaMapMarkerAlt className="text-blue-600 text-3xl mb-2" />,
            title: 'Fokus Bandung Timur',
            desc: 'NginepAja hanya melayani kawasan seperti Cileunyi, Jatinangor, dan Rancaekek.',
          },
          {
            icon: <FaRegLightbulb className="text-yellow-500 text-3xl mb-2" />,
            title: 'Info Lokal Akurat',
            desc: 'Kami memahami fasilitas, akses, dan lingkungan lokal dengan lebih baik.',
          },
          {
            icon: <FaHotel className="text-purple-600 text-3xl mb-2" />,
            title: 'Pengalaman Terpersonalisasi',
            desc: 'Solusi tepat untuk mahasiswa, wisatawan, dan pelaku bisnis lokal.',
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow p-6 text-center transition"
          >
            <div className="flex justify-center mb-3">{item.icon}</div>
            <h3 className="font-bold text-blue-700 text-lg mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Section bawah tanpa animasi agar lebih ringan */}
      <section className="text-center mt-16 max-w-4xl mx-auto">
        <p className="text-base text-gray-700 leading-relaxed px-4">
          Dibangun untuk memberikan <strong>pengalaman akomodasi terbaik</strong> di Bandung Timur, NginepAja bukan sekadar sistem booking hotel. Kami adalah solusi lokal yang hadir untuk kebutuhan lokal.
        </p>
      </section>
    </main>
  );
}
