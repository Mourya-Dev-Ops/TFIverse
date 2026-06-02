'use client';

import { useState, useTransition } from 'react';
import { Bookmark, Check, Star, MessageSquare, X } from 'lucide-react';
import { toggleWatchlist, toggleSeen, submitReview } from '@/app/actions/engagement';
import { useRouter } from 'next/navigation';

interface EngagementButtonsProps {
  movieSlug: string;
  initialData: {
    inWatchlist: boolean;
    isSeen: boolean;
    userReview: { rating: number; reviewText: string | null; spoilers: boolean | null } | null;
  };
}

export function EngagementButtons({ movieSlug, initialData }: EngagementButtonsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [inWatchlist, setInWatchlist] = useState(initialData.inWatchlist);
  const [isSeen, setIsSeen] = useState(initialData.isSeen);
  
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(initialData.userReview?.rating || 0);
  const [reviewText, setReviewText] = useState(initialData.userReview?.reviewText || '');
  const [spoilers, setSpoilers] = useState(initialData.userReview?.spoilers || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWatchlist = () => {
    // Optimistic update
    setInWatchlist(!inWatchlist);
    startTransition(async () => {
      const result = await toggleWatchlist(movieSlug);
      if (result?.requiresAuth) {
        setInWatchlist(inWatchlist); // Revert
        router.push('/login');
      } else if (!result?.success) {
        setInWatchlist(inWatchlist); // Revert on other errors
      } else {
          router.refresh();
      }
    });
  };

  const handleSeen = () => {
    setIsSeen(!isSeen);
    startTransition(async () => {
      const result = await toggleSeen(movieSlug);
      if (result?.requiresAuth) {
        setIsSeen(isSeen);
        router.push('/login');
      } else if (!result?.success) {
        setIsSeen(isSeen);
      } else {
          router.refresh();
      }
    });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
        setError('Please select a rating');
        return;
    }
    setIsSubmitting(true);
    setError(null);
    
    try {
        const result = await submitReview(movieSlug, rating, reviewText, spoilers);
        if (result?.requiresAuth) {
            router.push('/login');
        } else if (!result?.success) {
            setError(result.error || 'Failed to submit review');
        } else {
            setIsReviewModalOpen(false);
            router.refresh();
        }
    } catch (err) {
        setError('An unexpected error occurred');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={handleWatchlist}
        disabled={isPending}
        className={`flex items-center justify-center gap-2 h-11 px-5 rounded-xl font-bold text-sm transition-all border ${
          inWatchlist 
            ? 'bg-blue-600/20 text-blue-500 border-blue-500/50 hover:bg-blue-600/30' 
            : 'bg-zinc-900/80 backdrop-blur text-white hover:bg-zinc-800 border-white/10'
        }`}
      >
        <Bookmark className={`w-4 h-4 ${inWatchlist ? 'fill-current' : ''}`} />
        {inWatchlist ? 'In Watchlist' : 'Watchlist'}
      </button>
      
      <button 
        onClick={handleSeen}
        disabled={isPending}
        className={`flex items-center justify-center gap-2 h-11 px-5 rounded-xl font-bold text-sm transition-all border ${
          isSeen 
            ? 'bg-green-600/20 text-green-500 border-green-500/50 hover:bg-green-600/30' 
            : 'bg-zinc-900/80 backdrop-blur text-white hover:bg-zinc-800 border-white/10'
        }`}
      >
        <Check className={`w-4 h-4 ${isSeen ? 'text-green-500' : ''}`} />
        {isSeen ? 'Watched' : 'Seen'}
      </button>

      <button 
        onClick={() => setIsReviewModalOpen(true)}
        className={`flex items-center justify-center gap-2 h-11 px-5 rounded-xl font-bold text-sm transition-all border ${
            initialData.userReview?.rating 
              ? 'bg-yellow-600/20 text-yellow-500 border-yellow-500/50 hover:bg-yellow-600/30' 
              : 'bg-zinc-900/80 backdrop-blur text-white hover:bg-zinc-800 border-white/10'
          }`}
      >
        <Star className={`w-4 h-4 ${initialData.userReview?.rating ? 'fill-current' : ''}`} />
        {initialData.userReview?.rating ? `Rated ${initialData.userReview.rating}` : 'Rate'}
      </button>
      
      <button 
        onClick={() => setIsReviewModalOpen(true)}
        className={`flex items-center justify-center gap-2 h-11 px-5 rounded-xl font-bold text-sm transition-all border ${
            initialData.userReview?.reviewText 
              ? 'bg-purple-600/20 text-purple-400 border-purple-500/50 hover:bg-purple-600/30' 
              : 'bg-zinc-900/80 backdrop-blur text-white hover:bg-zinc-800 border-white/10'
          }`}
      >
        <MessageSquare className={`w-4 h-4 ${initialData.userReview?.reviewText ? 'fill-current' : ''}`} />
        {initialData.userReview?.reviewText ? 'Reviewed' : 'Review'}
      </button>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-900/50">
                <h3 className="text-xl font-black text-white">Rate & Review</h3>
                <button 
                    onClick={() => setIsReviewModalOpen(false)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            <form onSubmit={handleReviewSubmit} className="p-6 space-y-6">
                <div>
                    <label className="block text-sm font-bold text-zinc-400 mb-3 uppercase tracking-widest">Your Rating</label>
                    <div className="flex gap-2 justify-center">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                                    rating >= star ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
                                }`}
                            >
                                <Star className={`w-4 h-4 ${rating >= star ? 'fill-current' : ''}`} />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-widest">Review (Optional)</label>
                    <textarea 
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none h-32"
                        placeholder="What did you think of the movie?"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <input 
                        type="checkbox" 
                        id="spoilers"
                        checked={spoilers}
                        onChange={(e) => setSpoilers(e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 bg-zinc-900 text-blue-500 focus:ring-blue-500/20"
                    />
                    <label htmlFor="spoilers" className="text-sm text-zinc-400 font-medium">Contains spoilers</label>
                </div>

                {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

                <div className="pt-2">
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Review'}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
