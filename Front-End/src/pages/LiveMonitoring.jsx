import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const moodColor = {
  calm: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10',
  stressed: 'text-red-300 border-red-400/30 bg-red-400/10',
  tired: 'text-yellow-200 border-yellow-400/30 bg-yellow-400/10',
  frustrated: 'text-orange-300 border-orange-400/30 bg-orange-400/10',
  unknown: 'text-white/50 border-white/15 bg-white/5',
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
      color: 'bg-[#ff7a30]',
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
    <section className="relative min-h-screen w-full overflow-hidden bg-[#0a0503] px-6 pt-28 pb-16 text-white md:px-12">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(120% 90% at 78% 45%, rgba(255,106,44,0.0) 0%, rgba(10,5,3,0.55) 55%, rgba(10,5,3,0.95) 78%),
            repeating-linear-gradient(90deg, rgba(255,122,48,0.9) 0px, rgba(255,90,20,0.9) 3px, rgba(190,58,10,0.9) 3px, rgba(190,58,10,0.9) 34px),
            linear-gradient(90deg, #0a0503 0%, #170a04 30%, #3a1204 55%, #7a2b06 75%, #a83e0a 100%)
          `,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#0a0503] via-transparent to-[#0a0503]/40" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-6 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/70">Live monitoring</p>
            <h1 className="mt-4 leading-[1.05]">
              <span className="block text-4xl font-black tracking-tight text-white md:text-5xl">
                {loading ? 'Loading' : 'Driver telemetry'}
              </span>
              <span className="block text-4xl font-light tracking-tight text-white/90 md:text-5xl">
                {loading ? 'telemetry...' : 'and stress feed'}
              </span>
            </h1>
          </div>

          <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm md:w-auto">
            <p className="text-xs uppercase tracking-wide text-white/50">Session status</p>
            <div className="mt-2 flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${messages.length > 0 ? 'bg-emerald-400' : 'bg-white/30'}`} />
              <span className="text-lg font-bold text-white/90">
                {messages.length > 0 ? `Active — ${messages.length} messages` : 'Waiting for data'}
              </span>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Driver condition */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-wide text-white/50">Driver condition</p>
            <div className="mt-6 space-y-5">
              {telemetry.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-white/60">{item.label}</span>
                    <span className="font-semibold text-white/90">{item.display}</span>
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
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-wide text-white/50">Lap analysis</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {sectors.map((sector) => (
                <article key={sector.label} className="rounded-xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-white/50">{sector.label}</p>
                  <p className="mt-2 text-3xl font-black text-white/90">{sector.time}</p>
                  <p className="mt-3 text-sm text-[#ff7a30]">{sector.state}</p>
                </article>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-white/70">
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
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
            <p className="text-4xl font-black text-white/90">{driverCount || '—'}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-white/50">Drivers</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
            <p className="text-4xl font-black text-white/90">{messages.length}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-white/50">Messages</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
            <p className="text-4xl font-black text-white/90">{laps.length}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-white/50">Laps</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LiveMonitoring