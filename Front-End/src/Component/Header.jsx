import React from 'react'
import { ChevronRight } from 'lucide-react'
import Button from './Button'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../Store/authSlice'

function Header({ onDriverClick }) {
  const authStatus = useSelector((state) => state.auth.status)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const navItems = [
    { label: 'Home', path: '/', active: true },
    { label: 'Driver', path: '/driver', active: true, protected: true },
    { label: 'Team', path: '/team', active: true },
    { label: 'Live', path: '/live', active: authStatus },
    { label: 'History', path: '/history', active: authStatus },
  ]

  return (
    <header className="fixed z-30 w-full mt-2">
      <nav className="mx-4 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 px-4 py-2 backdrop-blur-md md:mx-8 md:px-6">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-black tracking-tight text-white">
            CO-DRIVER
          </span>

          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    onClick={(event) => {
                      if (item.protected && onDriverClick) {
                        event.preventDefault()
                        onDriverClick()
                      }
                    }}
                    className={({ isActive }) =>
                      `px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50 ${
                        isActive
                          ? 'bg-amber-400/15 text-amber-400'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ) : null
            )}
          </ul>
        </div>

        <div className="flex items-center gap-3">
          {authStatus ? (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              <span>Logout</span>
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          ) : (
            <NavLink to="/team">
              <Button className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10">
                <span>Login</span>
                <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
              </Button>
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header