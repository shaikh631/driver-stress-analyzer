import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const moodStyle = {
  Calm: 'text-emerald-300',
  Stressed: 'text-red-300',
  Tired: 'text-yellow-300',
  Frustrated: 'text-orange-300',
  unknown: 'text-neutral-400',
}

function History() {
  const token = useSelector((state) => state.auth.token)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    const fetchHistory = async () => {
      try {
        const base = import.meta.env.VITE_API_URL || ''
        const res = await fetch(`${base}/api/radio/messages?limit=50`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setMessages(data.messages || [])
        }
      } catch (err) {
        console.error('Failed to fetch history:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [token])

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

      <div className="relative z-10 mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-white/70">Session history</p>
        <h1 className="mt-4 leading-[1.05]">
          <span className="block text-4xl font-black tracking-tight text-white md:text-5xl">
            Previous radio
          </span>
          <span className="block text-4xl font-light tracking-tight text-white/90 md:text-5xl">
            stress reports
          </span>
        </h1>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:p-8">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="text-white/50">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide">Time</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide">Driver</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide">Transcript</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide">Mood</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-white/60">Loading...</td>
                </tr>
              ) : !token ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-white/60">
                    Log in as a team to view history.
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-white/60">
                    No radio messages recorded yet.
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg._id} className="border-t border-white/10">
                    <td className="px-5 py-4 text-white/70">
                      {new Date(msg.createdAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 font-semibold text-white/90">{msg.driverId?.name || 'Unknown'}</td>
                    <td className="px-5 py-4 max-w-xs truncate text-white/70">
                      {msg.transcript || '—'}
                    </td>
                    <td className={`px-5 py-4 font-semibold ${moodStyle[msg.mood] || moodStyle.unknown}`}>
                      {msg.mood}
                    </td>
                    <td className="px-5 py-4 text-white/70">
                      {Math.round(msg.confidence * 100)}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default History