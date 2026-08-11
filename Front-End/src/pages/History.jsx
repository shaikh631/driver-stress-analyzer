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
        const res = await fetch('/api/radio/messages?limit=50', {
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
    <section className="relative min-h-screen overflow-hidden bg-[#150c08] px-6 pt-28 pb-16 text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 46px)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(60% 50% at 60% 45%, rgba(234,88,12,0.35) 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-orange-400">Session history</p>
        <h1 className="mt-3 text-4xl font-black">Previous radio stress reports</h1>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-8 backdrop-blur-sm">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="text-neutral-400">
              <tr>
                <th className="px-5 py-4 font-bold uppercase tracking-wider text-xs">Time</th>
                <th className="px-5 py-4 font-bold uppercase tracking-wider text-xs">Driver</th>
                <th className="px-5 py-4 font-bold uppercase tracking-wider text-xs">Transcript</th>
                <th className="px-5 py-4 font-bold uppercase tracking-wider text-xs">Mood</th>
                <th className="px-5 py-4 font-bold uppercase tracking-wider text-xs">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-neutral-300">Loading...</td>
                </tr>
              ) : !token ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-neutral-300">
                    Log in as a team to view history.
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-neutral-300">
                    No radio messages recorded yet.
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg._id} className="border-t border-white/10">
                    <td className="px-5 py-4 text-neutral-300">
                      {new Date(msg.createdAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 font-bold">{msg.driverId?.name || 'Unknown'}</td>
                    <td className="px-5 py-4 text-neutral-200 max-w-xs truncate">
                      {msg.transcript || '—'}
                    </td>
                    <td className={`px-5 py-4 font-bold ${moodStyle[msg.mood] || moodStyle.unknown}`}>
                      {msg.mood}
                    </td>
                    <td className="px-5 py-4 text-neutral-300">
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