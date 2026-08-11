import React from 'react'
import { Mic, Loader2, Check, Upload } from 'lucide-react'

/**
 * Large circular record button with states:
 * idle → recording (pulsing orange ring) → uploading (spinner) → processed (checkmark)
 */
export default function RecordButton({ state = 'idle', onMouseDown, onMouseUp, onMouseLeave, onTouchStart, onTouchEnd }) {
  const stateStyles = {
    idle: {
      ring: 'border-orange-500/40',
      inner: 'bg-gradient-to-br from-orange-600 to-red-600 shadow-lg shadow-orange-500/30',
      icon: <Mic className="h-8 w-8 text-white" />,
      label: 'Hold to record',
    },
    recording: {
      ring: 'border-orange-500 animate-pulse shadow-[0_0_40px_rgba(255,106,44,0.35)]',
      inner: 'bg-gradient-to-br from-red-600 to-orange-500 scale-95',
      icon: <Mic className="h-8 w-8 text-white animate-pulse" />,
      label: 'Recording…',
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
      {/* Outer ring */}
      <div className={`rounded-full border-[3px] p-2 transition-all duration-300 ${s.ring}`}>
        {/* Button */}
        <button
          type="button"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          aria-label="Push to talk"
          className={`flex h-24 w-24 items-center justify-center rounded-full transition-all duration-200 active:scale-90 sm:h-28 sm:w-28 ${s.inner}`}
        >
          {s.icon}
        </button>
      </div>

      {/* Label */}
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
        {s.label}
      </span>
    </div>
  )
}
