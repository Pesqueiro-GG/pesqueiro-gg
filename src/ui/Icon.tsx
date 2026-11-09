import {
  Bell,
  BookOpen,
  Camera,
  Fish,
  FishingHook,
  Globe,
  House,
  type LucideIcon,
  MapPin,
  Medal,
  Monitor,
  Moon,
  Plus,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Sun,
  Trophy,
  User,
  Users,
  X,
} from 'lucide-react'

/**
 * The icons the app uses, by their Lucide name. Listed one by one so only these reach the
 * browser; add a name here when an item needs a new icon. Fixed meanings are in
 * docs/reference/design-system.md#icons-with-fixed-meanings.
 */
const ICONS = {
  bell: Bell,
  'book-open': BookOpen,
  camera: Camera,
  fish: Fish,
  'fishing-hook': FishingHook,
  globe: Globe,
  house: House,
  'map-pin': MapPin,
  medal: Medal,
  monitor: Monitor,
  moon: Moon,
  plus: Plus,
  settings: Settings,
  share: Share2,
  'shield-check': ShieldCheck,
  sparkles: Sparkles,
  sun: Sun,
  trophy: Trophy,
  user: User,
  users: Users,
  x: X,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof ICONS

export type IconProps = {
  name: IconName
  /** Pixels. 20 by default; 16 in chips and badges, 22 in the bottom bar. */
  size?: number
  /** Only when the icon is the whole control and has no text. Otherwise the icon is hidden from screen readers. */
  label?: string
  className?: string
}

/** A Lucide icon drawn in the current text color. */
export function Icon({ name, size = 20, label, className }: IconProps) {
  const Svg = ICONS[name]
  return (
    <Svg
      size={size}
      strokeWidth={2}
      className={className ? `shrink-0 ${className}` : 'shrink-0'}
      focusable="false"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    />
  )
}
