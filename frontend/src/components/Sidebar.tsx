import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Building2, CalendarDays, LogOut, Menu, X, Star } from 'lucide-react'

export const Sidebar: React.FC = () => {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <header className="md:hidden fixed top-0 w-full bg-primary z-20 flex items-center justify-between p-4 shadow-lg border-b border-primary-hover">
        <div className="flex items-center gap-3 text-white">
          <div className="bg-white/10 p-1.5 rounded-lg">
            <Building2 className="w-5 h-5 text-secondary" />
          </div>
          <span className="font-bold text-lg tracking-wide">Hotel Hub</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      <aside
        className={`
          fixed md:relative inset-y-0 left-0 z-40 w-64 bg-primary text-white flex flex-col shadow-2xl 
          transform transition-transform duration-300 ease-in-out border-r border-primary-hover
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-8 border-b border-primary-hover flex items-center justify-between bg-primary-hover/20">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-extrabold tracking-wider text-white">
              HOTEL HUB
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-primary-light opacity-70">
                Premium
              </span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="w-2 h-2 text-secondary"
                    fill="currentColor"
                  />
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={closeSidebar}
            className="md:hidden text-primary-light hover:text-white cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-3 overflow-y-auto py-6">
          <NavLink
            to="/dashboard"
            end
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all duration-200 group font-medium
               ${
                 isActive
                   ? 'bg-white text-primary shadow-lg translate-x-1'
                   : 'text-primary-light hover:bg-primary-hover hover:text-white hover:translate-x-1'
               }`
            }
          >
            <Building2 className="w-5 h-5" />
            <span>Hotéis</span>
          </NavLink>

          <NavLink
            to="/dashboard/bookings"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all duration-200 group font-medium
               ${
                 isActive
                   ? 'bg-white text-primary font-bold shadow-md'
                   : 'text-primary-light hover:bg-primary-hover hover:text-white hover:translate-x-1'
               }`
            }
          >
            <CalendarDays className="w-5 h-5" />
            <span>Reservas</span>
          </NavLink>
        </nav>

        <div className="p-6 border-t border-primary-hover bg-primary-hover/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-secondary border-2 border-white/20 flex items-center justify-center text-white font-bold shadow-md">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate text-white">
                {user?.username}
              </p>
              <p className="text-xs text-primary-light opacity-80">
                Administrador
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg 
                       bg-black/20 text-primary-light border border-white/5
                       hover:bg-secondary hover:text-primary hover:font-bold hover:shadow-lg hover:-translate-y-0.5
                       transition-all duration-200 text-sm cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sair do Sistema
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-gray-50 pt-24 md:pt-8 p-6 md:p-10 scroll-smooth">
        <Outlet />
      </main>
    </div>
  )
}
