# Apply migrations to a cloud database

This guide shows you how to set up a Supabase cloud project (dev, production or demo) for the first time: create the `app_server` role, apply the migrations, and confirm the app can connect. After the delivery pipeline ([#4](https://github.com/Pesqueiro-GG/pesqueiro-gg/issues/4)) is in place, CI applies migrations on every merge, and you only need this guide for a new project.

## Before you begin

- The project exists in the São Paulo region (South America).
- You have its database password (the one set when the project was created) in a password manager.
- You've chosen a strong password for `app_server`, different for each project, and stored it in the password manager. Don't reuse the database password.
- You've cloned the repository and run `npm ci`.

Never paste these passwords or connection strings into issues, pull requests, chats or files that are committed. `.env.local` is ignored by git, so it's safe for local use.

## Get the connection strings

In the Supabase dashboard, open the project and select **Connect**. On the **Connection String** tab, choose **Session pooler** as the method and copy the URI. If only the transaction pooler is shown, copy it and change the port from `6543` to `5432`.

Copy the string; don't type it. The pooler host differs between projects (`aws-0-sa-east-1…` or `aws-1-sa-east-1…`), and a wrong host fails with "tenant/user not found". The user is `postgres.<project-ref>`, where the project reference is the project's random ID (shown in the dashboard address and under **Project Settings → General**), not its name.

The two connections the project uses:

| Use | Pooler mode | Port | User | Why |
|---|---|---|---|---|
| Migrations (`DATABASE_MIGRATION_URL`) | Session | 5432 | `postgres.<project-ref>` | Runs as the owner. The direct connection is IPv6-only, and many networks and GitHub Actions don't support IPv6, so use the session pooler. |
| The app (`DATABASE_URL`) | Transaction | 6543 | `app_server.<project-ref>` | How the app connects: as its own role, through the pooler built for serverless functions |

You only need to copy the session pooler string. `npm run db:check` builds the app's string from it.

In the session pooler string, replace `[YOUR-PASSWORD]` with the database password. If that password contains `@ : / ? # [ ] % &` or spaces, encode them (`@` → `%40`, `:` → `%3A`, `/` → `%2F`, `?` → `%3F`, `#` → `%23`, `%` → `%25`, `&` → `%26`). Choose the `app_server` password with letters and numbers only (at least 24 characters).

## Apply the migrations

1. In a terminal at the repository root, set the variables for this session only. In PowerShell:

   ```powershell
   $env:DATABASE_MIGRATION_URL = '<session pooler string, as postgres>'
   $env:APP_SERVER_DB_PASSWORD = '<the app_server password>'
   ```

   Use single quotes: inside double quotes, PowerShell changes anything after a `$` sign. In bash, use `export DATABASE_MIGRATION_URL='…'` and `export APP_SERVER_DB_PASSWORD='…'`.

2. Run the migrations:

   ```bash
   npm run db:migrate
   ```

   The script creates the `app_server` role if it doesn't exist, sets its password, and applies every migration in `drizzle/`. It prints `Migrations applied.` when done. Running it again is safe: applied migrations are skipped and the password is set again.

## Check that the app can connect

In the same terminal, run:

```bash
npm run db:check
```

With `DATABASE_URL` unset, the check builds the app's connection from the two variables above: the same host and project reference, user `app_server.<project-ref>`, the `app_server` password, and the transaction pooler port `6543`. It prints where it connects, then the result:

```
Connecting as app_server.<project-ref>@aws-1-sa-east-1.pooler.supabase.com:6543 …
Connected as app_server to postgres (Postgres 17.11).
```

The connection string it built is the app's `DATABASE_URL` for this project.

| Error | Cause | Fix |
|---|---|---|
| `tenant/user … not found` | Wrong host or project reference | Copy the session pooler string again from the dashboard |
| `password authentication failed` | The `app_server` password doesn't match | Run `npm run db:migrate` again with the same `APP_SERVER_DB_PASSWORD` |
| `Expected to connect as app_server` | `DATABASE_URL` is set to another user | Run `Remove-Item Env:DATABASE_URL` (PowerShell) or `unset DATABASE_URL` (bash) and check again |

The Supabase pooler accepts the custom `app_server` role; this was confirmed on the dev project on 7 Nov 2026.

## Finish

1. Close the terminal, so the variables don't stay in its history or environment.
2. When the delivery pipeline exists, store the same values as secrets in GitHub Actions and Vercel, following [Environments](../reference/environments.md#github-actions-secrets).
