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
