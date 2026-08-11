// Footer.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa'

const footerLinks = [
  {
    heading: 'Console',
    links: [
      { label: 'Home', path: '/' },
      { label: 'Driver', path: '/driver' },
      { label: 'Team', path: '/team/auth' },
      { label: 'Live', path: '/live' },
      { label: 'History', path: '/history' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', path: '/about' },
      { label: 'Careers', path: '/careers' },
      { label: 'Contact', path: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy policy', path: '/privacy' },
      { label: 'Terms of service', path: '/terms' },
    ],
  },
]

const socialLinks = [
  { icon: FaFacebookF, label: 'Facebook', href: '#' },
  { icon: FaInstagram, label: 'Instagram', href: '#' },
  { icon: FaLinkedin, label: 'LinkedIn', href: '#' },
  { icon: FaYoutube, label: 'Youtube', href: '#' },
]

function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-[#0a0503] text-white">
      {/* Subtle echo of the hero's stripe/vignette background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(120% 100% at 80% 0%, rgba(255,106,44,0.08) 0%, rgba(10,5,3,0) 55%),
            linear-gradient(180deg, #0a0503 0%, #120701 100%)
          `,
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-10 pt-16 md:px-12">
        <div className="flex flex-col justify-between gap-12 border-b border-white/10 pb-12 lg:flex-row">
          {/* Brand + CTA */}
          <div className="max-w-sm">
            <span className="text-2xl font-black tracking-tight text-white">
              CO-DRIVER
            </span>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Live telemetry, driver comms, and pit-wall coordination in one
              console — built for teams who treat every lap like it matters.
            </p>

            <Link
              to="/team/auth"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/10"
            >
              <span>Join the team</span>
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:gap-16">
            {footerLinks.map((group) => (
              <div key={group.heading}>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                  {group.heading}
                </p>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="text-sm text-white/70 transition hover:text-amber-400"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col items-center justify-between gap-6 pt-8 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} CO-DRIVER. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-amber-400 hover:text-amber-400"
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
