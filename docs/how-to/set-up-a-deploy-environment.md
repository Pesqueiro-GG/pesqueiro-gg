# Set up a deploy environment

This guide shows you how to connect a new environment, such as the demo, to the delivery pipeline: its Supabase database, its Vercel project and its GitHub environment. When you finish, every merge into the environment's branch migrates its database and deploys to it.

Dev and production are already set up. Use this guide for the demo (planned for about 22 Nov) or to rebuild an environment.

## Before you begin

- You have access to the Vercel account that owns the projects (Amanda's, "skyerv's projects") and admin access to the GitHub repository.
- The Supabase project exists in São Paulo, and you've applied the migrations and checked the connection by following [Apply migrations to a cloud database](apply-migrations-to-a-cloud-database.md). Keep its session pooler string and `app_server` password at hand.
- You've chosen the environment's name, branch and address. For the demo: GitHub environment `demo`, branch `main`, Vercel project `pesqueiro-demo`, address `pesqueirogg-demo.vercel.app`.

Never paste passwords, tokens or connection strings into issues, pull requests or chats.

## Create the Vercel project

1. In a terminal, sign in and create the project without a Git connection:

   ```bash
   npx vercel@65.2.0 login
   npx vercel@65.2.0 project add pesqueiro-demo
   ```

   `vercel.json` sets the Next.js preset, so the project builds correctly even though it was created without one.

2. In the Vercel dashboard, open the project and go to **Settings → Build and Deployment**. Set **Node.js Version** to **22.x**.
3. In **Settings → Domains**, add the environment's address (for example `pesqueirogg-demo.vercel.app`) and connect it to **Production**. If Vercel says it's taken, pick another and update [Environments](../reference/environments.md#vercel-projects).
4. In **Settings → Environment Variables**, add the app's variables for **Production**, as listed in [Environments](../reference/environments.md#environment-variables).
5. In **Settings → General**, copy the **Project ID** (`prj_…`).

## Create a token for the project

1. Go to **Account Settings → Tokens → Create Token**.
2. Name it `github-<environment>`, limit its scope to this project only, and set it to expire in **90 days**.
3. Copy the token. Vercel shows it once.

## Create the GitHub environment

1. In the repository, go to **Settings → Environments** and create the environment (for example `demo`), or open it if it exists.
2. Under **Deployment branches and tags**, choose **Selected branches and tags** and add the environment's branch (`main` for the demo). This stops a manual run from another branch from deploying there.
3. Add four environment secrets:

   | Secret | Value |
   |---|---|
   | `DATABASE_MIGRATION_URL` | The session pooler string, as `postgres.<project-ref>`, with the database password |
   | `APP_SERVER_DB_PASSWORD` | The `app_server` password you set with `db:migrate` |
   | `VERCEL_PROJECT_ID` | The project ID from Vercel |
   | `VERCEL_TOKEN` | The token you just created |

Paste each value with nothing before or after it. A stray space or line break fails the deploy with "Project not found". IDs aren't secret, so you can set them exactly with the GitHub CLI instead:

```bash
gh secret set VERCEL_PROJECT_ID --env demo --body prj_…
```

## Deploy and check

1. Go to **Actions → Deploy → Run workflow** and run it on the environment's branch.
2. Check that the environment's job finished and its summary names the right project.
3. Open the address and check that the page loads.

| Error | Cause | Fix |
|---|---|---|
| `Project not found` | Wrong `VERCEL_PROJECT_ID` or `VERCEL_ORG_ID`, a stray character in one, or a token limited to another project | Set the ID again with `gh secret set`; check the token's scope in Vercel |
| `Could not retrieve Project Settings` | `VERCEL_ORG_ID` isn't the account's `team_…` ID | Set the repository secret to the Team ID from Vercel **Settings → General** |
| `No Output Directory named "dist"` | The project has no Next.js preset | Check that `vercel.json` has `"framework": "nextjs"`, or set the preset in the project's settings |
| The wrong site appears at the address | The domain is attached to another project | Move the domain in each project's **Settings → Domains** |

## Finish

Update the [Vercel projects](../reference/environments.md#vercel-projects) table if anything differs from the plan, and set a reminder to replace the token before it expires.
