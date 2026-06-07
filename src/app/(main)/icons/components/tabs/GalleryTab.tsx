export default function GalleryTab({ data, theme }: { data: any, theme: any }) {
  const images = data.images || {};

  if (!images.gallery || images.gallery.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.gallery.map((img: string, i: number) => (
        <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/5 group relative">
          <img src={img} alt="Gallery" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none z-10" />
        </div>
      ))}
    </div>
  );
}
