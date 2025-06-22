import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { writeFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const name = formData.get('name');
  const photo = formData.get('photo');
  let photoPath = null;

  if (photo && typeof photo === 'object' && photo.arrayBuffer) {
    const buffer = Buffer.from(await photo.arrayBuffer());
    const filename = `${Date.now()}-${photo.name}`;
    const filepath = path.join(process.cwd(), 'public/uploads', filename);
    await writeFile(filepath, buffer);
    photoPath = `/uploads/${filename}`;
  }

  const client = await clientPromise;
  const db = client.db('nginepaja');
  await db.collection('users').updateOne(
    { email: session.user.email },
    {
      $set: {
        name,
        ...(photoPath && { image: photoPath }),
      },
    }
  );

  return NextResponse.json({ message: 'Profil berhasil diperbarui' });
}
