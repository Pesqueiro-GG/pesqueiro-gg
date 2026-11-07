-- The app's own database role and the helper every table uses.
-- scripts/db/migrate.ts creates the app_server role (with its password) before this runs.
-- See docs/explanation/decisions/ADR-003-server-only-data-access.md.

-- app_server can use the public schema and, by default, read and write every table the owner creates.
GRANT USAGE ON SCHEMA public TO app_server;
--> statement-breakpoint
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_server;
--> statement-breakpoint
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO app_server;
--> statement-breakpoint

-- The browser's roles get nothing by default on new tables. Row-level security also denies them.
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;
--> statement-breakpoint
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated;
--> statement-breakpoint
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM anon, authenticated, public;
--> statement-breakpoint

-- Every migration that creates a table calls: SELECT app_enable_access('public.<table>');
-- It turns row-level security on and lets only app_server through.
CREATE OR REPLACE FUNCTION public.app_enable_access(target regclass) RETURNS void
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
  EXECUTE format('ALTER TABLE %s ENABLE ROW LEVEL SECURITY', target);
  EXECUTE format('DROP POLICY IF EXISTS app_server_all ON %s', target);
  EXECUTE format('CREATE POLICY app_server_all ON %s FOR ALL TO app_server USING (true) WITH CHECK (true)', target);
END;
$$;
--> statement-breakpoint
REVOKE ALL ON FUNCTION public.app_enable_access(regclass) FROM public, anon, authenticated, app_server;
