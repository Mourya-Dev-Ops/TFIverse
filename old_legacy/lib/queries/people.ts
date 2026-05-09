// lib/queries/people.ts

import { db } from '@/lib/db';
import { people } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

// Type for person with metadata
export type PersonWithMetadata = typeof people.$inferSelect & {
  metadata: any; // Full JSON metadata
};

/**
 * Get person by slug
 */
export async function getPersonBySlug(slug: string): Promise<PersonWithMetadata | undefined> {
  const person = await db.query.people.findFirst({
    where: eq(people.slug, slug),
  });
  
  return person as PersonWithMetadata | undefined;
}

/**
 * Get all people by category and subcategory
 */
export async function getPeopleByCategory(
  category: string,
  subcategory?: string
): Promise<PersonWithMetadata[]> {
  if (subcategory) {
    return await db.query.people.findMany({
      where: and(
        eq(people.category, category),
        eq(people.subcategory, subcategory)
      ),
      orderBy: (people, { asc }) => [asc(people.name)],
    }) as PersonWithMetadata[];
  }
  
  return await db.query.people.findMany({
    where: eq(people.category, category),
    orderBy: (people, { asc }) => [asc(people.name)],
  }) as PersonWithMetadata[];
}

/**
 * Get all superstars (hero + superstar)
 */
export async function getSuperstars(): Promise<PersonWithMetadata[]> {
  return await getPeopleByCategory('hero', 'superstar');
}

/**
 * Get all legends (hero + legend)
 */
export async function getLegends(): Promise<PersonWithMetadata[]> {
  return await getPeopleByCategory('hero', 'legend');
}

/**
 * Get all rising stars (hero + rising-star)
 */
export async function getRisingStars(): Promise<PersonWithMetadata[]> {
  return await getPeopleByCategory('hero', 'rising-star');
}
