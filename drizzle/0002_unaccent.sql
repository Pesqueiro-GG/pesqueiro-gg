-- Accent-insensitive search for the species catalog (catalog.searchSpecies).
-- The extension lives in the `extensions` schema, as on Supabase; queries call extensions.unaccent().
-- If a database already has it somewhere else, move it rather than create a second copy.
CREATE SCHEMA IF NOT EXISTS extensions;
--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_extension WHERE extname = 'unaccent') THEN
    ALTER EXTENSION unaccent SET SCHEMA extensions;
  ELSE
    CREATE EXTENSION unaccent WITH SCHEMA extensions;
  END IF;
END $$;
--> statement-breakpoint
GRANT USAGE ON SCHEMA extensions TO app_server;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION extensions.unaccent(text) TO app_server;
