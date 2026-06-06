import { db } from './src/lib/db';
import { movies } from './src/lib/schema';
import { desc, gt, and, isNotNull } from 'drizzle-orm';

async function main() {
    // Get top movies by revenue (ones that actually have revenue data)
    const topMovies = await db.select({ 
        id: movies.id, 
        title: movies.title, 
        slug: movies.slug, 
        year: movies.year,
        budget: movies.budget, 
        revenue: movies.revenue,
        voteAverage: movies.voteAverage,
        popularity: movies.popularity
    })
    .from(movies)
    .where(and(gt(movies.revenue, 0), isNotNull(movies.revenue)))
    .orderBy(desc(movies.revenue))
    .limit(30);
    
    console.log("Top 30 Telugu movies by revenue:");
    topMovies.forEach((m, i) => {
        const budgetCr = m.budget ? `₹${((m.budget * 83) / 10000000).toFixed(1)} Cr` : 'N/A';
        const revenueCr = m.revenue ? `₹${((m.revenue * 83) / 10000000).toFixed(1)} Cr` : 'N/A';
        console.log(`${i+1}. ${m.title} (${m.year}) | ID: ${m.id} | Budget: ${budgetCr} | Revenue: ${revenueCr} | Rating: ${m.voteAverage}`);
    });
    
    process.exit(0);
}

main().catch(console.error);
