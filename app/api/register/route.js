import { hash } from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Ambil dan log data dari request body
    const body = await req.json();
    console.log('📩 Body:', body);

    const { email, password } = body;

    // Validasi input
    if (!email || !password) {
      console.log('❌ Email atau password kosong');
      return NextResponse.json({ message: 'Email dan password wajib diisi.' }, { status: 400 });
    }

    // Koneksi ke database
    const client = await clientPromise;
    const db = client.db('nginepaja');
    console.log('✅ Terhubung ke database');

    // Cek apakah user sudah terdaftar
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      console.log('⚠️ Email sudah digunakan:', email);
      return NextResponse.json({ message: 'Email sudah terdaftar.' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);
    console.log('🔐 Password berhasil di-hash');

    // Simpan user baru ke database
    await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      role: 'pelanggan', // hanya pelanggan yang bisa daftar
      createdAt: new Date(),
    });

    console.log('✅ Pendaftaran berhasil untuk:', email);
    return NextResponse.json({ message: 'Pendaftaran berhasil.' }, { status: 201 });

  } catch (error) {
    console.error('❌ Gagal mendaftar:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}
