import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import SessionWrapper from '@/components/SessionWrapper'; // ← Ganti SessionProvider langsung

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'NginepAja',
  description: 'Platform Booking Hotel Bandung Timur',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <SessionWrapper>
          <Navbar />
          <main className="pt-16">{children}</main>
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
