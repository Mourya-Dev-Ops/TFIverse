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
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now()
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
CREATE TABLE "meme_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meme_id" uuid NOT NULL,
	"user_id" uuid,
	"session_id" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "memes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image_url" text NOT NULL,
	"tags" json DEFAULT '[]'::json,
	"hero_tags" json DEFAULT '[]'::json,
	"likes" integer DEFAULT 0,
	"views" integer DEFAULT 0,
	"shares" integer DEFAULT 0,
	"downloads" integer DEFAULT 0,
	"status" text DEFAULT 'pending' NOT NULL,
	"allow_comments" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "meme_bookmarks" ADD CONSTRAINT "meme_bookmarks_meme_id_memes_id_fk" FOREIGN KEY ("meme_id") REFERENCES "public"."memes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meme_bookmarks" ADD CONSTRAINT "meme_bookmarks_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meme_comments" ADD CONSTRAINT "meme_comments_meme_id_memes_id_fk" FOREIGN KEY ("meme_id") REFERENCES "public"."memes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meme_comments" ADD CONSTRAINT "meme_comments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meme_likes" ADD CONSTRAINT "meme_likes_meme_id_memes_id_fk" FOREIGN KEY ("meme_id") REFERENCES "public"."memes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meme_likes" ADD CONSTRAINT "meme_likes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meme_reports" ADD CONSTRAINT "meme_reports_meme_id_memes_id_fk" FOREIGN KEY ("meme_id") REFERENCES "public"."memes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meme_reports" ADD CONSTRAINT "meme_reports_reported_by_user_id_fk" FOREIGN KEY ("reported_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meme_views" ADD CONSTRAINT "meme_views_meme_id_memes_id_fk" FOREIGN KEY ("meme_id") REFERENCES "public"."memes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meme_views" ADD CONSTRAINT "meme_views_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memes" ADD CONSTRAINT "memes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "meme_bookmarks_meme_user_idx" ON "meme_bookmarks" USING btree ("meme_id","user_id");--> statement-breakpoint
CREATE INDEX "meme_comments_meme_id_idx" ON "meme_comments" USING btree ("meme_id");--> statement-breakpoint
CREATE INDEX "meme_comments_created_at_idx" ON "meme_comments" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "meme_likes_meme_user_idx" ON "meme_likes" USING btree ("meme_id","user_id");--> statement-breakpoint
CREATE INDEX "meme_reports_meme_id_idx" ON "meme_reports" USING btree ("meme_id");--> statement-breakpoint
CREATE UNIQUE INDEX "meme_views_meme_session_idx" ON "meme_views" USING btree ("meme_id","session_id");--> statement-breakpoint
CREATE INDEX "memes_user_id_idx" ON "memes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "memes_status_idx" ON "memes" USING btree ("status");--> statement-breakpoint
CREATE INDEX "memes_created_at_idx" ON "memes" USING btree ("created_at");