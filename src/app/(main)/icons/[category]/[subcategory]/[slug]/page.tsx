import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { people, movieCredits, movies } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import IconProfileClient from "./icon-profile-client";

// ============================================================================
// SERVER COMPONENT — Data fetching + slug-first lookup with redirect safety
// ============================================================================

interface PageProps {
  params: Promise<{
    category: string;
    subcategory: string;
    slug: string;
  }>;
}

// ============================================================================
// CACHED DATA FETCHERS — Public celebrity data, safe to cache globally
// ============================================================================

const getCachedPerson = unstable_cache(
  async (slug: string) => {
    const [person] = await db.select().from(people).where(eq(people.slug, slug));
    return person || null;
  },
  ['person-by-slug'],
  { revalidate: 3600, tags: ['person'] }
);

const getCachedFilmography = unstable_cache(
  async (personId: string) => {
    return db
      .select({
        creditId: movieCredits.id,
        character: movieCredits.character,
        roleType: movieCredits.roleType,
        job: movieCredits.job,
        department: movieCredits.department,
        orderIndex: movieCredits.orderIndex,
        movieId: movies.id,
        movieTitle: movies.title,
        movieSlug: movies.slug,
        movieYear: movies.year,
        moviePoster: movies.posterUrl,
        movieBackdrop: movies.backdropUrl,
        movieRating: movies.voteAverage,
        movieVotes: movies.voteCount,
        movieRuntime: movies.runtime,
        movieOverview: movies.overview,
        movieStatus: movies.status,
        movieOttFetched: movies.ottFetched,
      })
      .from(movieCredits)
      .innerJoin(movies, eq(movieCredits.movieId, movies.id))
      .where(eq(movieCredits.personId, personId));
  },
  ['person-filmography'],
  { revalidate: 3600, tags: ['filmography'] }
);

// ============================================================================
// METADATA
// ============================================================================

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const person = await getCachedPerson(slug);
  if (!person) return { title: "Not Found | TFIverse" };
  return {
    title: `${person.name} | TFIverse`,
    description: (person.metadata as any)?.bio?.substring(0, 160) || `${person.name} on TFIverse`,
  };
}

// ============================================================================
// PAGE
// ============================================================================

export default async function IconProfilePage({ params }: PageProps) {
  const { category, subcategory, slug } = await params;

  // SLUG-FIRST LOOKUP: Find person by slug regardless of category/subcategory.
  // This ensures old bookmarked URLs still work after category promotions
  // (e.g., rising-star → superstar).
  const person = await getCachedPerson(slug);

  if (!person) notFound();

  // If the URL category/subcategory doesn't match the DB, redirect to correct URL.
  // This handles category promotions gracefully.
  if (person.category !== category || person.subcategory !== subcategory) {
    redirect(`/icons/${person.category}/${person.subcategory}/${person.slug}`);
  }

  // Fetch filmography (cached separately since it's a heavier query)
  const filmography = await getCachedFilmography(person.id);

  const data = person.metadata as any;

  return (
    <IconProfileClient
      person={person}
      data={data}
      category={category}
      subcategory={subcategory}
      filmography={filmography}
    />
  );
}
