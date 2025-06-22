import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import clientPromise from './mongodb';
import { compare } from 'bcryptjs';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db('nginepaja');
        const user = await db.collection('users').findOne({ email: credentials.email });

        if (!user) throw new Error('Pengguna tidak ditemukan');

        const isPasswordCorrect = await compare(credentials.password, user.password);
        if (!isPasswordCorrect) throw new Error('Password salah');

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          image: user.image || '', // pastikan image ikut di session
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Selalu ambil data user terbaru dari database jika ada email
      if (token?.email) {
        const client = await clientPromise;
        const db = client.db('nginepaja');
        const dbUser = await db.collection('users').findOne({ email: token.email });
        if (dbUser) {
          token.role = dbUser.role ?? 'pelanggan';
          token.image = dbUser.image || '';
          token.birthdate = dbUser.birthdate || '';
          token.nik = dbUser.nik || '';
        }
      }
      // Jika login baru, user object ada
      if (user) {
        token.role = user.role ?? 'pelanggan';
        token.image = user.image || '';
      }
      return token;
    },
    async session({ session, token }) {
      const client = await clientPromise;
      const db = client.db('nginepaja');
      let dbUser = await db.collection('users').findOne({ email: session.user.email });
      if (!dbUser) {
        // User Google baru, buat user di database
        await db.collection('users').insertOne({
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          role: 'pelanggan',
        });
        dbUser = await db.collection('users').findOne({ email: session.user.email });
      }
      if (dbUser) {
        session.user.name = dbUser.name || session.user.name;
        session.user.image = dbUser.imageData
          ? `/api/user/photo?email=${encodeURIComponent(dbUser.email)}`
          : (dbUser.image || session.user.image || '');
        session.user.role = dbUser.role || 'pelanggan';
        session.user.birthdate = dbUser.birthdate || '';
        session.user.nik = dbUser.nik || '';
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
