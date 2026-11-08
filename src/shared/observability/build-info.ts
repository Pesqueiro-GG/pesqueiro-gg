// Facts fixed at build time and inlined by next.config.ts, so the server and the browser agree.

export type AppEnv = 'local' | 'dev' | 'demo' | 'production'

const ENVS: readonly AppEnv[] = ['local', 'dev', 'demo', 'production']

function toAppEnv(value: string | undefined): AppEnv {
  return ENVS.includes(value as AppEnv) ? (value as AppEnv) : 'local'
}

/** The environment this build is for (APP_ENV at build time). */
export const appEnv: AppEnv = toAppEnv(process.env.NEXT_PUBLIC_APP_ENV)

/** The commit this build was made from: set by deploy.yml, or by Vercel on previews. */
export const commit: string = process.env.NEXT_PUBLIC_COMMIT_SHA || 'local'

/** True where debugging aids (such as /api/debug/boom) may run. */
export const isDebugEnv: boolean = appEnv === 'local' || appEnv === 'dev'
