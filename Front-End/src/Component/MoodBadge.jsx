import React from 'react'
import { Smile, AlertTriangle, Battery, Flame, HelpCircle } from 'lucide-react'

const moodConfig = {
  Calm: {
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    icon: Smile,
    glow: 'shadow-[0_0_8px_rgba(16,185,129,0.2)]',
  },
  Stressed: {
    bg: 'bg-red-500/15',
    border: 'border-red-500/30',
    text: 'text-red-400',
    icon: AlertTriangle,
    glow: 'shadow-[0_0_8px_rgba(239,68,68,0.2)]',
  },
  Tired: {
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    icon: Battery,
    glow: 'shadow-[0_0_8px_rgba(245,158,11,0.2)]',
  },
  Frustrated: {
    bg: 'bg-orange-600/15',
    border: 'border-orange-600/30',
    text: 'text-orange-400',
    icon: Flame,
    glow: 'shadow-[0_0_8px_rgba(234,88,12,0.2)]',
  },
  unknown: {
    bg: 'bg-white/5',
    border: 'border-white/10',
    text: 'text-white/50',
    icon: HelpCircle,
    glow: '',
  },
}

export default function MoodBadge({ mood = 'unknown', size = 'sm' }) {
  const cfg = moodConfig[mood] || moodConfig.unknown
  const Icon = cfg.icon

  const sizes = {
    xs: 'px-2 py-0.5 text-[10px] gap-1',
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-sm gap-2',
  }

  const iconSizes = {
    xs: 'h-2.5 w-2.5',
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold uppercase tracking-wider
        ${cfg.bg} ${cfg.border} ${cfg.text} ${cfg.glow} ${sizes[size]}`}
    >
      <Icon className={iconSizes[size]} strokeWidth={2} />
      {mood}
    </span>
  )
}

export { moodConfig }
