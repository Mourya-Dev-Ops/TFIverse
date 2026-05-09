import { Suspense } from 'react';
import {
  getMoviesFromDB,
  getMovieStats,
  getUniqueYears,
  getHeroesList,
} from '@/app/actions/movies';
import MoviesClientOld from './movies-client';

export const metadata = {
  title: 'Movies | TFiverse',
  description: 'Explore Telugu cinema from TFiverse superstars',
};

export const revalidate = 3600;

async function MoviesContent() {
  // ✅ DEFAULT: Show only UPCOMING movies on first load
  const [moviesRes, statsRes, yearsRes, heroesRes] = await Promise.all([
    getMoviesFromDB({ movieType: 'upcoming', limit: 100 }),
    getMovieStats(),
    getUniqueYears(),
    getHeroesList(),
  ]);

  return (
    <MoviesClientOld
      moviesData={moviesRes.data || []}
      stats={statsRes.data}
      years={yearsRes.data || []}
      heroes={heroesRes.data || []}
    />
  );
}

export default function MoviesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <MoviesContent />
    </Suspense>
  );
}
