import React from 'react'
import { ArrowRight } from 'lucide-react'
import { NavLink, useOutletContext } from 'react-router-dom'

const pipeline = [
  'DRIVER RADIO',
  'AI VOICE ANALYSIS',
  'STRESS DETECTION',
  'RACE PERFORMANCE',
  'TEAM INSIGHT',
]

function Home() {
  const { openDriverModal } = useOutletContext()

  return (
    <main className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-[#050608] px-6 pb-6 pt-16 text-white">
      <div className="absolute inset-0 z-0">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=2200&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/90 to-transparent" />
      </div>

      <section className="relative z-10 mx-auto mb-16 mt-32 flex w-full max-w-[1200px] flex-col items-center space-y-6 text-center">
        <div className="flex items-center gap-2 rounded border border-zinc-800 bg-[#111111] px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-red-600" />
          <span className="text-sm font-semibold uppercase tracking-wider text-white">
            PIT WALL LIVE
          </span>
        </div>

        <div className="max-w-4xl space-y-4">
          <h1 className="text-5xl font-black uppercase tracking-tight text-white md:text-7xl">
            The <span className="text-red-600">Silent</span> Co-Driver
          </h1>
          <h2 className="text-2xl font-semibold uppercase tracking-tight text-white md:text-3xl">
            Reading driver stress from radio calls.
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-7 text-zinc-400">
            AI-powered voice intelligence for smarter race decisions.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <button
            type="button"
            onClick={openDriverModal}
            className="flex items-center justify-center gap-2 rounded bg-red-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-500"
          >
            DRIVER PORTAL
            <ArrowRight className="h-4 w-4" />
          </button>
          <NavLink
            to="/team/auth"
            className="flex items-center justify-center gap-2 rounded border border-zinc-600 bg-transparent px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-900"
          >
            TEAM DASHBOARD
          </NavLink>
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-auto w-full max-w-[1200px] border-t border-zinc-800 pt-16">
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-400 md:gap-4 md:text-sm">
          {pipeline.map((item, index) => (
            <React.Fragment key={item}>
              <span
                className={`rounded bg-[#1a1a1a] px-3 py-1 ${
                  item === 'AI VOICE ANALYSIS'
                    ? 'border border-red-600/30 text-red-500'
                    : item === 'TEAM INSIGHT'
                      ? 'text-white'
                      : ''
                }`}
              >
                {item}
              </span>
              {index < pipeline.length - 1 && (
                <ArrowRight className="h-4 w-4 text-zinc-600" />
              )}
            </React.Fragment>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Home
