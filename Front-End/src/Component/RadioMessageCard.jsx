import React from 'react'
import MoodBadge from './MoodBadge'

export default function RadioMessageCard({ message }) {
  const driverName = message.driverId?.name || message.driverName || 'Driver'
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <article className="rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm transition hover:border-white/20">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/20 text-xs font-bold text-orange-400">
            {driverName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-white">{driverName}</span>
        </div>
        <span className="font-mono text-[11px] text-white/40">{time}</span>
      </div>

      {/* Transcript */}
      <p className="mt-3 text-sm leading-relaxed text-white/70">
        "{message.transcript || 'No transcript available'}"
      </p>

      {/* Mood + confidence */}
      <div className="mt-3 flex items-center justify-between">
        <MoodBadge mood={message.mood} size="sm" />
        {message.confidence > 0 && (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-orange-500/60"
                style={{ width: `${Math.round(message.confidence * 100)}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-white/40">
              {Math.round(message.confidence * 100)}%
            </span>
          </div>
        )}
      </div>
    </article>
  )
}
