import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { people } from '@/lib/schema'; // Your people table
import { eq, and } from 'drizzle-orm';
import HeroDetailClient from './superstar-client';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

/** Fetch hero data by slug */
async function getHeroData(slug: string) {
  if (!slug) return null;
  try {
    const result = await db.query.people.findFirst({
      where: eq(people.slug, slug),
    });
    if (!result) {
      console.warn(`⚠️ Hero not found: ${slug}`);
      return null;
    }
    const heroData = result.metadata ?? {};
    return {
      ...heroData,
      id: result.id,
      name: result.name ?? heroData.name,
      slug: result.slug,
      tmdbPersonId: result.tmdbPersonId ?? heroData.tmdbPersonId,
      imdbId: result.imdbId ?? heroData.imdbId,
      category: result.category ?? heroData.category,
      subcategory: result.subcategory ?? heroData.subcategory,
    };
  } catch (error) {
    console.error(`🚨 Database error for slug ${slug}:`, error);
    return null;
  }
}

/** Resolve meta image for OpenGraph */
function resolveOgImage(heroData: any) {
  if (!heroData) return '/og-image.jpg';
  const banner = heroData.images?.banner;
  if (!banner) {
    const candidate =
      heroData.images?.featured ||
      heroData.images?.avatar ||
      heroData.images?.portrait ||
      (Array.isArray(heroData.images?.gallery) ? heroData.images.gallery[0] : null);
    if (typeof candidate === 'string') return candidate;
    if (candidate && typeof candidate === 'object') return candidate.url || candidate.tmdbPath || candidate.path || '/og-image.jpg';
    return '/og-image.jpg';
  }
  if (typeof banner === 'string') return banner;
  if (typeof banner === 'object') return banner.url || banner.tmdbPath || banner.path || '/og-image.jpg';
  return '/og-image.jpg';
}

/** SEO/OG metadata */
export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const heroData = await getHeroData(slug);
    if (!heroData) {
      return { title: 'Hero Not Found', description: 'This hero does not exist.' };
    }
    const ogImage = resolveOgImage(heroData);
    return {
      title: `${heroData.name || 'Hero'} - TFIverse`,
      description: heroData.title || heroData.bio || 'Learn more about this Telugu cinema actor.',
      openGraph: {
        title: heroData.name,
        description: heroData.title || heroData.bio,
        images: [ogImage],
      },
    };
  } catch (error) {
    console.error('❌ Metadata generation error:', error);
    return { title: 'Error', description: 'An error occurred.' };
  }
}

/** Main page route */
export default async function HeroPage({ params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    if (!slug) return notFound();
    const heroData = await getHeroData(slug);
    if (!heroData) {
      console.warn(`🔍 Hero page not found for: ${slug}`);
      notFound();
    }
    return <HeroDetailClient heroData={heroData} />;
  } catch (error) {
    console.error('❌ Error loading hero page:', error);
    notFound();
  }
}

/** Can be used for static site generation for known slugs */
export async function generateStaticParams() {
  try {
    const superstars = await db.query.people.findMany({
      where: (peopleTbl, { eq }) =>
        and(eq(peopleTbl.category, 'hero'), eq(peopleTbl.subcategory, 'superstar')),
      columns: { slug: true },
    });
    return (superstars || []).map((h) => ({ slug: h.slug }));
  } catch (error) {
    console.error('❌ Error generating static params:', error);
    return [];
  }
}
