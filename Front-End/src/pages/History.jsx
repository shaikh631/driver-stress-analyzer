import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

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

  const moodStyle = {
    Calm: 'text-emerald-300',
    Stressed: 'text-red-300',
    Tired: 'text-yellow-300',
    Frustrated: 'text-orange-300',
    unknown: 'text-neutral-400',
  }

  return (
    <section className="min-h-screen bg-neutral-950 px-6 pt-28 pb-16 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-red-400">Session history</p>
        <h1 className="mt-3 text-4xl font-black">Previous radio stress reports</h1>

        <div className="mt-8 overflow-hidden rounded-lg border border-white/10">
          <table className="w-full border-collapse bg-neutral-900 text-left text-sm">
            <thead className="bg-black text-neutral-300">
              <tr>
                <th className="px-5 py-4">Time</th>
                <th className="px-5 py-4">Driver</th>
                <th className="px-5 py-4">Transcript</th>
                <th className="px-5 py-4">Mood</th>
                <th className="px-5 py-4">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-neutral-400">Loading...</td>
                </tr>
              ) : !token ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-neutral-400">
                    Log in as a team to view history.
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-neutral-400">
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
                    <td className="px-5 py-4 text-neutral-300 max-w-xs truncate">
                      {msg.transcript || '—'}
                    </td>
                    <td className={`px-5 py-4 font-bold ${moodStyle[msg.mood] || ''}`}>
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
