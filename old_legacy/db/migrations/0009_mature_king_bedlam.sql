CREATE TABLE "user_follows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"followerId" uuid NOT NULL,
	"followingId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "pronouns" text;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "statusMessage" text;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "avatarUrl" text;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "bannerUrl" text;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "twitterUrl" text;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "instagramUrl" text;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "youtubeUrl" text;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "tiktokUrl" text;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "imdbUrl" text;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "letterboxdUrl" text;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "totalWatched" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "totalMemes" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "totalTierLists" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "favoriteBadges" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "showFollowers" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "showFollowing" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "showWatchlist" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "showWatched" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "showReviews" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "showTierLists" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "showMemes" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "isOnline" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "lastSeen" timestamp;--> statement-breakpoint
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_followerId_user_id_fk" FOREIGN KEY ("followerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_followingId_user_id_fk" FOREIGN KEY ("followingId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "follower_following_idx" ON "user_follows" USING btree ("followerId","followingId");