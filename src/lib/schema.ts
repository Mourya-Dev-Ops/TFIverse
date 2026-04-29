// lib/schema.ts - v17 CLEAN (OLD TABLES REMOVED)

import { sql } from 'drizzle-orm';
import {
  pgTable, serial, text, timestamp, boolean, integer, varchar, jsonb, real,
  uuid, index, unique, primaryKey
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import type { AdapterAccountType } from 'next-auth/adapters';


// ============================================================================
// AUTH SYSTEM - NEXTAUTH CORE TABLES (UUID)
// ============================================================================

export const users = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  password: text('password'),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
});

export const accounts = pgTable(
  'account',
  {
    userId: uuid('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: uuid('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const passwordResetTokens = pgTable('password_reset_token', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull(),
  token: text('token').notNull().unique(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
});

// ============================================================================
// PROFILE SYSTEM (UUID-BASED)
// ============================================================================

export const userProfiles = pgTable('user_profile', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('userId').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  username: text('username').notNull().unique(),
  bio: text('bio'),
  location: text('location'),
  website: text('website'),
  coverImage: text('coverImage'),
  totalReviews: integer('totalReviews').default(0),
  totalWatchlist: integer('totalWatchlist').default(0),
  totalFollowers: integer('totalFollowers').default(0),
  statusEmoji: text('status_emoji'),
  themeColor: text('theme_color').default('#3b82f6'),
  totalFollowing: integer('totalFollowing').default(0),
  badges: jsonb('badges').$type<string[]>().default([]),
  isPublic: boolean('isPublic').default(true),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
  pronouns: text('pronouns'),
  statusMessage: text('statusMessage'),
  avatarUrl: text('avatarUrl'),
  bannerUrl: text('bannerUrl'),
  twitterUrl: text('twitterUrl'),
  instagramUrl: text('instagramUrl'),
  youtubeUrl: text('youtubeUrl'),
  tiktokUrl: text('tiktokUrl'),
  imdbUrl: text('imdbUrl'),
  letterboxdUrl: text('letterboxdUrl'),
  totalWatched: integer('totalWatched').default(0),
  totalMemes: integer('totalMemes').default(0),
  totalTierLists: integer('totalTierLists').default(0),
  totalMoviesWatched: integer('total_movies_watched').default(0),
  totalReviewsWritten: integer('total_reviews_written').default(0),
  totalLikesGiven: integer('total_likes_given').default(0),
  streakDays: integer('streak_days').default(0),
  favoriteBadges: jsonb('favoriteBadges').$type<string[]>().default([]),
  favoriteHeroSlug: text('favorite_hero_slug'),
  favoriteMovieSlug: text('favorite_movie_slug'),
  showFollowers: boolean('showFollowers').default(true),
  showFollowing: boolean('showFollowing').default(true),
  showWatchlist: boolean('showWatchlist').default(true),
  showWatched: boolean('showWatched').default(true),
  showReviews: boolean('showReviews').default(true),
  showTierLists: boolean('showTierLists').default(true),
  showMemes: boolean('showMemes').default(true),
  isOnline: boolean('isOnline').default(false),
  lastSeen: timestamp('lastSeen', { mode: 'date' }),
  dateOfBirth: timestamp('dateOfBirth', { mode: 'date' }),
});

export const userFollows = pgTable('user_follows', {
  id: uuid('id').primaryKey().defaultRandom(),
  followerId: uuid('followerId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  followingId: uuid('followingId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
});

export const profileViews = pgTable('profile_views', {
  id: uuid('id').primaryKey().defaultRandom(),
  viewerId: uuid('viewer_id').references(() => users.id),
  profileId: uuid('profile_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  viewedAt: timestamp('viewed_at').defaultNow(),
});

// ============================================================================
// PEOPLE TABLE - ALL PEOPLE (HEROES, DIRECTORS, SINGERS, ETC.)
// ============================================================================

export const people = pgTable(
  'people',
  {
    // Primary Key (string like 'prabhas', 'ss-rajamouli')
    id: varchar('id', { length: 100 }).primaryKey(),

    // Basic Info
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),

    // External IDs
    tmdbPersonId: integer('tmdb_person_id'),
    imdbId: varchar('imdb_id', { length: 50 }),

    // Category System (from metadata)
    category: varchar('category', { length: 100 }).notNull(), // 'hero', 'heroine', 'director', etc.
    subcategory: varchar('subcategory', { length: 100 }),     // 'superstar', 'diva', 'hitmaker', null

    // Full JSON Data
    metadata: jsonb('metadata').notNull(), // Complete JSON file stored here

    // Timestamps
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    slugIdx: index('idx_people_slug').on(table.slug),
    categoryIdx: index('idx_people_category').on(table.category),
    subcategoryIdx: index('idx_people_subcategory').on(table.subcategory),
    tmdbIdx: index('idx_people_tmdb').on(table.tmdbPersonId),
    catSubcatIdx: index('idx_people_cat_subcat').on(table.category, table.subcategory),
  })
);


// ============================================================================
// MOVIES TABLE - ALL TELUGU MOVIES FROM TMDB
// ============================================================================

export const movies = pgTable(
  'movies',
  {
    // Primary Key (auto-increment)
    id: serial('id').primaryKey(),

    // TMDB IDs (for uniqueness and external references)
    tmdbId: integer('tmdb_id').notNull().unique(),
    imdbId: varchar('imdb_id', { length: 20 }),

    // Basic Info
    title: varchar('title', { length: 500 }).notNull(),
    originalTitle: varchar('original_title', { length: 500 }),
    slug: varchar('slug', { length: 500 }).notNull().unique(),
    tagline: varchar('tagline', { length: 500 }),
    overview: text('overview'),

    // Release Info
    releaseDate: timestamp('release_date', { mode: 'date' }),
    year: integer('year'),
    runtime: integer('runtime'), // in minutes
    status: varchar('status', { length: 50 }), // 'Released', 'Post Production', etc.

    // Financial Data
    budget: integer('budget'),
    revenue: integer('revenue'),

    // Ratings
    voteAverage: real('vote_average'),  // ← Change from integer
    voteCount: integer('vote_count'),
    popularity: real('popularity'),      // ← Change from integer

    // Media URLs (full URLs stored here)
    posterUrl: varchar('poster_url', { length: 500 }),
    backdropUrl: varchar('backdrop_url', { length: 500 }),
    trailerUrl: varchar('trailer_url', { length: 500 }),

    // Full JSON Data (backup/reference)
    metadata: jsonb('metadata').notNull(),

    // OTT Platform Data (from JustWatch API)
    ottUrls: jsonb('ott_urls'),
    ottFetched: boolean('ott_fetched').default(false),

    // Timestamps
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    tmdbIdIdx: index('idx_movies_tmdb_id').on(table.tmdbId),
    slugIdx: index('idx_movies_slug').on(table.slug),
    yearIdx: index('idx_movies_year').on(table.year),
    releaseIdx: index('idx_movies_release_date').on(table.releaseDate),
  })
);


// ============================================================================
// MOVIE CREDITS - LINKS MOVIES ↔ PEOPLE (CAST & CREW)
// ============================================================================

export const movieCredits = pgTable(
  'movie_credits',
  {
    // Primary Key
    id: serial('id').primaryKey(),

    // Foreign Keys
    movieId: integer('movie_id').notNull().references(() => movies.id, { onDelete: 'cascade' }),
    personId: varchar('person_id', { length: 100 }).notNull().references(() => people.id, { onDelete: 'cascade' }),

    // TMDB Person ID (for matching when person doesn't exist yet)
    tmdbPersonId: integer('tmdb_person_id').notNull(),

    // Role Type
    roleType: varchar('role_type', { length: 10 }).notNull(), // 'cast' or 'crew'

    // Cast-specific fields
    character: varchar('character', { length: 500 }), // Character name (for cast)
    orderIndex: integer('order_index'), // Display order (for cast)

    // Crew-specific fields
    job: varchar('job', { length: 100 }), // 'Director', 'Producer', etc.
    department: varchar('department', { length: 100 }), // 'Directing', 'Writing', etc.

    // Timestamp
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    movieIdx: index('idx_credits_movie').on(table.movieId),
    personIdx: index('idx_credits_person').on(table.personId),
    tmdbPersonIdx: index('idx_credits_tmdb_person').on(table.tmdbPersonId),
    roleIdx: index('idx_credits_role').on(table.roleType),
  })
);

