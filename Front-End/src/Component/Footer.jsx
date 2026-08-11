import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaLinkedin } from 'react-icons/fa'

function Footer() {
  return (
    <footer className=" w-full h-full  bg-slate-700 text-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-3xl font-extrabold">Ayan Shaikh</h2>
            <p className="mt-4 text-sm text-slate-200 max-w-xs">
              Passionate Full Stack Java Developer and AIML Student focused on building modern, scalable, and user-friendly web applications.
            </p>
            <nav className="mt-8">
              <ul className="space-y-3 text-sm">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/skills" className="hover:text-white">Skills</Link></li>
                <li><Link to="/projects" className="hover:text-white">Projects</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </nav>
          </div>

          <div className="border-l border-r border-slate-600 px-6">
            <h3 className="text-sm font-semibold text-slate-200">Expertise</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              <li>React.js</li>
              <li>Java</li>
              <li>Spring Boot</li>
              <li>Node.js</li>
              <li>MySQL</li>
              <li>Tailwind CSS</li>
            </ul>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-slate-200">Get In Touch</h4>
              <p className="mt-2 text-sm text-slate-200">📍 Mumbai, Maharashtra, India</p>
              <p className="mt-1 text-sm text-slate-200">📧 your-email@example.com</p>
              <p className="mt-1 text-sm text-slate-200">💼 Open to internships and collaboration opportunities</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-200">Contact</h3>
            <address className="not-italic mt-4 text-sm text-slate-200 space-y-2">
              <div>Mumbai, Maharashtra</div>
              <div>India</div>
            </address>

            <div className="mt-6 flex items-center gap-3">
              <a href="#" aria-label="Facebook" className="p-2 rounded-md bg-slate-600 hover:bg-slate-500">
                <FaFacebookF className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Instagram" className="p-2 rounded-md bg-slate-600 hover:bg-slate-500">
                <FaInstagram className="h-4 w-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="p-2 rounded-md bg-slate-600 hover:bg-slate-500">
                <FaLinkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-600 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-slate-300">
          <div>© 2026 Ayan Shaikh. All Rights Reserved.</div>
          <div className="mt-3 md:mt-0">Designed & Developed with ❤️ using React & Tailwind CSS.</div>
        </div>
      </div>
    </footer>
  )
}

export default Footer