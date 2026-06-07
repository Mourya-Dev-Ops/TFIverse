ALTER TABLE "meme_comments" DROP CONSTRAINT "meme_comments_user_id_user_id_fk";
--> statement-breakpoint
DROP INDEX "meme_comments_meme_id_idx";--> statement-breakpoint
DROP INDEX "meme_comments_created_at_idx";--> statement-breakpoint
ALTER TABLE "meme_comments" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "meme_comments" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "meme_comments" ALTER COLUMN "meme_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "meme_comments" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "meme_comments" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "meme_comments" ADD COLUMN "comment" text NOT NULL;--> statement-breakpoint
ALTER TABLE "meme_comments" ADD CONSTRAINT "meme_comments_user_id_user_profile_userId_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profile"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meme_comments" DROP COLUMN "content";