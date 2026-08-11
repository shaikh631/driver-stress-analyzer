import React from 'react'

export default function ConnectionStatusPill({ teamName, connected = true, onDisconnect }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-sm">
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          connected
            ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse'
            : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
        }`}
      />
      <span className="text-sm font-semibold text-white">
        {connected ? `Connected to ${teamName}` : 'Disconnected'}
      </span>
      {connected && onDisconnect && (
        <button
          onClick={onDisconnect}
          className="ml-1 text-xs text-white/40 underline underline-offset-2 transition hover:text-white/70"
        >
          Disconnect
        </button>
      )}
    </div>
  )
}
