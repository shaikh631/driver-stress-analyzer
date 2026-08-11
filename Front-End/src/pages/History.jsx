import React from 'react'

const sessions = [
  { race: 'Bahrain GP', stint: 'Laps 12-24', stress: '58%', result: 'Undercut successful' },
  { race: 'Monaco GP', stint: 'Laps 31-47', stress: '81%', result: 'High pressure traffic' },
  { race: 'Silverstone GP', stint: 'Laps 6-19', stress: '49%', result: 'Stable push phase' },
  { race: 'Monza GP', stint: 'Laps 39-53', stress: '72%', result: 'Defensive final stint' },
]

function History() {
  return (
    <section className="min-h-screen bg-neutral-950 px-6 pt-28 pb-16 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-red-400">Session history</p>
        <h1 className="mt-3 text-4xl font-black">Previous F1 car stress reports</h1>

        <div className="mt-8 overflow-hidden rounded-lg border border-white/10">
          <table className="w-full border-collapse bg-neutral-900 text-left text-sm">
            <thead className="bg-black text-neutral-300">
              <tr>
                <th className="px-5 py-4">Race</th>
                <th className="px-5 py-4">Stint</th>
                <th className="px-5 py-4">Peak Stress</th>
                <th className="px-5 py-4">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.race} className="border-t border-white/10">
                  <td className="px-5 py-4 font-bold">{session.race}</td>
                  <td className="px-5 py-4 text-neutral-300">{session.stint}</td>
                  <td className="px-5 py-4 text-red-200">{session.stress}</td>
                  <td className="px-5 py-4 text-neutral-300">{session.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default History
