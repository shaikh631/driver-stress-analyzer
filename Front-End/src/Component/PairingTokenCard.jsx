import React, { useState } from 'react'
import { Copy, Check, RefreshCw } from 'lucide-react'

export default function PairingTokenCard({
  token,
  expiresAt,
  onRegenerate,
  generating = false,
}) {
  const [copied, setCopied] = useState(false)

  const copyToken = () => {
    if (!token) return
    navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Expiry display
  let expiryLabel = ''
  if (expiresAt) {
    const diff = new Date(expiresAt) - new Date()
    if (diff > 0) {
      const hours = Math.floor(diff / 3600000)
      const mins = Math.floor((diff % 3600000) / 60000)
      expiryLabel = `Expires in ${hours}h ${mins}m`
    } else {
      expiryLabel = 'Expired'
    }
  }

  return (
    <div className="rounded-2xl border border-orange-500/30 bg-orange-500/[0.06] p-6 shadow-[0_0_30px_-5px_rgba(255,106,44,0.15)]">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
          Pairing Token
        </h3>
        {expiryLabel && (
          <span className="font-mono text-[10px] text-white/40">{expiryLabel}</span>
        )}
      </div>

      {token ? (
        <>
          <div className="mt-4 flex items-center gap-3">
            <span className="font-mono text-4xl font-black tracking-[0.35em] text-white">
              {token}
            </span>
            <button
              onClick={copyToken}
              aria-label={copied ? 'Copied' : 'Copy token'}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/60 transition hover:border-amber-400 hover:text-amber-400"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={onRegenerate}
              disabled={generating}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10 disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${generating ? 'animate-spin' : ''}`} />
              {generating ? 'Generating…' : 'Regenerate'}
            </button>
          </div>
        </>
      ) : (
        <div className="mt-4">
          <p className="text-sm text-white/50">
            Generate a token and share it with your driver.
          </p>
          <button
            onClick={onRegenerate}
            disabled={generating}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:shadow-orange-500/40 disabled:opacity-50"
          >
            <span className="text-lg leading-none">▶</span>
            {generating ? 'Generating…' : 'Generate Pairing Code'}
          </button>
        </div>
      )}
    </div>
  )
}
