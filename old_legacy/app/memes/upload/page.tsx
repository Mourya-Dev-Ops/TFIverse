'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaUpload, FaImage } from 'react-icons/fa';

export default function UploadMeme() {
  const { data: session } = useSession();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    heroTags: '',
  });

  if (!session?.user) {
    router.push('/signin');
    return null;
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      setPreview(data.secure_url);
    } catch (error) {
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!preview) {
      alert('Please upload an image');
      return;
    }

    setUploading(true);
    try {
      const res = await fetch('/api/memes/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          imageUrl: preview,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          heroTags: formData.heroTags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        alert('Meme uploaded! Awaiting admin approval.');
        router.push('/memes/my');
      } else {
        alert('Failed to upload meme');
      }
    } catch (error) {
      alert('Failed to upload meme');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-6 md:py-8">
        <Link href="/memes" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
          <FaArrowLeft /> Back to Memes
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold mb-6">Upload Meme</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Image *</label>
            {preview ? (
              <div className="relative aspect-square max-w-md mx-auto bg-gray-900 rounded-lg overflow-hidden">
                <Image src={preview} alt="Preview" fill className="object-contain" />
                <button
                  type="button"
                  onClick={() => setPreview('')}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                >
                  Change
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-red-600 transition-colors">
                <div className="flex flex-col items-center justify-center py-6">
                  <FaImage className="text-4xl text-gray-400 mb-3" />
                  <p className="text-sm text-gray-400">Click to upload image</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 rounded-lg border border-gray-800 focus:border-red-600 focus:outline-none"
              placeholder="Give your meme a catchy title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 rounded-lg border border-gray-800 focus:border-red-600 focus:outline-none h-24 resize-none"
              placeholder="Add a description (optional)"
            />
          </div>

          {/* Tags */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900 rounded-lg border border-gray-800 focus:border-red-600 focus:outline-none"
                placeholder="funny, viral, trending"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hero Tags</label>
              <input
                type="text"
                value={formData.heroTags}
                onChange={(e) => setFormData({ ...formData, heroTags: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900 rounded-lg border border-gray-800 focus:border-red-600 focus:outline-none"
                placeholder="Prabhas, Allu Arjun"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !preview}
              className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              {uploading ? 'Uploading...' : <><FaUpload /> Upload</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
