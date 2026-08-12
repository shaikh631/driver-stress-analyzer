import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, ChevronDown, ChevronUp } from 'lucide-react'
import BackgroundWrapper from '../Component/BackgroundWrapper'
import ConnectionStatusPill from '../Component/ConnectionStatusPill'
import RecordButton from '../Component/RecordButton'
import MoodBadge from '../Component/MoodBadge'

export default function DriverPortal() {
  const [driverSession, setDriverSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem('driverSession')) } catch { return null }
  })
  const [checkingSession, setCheckingSession] = useState(Boolean(driverSession))
  const [sessionError, setSessionError] = useState('')

  useEffect(() => {
    if (!driverSession) return

    const verifyDriver = async () => {
      setCheckingSession(true)
      try {
        const base = import.meta.env.VITE_API_URL || ''
        const res = await fetch(`${base}/api/driver/status`, {
          headers: { 'x-driver-session': driverSession.sessionId },
        })
        if (!res.ok) throw new Error('Driver session invalid or expired')
      } catch (err) {
        localStorage.removeItem('driverSession')
        setDriverSession(null)
        setSessionError('Driver session expired or disconnected. Please reconnect.')
      } finally {
        setCheckingSession(false)
      }
    }

    verifyDriver()
  }, [driverSession])

  return (
    <BackgroundWrapper>
      {checkingSession ? (
        <div className="flex min-h-screen items-center justify-center text-white">
          Verifying driver connection...
        </div>
      ) : driverSession ? (
        <PairedView session={driverSession} onDisconnect={() => {
          localStorage.removeItem('driverSession')
          setDriverSession(null)
        }} />
      ) : (
        <>
          {sessionError && (
            <div className="mx-auto mb-6 max-w-md rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
              {sessionError}
            </div>
          )}
          <ConnectView onConnected={(session) => {
            setSessionError('')
            setDriverSession(session)
          }} />
        </>
      )}
    </BackgroundWrapper>
  )
}


/* ═══════════════════════════════════════════════════
   STATE A — NOT PAIRED (connect form)
   ═══════════════════════════════════════════════════ */
