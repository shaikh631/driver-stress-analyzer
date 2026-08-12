import React from 'react'
import { Mic, Loader2, Check } from 'lucide-react'

const formatSeconds = (seconds) => {
  const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0
  const mins = String(Math.floor(safe / 60)).padStart(2, '0')
  const secs = String(safe % 60).padStart(2, '0')
  return `${mins}:${secs}`
}

/**
 * Large circular record button with explicit Start/Stop controls and a countdown timer.
 */
export default function RecordButton({ state = 'idle', recordSeconds = 0, onStart, onStop }) {
  const isRecording = state === 'recording'
  const stateStyles = {
    idle: {
      ring: 'border-orange-500/40',
      inner: 'bg-gradient-to-br from-orange-600 to-red-600 shadow-lg shadow-orange-500/30',
      icon: <Mic className="h-8 w-8 text-white" />,
      label: 'Start Recording',
    },
    recording: {
      ring: 'border-orange-500 animate-pulse shadow-[0_0_40px_rgba(255,106,44,0.35)]',
      inner: 'bg-gradient-to-br from-red-600 to-orange-500 scale-95',
      icon: <Mic className="h-8 w-8 text-white animate-pulse" />,
      label: 'Stop Recording',
    },
    uploading: {
      ring: 'border-amber-500/40',
      inner: 'bg-gradient-to-br from-amber-600 to-orange-500',
      icon: <Loader2 className="h-8 w-8 text-white animate-spin" />,
      label: 'Uploading & analyzing…',
    },
    processed: {
      ring: 'border-emerald-500/40',
      inner: 'bg-gradient-to-br from-emerald-600 to-emerald-500 shadow-lg shadow-emerald-500/20',
      icon: <Check className="h-8 w-8 text-white" />,
      label: 'Sent!',
    },
  }

  const s = stateStyles[state] || stateStyles.idle

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`rounded-full border-[3px] p-2 transition-all duration-300 ${s.ring}`}>
        <button
          type="button"
          onClick={isRecording ? onStop : onStart}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          className={`flex h-24 w-24 items-center justify-center rounded-full transition-all duration-200 active:scale-90 sm:h-28 sm:w-28 ${s.inner}`}
        >
          {s.icon}
        </button>
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
          {s.label}
        </span>
        <span className="font-mono text-sm text-orange-300">
          {isRecording ? formatSeconds(recordSeconds) : '00:00'}
        </span>
      </div>
    </div>
  )
}
