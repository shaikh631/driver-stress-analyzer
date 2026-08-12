// src/pages/Contact.jsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FaGithub, FaLinkedin, FaYoutube } from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import { FaSatelliteDish, FaEnvelope, FaPhone, FaLocationDot } from 'react-icons/fa6'

const channels = ['ENGINEERING', 'STRATEGY', 'MEDIA', 'PARTNERSHIPS']

// 👇 Replace with your real Formspree endpoint
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xgawyyay'

const contactPoints = [
  { icon: FaEnvelope, label: 'Email', value: 'as9251145@gamil.com' },
  { icon: FaPhone, label: 'Connect', value: '91+ 7021* *****' },
  { icon: FaLocationDot, label: 'In', value: 'Mumbai , India' },
]

function Waveform({ active }) {
  const bars = Array.from({ length: 24 })
  return (
    <div className="flex h-8 items-center gap-0.75">
      {bars.map((_, i) => (
        <motion.span
          key={i}
          className="w-0.75 rounded-full bg-[#ff7a30]"
          animate={
            active
              ? { height: [6, 10 + ((i * 7) % 22), 6] }
              : { height: 4 }
          }
          transition={
            active
              ? {
                  duration: 0.6 + (i % 5) * 0.1,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  delay: i * 0.03,
                }
              : { duration: 0.3 }
          }
          style={{ opacity: active ? 0.9 : 0.25 }}
        />
      ))}
    </div>
  )
}

function Contact() {
  const [channel, setChannel] = useState(channels[0])
  const [isTyping, setIsTyping] = useState(false)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [formData, setFormData] = useState({ name: '', team: '', email: '', message: '' })

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          team: formData.team,
          email: formData.email,
          channel,
          message: formData.message,
        }),
      })

      if (res.ok) {
        setStatus('sent')
        setFormData({ name: '', team: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }

    setTimeout(() => setStatus('idle'), 4000)
  }

  return (
    <section className="relative w-full overflow-hidden bg-[#0a0503] text-white">
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

      {/* Social rail — kept consistent with Home for site-wide chrome */}
      <div className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-5 md:flex">
        {[SiLeetcode, FaGithub, FaLinkedin, FaYoutube].map((Icon, i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <a
              href="#"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white/80 transition hover:border-white hover:text-white"
              aria-label="Social link"
            >
              <Icon className="h-3.5 w-3.5" />
            </a>
            {i < 3 && <span className="h-6 w-px bg-white/20" />}
          </div>
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-28 md:px-12">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm font-semibold uppercase tracking-wide text-white/70"
        >
          Open channel
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="mt-4 max-w-2xl leading-[1.05]"
        >
          <span className="block text-4xl font-light tracking-tight text-white/90 md:text-5xl">
            Get your team
          </span>
          <span className="block text-4xl font-black tracking-tight text-white md:text-5xl">
            on comms
          </span>
        </motion.h1>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Radio panel form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:p-8"
          >
            {/* Channel tabs */}
            <div className="flex flex-wrap gap-2 border-b border-white/10 pb-6">
              {channels.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setChannel(c)}
                  className="relative rounded-full px-4 py-2 text-xs font-semibold tracking-wide"
                >
                  {channel === c && (
                    <motion.span
                      layoutId="channelIndicator"
                      className="absolute inset-0 rounded-full bg-[#ff7a30]/90"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className={`relative z-10 ${channel === c ? 'text-[#0a0503]' : 'text-white/60'}`}>
                    {c}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wide text-white/50">Name</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Lewis Carter"
                  className="rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-[#ff7a30]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wide text-white/50">Team / organisation</label>
                <input
                  type="text"
                  name="team"
                  value={formData.team}
                  onChange={handleChange}
                  placeholder="Apex Racing"
                  className="rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-[#ff7a30]"
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-xs uppercase tracking-wide text-white/50">Email</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@team.com"
                  className="rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-[#ff7a30]"
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-wide text-white/50">Message</label>
                  <Waveform active={isTyping} />
                </div>
                <textarea
                  required
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setIsTyping(true)}
                  onBlur={() => setIsTyping(false)}
                  placeholder={`Tell us what your ${channel.toLowerCase()} team needs on the wall...`}
                  className="resize-none rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-[#ff7a30]"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 backdrop-blur-sm transition hover:bg-white/10 disabled:opacity-60"
              >
                <FaSatelliteDish className="h-4 w-4 text-[#ff7a30]" />
                <span className="text-sm font-semibold">
                  {status === 'sending'
                    ? 'TRANSMITTING…'
                    : status === 'sent'
                    ? 'SIGNAL SENT'
                    : status === 'error'
                    ? 'RETRY TRANSMIT'
                    : 'TRANSMIT'}
                </span>
              </button>

              <AnimatePresence>
                {status === 'sent' && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-white/50"
                  >
                    Received on {channel} — we'll reply within one race weekend.
                  </motion.span>
                )}
                {status === 'error' && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-red-400"
                  >
                    Signal lost — please try again.
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.form>

          {/* Quick contact points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            {contactPoints.map((c) => (
              <div
                key={c.label}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
              >
                <c.icon className="mt-1 h-4 w-4 text-[#ff7a30]" />
                <div>
                  <div className="text-xs uppercase tracking-wide text-white/50">{c.label}</div>
                  <div className="mt-1 text-sm font-medium text-white/90">{c.value}</div>
                </div>
              </div>
            ))}
            <div className="rounded-2xl border border-dashed border-white/15 p-5 text-sm leading-relaxed text-white/50">
              Radio checks run Mon–Fri, 09:00–20:00 GMT. Outside those hours,
              your message queues and transmits first thing next session.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact