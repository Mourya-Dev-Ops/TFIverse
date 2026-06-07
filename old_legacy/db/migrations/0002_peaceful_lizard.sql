ALTER TABLE "hero_follows" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "hero_follows" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "hero_follows" ALTER COLUMN "user_id" SET DATA TYPE uuid;