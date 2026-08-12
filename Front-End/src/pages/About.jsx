// src/pages/About.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  FaUserShield,
  FaKey,
  FaKeyboard,
  FaLink,
  FaMicrophone,
  FaBrain,
  FaChartLine,
} from 'react-icons/fa6'

const steps = [
  { icon: FaUserShield, title: 'Sign up / log in', body: 'OTP-secured team access' },
  { icon: FaKey, title: 'Generate a token', body: 'Unique token per team', pulse: true },
  { icon: FaKeyboard, title: 'Enter the token', body: 'No driver account needed' },
  { icon: FaLink, title: 'Connect the session', body: 'Token opens the live link' },
  { icon: FaMicrophone, title: 'Send audio', body: 'Captured via push-to-talk' },
  { icon: FaBrain, title: 'AI analyzes it', body: 'Tone and urgency, real time' },
  { icon: FaChartLine, title: 'Results hit the wall', body: 'Synced live with telemetry' },
]

function About() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#0a0503] text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(120% 90% at 15% 20%, rgba(255,106,44,0.0) 0%, rgba(10,5,3,0.55) 55%, rgba(10,5,3,0.95) 78%),
            repeating-linear-gradient(90deg, rgba(255,122,48,0.9) 0px, rgba(255,90,20,0.9) 3px, rgba(190,58,10,0.9) 3px, rgba(190,58,10,0.9) 34px),
            linear-gradient(90deg, #a83e0a 0%, #7a2b06 25%, #3a1204 45%, #170a04 70%, #0a0503 100%)
          `,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0503] via-transparent to-[#0a0503]" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center gap-10 px-6 py-10 md:px-12">
        {/* Header — compact */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-wide text-white/70 md:text-sm"
          >
            The pairing flow
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-2 leading-[1.05]"
          >
            <span className="block text-2xl font-light tracking-tight text-white/90 sm:text-3xl md:text-4xl">
              One token bridges
            </span>
            <span className="block text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl">
              driver and dashboard
            </span>
          </motion.h1>
        </div>

        {/* Signal chain — signature element, single row */}
        <div className="relative">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.3 }}
            style={{ transformOrigin: 'left' }}
            className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-[#ff7a30]/10 via-[#ff7a30]/70 to-[#ff7a30]/10 lg:block"
          />

          <ol className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-7 lg:gap-x-3">
            {steps.map((step, i) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.09, duration: 0.45 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#ff7a30]/50 bg-[#0a0503]">
                  {step.pulse && (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-[#ff7a30]/30"
                      animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                  <step.icon className="relative z-10 h-4 w-4 text-[#ff7a30]" />
                </div>

                <span className="mt-3 font-mono text-[10px] text-[#ff7a30]/70">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-1 text-xs font-semibold text-white sm:text-sm">
                  {step.title}
                </h3>
                <p className="mt-1 max-w-[10rem] text-[11px] leading-snug text-white/50 sm:text-xs">
                  {step.body}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* Key point callout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="rounded-2xl border border-[#ff7a30]/30 bg-[#ff7a30]/[0.06] px-5 py-4 backdrop-blur-sm md:px-6"
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#ff7a30] md:text-xs">
            Key point
          </p>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
            The pairing token is the bridge — the only thing that links an
            anonymous driver session to an authenticated team session. No
            token, no connection.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="flex flex-col items-start gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="max-w-md text-sm text-white/60">
            Ready to generate your team's first pairing token?
          </p>
          <Link
            to="/team"
            className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-3 backdrop-blur-sm transition hover:bg-white/10"
          >
            <span className="text-lg leading-none">▶</span>
            <span className="text-sm font-semibold">TEAM DASHBOARD</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default About