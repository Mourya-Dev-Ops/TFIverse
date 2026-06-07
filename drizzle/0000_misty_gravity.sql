CREATE TABLE "account" (
	"userId" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "badges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"icon" varchar(10),
	"requirement" jsonb,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "badges_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "meme_bookmarks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meme_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "meme_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meme_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"comment" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meme_downloads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meme_id" uuid NOT NULL,
	"user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meme_likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meme_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "meme_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meme_id" uuid NOT NULL,
	"reported_by" uuid NOT NULL,
	"reason" text NOT NULL,
	"details" text,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "meme_shares" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meme_id" uuid NOT NULL,
	"user_id" uuid,
	"platform" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meme_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meme_id" uuid NOT NULL,
	"user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text
);
--> statement-breakpoint
CREATE TABLE "memes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image_url" text NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"hero_tags" jsonb DEFAULT '[]'::jsonb,
	"movie_tags" jsonb DEFAULT '[]'::jsonb,
	"likes" integer DEFAULT 0,
	"views" integer DEFAULT 0,
	"shares" integer DEFAULT 0,
	"downloads" integer DEFAULT 0,
	"status" text DEFAULT 'pending' NOT NULL,
	"is_featured" boolean DEFAULT false,
	"featured_at" timestamp,
	"allow_comments" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "movie_credits" (
	"id" serial PRIMARY KEY NOT NULL,
	"movie_id" integer NOT NULL,
	"person_id" varchar(100) NOT NULL,
	"tmdb_person_id" integer NOT NULL,
	"role_type" varchar(10) NOT NULL,
	"character" varchar(500),
	"order_index" integer,
	"job" varchar(100),
	"department" varchar(100),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "movie_ott_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"movie_id" integer NOT NULL,
	"platform" varchar(100) NOT NULL,
	"url" text,
	"type" varchar(50) NOT NULL,
	"region" varchar(10) DEFAULT 'IN',
	"is_available" boolean DEFAULT true,
	"price" real,
	"quality" varchar(20),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "unique_movie_platform_type" UNIQUE("movie_id","platform","type")
);
--> statement-breakpoint
CREATE TABLE "movies" (
	"id" serial PRIMARY KEY NOT NULL,
	"tmdb_id" integer NOT NULL,
	"imdb_id" varchar(20),
	"title" varchar(500) NOT NULL,
	"original_title" varchar(500),
	"slug" varchar(500) NOT NULL,
	"tagline" varchar(500),
	"overview" text,
	"release_date" timestamp,
	"year" integer,
	"runtime" integer,
	"status" varchar(50),
	"budget" integer,
	"revenue" integer,
	"vote_average" real,
	"vote_count" integer,
	"popularity" real,
	"poster_url" varchar(500),
	"backdrop_url" varchar(500),
	"trailer_url" varchar(500),
	"metadata" jsonb NOT NULL,
	"ott_urls" jsonb,
	"ott_fetched" boolean DEFAULT false,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "movies_tmdb_id_unique" UNIQUE("tmdb_id"),
	CONSTRAINT "movies_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"link" text,
	"read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "password_reset_token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "password_reset_token_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "people" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"tmdb_person_id" integer,
	"imdb_id" varchar(50),
	"category" varchar(100) NOT NULL,
	"subcategory" varchar(100),
	"metadata" jsonb NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "people_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "people_follows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"person_id" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_person_follow_unique" UNIQUE("user_id","person_id")
);
--> statement-breakpoint
CREATE TABLE "pinned_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"item_type" text NOT NULL,
	"item_id" uuid NOT NULL,
	"pinned_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "profile_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"viewer_id" uuid,
	"profile_id" uuid NOT NULL,
	"viewed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"movie_slug" varchar(255) NOT NULL,
	"rating" integer NOT NULL,
	"review_text" text,
	"spoilers" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rumors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"status" text NOT NULL,
	"source" text,
	"url" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tier_list_comment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tierListId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"parentId" uuid,
	"content" text NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tier_list_like" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"tierListId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tier_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"tiers" jsonb DEFAULT '{"S":[],"A":[],"B":[],"C":[],"D":[],"F":[]}'::jsonb,
	"isPublic" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_badges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"badge_id" uuid NOT NULL,
	"earned_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_follows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"followerId" uuid NOT NULL,
	"followingId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"username" text NOT NULL,
	"bio" text,
	"location" text,
	"website" text,
	"coverImage" text,
	"totalReviews" integer DEFAULT 0,
	"totalWatchlist" integer DEFAULT 0,
	"totalFollowers" integer DEFAULT 0,
	"status_emoji" text,
	"theme_color" text DEFAULT '#3b82f6',
	"totalFollowing" integer DEFAULT 0,
	"badges" jsonb DEFAULT '[]'::jsonb,
	"isPublic" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"pronouns" text,
	"statusMessage" text,
	"avatarUrl" text,
	"bannerUrl" text,
	"twitterUrl" text,
	"instagramUrl" text,
	"youtubeUrl" text,
	"tiktokUrl" text,
	"imdbUrl" text,
	"letterboxdUrl" text,
	"totalWatched" integer DEFAULT 0,
	"totalMemes" integer DEFAULT 0,
	"totalTierLists" integer DEFAULT 0,
	"total_movies_watched" integer DEFAULT 0,
	"total_reviews_written" integer DEFAULT 0,
	"total_likes_given" integer DEFAULT 0,
	"streak_days" integer DEFAULT 0,
	"favoriteBadges" jsonb DEFAULT '[]'::jsonb,
	"favorite_hero_slug" text,
	"favorite_movie_slug" text,
	"showFollowers" boolean DEFAULT true,
	"showFollowing" boolean DEFAULT true,
	"showWatchlist" boolean DEFAULT true,
	"showWatched" boolean DEFAULT true,
	"showReviews" boolean DEFAULT true,
	"showTierLists" boolean DEFAULT true,
	"showMemes" boolean DEFAULT true,
	"isOnline" boolean DEFAULT false,
	"lastSeen" timestamp,
	"dateOfBirth" timestamp,
	CONSTRAINT "user_profile_userId_unique" UNIQUE("userId"),
	CONSTRAINT "user_profile_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"password" text,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "watched_movies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"movie_slug" varchar(255) NOT NULL,
	"watched_at" timestamp DEFAULT now(),
	"rating" integer
);
--> statement-breakpoint
CREATE TABLE "watchlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"movie_slug" varchar(255) NOT NULL,
	"added_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meme_bookmarks" ADD CONSTRAINT "meme_bookmarks_meme_id_memes_id_fk" FOREIGN KEY ("meme_id") REFERENCES "public"."memes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meme_bookmarks" ADD CONSTRAINT "meme_bookmarks_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meme_comments" ADD CONSTRAINT "meme_comments_meme_id_memes_id_fk" FOREIGN KEY ("meme_id") REFERENCES "public"."memes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meme_comments" ADD CONSTRAINT "meme_comments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meme_downloads" ADD CONSTRAINT "meme_downloads_meme_id_memes_id_fk" FOREIGN KEY ("meme_id") REFERENCES "public"."memes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meme_downloads" ADD CONSTRAINT "meme_downloads_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meme_likes" ADD CONSTRAINT "meme_likes_meme_id_memes_id_fk" FOREIGN KEY ("meme_id") REFERENCES "public"."memes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meme_likes" ADD CONSTRAINT "meme_likes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meme_reports" ADD CONSTRAINT "meme_reports_meme_id_memes_id_fk" FOREIGN KEY ("meme_id") REFERENCES "public"."memes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meme_reports" ADD CONSTRAINT "meme_reports_reported_by_user_id_fk" FOREIGN KEY ("reported_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meme_shares" ADD CONSTRAINT "meme_shares_meme_id_memes_id_fk" FOREIGN KEY ("meme_id") REFERENCES "public"."memes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meme_shares" ADD CONSTRAINT "meme_shares_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meme_views" ADD CONSTRAINT "meme_views_meme_id_memes_id_fk" FOREIGN KEY ("meme_id") REFERENCES "public"."memes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meme_views" ADD CONSTRAINT "meme_views_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memes" ADD CONSTRAINT "memes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movie_credits" ADD CONSTRAINT "movie_credits_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movie_credits" ADD CONSTRAINT "movie_credits_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movie_ott_links" ADD CONSTRAINT "movie_ott_links_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "people_follows" ADD CONSTRAINT "people_follows_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "people_follows" ADD CONSTRAINT "people_follows_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pinned_items" ADD CONSTRAINT "pinned_items_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_views" ADD CONSTRAINT "profile_views_viewer_id_user_id_fk" FOREIGN KEY ("viewer_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_views" ADD CONSTRAINT "profile_views_profile_id_user_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tier_list_comment" ADD CONSTRAINT "tier_list_comment_tierListId_tier_list_id_fk" FOREIGN KEY ("tierListId") REFERENCES "public"."tier_list"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tier_list_comment" ADD CONSTRAINT "tier_list_comment_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tier_list_like" ADD CONSTRAINT "tier_list_like_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tier_list_like" ADD CONSTRAINT "tier_list_like_tierListId_tier_list_id_fk" FOREIGN KEY ("tierListId") REFERENCES "public"."tier_list"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tier_list" ADD CONSTRAINT "tier_list_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badge_id_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_followerId_user_id_fk" FOREIGN KEY ("followerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_followingId_user_id_fk" FOREIGN KEY ("followingId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watched_movies" ADD CONSTRAINT "watched_movies_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_credits_movie" ON "movie_credits" USING btree ("movie_id");--> statement-breakpoint
CREATE INDEX "idx_credits_person" ON "movie_credits" USING btree ("person_id");--> statement-breakpoint
CREATE INDEX "idx_credits_tmdb_person" ON "movie_credits" USING btree ("tmdb_person_id");--> statement-breakpoint
CREATE INDEX "idx_credits_role" ON "movie_credits" USING btree ("role_type");--> statement-breakpoint
CREATE INDEX "idx_movie_ott_movie_id" ON "movie_ott_links" USING btree ("movie_id");--> statement-breakpoint
CREATE INDEX "idx_movie_ott_platform" ON "movie_ott_links" USING btree ("platform");--> statement-breakpoint
CREATE INDEX "idx_movie_ott_available" ON "movie_ott_links" USING btree ("is_available");--> statement-breakpoint
CREATE INDEX "idx_movie_ott_region" ON "movie_ott_links" USING btree ("region");--> statement-breakpoint
CREATE INDEX "idx_movies_tmdb_id" ON "movies" USING btree ("tmdb_id");--> statement-breakpoint
CREATE INDEX "idx_movies_slug" ON "movies" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_movies_year" ON "movies" USING btree ("year");--> statement-breakpoint
CREATE INDEX "idx_movies_release_date" ON "movies" USING btree ("release_date");--> statement-breakpoint
CREATE INDEX "idx_people_slug" ON "people" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_people_category" ON "people" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_people_subcategory" ON "people" USING btree ("subcategory");--> statement-breakpoint
CREATE INDEX "idx_people_tmdb" ON "people" USING btree ("tmdb_person_id");--> statement-breakpoint
CREATE INDEX "idx_people_cat_subcat" ON "people" USING btree ("category","subcategory");