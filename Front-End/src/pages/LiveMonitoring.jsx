import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function LiveMonitoring() {
  const token = useSelector((state) => state.auth.token)
  const [messages, setMessages] = useState([])
  const [laps, setLaps] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [msgRes, lapRes] = await Promise.all([
        fetch('/api/radio/messages?limit=10', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/laps', { headers: { Authorization: `Bearer ${token}` } }),
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

  // Socket.IO for live updates
  useEffect(() => {
    if (!token) return
    let socket
    const connectSocket = async () => {
      try {
        const { io } = await import('socket.io-client')
        socket = io({ auth: { token } })
        socket.on('radio:new', () => fetchData())
        socket.on('lap:new', () => fetchData())
      } catch {}
    }
    connectSocket()
    return () => { if (socket) socket.disconnect() }
  }, [token])

  // Derive telemetry from latest message
  const latestMsg = messages[0]
  const telemetry = [
    { label: 'Throttle', value: '91%', color: 'bg-emerald-400' },
    { label: 'Brake Pressure', value: '42%', color: 'bg-red-500' },
    { label: 'Heart Rate', value: '154 bpm', color: 'bg-yellow-400' },
    { label: 'Voice Stress', value: latestMsg ? `${Math.round((latestMsg.confidence || 0) * 100)}%` : '—', color: 'bg-orange-500' },
  ]

  const recentLaps = laps.slice(-3)
  const sectors = recentLaps.length > 0
    ? recentLaps.map((l, i) => ({
        label: `Lap ${l.lapNumber}`,
        time: (l.lapTimeMs / 1000).toFixed(3),
        state: l.driverId?.name || 'Driver',
      }))
    : [
        { label: 'Sector 1', time: '—', state: 'Waiting for data' },
        { label: 'Sector 2', time: '—', state: 'Waiting for data' },
        { label: 'Sector 3', time: '—', state: 'Waiting for data' },
      ]

  return (
    <section className="min-h-screen bg-neutral-950 px-6 pt-28 pb-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-red-400">Live monitoring</p>
            <h1 className="mt-3 text-4xl font-black">
              {loading ? 'Loading telemetry...' : 'Driver telemetry and stress feed'}
            </h1>
          </div>
          <div className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-200">
            {messages.length > 0 ? `Session active — ${messages.length} messages` : 'Waiting for data...'}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-lg border border-white/10 bg-neutral-900 p-6">
            <h2 className="text-xl font-black">Driver condition</h2>
            <div className="mt-6 space-y-5">
              {telemetry.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-neutral-300">{item.label}</span>
                    <span className="font-bold">{item.value}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-neutral-800">
                    <div className={`h-full ${item.color}`} style={{ width: item.value.includes('bpm') ? '76%' : item.value === '—' ? '0%' : item.value }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-neutral-900 p-6">
            <h2 className="text-xl font-black">Lap analysis</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {sectors.map((sector) => (
                <article key={sector.label} className="rounded-md bg-black p-5">
                  <p className="text-sm text-neutral-400">{sector.label}</p>
                  <p className="mt-2 text-3xl font-black">{sector.time}</p>
                  <p className="mt-3 text-sm text-red-200">{sector.state}</p>
                </article>
              ))}
            </div>
            <div className="mt-6 rounded-md border border-yellow-400/30 bg-yellow-400/10 p-4 text-yellow-100">
              {latestMsg
                ? `${latestMsg.mood} — ${latestMsg.reasoning || 'Analysis pending...'}`
                : 'Waiting for driver radio transmission for stress analysis...'}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LiveMonitoring
