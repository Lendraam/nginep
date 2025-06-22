import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import clientPromise from '@/lib/mongodb';
import formidable from 'formidable';
import fs from 'fs/promises';
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

  try {
    const form = formidable({ multiples: false });

    const data = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const name = data.fields.name;
    const birthdate = data.fields.birthdate;
    const nik = data.fields.nik;
    let photoPath = null;

    if (data.files.photo) {
      const file = data.files.photo[0];
      const buffer = await fs.readFile(file.filepath);
      const filename = `${Date.now()}-${file.originalFilename}`;
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      await fs.mkdir(uploadDir, { recursive: true });
      const filepath = path.join(uploadDir, filename);
      await fs.writeFile(filepath, buffer);
      photoPath = `/uploads/${filename}`;
    }

    const client = await clientPromise;
    const db = client.db('nginepaja');

    await db.collection('users').updateOne(
      { email: session.user.email },
      {
        $set: {
          name,
          birthdate,
          nik,
          ...(photoPath && { image: photoPath }),
        },
      }
    );

    return res.status(200).json({ message: 'Profil berhasil diperbarui' });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Gagal memperbarui profil' });
  }
}
