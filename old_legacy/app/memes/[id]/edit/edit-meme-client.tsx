'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaSave, FaUpload } from 'react-icons/fa';

export default function EditMemeClient({ memeId, user }: { memeId: string; user: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [meme, setMeme] = useState<any>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    heroTags: '',
  });

  useEffect(() => {
    loadMeme();
  }, [memeId]);

  async function loadMeme() {
    try {
      const res = await fetch(`/api/memes/${memeId}`);
      const data = await res.json();
      
      if (data.userId !== user?.id) {
        router.push('/memes');
        return;
      }

      setMeme(data);
      setPreviewUrl(data.imageUrl);
      setFormData({
        title: data.title,
        description: data.description || '',
        tags: data.tags.join(', '),
        heroTags: data.heroTags.join(', '),
      });
    } catch (error) {
      console.error('Failed to load meme:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setNewImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      let newImageUrl = meme.imageUrl;

      // If new image selected, upload it first
      if (newImageFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', newImageFile);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );
        const uploadData = await uploadRes.json();
        newImageUrl = uploadData.secure_url;
        setUploading(false);
      }

      // Update meme with new data
      const res = await fetch(`/api/memes/${memeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          heroTags: formData.heroTags.split(',').map(t => t.trim()).filter(Boolean),
          imageUrl: newImageUrl,
          oldImageUrl: meme.imageUrl, // Send old URL to delete from Cloudinary
        }),
      });

      if (res.ok) {
        alert('Meme updated! Awaiting admin approval.');
        router.push(`/memes/${memeId}`);
      } else {
        alert('Failed to update meme');
      }
    } catch (error) {
      alert('Failed to update meme');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center pt-20">Loading...</div>;
  if (!meme) return <div className="min-h-screen bg-black text-white flex items-center justify-center pt-20">Meme not found</div>;

  return (
    <div className="text-white pt-20">
      <div className="max-w-3xl mx-auto px-4 py-6 md:py-8">
        <Link href={`/memes/${memeId}`} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
          <FaArrowLeft /> Back to Meme
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold mb-6">Edit Meme</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload/Preview */}
          <div>
            <label className="block text-sm font-medium mb-2">Image</label>
            <div className="relative aspect-square max-w-md mx-auto bg-gray-900 rounded-lg overflow-hidden mb-4">
              <Image src={previewUrl} alt={meme.title} fill className="object-contain" />
            </div>
            <label className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer max-w-md mx-auto">
              <FaUpload /> Change Image
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 rounded-lg border border-gray-800 focus:border-red-600 focus:outline-none"
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
              disabled={saving || uploading}
              className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              {uploading ? 'Uploading...' : saving ? 'Saving...' : <><FaSave /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
