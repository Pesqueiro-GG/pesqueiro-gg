# Apply migrations to a cloud database

This guide shows you how to set up a Supabase cloud project (dev, production or demo) for the first time: create the `app_server` role, apply the migrations, and confirm the app can connect. After the delivery pipeline ([#4](https://github.com/Pesqueiro-GG/pesqueiro-gg/issues/4)) is in place, CI applies migrations on every merge, and you only need this guide for a new project.

## Before you begin

- The project exists in the São Paulo region (South America).
- You have its database password (the one set when the project was created) in a password manager.
- You've chosen a strong password for `app_server`, different for each project, and stored it in the password manager. Don't reuse the database password.
- You've cloned the repository and run `npm ci`.

Never paste these passwords or connection strings into issues, pull requests, chats or files that are committed. `.env.local` is ignored by git, so it's safe for local use.

## Get the connection strings

In the Supabase dashboard, open the project and select **Connect**. You need two strings:

| Use | Pooler mode | Port | User | Why |
|---|---|---|---|---|
| Migrations (`DATABASE_MIGRATION_URL`) | Session | 5432 | `postgres.<project-ref>` | Runs as the owner. The direct connection is IPv6-only, and many networks and GitHub Actions don't support IPv6, so use the session pooler. |
| The app (`DATABASE_URL`) | Transaction | 6543 | `app_server.<project-ref>` | How the app connects: as its own role, through the pooler built for serverless functions |

Replace `[YOUR-PASSWORD]` in each string with the right password: the database password for migrations, the `app_server` password for the app.

## Apply the migrations

1. In a terminal at the repository root, set the variables for this session only. In PowerShell:

   ```powershell
   $env:DATABASE_MIGRATION_URL = "<session pooler string, as postgres>"
   $env:APP_SERVER_DB_PASSWORD = "<the app_server password>"
   ```

   In bash, use `export DATABASE_MIGRATION_URL="…"` and `export APP_SERVER_DB_PASSWORD="…"`.

2. Run the migrations:

   ```bash
   npm run db:migrate
   ```

   The script creates the `app_server` role if it doesn't exist, sets its password, and applies every migration in `drizzle/`. It prints `Migrations applied.` when done. Running it again is safe: applied migrations are skipped and the password is set again.

## Check that the app can connect

1. Set the app's connection string:

   ```powershell
   $env:DATABASE_URL = "<transaction pooler string, as app_server.<project-ref>>"
   ```

2. Run the check:

   ```bash
   npm run db:check
   ```

   It should print `Connected as app_server to postgres`.

If the check fails with an authentication error, the pooler may not accept the custom role. Record the error in [#3](https://github.com/Pesqueiro-GG/pesqueiro-gg/issues/3) and connect the app with the direct connection's IPv4 alternative or a dedicated database user instead, as described in [Environments](../reference/environments.md).

## Finish

1. Close the terminal, so the variables don't stay in its history or environment.
2. When the delivery pipeline exists, store the same values as secrets in GitHub Actions and Vercel, following [Environments](../reference/environments.md#github-actions-secrets).
