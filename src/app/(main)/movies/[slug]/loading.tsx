export default function Loading() {
  return (
    <div className="min-h-screen bg-black w-full pb-32 overflow-x-hidden animate-pulse">
      {/* Hero Skeleton */}
      <div className="relative w-full h-[60vh] md:h-[70vh] bg-zinc-900" />
      
      {/* Header Skeleton */}
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-16 pt-12 md:pt-16 relative z-20 mb-16 -mt-32">
        <div className="h-16 md:h-24 w-3/4 max-w-3xl bg-zinc-800 rounded-xl mb-6" />
        
        {/* Badges Skeleton */}
        <div className="flex gap-4 mb-8">
            <div className="h-4 w-12 bg-zinc-800 rounded" />
            <div className="h-4 w-16 bg-zinc-800 rounded" />
            <div className="h-4 w-32 bg-zinc-800 rounded" />
        </div>
        
        {/* Action Buttons Skeleton */}
        <div className="flex gap-3">
          <div className="h-11 w-28 bg-zinc-800 rounded-xl" />
          <div className="h-11 w-32 bg-zinc-800 rounded-xl" />
          <div className="h-11 w-24 bg-zinc-800 rounded-xl" />
          <div className="h-11 w-24 bg-zinc-800 rounded-xl" />
        </div>
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-20">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-20">
          
          {/* Synopsis */}
          <div>
            <div className="h-6 w-full max-w-2xl bg-zinc-900 rounded mb-4" />
            <div className="h-6 w-full max-w-xl bg-zinc-900 rounded mb-4" />
            <div className="h-6 w-3/4 max-w-lg bg-zinc-900 rounded" />
          </div>

          {/* Cast Scroller Skeleton */}
          <div>
            <div className="h-4 w-24 bg-zinc-900 rounded mb-6" />
            <div className="flex gap-6 overflow-hidden">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="flex flex-col items-center gap-3 shrink-0">
                        <div className="w-24 h-24 rounded-full bg-zinc-900" />
                        <div className="w-16 h-3 bg-zinc-900 rounded" />
                        <div className="w-12 h-2 bg-zinc-900 rounded" />
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4">
          <div className="space-y-6">
            <div className="w-3/4 mx-auto aspect-[2/3] bg-zinc-900 rounded-2xl" />
            <div className="h-10 w-full bg-zinc-900 rounded-full" />
            <div className="h-96 w-full bg-zinc-900 rounded-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
