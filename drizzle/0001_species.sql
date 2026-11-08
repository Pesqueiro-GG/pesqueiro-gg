CREATE TYPE "public"."rarity_tier" AS ENUM('comum', 'incomum', 'raro', 'epico');--> statement-breakpoint
CREATE TYPE "public"."species_habitat" AS ENUM('freshwater', 'marine', 'both');--> statement-breakpoint
CREATE TABLE "species" (
	"id" text PRIMARY KEY NOT NULL,
	"album_no" integer NOT NULL,
	"scientific_name" text NOT NULL,
	"name_pt" text NOT NULL,
	"name_en" text NOT NULL,
	"aliases_pt" text[] DEFAULT '{}' NOT NULL,
	"habitat" "species_habitat" NOT NULL,
	"rarity_tier" "rarity_tier" NOT NULL,
	"is_protected" boolean DEFAULT false NOT NULL,
	"protection_note_pt" text,
	"protection_note_en" text,
	"sources" text[] NOT NULL,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	CONSTRAINT "species_album_no_unique" UNIQUE("album_no")
);
--> statement-breakpoint
SELECT app_enable_access('public.species');
