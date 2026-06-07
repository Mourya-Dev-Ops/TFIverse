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
ALTER TABLE "movies" ALTER COLUMN "vote_average" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "movies" ALTER COLUMN "popularity" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "movie_ott_links" ADD CONSTRAINT "movie_ott_links_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_movie_ott_movie_id" ON "movie_ott_links" USING btree ("movie_id");--> statement-breakpoint
CREATE INDEX "idx_movie_ott_platform" ON "movie_ott_links" USING btree ("platform");--> statement-breakpoint
CREATE INDEX "idx_movie_ott_available" ON "movie_ott_links" USING btree ("is_available");--> statement-breakpoint
CREATE INDEX "idx_movie_ott_region" ON "movie_ott_links" USING btree ("region");