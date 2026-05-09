import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { people } from '@/lib/schema';

/**
 * GET /api/people
 * Returns all people (heroes, superstars, etc.) from the database.
 * This uses the new 'people' table with v17 JSONB structure in metadata.
 */
export async function GET() {
  try {
    const allPeople = await db.select().from(people);

    console.log(`✅ People fetched: ${allPeople.length}`);

    // Optional: Map each person to include top-level essentials
    const normalized = allPeople.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      subcategory: p.subcategory,
      tmdbPersonId: p.tmdbPersonId,
      imdbId: p.imdbId,
      metadata: p.metadata, // full v17 JSONB data
    }));

    return NextResponse.json({ people: normalized }, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching people:', error);
    return NextResponse.json(
      { error: 'Failed to fetch people' },
      { status: 500 }
    );
  }
}
