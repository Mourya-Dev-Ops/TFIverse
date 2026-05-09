// app/heroes/page.tsx - FIXED (NO 'use server' needed)

import postgres from 'postgres';
import HeroesClient from './heroes-client';

export const metadata = {
  title: 'Heroes - TFiverse',
  description: 'Browse Telugu cinema heroes',
};

const sql = postgres(process.env.DATABASE_URL || '');

export default async function Heroes() {
  try {
    // ✅ RAW SQL - Query ONLY actual v15 columns
    const allHeroes = await sql`
      SELECT 
        id,
        hero_id,
        name,
        slug,
        title,
        category,
        data,
        created_at,
        updated_at
      FROM heroes
      ORDER BY id DESC
    `;

    // ✅ Transform data: spread JSONB data + keep slug
    const heroesData = allHeroes.map((hero: any) => ({
      id: hero.id,
      slug: hero.slug,
      name: hero.name,
      title: hero.title,
      category: hero.category,
      ...hero.data, // ✅ Spread JSONB data (images, personalInfo, movies, etc)
      createdAt: hero.created_at,
      updatedAt: hero.updated_at,
    }));

    return <HeroesClient initialHeroes={heroesData} />;
  } catch (error) {
    console.error('❌ Failed to fetch heroes:', error);

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-3xl font-bold mb-4">❌ Failed to Load Heroes</p>
          <p className="text-white/60 text-lg mb-6">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-white/90 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
}
