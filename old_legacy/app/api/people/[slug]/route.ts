// app/api/heroes/[slug]/route.ts
import { db } from '@/lib/db';
import { heroes } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const [hero] = await db
    .select()
    .from(heroes)
    .where(eq(heroes.slug, params.slug));

  if (!hero) {
    return Response.json({ error: 'Hero not found' }, { status: 404 });
  }

  return Response.json(hero);
}
