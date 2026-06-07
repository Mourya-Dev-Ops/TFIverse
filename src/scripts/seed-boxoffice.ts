import 'dotenv/config';
import { db } from '../lib/db';
import { movies, realtimeSessions, hourlyTrendingLogs } from '../lib/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

async function seedBoxOffice() {
    console.log('🌱 Seeding Box Office Mock Data...');

    // 1. Get or create a movie to track (Devara as an example)
    let movie = await db.query.movies.findFirst({
        where: eq(movies.title, 'Devara: Part 1'),
    });

    if (!movie) {
        console.log('Inserting mock movie...');
        const [newMovie] = await db.insert(movies).values({
            tmdbId: 811941,
            title: 'Devara: Part 1',
            originalTitle: 'దేవర',
            overview: 'An epic action saga set against coastal lands.',
            posterPath: '/A9enXEJMAh4P4a1Nq1t71bZ4uL6.jpg',
            backdropPath: '/3V4kLQg0kSqPLctI5ziYWabAZYF.jpg',
            releaseDate: new Date('2024-09-27'),
            runtime: 178,
            language: 'te',
            createdAt: new Date(),
        }).returning();
        movie = newMovie;
    }

    const movieId = movie.id;

    console.log(`Clearing old sessions for Movie ID: ${movieId}...`);
    await db.delete(realtimeSessions).where(eq(realtimeSessions.movieId, movieId));
    await db.delete(hourlyTrendingLogs).where(eq(hourlyTrendingLogs.movieId, movieId));

    // 2. Generate Realtime Sessions (Mock data across cities)
    const cities = ['Hyderabad', 'Bengaluru', 'Chennai', 'Vijayawada', 'Vizag'];
    const venues = ['AMB Cinemas', 'Prasads IMAX', 'PVR: Inorbit', 'Cinepolis', 'INOX'];
    
    console.log('Generating Realtime Sessions...');
    const sessionInserts = [];
    let totalSoldTickets = 0;
    let totalGrossRevenue = 0;
    
    for (const city of cities) {
        for (const venue of venues) {
            // Generate 3 showtimes per venue
            const showTimes = ['10:30 AM', '02:00 PM', '09:00 PM'];
            for (const time of showTimes) {
                const totalSeats = 250;
                // Random occupancy between 60% and 100%
                const occupancyPercent = 0.6 + Math.random() * 0.4;
                const soldSeats = Math.floor(totalSeats * occupancyPercent);
                const availableSeats = totalSeats - soldSeats;
                const ticketPrice = 295; // Average price in INR
                const grossRevenue = soldSeats * ticketPrice;
                
                totalSoldTickets += soldSeats;
                totalGrossRevenue += grossRevenue;

                sessionInserts.push({
                    movieId,
                    sessionId: uuidv4(),
                    venueName: venue,
                    chainName: venue.includes('PVR') ? 'PVR' : venue.includes('INOX') ? 'INOX' : 'Local',
                    city: city,
                    state: city === 'Hyderabad' ? 'Telangana' : 'Andhra Pradesh',
                    showDate: new Date(),
                    showTime: time,
                    audi: `Screen ${Math.floor(Math.random() * 5) + 1}`,
                    totalSeats,
                    availableSeats,
                    soldSeats,
                    grossRevenue,
                    source: 'BMS',
                    lastUpdated: new Date()
                });
            }
        }
    }
    
    await db.insert(realtimeSessions).values(sessionInserts);
    console.log(`Inserted ${sessionInserts.length} realtime sessions.`);

    // 3. Generate Hourly Trending Logs (Last 12 hours)
    console.log('Generating Hourly Trending Logs...');
    const hourlyLogs = [];
    let cumulativeSold = 0;
    let cumulativeGross = 0;

    for (let i = 12; i >= 0; i--) {
        const hourTimestamp = new Date();
        hourTimestamp.setHours(hourTimestamp.getHours() - i, 0, 0, 0);

        // Simulate sales growth over the day
        const ticketsSoldThisHour = Math.floor(Math.random() * 1000) + 500;
        const grossThisHour = ticketsSoldThisHour * 295;
        
        cumulativeSold += ticketsSoldThisHour;
        cumulativeGross += grossThisHour;

        hourlyLogs.push({
            movieId,
            timestamp: hourTimestamp,
            soldTickets: cumulativeSold, // the total snapshot at that hour
            grossRevenue: cumulativeGross,
            showsCount: sessionInserts.length,
            averageOccupancy: 60 + (Math.random() * 30), // 60% to 90%
        });
    }

    await db.insert(hourlyTrendingLogs).values(hourlyLogs);
    console.log(`Inserted ${hourlyLogs.length} hourly logs.`);

    console.log('✅ Seeding Complete!');
}

seedBoxOffice().catch((e) => {
    console.error('Error seeding DB:', e);
    process.exit(1);
}).then(() => {
    process.exit(0);
});
