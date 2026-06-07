// lib/b2-storage.ts

import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import sharp from 'sharp';

// Initialize B2 client (S3-compatible)
const b2Client = new S3Client({
  endpoint: process.env.B2_ENDPOINT!,
  region: process.env.B2_REGION!,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID!,
    secretAccessKey: process.env.B2_APPLICATION_KEY!,
  },
});

// Define folder types
export type B2Folder = 'memes' | 'fan-gallery' | 'hero-gallery' | 'hero-avatars' | 'hero-banners';

// Image size configs per folder
const RESIZE_CONFIG: Record<B2Folder, number | null> = {
  memes: 1200,
  'fan-gallery': 2000,
  'hero-gallery': 2000,
  'hero-avatars': 500, // Avatars are small
  'hero-banners': 1920, // Wide format
};

// Upload to Backblaze B2
export async function uploadToB2(
  file: File,
  folder: B2Folder,
  optimize: boolean = true
) {
  try {
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    let buffer = Buffer.from(bytes);

    // Optimize image
    if (optimize && file.type.startsWith('image/')) {
      const maxWidth = RESIZE_CONFIG[folder];

      if (maxWidth) {
        buffer = await sharp(buffer)
          .resize(maxWidth, null, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({ quality: 85, progressive: true })
          .toBuffer();
      }
    }

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `${folder}/${timestamp}-${random}.${extension}`;

    // Upload to B2
    const upload = new Upload({
      client: b2Client,
      params: {
        Bucket: process.env.B2_BUCKET_NAME!,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
        CacheControl: 'max-age=31536000', // 1 year cache
      },
    });

    await upload.done();

    // Generate public URL
    const url = `${process.env.B2_PUBLIC_URL}/${filename}`;

    return {
      url,
      key: filename,
      size: buffer.length,
    };
  } catch (error) {
    console.error('❌ B2 upload error:', error);
    throw new Error('Failed to upload to B2');
  }
}

// Delete from B2
export async function deleteFromB2(key: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME!,
      Key: key,
    });

    await b2Client.send(command);
    return true;
  } catch (error) {
    console.error('❌ B2 delete error:', error);
    return false;
  }
}

// Get B2 public URL
export function getB2Url(key: string) {
  return `${process.env.B2_PUBLIC_URL}/${key}`;
}