// ============================================================================
// MOVIE OTT LINKS - STREAMING AVAILABILITY
// ============================================================================

export const movieOttLinks = pgTable(
  'movie_ott_links',
  {
    // Primary Key
    id: serial('id').primaryKey(),

    // Foreign Key to Movies
    movieId: integer('movie_id').notNull().references(() => movies.id, { onDelete: 'cascade' }),

    // Platform Info
    platform: varchar('platform', { length: 100 }).notNull(), // 'Netflix', 'Aha', etc.
    url: text('url'), // Direct link to watch
    type: varchar('type', { length: 50 }).notNull(), // 'subscription', 'rent', 'buy'

    // Region & Availability
    region: varchar('region', { length: 10 }).default('IN'), // Country code
    isAvailable: boolean('is_available').default(true),

    // Optional Metadata
    price: real('price'), // Rental/purchase price
    quality: varchar('quality', { length: 20 }), // 'HD', '4K', etc.

    // Timestamps
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    movieIdx: index('idx_movie_ott_movie_id').on(table.movieId),
    platformIdx: index('idx_movie_ott_platform').on(table.platform),
    availableIdx: index('idx_movie_ott_available').on(table.isAvailable),
    regionIdx: index('idx_movie_ott_region').on(table.region),

    // Prevent duplicate platform entries per movie
    uniqueMoviePlatformType: unique('unique_movie_platform_type').on(
      table.movieId,
      table.platform,
      table.type
    ),
  })
);


