/**
 * Rescue Network design system tokens
 * (https://claude.ai/artifact/UabQRNhQQnXT3wctLjv5WJ). Light theme only for now.
 */
import type { StatusTone } from '@animal/shared';

export const color = {
  page: '#ffffff',
  /** Light fill for inputs and small round buttons on the white page. */
  fill: '#f1f4f8',
  surface: '#ffffff',
  surfaceTint: '#eaf6fe',
  line: '#e6eaf1',
  ink: '#2f3a4c',
  inkSecondary: '#5e6a7d',
  inkMuted: '#8792a4',
  inkSubtle: '#b3bcc9',
  primary: '#5bbef6',
  action: '#0c74b6',
  onAction: '#ffffff',
  coral: '#f0735a',
  urgent: '#c4372a',
  urgentTint: '#fde6e1',
  amber: '#f5a623',
  amberInk: '#9a5b00',
  amberTint: '#fef0dc',
  success: '#34c27a',
  successInk: '#1d7a4a',
  successTint: '#e1f6ea',
  infoInk: '#0c74b6',
  scrim: 'rgba(30, 40, 60, 0.38)',
} as const;

/**
 * Pastels for warmth on secondary surfaces (tiles, stats, icon discs, backdrops).
 * No pinks or reds: the red family stays reserved for urgency.
 */
export const pastel = {
  sky: { bg: '#e8f5ff', soft: '#cde8fc', ink: '#0c6aa6' },
  lavender: { bg: '#f1edff', soft: '#ddd3ff', ink: '#5b45c4' },
  mint: { bg: '#e5f8ef', soft: '#c8eedb', ink: '#1b7449' },
  green: { bg: '#e2f5da', soft: '#c9ebba', ink: '#2f7027' },
  peach: { bg: '#fff0e4', soft: '#ffd9bd', ink: '#9a4a12' },
  sage: { bg: '#eaf3e4', soft: '#cfe3c3', ink: '#3d6633' },
  periwinkle: { bg: '#ecefff', soft: '#d3d9ff', ink: '#4350b0' },
  lemon: { bg: '#fffbe0', soft: '#fbefa8', ink: '#7a6200' },
  butter: { bg: '#fff6d9', soft: '#ffe8a6', ink: '#8a5a00' },
  aqua: { bg: '#e1f6f5', soft: '#c2ece9', ink: '#11756f' },
  /** Food donations: warm cream fading into fresh mint. */
  fresh: { bg: '#f3f6e4', soft: '#d9eedf', ink: '#2f6f4c', grad: ['#fff1dc', '#dcf3e6'] },
} as const;

export type PastelName = keyof typeof pastel;

export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32 } as const;
export const radius = { sm: 8, md: 14, lg: 24, xl: 32, pill: 999 } as const;

export const shadow = {
  card: { boxShadow: '0 8px 24px rgba(110, 130, 170, 0.12)' },
  sheet: { boxShadow: '0 -8px 28px rgba(110, 130, 170, 0.16)' },
  float: { boxShadow: '0 10px 24px rgba(12, 116, 182, 0.28)' },
} as const;

export const font = {
  /** One family across the app: Plus Jakarta Sans (modern, warm, readable). */
  regular: 'PlusJakartaSans_400Regular',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
  headingBold: 'PlusJakartaSans_700Bold',
  headingExtrabold: 'PlusJakartaSans_800ExtraBold',
} as const;

export const type = {
  display: { fontFamily: font.headingExtrabold, fontSize: 26, lineHeight: 32, color: color.ink, letterSpacing: -0.3 },
  title: { fontFamily: font.headingBold, fontSize: 19, lineHeight: 26, color: color.ink },
  section: { fontFamily: font.headingBold, fontSize: 15, lineHeight: 20, color: color.ink },
  body: { fontFamily: font.regular, fontSize: 15, lineHeight: 22, color: color.inkSecondary },
  label: { fontFamily: font.semibold, fontSize: 13, lineHeight: 18, color: color.inkSecondary },
  button: { fontFamily: font.bold, fontSize: 15, lineHeight: 20 },
  caption: { fontFamily: font.semibold, fontSize: 12, lineHeight: 16, color: color.inkSecondary },
} as const;

export const toneColors: Record<StatusTone, { bg: string; fg: string; marker: string }> = {
  urgent: { bg: color.urgentTint, fg: color.urgent, marker: color.coral },
  info: { bg: color.surfaceTint, fg: color.infoInk, marker: color.action },
  amber: { bg: color.amberTint, fg: color.amberInk, marker: color.amber },
  success: { bg: color.successTint, fg: color.successInk, marker: color.success },
  neutral: { bg: '#eef1f5', fg: color.inkSecondary, marker: color.inkMuted },
};
