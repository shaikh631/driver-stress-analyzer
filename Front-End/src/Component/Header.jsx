// import React from 'react'
// import { ChevronRight } from 'lucide-react'
// import Button from './Button'
// import { NavLink } from 'react-router-dom'
// import { useSelector } from 'react-redux'

// function Header({ onDriverClick }) {
//   const authStatus = useSelector((state) => state.auth.status)

//   const navItems = [
//     { label: 'Home', path: '/', active: true },
//     { label: 'Driver', path: '/driver', active: true, protected: true },
//     { label: 'Team', path: '/team/auth', active: true  },
//     { label: 'Live', path: '/live', active: authStatus },
//     { label: 'History', path: '/history', active: authStatus },
//   ]

//   return (
//     <header className="fixed z-30 w-full mt-2 bg-transparent backdrop-blur-md">
//       <nav className="flex w-full items-center justify-between gap-4 px-4 py-1 md:px-8">
//         <div className="flex items-center gap-6">
//           <span className="text-3xl font-black tracking-tight bg-transparent text-slate-950">
//             CO-DRIVER
//           </span>

//           <ul className="flex items-center gap-1">
//             {navItems.map((item) =>
//               item.active ? (
//                 <li key={item.path}>
// 	                  <NavLink
// 	                    to={item.path}
// 	                    end={item.path === '/'}
// 	                    onClick={(event) => {
// 	                      if (item.protected && onDriverClick) {
// 	                        event.preventDefault()
// 	                        onDriverClick()
// 	                      }
// 	                    }}
// 	                    className={({ isActive }) =>
// 	                      `px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                         isActive
//                           ? 'text-blue-600 bg-blue-50'
//                           : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
//                       }`
//                     }
//                   >
//                     {item.label}
//                   </NavLink>
//                 </li>
//               ) : null
//             )}
//             {authStatus && (
//               <li>
//                 {/* <LogoutBtn /> */}
//                 logout
//               </li>
//             )}
//           </ul>
//         </div>

//         <div className="flex items-center gap-3">
//           <Button className="inline-flex items-center gap-2 rounded-3xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
//             <span>{authStatus ? 'logout' : 'login'}</span>
//             <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
//           </Button>
//         </div>
//       </nav>
//     </header>
//   )
// }

// export default Header



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
    { label: 'Team', path: '/team/auth', active: true },
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
            {authStatus && (
              <li>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white/70 transition hover:text-white"
                >
                  {/* <LogoutBtn /> */}
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <Button className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10">
            <span>{authStatus ? 'Logout' : 'Login'}</span>
            <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </div>
      </nav>
    </header>
  )
}

export default Header