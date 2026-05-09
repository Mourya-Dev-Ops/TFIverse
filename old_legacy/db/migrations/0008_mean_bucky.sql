ALTER TABLE "meme_comments" DROP CONSTRAINT "meme_comments_user_id_user_profile_userId_fk";
--> statement-breakpoint
DROP INDEX "unique_meme_view";--> statement-breakpoint
ALTER TABLE "meme_comments" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "meme_comments" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "meme_comments" ALTER COLUMN "meme_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "meme_comments" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "meme_views" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "meme_views" ADD COLUMN "ip_address" text;--> statement-breakpoint
ALTER TABLE "meme_comments" ADD CONSTRAINT "meme_comments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "meme_views_meme_user_idx" ON "meme_views" USING btree ("meme_id","user_id");--> statement-breakpoint
CREATE INDEX "meme_views_meme_ip_idx" ON "meme_views" USING btree ("meme_id","ip_address");