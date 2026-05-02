import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { people, movieCredits, movies } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
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

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const [person] = await db.select().from(people).where(eq(people.slug, slug));
  if (!person) return { title: "Not Found | TFIverse" };
  return {
    title: `${person.name} | TFIverse`,
    description: (person.metadata as any)?.bio?.substring(0, 160) || `${person.name} on TFIverse`,
  };
}

export default async function IconProfilePage({ params }: PageProps) {
  const { category, subcategory, slug } = await params;

  // SLUG-FIRST LOOKUP: Find person by slug regardless of category/subcategory.
  // This ensures old bookmarked URLs still work after category promotions
  // (e.g., rising-star → superstar).
  const [person] = await db
    .select()
    .from(people)
    .where(eq(people.slug, slug));

  if (!person) notFound();

  // If the URL category/subcategory doesn't match the DB, redirect to correct URL.
  // This handles category promotions gracefully.
  if (person.category !== category || person.subcategory !== subcategory) {
    redirect(`/icons/${person.category}/${person.subcategory}/${person.slug}`);
  }

  // Fetch filmography from movie_credits bridge table
  const filmography = await db
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
    .where(eq(movieCredits.personId, person.id));

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
