// import React from 'react'
// import { ArrowRight } from 'lucide-react'
// import { NavLink, useOutletContext } from 'react-router-dom'

// const pipeline = [
//   'DRIVER RADIO',
//   'AI VOICE ANALYSIS',
//   'STRESS DETECTION',
//   'RACE PERFORMANCE',
//   'TEAM INSIGHT',
// ]

// function Home() {
//   const { openDriverModal } = useOutletContext()

//   return (
//     <main className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-[#050608] px-6 pb-6 pt-16 text-white">
//       <div className="absolute inset-0 z-0">
//         <div
//           className="h-full w-full bg-cover bg-center bg-no-repeat opacity-40"
//           style={{
//             backgroundImage:
//               "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=2200&q=80')",
//           }}
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/90 to-transparent" />
//       </div>

//       <section className="relative z-10 mx-auto mb-16 mt-32 flex w-full max-w-[1200px] flex-col items-center space-y-6 text-center">
//         <div className="flex items-center gap-2 rounded border border-zinc-800 bg-[#111111] px-3 py-1">
//           <span className="h-2 w-2 rounded-full bg-red-600" />
//           <span className="text-sm font-semibold uppercase tracking-wider text-white">
//             PIT WALL LIVE
//           </span>
//         </div>

//         <div className="max-w-4xl space-y-4">
//           <h1 className="text-5xl font-black uppercase tracking-tight text-white md:text-7xl">
//             The <span className="text-red-600">Silent</span> Co-Driver
//           </h1>
//           <h2 className="text-2xl font-semibold uppercase tracking-tight text-white md:text-3xl">
//             Reading driver stress from radio calls.
//           </h2>
//           <p className="mx-auto max-w-2xl text-base leading-7 text-zinc-400">
//             AI-powered voice intelligence for smarter race decisions.
//           </p>
//         </div>

//         <div className="mt-8 flex flex-col gap-4 sm:flex-row">
//           <button
//             type="button"
//             onClick={openDriverModal}
//             className="flex items-center justify-center gap-2 rounded bg-red-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-500"
//           >
//             DRIVER PORTAL
//             <ArrowRight className="h-4 w-4" />
//           </button>
//           <NavLink
//             to="/team/auth"
//             className="flex items-center justify-center gap-2 rounded border border-zinc-600 bg-transparent px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-900"
//           >
//             TEAM DASHBOARD
//           </NavLink>
//         </div>
//       </section>

//       <section className="relative z-10 mx-auto mt-auto w-full max-w-[1200px] border-t border-zinc-800 pt-16">
//         <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-400 md:gap-4 md:text-sm">
//           {pipeline.map((item, index) => (
//             <React.Fragment key={item}>
//               <span
//                 className={`rounded bg-[#1a1a1a] px-3 py-1 ${
//                   item === 'AI VOICE ANALYSIS'
//                     ? 'border border-red-600/30 text-red-500'
//                     : item === 'TEAM INSIGHT'
//                       ? 'text-white'
//                       : ''
//                 }`}
//               >
//                 {item}
//               </span>
//               {index < pipeline.length - 1 && (
//                 <ArrowRight className="h-4 w-4 text-zinc-600" />
//               )}
//             </React.Fragment>
//           ))}
//         </div>
//       </section>
//     </main>
//   )
// }

// export default Home
// Home.jsx
import React from 'react'
import { Link, useOutletContext } from 'react-router-dom'
// import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa'

function Home() {
  const { openDriverModal } = useOutletContext()


  return (
    <section className="relative flex min-h-screen w-full items-center overflow-hidden bg-[#0a0503] text-white">
      {/* Background: vertical stripes fading from orange (right) to black (left) */}
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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0503] via-transparent to-[#0a0503]/40" />

      {/* Vertical social rail */}
      <div className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-5 md:flex">
        {[FaFacebookF, FaInstagram, FaLinkedin, FaYoutube].map((Icon, i) => (
          <React.Fragment key={i}>
            <a
              href="#"
              aria-label={Icon.displayName || 'Social link'}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white/80 transition hover:border-white hover:text-white"
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
            </a>
            {i < 3 && <span className="h-6 w-px bg-white/20" />}
          </React.Fragment>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-start px-6 py-24 md:px-12 lg:flex-row lg:items-center">
        <div className="max-w-xl lg:w-1/2">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/70">
            Built for every pit crew
          </p>

          <h1 className="mt-4 leading-[1.05]">
            <span className="block text-4xl font-light tracking-tight text-white/90 md:text-5xl">
              Command the Race
            </span>
            <span className="block text-4xl font-black tracking-tight text-white md:text-5xl">
              Own Every Second
            </span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-white/60">
            Live telemetry, driver comms, and pit-wall coordination in one
            console — built for teams who treat every lap like it matters.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={openDriverModal}
              className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 backdrop-blur-sm transition hover:bg-white/10"
            >
              <span className="text-xl leading-none">▶</span>
              <span className="text-sm font-semibold"> DRIVER PORTAL</span>
            </button>
            <Link
              to="/team/auth"
              className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 backdrop-blur-sm transition hover:bg-white/10"
            >
              <span className="text-lg leading-none">▶</span>
              <span className="text-sm font-semibold">TEAM DASHBOARD</span>
            </Link>
          </div>
        </div>

        <div className="mt-16 flex w-full items-center justify-center lg:mt-0 lg:w-1/2">
          <img
            src="/assets/image.png"
            alt="CO-DRIVER telemetry console"
            className="h-auto w-full max-w-md object-contain"
          />
        </div>
      </div>
    </section>
  )
}

export default Home
