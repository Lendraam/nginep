import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import clientPromise from '@/lib/mongodb';
import formidable from 'formidable';
import { writeFile } from 'fs/promises';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const form = formidable({ multiples: false, keepExtensions: true });

  try {
    const data = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const name = data.fields.name;
    let photoPath = null;

    if (data.files.photo) {
      const file = data.files.photo;
      const buffer = await file.toBuffer();
      const filename = `${Date.now()}-${file.originalFilename}`;
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

    res.status(200).json({ message: 'Profil berhasil diperbarui' });
  } catch (err) {
    console.error('Gagal update profil:', err);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
}
