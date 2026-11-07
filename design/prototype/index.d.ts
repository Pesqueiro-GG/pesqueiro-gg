import type * as React from 'react';

type Lang = 'pt' | 'en';
type Tier = 'comum' | 'incomum' | 'raro' | 'epico';

export interface LogoProps { variant?: 'full' | 'mark'; size?: number; className?: string }
/** The bobber mark, alone or with the Pesqueiro.GG wordmark. */
export declare function Logo(props: LogoProps): React.ReactElement;

export interface IconProps { name: string; size?: number; label?: string; className?: string }
/** A Lucide icon by name; decorative unless `label` is given. */
export declare function Icon(props: IconProps): React.ReactElement;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text' | 'danger';
  icon?: string;
  size?: 'md' | 'sm';
  full?: boolean;
}
/** Pill button. One primary per view. */
export declare function Button(props: ButtonProps): React.ReactElement;

export interface ChipProps extends React.HTMLAttributes<HTMLElement> {
  tone?: 'neutral' | 'water' | 'bobber' | 'reed' | 'gold';
  icon?: string;
  selected?: boolean;
}
/** Filter or category chip; a toggle button when `selected` or `onClick` is set. */
export declare function Chip(props: ChipProps): React.ReactElement;

export interface RarityBadgeProps { tier?: Tier | 'protegida'; lang?: Lang; className?: string }
/** The species tier as a word plus color. */
export declare function RarityBadge(props: RarityBadgeProps): React.ReactElement;

export interface AvatarProps { name: string; src?: string; size?: 'sm' | 'md' | 'lg'; className?: string }
/** A person's photo, or their initials on water-soft. */
export declare function Avatar(props: AvatarProps): React.ReactElement;

export interface StickerProps {
  number: number;
  name: string;
  scientific?: string;
  tier?: Tier;
  filled?: boolean;
  photo?: string;
  isNew?: boolean;
  lang?: Lang;
  className?: string;
}
/** One slot of the Álbum de Espécies: filled sticker or empty dashed slot. */
export declare function Sticker(props: StickerProps): React.ReactElement;

export interface FishLineProps { value: number; max: number; label?: string; className?: string }
/** Progress drawn as a fishing line with the bobber at the current point. */
export declare function FishLine(props: FishLineProps): React.ReactElement;

export interface LeaderboardRowProps {
  position: number;
  name: string;
  avatar?: string;
  rankTitle?: string;
  xp: number;
  delta?: number;
  isMe?: boolean;
  lang?: Lang;
  className?: string;
}
/** One person in a season ranking or challenge leaderboard. */
export declare function LeaderboardRow(props: LeaderboardRowProps): React.ReactElement;

export interface CatchCardProps {
  author: string;
  avatar?: string;
  group?: string;
  time?: string;
  photo?: string;
  species: string;
  tier?: Tier | 'protegida';
  weight?: string;
  length?: string;
  water?: string;
  released?: boolean;
  place?: string;
  story?: string;
  reactions?: number;
  comments?: number;
  reacted?: boolean;
  verified?: boolean;
  newSticker?: boolean;
  lang?: Lang;
  className?: string;
}
/** A catch in a feed: photo first, then species, facts, the coarse place and the story. */
export declare function CatchCard(props: CatchCardProps): React.ReactElement;

export interface ChallengeCardProps {
  scope?: 'group' | 'official';
  scopeLabel?: string;
  title: string;
  rule?: string;
  ends?: string;
  participants?: string;
  myPosition?: string;
  proof?: boolean;
  lang?: Lang;
  className?: string;
}
/** A challenge in a list: who runs it, the rule, time left and your position. */
export declare function ChallengeCard(props: ChallengeCardProps): React.ReactElement;

export interface PromotionBannerProps { rank: string; level?: number; onAccept?: () => void; lang?: Lang; className?: string }
/** The level-up moment, with the career title. */
export declare function PromotionBanner(props: PromotionBannerProps): React.ReactElement;

export interface BottomNavProps {
  active?: 'feed' | 'album' | 'challenges' | 'profile';
  hrefs?: Partial<Record<'feed' | 'album' | 'log' | 'challenges' | 'profile', string>>;
  lang?: Lang;
  className?: string;
}
/** The phone tab bar, with Log as the raised bobber button in the middle. */
export declare function BottomNav(props: BottomNavProps): React.ReactElement;

declare global {
  interface Window {
    PesqueiroGG: {
      Logo: typeof Logo; Icon: typeof Icon; Button: typeof Button; Chip: typeof Chip;
      RarityBadge: typeof RarityBadge; Avatar: typeof Avatar; Sticker: typeof Sticker; FishLine: typeof FishLine;
      LeaderboardRow: typeof LeaderboardRow; CatchCard: typeof CatchCard; ChallengeCard: typeof ChallengeCard;
      PromotionBanner: typeof PromotionBanner; BottomNav: typeof BottomNav; iconNames: string[];
    };
  }
}
