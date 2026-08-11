import React from 'react'

const strategy = [
  ['P1 gap', '+3.842s'],
  ['Pit window', 'Lap 22-24'],
  ['Fuel delta', '-0.7 kg'],
  ['ERS deploy', 'Balanced'],
]

const alerts = [
  'Rear tyre surface temp above target by 4C.',
  'Driver voice pitch increased after Turn 5 lock-up.',
  'Traffic predicted in 2 laps behind Car 16.',
]

function TeamDashboard() {
  return (
    <section className="min-h-screen bg-zinc-950 px-6 pt-28 pb-16 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-red-400">Pit wall dashboard</p>
        <h1 className="mt-3 text-4xl font-black">Race control view for driver stress and car pace</h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-lg border border-white/10 bg-neutral-900 p-6">
            <h2 className="text-xl font-black">Strategy snapshot</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {strategy.map(([label, value]) => (
                <div key={label} className="rounded-md bg-black p-5">
                  <p className="text-sm text-neutral-400">{label}</p>
                  <p className="mt-2 text-2xl font-black">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-red-500/20 bg-red-950/30 p-6">
            <h2 className="text-xl font-black">Race alerts</h2>
            <div className="mt-5 space-y-3">
              {alerts.map((alert) => (
                <div key={alert} className="rounded-md border border-red-400/20 bg-black/40 p-4 text-sm text-red-100">
                  {alert}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-white/10 bg-neutral-900 p-6">
          <h2 className="text-xl font-black">Recommended radio message</h2>
          <p className="mt-3 text-neutral-300">
            "Keep it smooth into Turn 11. Brake temps are under control. Target plus two tenths this lap."
          </p>
        </div>
      </div>
    </section>
  )
}

export default TeamDashboard
