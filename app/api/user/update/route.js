import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export const runtime = 'nodejs';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const name = formData.get('name');
  const photo = formData.get('photo');
  let imageData = null;
  let imageType = null;

  if (photo && typeof photo === 'object' && photo.arrayBuffer) {
    const buffer = Buffer.from(await photo.arrayBuffer());
    imageData = buffer;
    imageType = photo.type;
  }

  const client = await clientPromise;
  const db = client.db('nginepaja');
  await db.collection('users').updateOne(
    { email: session.user.email },
    {
      $set: {
        name,
        ...(imageData && { imageData, imageType }),
      },
    }
  );

  return NextResponse.json({ message: 'Profil berhasil diperbarui' });
}
