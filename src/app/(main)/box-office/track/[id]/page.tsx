import { getMovieBoxOfficeDetails } from '@/app/actions/boxoffice';
import TrackClient from './TrackClient';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import { movies } from '@/lib/schema/content';
import { eq } from 'drizzle-orm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const movieId = Number(id);

  if (isNaN(movieId)) {
    return {
      title: 'Box Office Track | TFIverse',
      description: 'Live Box Office ticket sales tracker.',
    };
  }

  const movie = await db.query.movies.findFirst({
    where: eq(movies.id, movieId),
  });

  return {
    title: movie ? `${movie.title} Live Box Office Tracking | TFIverse` : 'Movie Tracking | TFIverse',
    description: movie ? `Real-time ticket bookings, theater occupancy, and box office sales speed for ${movie.title}.` : 'Real-time box office analytics.',
  };
}

export default async function TrackPage({ params }: PageProps) {
  const { id } = await params;
  const movieId = Number(id);

  if (isNaN(movieId)) {
    return (
      <div className="min-h-[70vh] bg-black text-white flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-black text-rose-500 uppercase tracking-wider mb-4">Invalid Movie ID</h1>
        <p className="text-zinc-500 text-sm font-semibold max-w-md">Please specify a valid movie database identifier to access live tracking.</p>
      </div>
    );
  }

  const data = await getMovieBoxOfficeDetails(movieId);

  if (!data) {
    return (
      <div className="min-h-[70vh] bg-black text-white flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-black text-rose-500 uppercase tracking-wider mb-4">No Tracking Data Found</h1>
        <p className="text-zinc-500 text-sm font-semibold max-w-md">We haven't found any active tracking sessions or logs for this movie. Check back in a few minutes or start tracking.</p>
      </div>
    );
  }

  // Convert Date objects to string to pass safely across the Server-Client boundary
  const formattedData = {
    ...data,
    lastUpdated: data.lastUpdated.toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    })
  };

  return (
    <div className="min-h-screen bg-black">
      <TrackClient initialData={formattedData} />
    </div>
  );
}
