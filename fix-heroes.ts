import { db } from './src/lib/db';
import { people } from './src/lib/schema';
import { eq, inArray } from 'drizzle-orm';

async function main() {
    console.log('Updating heroes subcategories...');
    
    // Legends
    await db.update(people)
        .set({ subcategory: 'legend' })
        .where(inArray(people.name, ['Chiranjeevi']));
        
    // Superstars
    await db.update(people)
        .set({ subcategory: 'superstar' })
        .where(inArray(people.name, ['Pawan Kalyan', 'Mahesh Babu', 'Allu Arjun', 'Jr NTR', 'Ram Charan', 'Ravi Teja', 'Nani', 'Vijay Deverakonda']));

    console.log('Done updating subcategories.');
    process.exit(0);
}

main().catch(console.error);