// ============================================================================
// RELATIONS FOR MOVIES
// ============================================================================

// Update moviesRelations to include OTT links
export const moviesRelations = relations(movies, ({ many }) => ({
  credits: many(movieCredits),
  ottLinks: many(movieOttLinks), // ← ADD THIS LINE
}));

export const movieCreditsRelations = relations(movieCredits, ({ one }) => ({
  movie: one(movies, {
    fields: [movieCredits.movieId],
    references: [movies.id],
  }),
  person: one(people, {
    fields: [movieCredits.personId],
    references: [people.id],
  }),
}));

export const movieOttLinksRelations = relations(movieOttLinks, ({ one }) => ({
  movie: one(movies, {
    fields: [movieOttLinks.movieId],
    references: [movies.id],
  }),
}));





// ============================================================================
// PEOPLE FOLLOWS
// ============================================================================

export const peopleFollows = pgTable('people_follows', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  personId: varchar('person_id', { length: 100 }).notNull().references(() => people.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userPersonIdx: unique('user_person_follow_unique').on(table.userId, table.personId),
}));

// ============================================================================
// CONTENT SYSTEM (UUID-BASED)
// ============================================================================

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  movieSlug: varchar('movie_slug', { length: 255 }).notNull(),
  rating: integer('rating').notNull(),
  reviewText: text('review_text'),
  spoilers: boolean('spoilers').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const watchedMovies = pgTable('watched_movies', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  movieSlug: varchar('movie_slug', { length: 255 }).notNull(),
  watchedAt: timestamp('watched_at').defaultNow(),
  rating: integer('rating'),
});

export const watchlist = pgTable('watchlist', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  movieSlug: varchar('movie_slug', { length: 255 }).notNull(),
  addedAt: timestamp('added_at').defaultNow(),
});

export const pinnedItems = pgTable('pinned_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  itemType: text('item_type').notNull(),
  itemId: uuid('item_id').notNull(),
  pinnedAt: timestamp('pinned_at').defaultNow(),
});

// ============================================================================
// BADGES SYSTEM (UUID-BASED)
// ============================================================================

export const badges = pgTable('badges', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: varchar('key', { length: 100 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 10 }),
  requirement: jsonb('requirement'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const userBadges = pgTable('user_badges', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  badgeId: uuid('badge_id').notNull().references(() => badges.id, { onDelete: 'cascade' }),
  earnedAt: timestamp('earned_at').defaultNow(),
});

// ============================================================================
// TIER LISTS SYSTEM (UUID-BASED)
// ============================================================================

export const tierLists = pgTable('tier_list', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  tiers: jsonb('tiers').$type<{
    S: string[]; A: string[]; B: string[]; C: string[]; D: string[]; F: string[];
  }>().default({ S: [], A: [], B: [], C: [], D: [], F: [] }),
  isPublic: boolean('isPublic').default(true),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
});