function ConnectView({ onConnected }) {
  const [token, setToken] = useState(Array(6).fill(''))
  const [driverName, setDriverName] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const inputRefs = useRef([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index, value) => {
    const v = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (v.length > 1) return
    const next = [...token]
    next[index] = v
    setToken(next)
    if (v && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !token[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6)
    if (!pasted) return
    e.preventDefault()
    const next = Array(6).fill('')
    pasted.split('').forEach((ch, i) => { next[i] = ch })
    setToken(next)
    inputRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const code = token.join('')
    if (code.length !== 6) { setError('Enter all 6 characters'); return }
    setError('')
    setSubmitting(true)
    try {
      const base = import.meta.env.VITE_API_URL || ''
      const res = await fetch(`${base}/api/driver/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pairingToken: code, driverName: driverName.trim() || 'Driver' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Connection failed')
      const session = { sessionId: data.driverSessionId, driverId: data.driverId, teamName: data.teamName }
      localStorage.setItem('driverSession', JSON.stringify(session))
      onConnected(session)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-24 pb-16">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-md">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
            Driver Protocol
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
            Connect to Your Team
          </h2>
          <p className="mt-2 text-sm text-white/40">
            Enter the 6-character pairing code from your team engineer.
          </p>

          {/* PIN-style code entry */}
          <div className="mt-8 flex justify-between gap-2" onPaste={handlePaste}>
            {token.map((ch, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                type="text"
                inputMode="text"
                maxLength={1}
                value={ch}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                aria-label={`Character ${i + 1}`}
                className="h-14 w-12 rounded-xl border border-white/15 bg-white/[0.03] text-center font-mono text-2xl font-black uppercase text-white outline-none transition
                  focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30
                  sm:h-16 sm:w-14 sm:text-3xl"
              />
            ))}
          </div>

          {error && (
            <p className="mt-3 text-sm font-medium text-red-400">{error}</p>
          )}

          {/* Driver name */}
          <div className="mt-6">
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
              Driver Name (optional)
            </label>
            <input
              type="text"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              placeholder="e.g. Verstappen"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition focus:border-orange-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-full bg-gradient-to-r from-orange-600 to-amber-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:shadow-orange-500/40 disabled:opacity-50"
          >
            <span className="mr-2">▶</span>
            {submitting ? 'Connecting…' : 'Connect'}
          </button>
        </form>
      </div>
    </div>
  )
}


/* ═══════════════════════════════════════════════════
   STATE B — PAIRED / RECORDING VIEW
   ═══════════════════════════════════════════════════ */
function PairedView({ session, onDisconnect }) {
  const [recordState, setRecordState] = useState('idle') // idle | recording | uploading | processed
  const [recordSeconds, setRecordSeconds] = useState(0)
  const [lastResult, setLastResult] = useState(null)
  const [recentSends, setRecentSends] = useState([])
  const [showRecent, setShowRecent] = useState(false)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const fileInputRef = useRef(null)
  const recordingStartedAtRef = useRef(null)

  useEffect(() => {
    if (recordState !== 'recording') return

    const tick = () => {
      if (!recordingStartedAtRef.current) return
      const elapsed = Math.floor((Date.now() - recordingStartedAtRef.current) / 1000)
      setRecordSeconds(elapsed)
    }

    tick()
    const intervalId = setInterval(tick, 250)
    return () => clearInterval(intervalId)
  }, [recordState])

  const uploadAudio = async (blob) => {
    setRecordState('uploading')
    try {
      const formData = new FormData()
      formData.append('audio', blob, 'radio-clip.webm')
      const base = import.meta.env.VITE_API_URL || ''
      const res = await fetch(`${base}/api/radio/upload`, {
        method: 'POST',
        headers: { 'x-driver-session': session.sessionId },
        body: formData,
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Upload failed')

      setLastResult(result)
      setRecentSends((prev) => [result, ...prev].slice(0, 5))
      setRecordState('processed')
      setTimeout(() => {
        setRecordState('idle')
        setRecordSeconds(0)
      }, 3000)
    } catch (err) {
      console.error(err)
      setRecordState('idle')
      setRecordSeconds(0)
    }
  }

  const startRecording = async () => {
    if (recordState === 'recording' || recordState === 'uploading') return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      chunksRef.current = []
      recordingStartedAtRef.current = Date.now()
      setRecordSeconds(0)

      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        stream.getTracks().forEach((t) => t.stop())
        if (blob.size > 0) uploadAudio(blob)
      }

      mr.start()
      mediaRecorderRef.current = mr
      setRecordState('recording')
    } catch {
      alert('Microphone access denied')
    }
  }

  const stopRecording = () => {
    if (recordState !== 'recording') return
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    recordingStartedAtRef.current = null
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) uploadAudio(file)
    e.target.value = ''
  }

  return (
    <div className="flex min-h-screen flex-col items-center px-4 pt-28 pb-16">
      {/* Connection status */}
      <ConnectionStatusPill
        teamName={session.teamName}
        connected={true}
        onDisconnect={onDisconnect}
      />

      {/* Record button — explicit start/stop controls */}
      <div className="mt-16">
        <RecordButton
          state={recordState}
          recordSeconds={recordSeconds}
          onStart={startRecording}
          onStop={stopRecording}
        />
      </div>

      {/* Upload existing file */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="mt-6 inline-flex items-center gap-2 text-xs text-white/30 transition hover:text-white/60"
      >
        <Upload className="h-3.5 w-3.5" />
        Or upload an audio file
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="hidden"
        aria-label="Upload audio file"
      />

      {/* Last result card */}
      {lastResult && lastResult.transcript && (
        <div className="mt-8 w-full max-w-sm rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
              Last transmission
            </p>
            <MoodBadge mood={lastResult.mood} size="sm" />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            "{lastResult.transcript}"
          </p>
          {lastResult.reasoning && (
            <p className="mt-2 text-xs text-white/30">{lastResult.reasoning}</p>
          )}
          <div className="mt-3 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-orange-500/60"
                style={{ width: `${Math.round((lastResult.confidence || 0) * 100)}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-white/40">
              {Math.round((lastResult.confidence || 0) * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Recent sends */}
      {recentSends.length > 0 && (
        <div className="mt-6 w-full max-w-sm">
          <button
            onClick={() => setShowRecent((s) => !s)}
            className="flex w-full items-center justify-between text-xs text-white/30 transition hover:text-white/50"
          >
            <span className="font-mono uppercase tracking-[0.2em]">
              Recent Sends ({recentSends.length})
            </span>
            {showRecent ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {showRecent && (
            <div className="mt-3 space-y-2">
              {recentSends.map((r, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
                  <p className="flex-1 truncate text-xs text-white/50">
                    "{r.transcript || '—'}"
                  </p>
                  <MoodBadge mood={r.mood} size="xs" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
