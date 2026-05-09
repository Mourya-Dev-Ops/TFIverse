CREATE TABLE "hero_follow_counts" (
	"hero_slug" text PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hero_follows" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"hero_slug" text NOT NULL,
	"hero_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hero_follows" ADD CONSTRAINT "hero_follows_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_hero_idx" ON "hero_follows" USING btree ("user_id","hero_slug");