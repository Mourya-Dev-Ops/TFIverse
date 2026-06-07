import { sql } from 'drizzle-orm';
import { pgTable, varchar, integer, timestamp, jsonb, serial, index, real, unique } from 'drizzle-orm/pg-core';
import { movies } from './content';

// Tracks BookMyShow interest counts over time
export const bmsInterests = pgTable('bms_interests', {
    id: serial('id').primaryKey(),
    movieId: integer('movie_id').notNull().references(() => movies.id, { onDelete: 'cascade' }),
    tmdbId: integer('tmdb_id').notNull(),
    count: integer('count').notNull(),
    timestamp: timestamp('timestamp').default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => ({
    movieIdx: index('idx_bms_movie').on(table.movieId),
    timestampIdx: index('idx_bms_timestamp').on(table.timestamp),
}));

// Daily Box Office collections
export const dailyCollections = pgTable('daily_collections', {
    id: serial('id').primaryKey(),
    movieId: integer('movie_id').notNull().references(() => movies.id, { onDelete: 'cascade' }),
    date: timestamp('date', { mode: 'date' }).notNull(),
    indiaNet: real('india_net'),
    indiaGross: real('india_gross'),
    overseasGross: real('overseas_gross'),
    worldwideGross: real('worldwide_gross'),
    occupancy: real('occupancy'), // percentage
    source: varchar('source', { length: 100 }),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => ({
    movieDateUnique: unique('unique_movie_date').on(table.movieId, table.date),
    movieIdx: index('idx_daily_collections_movie').on(table.movieId),
    dateIdx: index('idx_daily_collections_date').on(table.date),
}));

// Regional/District-wise collections
export const districtCollections = pgTable('district_collections', {
    id: serial('id').primaryKey(),
    movieId: integer('movie_id').notNull().references(() => movies.id, { onDelete: 'cascade' }),
    region: varchar('region', { length: 100 }).notNull(), // e.g., 'Nizam', 'Ceeded', 'UA'
    totalGross: real('total_gross'),
    share: real('share'),
    source: varchar('source', { length: 100 }),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => ({
    movieRegionUnique: unique('unique_movie_region').on(table.movieId, table.region),
    movieIdx: index('idx_district_movie').on(table.movieId),
}));

// Re-release records
export const reReleases = pgTable('re_releases', {
    id: serial('id').primaryKey(),
    movieId: integer('movie_id').notNull().references(() => movies.id, { onDelete: 'cascade' }),
    reReleaseDate: timestamp('re_release_date', { mode: 'date' }).notNull(),
    format: varchar('format', { length: 100 }), // '4K UHD', 'IMAX', 'Standard', 'Dolby Atmos'
    occasion: varchar('occasion', { length: 255 }), // 'Anniversary', 'Fan Demand', 'Festival Special'
    totalGross: real('total_gross'), // in USD (will convert to INR on display)
    theaterDays: integer('theater_days'), // how many days it ran
    note: varchar('note', { length: 500 }),
    source: varchar('source', { length: 100 }),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => ({
    movieIdx: index('idx_rereleases_movie').on(table.movieId),
    dateIdx: index('idx_rereleases_date').on(table.reReleaseDate),
}));

// 1. Realtime show-by-show details
export const realtimeSessions = pgTable('realtime_sessions', {
    id: serial('id').primaryKey(),
    movieId: integer('movie_id').notNull().references(() => movies.id, { onDelete: 'cascade' }),
    sessionId: varchar('session_id', { length: 100 }).notNull(), // Unique session identifier
    venueName: varchar('venue_name', { length: 255 }).notNull(),
    chainName: varchar('chain_name', { length: 100 }),
    city: varchar('city', { length: 100 }).notNull(),
    state: varchar('state', { length: 100 }),
    showDate: timestamp('show_date', { mode: 'date' }).notNull(), // Date of the show
    showTime: varchar('show_time', { length: 50 }).notNull(), // e.g., '07:30 PM'
    audi: varchar('audi', { length: 100 }),
    totalSeats: integer('total_seats').notNull(),
    availableSeats: integer('available_seats').notNull(),
    soldSeats: integer('sold_seats').notNull(),
    grossRevenue: real('gross_revenue').notNull(),
    source: varchar('source', { length: 10 }).notNull(), // 'BMS', 'PAYTM'
    lastUpdated: timestamp('last_updated').default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => ({
    sessionUnique: unique('unique_session').on(table.movieId, table.sessionId),
    movieSessionIdx: index('idx_realtime_movie_session').on(table.movieId),
    cityIdx: index('idx_realtime_city').on(table.city),
    dateIdx: index('idx_realtime_date').on(table.showDate),
}));

// 2. Hourly aggregated trending logs for charts
export const hourlyTrendingLogs = pgTable('hourly_trending_logs', {
    id: serial('id').primaryKey(),
    movieId: integer('movie_id').notNull().references(() => movies.id, { onDelete: 'cascade' }),
    timestamp: timestamp('timestamp').notNull(), // Rounded hour
    soldTickets: integer('sold_tickets').notNull(),
    grossRevenue: real('gross_revenue').notNull(),
    showsCount: integer('shows_count').notNull(),
    averageOccupancy: real('average_occupancy').notNull(),
}, (table) => ({
    movieHourUnique: unique('unique_movie_hour').on(table.movieId, table.timestamp),
    movieHourIdx: index('idx_hourly_trending_movie').on(table.movieId),
}));
