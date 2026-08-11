import React from 'react'
import { FaFacebookF, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa'

/**
 * Shared background wrapper replicating the homepage dark/orange
 * gradient treatment with vertical orange stripes.
 */
export default function BackgroundWrapper({ children, className = '' }) {
  return (
    <section
      className={`relative min-h-screen w-full overflow-hidden bg-[#0a0503] text-white ${className}`}
    >
      {/* Orange stripe gradient — right side warm glow */}
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
      {/* Vertical vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0503] via-transparent to-[#0a0503]/40" />

      {/* Vertical social rail */}
      <div className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-5 md:flex">
        {[FaFacebookF, FaInstagram, FaLinkedin, FaYoutube].map((Icon, i) => (
          <React.Fragment key={i}>
            <a
              href="#"
              aria-label="Social link"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white/80 transition hover:border-white hover:text-white"
            >
              <Icon className="h-3.5 w-3.5" />
            </a>
            {i < 3 && <span className="h-6 w-px bg-white/20" />}
          </React.Fragment>
        ))}
      </div>

      {/* Page content */}
      <div className="relative z-10">{children}</div>
    </section>
  )
}
