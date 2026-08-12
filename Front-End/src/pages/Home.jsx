import React from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { motion } from 'motion/react'
// import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import { FaGithub, FaLinkedin, FaYoutube } from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import About from './About'
import Contact from './Contact'

function Home() {
  const { openDriverModal } = useOutletContext()


  return (
  <>
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
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#0a0503] via-transparent to-[#0a0503]/40" />

      {/* Vertical social rail */}
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-5 md:flex"
      >
        {[SiLeetcode, FaGithub, FaLinkedin, FaYoutube].map((Icon, i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <a
              href="#"
              aria-label={Icon.displayName || 'Social link'}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white/80 transition hover:border-white hover:text-white"
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
            </a>
            {i < 3 && <span className="h-6 w-px bg-white/20" />}
          </div>
        ))}
      </motion.div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-start px-6 py-24 md:px-12 lg:flex-row lg:items-center">
        <div className="max-w-xl lg:w-1/2">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm font-semibold uppercase tracking-wide text-white/70"
          >
            Built for every pit crew
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 leading-[1.05]"
          >
            <span className="block text-4xl font-light tracking-tight text-white/90 md:text-5xl">
              Command the Race
            </span>
            <span className="block text-4xl font-black tracking-tight text-white md:text-5xl">
              Own Every Second
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-md text-base leading-relaxed text-white/60"
          >
            Live telemetry, driver comms, and pit-wall coordination in one
            console — built for teams who treat every lap like it matters.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <motion.button
              type="button"
              onClick={openDriverModal}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 backdrop-blur-sm transition hover:bg-white/10"
            >
              <span className="text-xl leading-none">▶</span>
              <span className="text-sm font-semibold"> DRIVER PORTAL</span>
            </motion.button>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/team"
                className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 backdrop-blur-sm transition hover:bg-white/10"
              >
                <span className="text-lg leading-none">▶</span>
                <span className="text-sm font-semibold">TEAM DASHBOARD</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
          className="mt-16 flex w-full items-center justify-center lg:mt-0 lg:w-1/2"
        >
          <motion.img
            src="/assets/image.png"
            alt="CO-DRIVER telemetry console"
            className="h-auto w-full max-w-md object-contain"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
    <About />
    <Contact />
  </>
  )
}

export default Home