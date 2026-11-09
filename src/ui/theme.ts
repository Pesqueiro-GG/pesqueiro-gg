/** The theme choices in Settings. `system` follows the device. */
export const THEMES = ['system', 'light', 'dark'] as const

export type Theme = (typeof THEMES)[number]

/** Cookie read on the server so `<html data-theme>` is right before the first paint. */
export const THEME_COOKIE = 'theme'

export function parseTheme(value: string | undefined): Theme {
  return (THEMES as readonly string[]).includes(value ?? '') ? (value as Theme) : 'system'
}

/** The `data-theme` attribute for a choice: none for `system`, so the media query decides. */
export function themeAttribute(theme: Theme): 'light' | 'dark' | undefined {
  return theme === 'system' ? undefined : theme
}
