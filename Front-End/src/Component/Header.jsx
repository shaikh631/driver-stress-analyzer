import React from 'react'
import { ChevronRight } from 'lucide-react'
import Button from './Button'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Header({ onDriverClick }) {
  const authStatus = useSelector((state) => state.auth.status)

  const navItems = [
    { label: 'Home', path: '/', active: true },
    { label: 'Driver', path: '/driver', active: true, protected: true },
    { label: 'Team', path: '/team/auth', active: true  },
    { label: 'Live', path: '/live', active: authStatus },
    { label: 'History', path: '/history', active: authStatus },
  ]

  return (
    <header className="fixed z-30 w-full mt-2 bg-transparent backdrop-blur-md">
      <nav className="flex w-full items-center justify-between gap-4 px-4 py-1 md:px-8">
        <div className="flex items-center gap-6">
          <span className="text-3xl font-black tracking-tight bg-transparent text-slate-950">
            CO-DRIVER
          </span>

          <ul className="flex items-center gap-1">
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
	                      `px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isActive
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ) : null
            )}
            {authStatus && (
              <li>
                {/* <LogoutBtn /> */}
                logout
              </li>
            )}
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <Button className="inline-flex items-center gap-2 rounded-3xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            <span>{authStatus ? 'logout' : 'login'}</span>
            <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </div>
      </nav>
    </header>
  )
}

export default Header