export const tierListLikes = pgTable('tier_list_like', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tierListId: uuid('tierListId').notNull().references(() => tierLists.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
});

// ============================================================================
// MEMES SYSTEM (UUID-BASED)
// ============================================================================

export const memes = pgTable('memes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  imageUrl: text('image_url').notNull(),
  tags: jsonb('tags').$type<string[]>().default([]),
  heroTags: jsonb('hero_tags').$type<string[]>().default([]),
  likes: integer('likes').default(0),
  views: integer('views').default(0),
  shares: integer('shares').default(0),
  downloads: integer('downloads').default(0),
  status: text('status').default('pending').notNull(),
  allowComments: boolean('allow_comments').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const memeViews = pgTable('meme_views', {
  id: uuid('id').primaryKey().defaultRandom(),
  memeId: uuid('meme_id').notNull().references(() => memes.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  ipAddress: text('ip_address'),
});

export const memeLikes = pgTable('meme_likes', {
  id: uuid('id').primaryKey().defaultRandom(),
  memeId: uuid('meme_id').notNull().references(() => memes.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const memeDownloads = pgTable('meme_downloads', {
  id: uuid('id').primaryKey().defaultRandom(),
  memeId: uuid('meme_id').notNull().references(() => memes.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const memeComments = pgTable('meme_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  memeId: uuid('meme_id').notNull().references(() => memes.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  comment: text('comment').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const memeBookmarks = pgTable('meme_bookmarks', {
  id: uuid('id').primaryKey().defaultRandom(),
  memeId: uuid('meme_id').notNull().references(() => memes.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const memeReports = pgTable('meme_reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  memeId: uuid('meme_id').notNull().references(() => memes.id, { onDelete: 'cascade' }),
  reportedBy: uuid('reported_by').notNull().references(() => users.id, { onDelete: 'cascade' }),
  reason: text('reason').notNull(),
  details: text('details'),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const memeShares = pgTable('meme_shares', {
  id: uuid('id').primaryKey().defaultRandom(),
  memeId: uuid('meme_id').notNull().references(() => memes.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  platform: text('platform'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================================
// NOTIFICATIONS SYSTEM (UUID-BASED)
// ============================================================================

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  link: text('link'),
  read: boolean('read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ one, many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  profile: one(userProfiles),
  reviews: many(reviews),
  watchedMovies: many(watchedMovies),
  watchlist: many(watchlist),
  memes: many(memes),
  tierLists: many(tierLists),
  userBadges: many(userBadges),
  peopleFollows: many(peopleFollows),
}));

export const peopleRelations = relations(people, ({ many }) => ({
  followers: many(peopleFollows),
}));

export const peopleFollowsRelations = relations(peopleFollows, ({ one }) => ({
  user: one(users, {
    fields: [peopleFollows.userId],
    references: [users.id],
  }),
  person: one(people, {
    fields: [peopleFollows.personId],
    references: [people.id],
  }),
}));

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Person = typeof people.$inferSelect;
export type NewPerson = typeof people.$inferInsert;
export type PeopleFollow = typeof peopleFollows.$inferSelect;
export type NewPeopleFollow = typeof peopleFollows.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type WatchedMovie = typeof watchedMovies.$inferSelect;
export type WatchlistItem = typeof watchlist.$inferSelect;
export type TierList = typeof tierLists.$inferSelect;
export type NewTierList = typeof tierLists.$inferInsert;
export type Meme = typeof memes.$inferSelect;
export type NewMeme = typeof memes.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type Movie = typeof movies.$inferSelect;
export type NewMovie = typeof movies.$inferInsert;
export type MovieCredit = typeof movieCredits.$inferSelect;
export type NewMovieCredit = typeof movieCredits.$inferInsert;
export type MovieOttLink = typeof movieOttLinks.$inferSelect;
export type NewMovieOttLink = typeof movieOttLinks.$inferInsert;

// ============================================================================
// RUMORS SYSTEM
// ============================================================================

export const rumors = pgTable('rumors', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  status: text('status').notNull(), // 'confirmed', 'trade', 'discussion'
  source: text('source'),
  url: text('url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export type Rumor = typeof rumors.$inferSelect;
export type NewRumor = typeof rumors.$inferInsert;
