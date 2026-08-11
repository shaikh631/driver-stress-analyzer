import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const moodColor = {
  calm: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10',
  stressed: 'text-red-300 border-red-400/30 bg-red-400/10',
  tired: 'text-yellow-200 border-yellow-400/30 bg-yellow-400/10',
  frustrated: 'text-orange-300 border-orange-400/30 bg-orange-400/10',
  unknown: 'text-neutral-400 border-white/15 bg-white/5',
}

function MoodBadge({ mood }) {
  const key = (mood || 'unknown').toLowerCase()
  const cls = moodColor[key] || moodColor.unknown
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {mood || 'Unknown'}
    </span>
  )
}

function LiveMonitoring() {
  const token = useSelector((state) => state.auth.token)
  const [messages, setMessages] = useState([])
  const [laps, setLaps] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const base = import.meta.env.VITE_API_URL || ''
      const [msgRes, lapRes] = await Promise.all([
          fetch(`${base}/api/radio/messages?limit=10`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${base}/api/laps`, { headers: { Authorization: `Bearer ${token}` } }),
        ])
      if (msgRes.ok) {
        const data = await msgRes.json()
        setMessages(data.messages || [])
      }
      if (lapRes.ok) {
        const data = await lapRes.json()
        setLaps(data.laps || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchData()
  }, [token])

  useEffect(() => {
    if (!token) return
    let socket
    const connectSocket = async () => {
      try {
        const { io } = await import('socket.io-client')
        const base = import.meta.env.VITE_API_URL || ''
        socket = io(base || '/', { auth: { token }, path: '/socket.io' })
        socket.on('radio:new', () => fetchData())
        socket.on('lap:new', () => fetchData())
      } catch {}
    }
    connectSocket()
    return () => { if (socket) socket.disconnect() }
  }, [token])

  const latestMsg = messages[0]

  const telemetry = [
    { label: 'Throttle', value: 91, display: '91%', color: 'bg-emerald-400' },
    { label: 'Brake Pressure', value: 42, display: '42%', color: 'bg-red-500' },
    { label: 'Heart Rate', value: 76, display: '154 bpm', color: 'bg-yellow-400' },
    {
      label: 'Voice Stress',
      value: latestMsg ? Math.round((latestMsg.confidence || 0) * 100) : 0,
      display: latestMsg ? `${Math.round((latestMsg.confidence || 0) * 100)}%` : '—',
      color: 'bg-orange-500',
    },
  ]

  const recentLaps = laps.slice(-3)
  const sectors = recentLaps.length > 0
    ? recentLaps.map((l) => ({
        label: `Lap ${l.lapNumber}`,
        time: (l.lapTimeMs / 1000).toFixed(3),
        state: l.driverId?.name || 'Driver',
      }))
    : [
        { label: 'Sector 1', time: '—', state: 'Waiting for data' },
        { label: 'Sector 2', time: '—', state: 'Waiting for data' },
        { label: 'Sector 3', time: '—', state: 'Waiting for data' },
      ]

  const driverCount = new Set(laps.map((l) => l.driverId?._id || l.driverId?.name).filter(Boolean)).size

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#120b08] px-6 pt-28 pb-16 text-white">
      {/* Ambient grid + glow background, matches the pit-wall dashboard theme */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 48px)',
        }}
      />
      <div
        className="pointer-events-none absolute -top-40 right-0 h-[36rem] w-[36rem] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.55) 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-[28rem] w-[28rem] rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.4) 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-6 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-orange-400">Live monitoring</p>
            <h1 className="mt-3 text-4xl font-black">
              {loading ? 'Loading telemetry...' : 'Driver telemetry and stress feed'}
            </h1>
          </div>

          <div className="w-full max-w-xs rounded-lg border border-orange-400/25 bg-black/30 px-5 py-4 backdrop-blur-sm md:w-auto">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-300">Session status</p>
            <div className="mt-2 flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${messages.length > 0 ? 'bg-emerald-400' : 'bg-neutral-500'}`} />
              <span className="text-lg font-black">
                {messages.length > 0 ? `Active — ${messages.length} messages` : 'Waiting for data'}
              </span>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Driver condition */}
          <div className="rounded-lg border border-white/10 bg-black/30 p-6 backdrop-blur-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-300">Driver condition</p>
            <div className="mt-6 space-y-5">
              {telemetry.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-neutral-400">{item.label}</span>
                    <span className="font-bold text-white">{item.display}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lap analysis */}
          <div className="rounded-lg border border-white/10 bg-black/30 p-6 backdrop-blur-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-300">Lap analysis</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {sectors.map((sector) => (
                <article key={sector.label} className="rounded-md border border-white/5 bg-black/40 p-5">
                  <p className="text-sm text-neutral-400">{sector.label}</p>
                  <p className="mt-2 text-3xl font-black">{sector.time}</p>
                  <p className="mt-3 text-sm text-orange-300">{sector.state}</p>
                </article>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 rounded-md border border-yellow-400/25 bg-yellow-400/10 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-yellow-100">
                {latestMsg
                  ? (latestMsg.reasoning || 'Analysis pending...')
                  : 'Waiting for driver radio transmission for stress analysis...'}
              </p>
              {latestMsg && <MoodBadge mood={latestMsg.mood} />}
            </div>
          </div>
        </div>

        {/* Stat row */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-black/30 p-6 text-center backdrop-blur-sm">
            <p className="text-4xl font-black">{driverCount || '—'}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Drivers</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/30 p-6 text-center backdrop-blur-sm">
            <p className="text-4xl font-black">{messages.length}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Messages</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/30 p-6 text-center backdrop-blur-sm">
            <p className="text-4xl font-black">{laps.length}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Laps</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LiveMonitoring