DROP INDEX "meme_views_meme_session_idx";--> statement-breakpoint
ALTER TABLE "meme_views" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "meme_views" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "meme_views" ADD COLUMN "ip_address" text;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_meme_view" ON "meme_views" USING btree ("meme_id","user_id");--> statement-breakpoint
ALTER TABLE "meme_views" DROP COLUMN "session_id";