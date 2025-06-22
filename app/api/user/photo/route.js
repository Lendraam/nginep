import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  if (!email) {
    return new NextResponse('Email required', { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db('nginepaja');
  const user = await db.collection('users').findOne({ email });
  if (!user || !user.imageData) {
    return new NextResponse('Not found', { status: 404 });
  }
  return new NextResponse(user.imageData.buffer, {
    status: 200,
    headers: {
      'Content-Type': user.imageType || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000',
    },
  });
}
