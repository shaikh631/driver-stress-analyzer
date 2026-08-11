import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { login } from '../Store/authSlice'
import BackgroundWrapper from '../Component/BackgroundWrapper'
import PairingTokenCard from '../Component/PairingTokenCard'
import RadioMessageCard from '../Component/RadioMessageCard'
import LapTimeChart from '../Component/LapTimeChart'

/* ─── Mock data for when backend has no data yet ─── */
const MOCK_MESSAGES = [
  { _id: '1', driverId: { name: 'Verstappen' }, transcript: 'Box box box, tyres are gone.', mood: 'Stressed', confidence: 0.88, createdAt: new Date(Date.now() - 60000).toISOString() },
  { _id: '2', driverId: { name: 'Verstappen' }, transcript: 'Copy, understood. Pushing now.', mood: 'Calm', confidence: 0.92, createdAt: new Date(Date.now() - 180000).toISOString() },
  { _id: '3', driverId: { name: 'Verstappen' }, transcript: 'This car is undrivable, I can\'t keep it on track.', mood: 'Frustrated', confidence: 0.84, createdAt: new Date(Date.now() - 300000).toISOString() },
]

const MOCK_LAPS = [
  { _id: '1', lapNumber: 1, lapTimeMs: 96400, timestamp: new Date(Date.now() - 600000).toISOString() },
  { _id: '2', lapNumber: 2, lapTimeMs: 95200, timestamp: new Date(Date.now() - 500000).toISOString() },
  { _id: '3', lapNumber: 3, lapTimeMs: 94800, timestamp: new Date(Date.now() - 400000).toISOString() },
  { _id: '4', lapNumber: 4, lapTimeMs: 97100, timestamp: new Date(Date.now() - 300000).toISOString() },
  { _id: '5', lapNumber: 5, lapTimeMs: 95500, timestamp: new Date(Date.now() - 200000).toISOString() },
  { _id: '6', lapNumber: 6, lapTimeMs: 94400, timestamp: new Date(Date.now() - 100000).toISOString() },
]

/* ═══════════════════════════════════════════════════
   STATE A — TEAM AUTH (logged out)
   ═══════════════════════════════════════════════════ */
function TeamAuthPanel() {
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { name: '', email: '', password: '', confirmPassword: '' } })

  const password = watch('password')
  const switchMode = (m) => { setMode(m); setApiError(''); reset() }

  const onSubmit = async (data) => {
    setApiError('')
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup'
      const body = mode === 'login'
        ? { email: data.email, password: data.password }
        : { name: data.name, email: data.email, password: data.password }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Authentication failed')

      dispatch(login({ userData: result.team, token: result.token }))
      navigate('/team')
    } catch (err) {
      setApiError(err.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-24 pb-16">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-md">
        {/* Tab toggle */}
        <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
          {['login', 'signup'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                mode === m
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/20'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {m === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <h2 className="text-2xl font-black tracking-tight text-white">
          {mode === 'login' ? 'Welcome back' : 'Join the team'}
        </h2>
        <p className="mt-1 text-sm text-white/40">
          {mode === 'login'
            ? 'Enter your credentials to open the console.'
            : 'Create an account to get on the pit wall.'}
        </p>

        {apiError && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {mode === 'signup' && (
            <InputField
              label="Team Name" icon={User} error={errors.name?.message}
              inputProps={register('name', { required: 'Enter your team name' })}
              placeholder="Scuderia Rivera"
            />
          )}
          <InputField
            label="Email" icon={Mail} error={errors.email?.message}
            inputProps={register('email', {
              required: 'Enter your email',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
            })}
            placeholder="you@team.com" type="email"
          />
          <InputField
            label="Password" icon={Lock} error={errors.password?.message}
            inputProps={register('password', { required: 'Enter password', minLength: { value: 8, message: 'At least 8 characters' } })}
            placeholder="••••••••" type={showPassword ? 'text' : 'password'}
            trailing={
              <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-white/30 hover:text-white/60" aria-label="Toggle password">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          {mode === 'signup' && (
            <InputField
              label="Confirm Password" icon={Lock} error={errors.confirmPassword?.message}
              inputProps={register('confirmPassword', {
                required: 'Confirm your password',
                validate: (v) => v === password || 'Passwords don\u2019t match',
              })}
              placeholder="••••••••" type={showPassword ? 'text' : 'password'}
            />
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-full bg-gradient-to-r from-orange-600 to-amber-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:shadow-orange-500/40 disabled:opacity-50"
          >
            {isSubmitting ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Create Team'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/30">
          {mode === 'login' ? (
            <>New to the team?{' '}<button type="button" onClick={() => switchMode('signup')} className="font-semibold text-orange-400 hover:underline">Create an account</button></>
          ) : (
            <>Already have access?{' '}<button type="button" onClick={() => switchMode('login')} className="font-semibold text-orange-400 hover:underline">Log in</button></>
          )}
        </p>
      </div>
    </div>
  )
}

/* Sub-component: Input field matching dark theme */
function InputField({ label, icon: Icon, error, trailing, inputProps, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">{label}</label>
      <div className={`flex items-center gap-2.5 rounded-xl border bg-white/[0.03] px-4 py-3 transition focus-within:border-orange-500/50 ${error ? 'border-red-500/40' : 'border-white/10'}`}>
        <Icon className="h-4 w-4 shrink-0 text-white/30" strokeWidth={1.5} />
        <input type={type} placeholder={placeholder} className="w-full bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none" {...inputProps} />
        {trailing}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  )
}


/* ═══════════════════════════════════════════════════
   STATE B — TEAM DASHBOARD (logged in)
   ═══════════════════════════════════════════════════ */
function TeamDashboardPanel() {
  const token = useSelector((state) => state.auth.token)
  const teamData = useSelector((state) => state.auth.userData)
  const [pairingToken, setPairingToken] = useState(null)
  const [pairingExpiry, setPairingExpiry] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [messages, setMessages] = useState([])
  const [laps, setLaps] = useState([])
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [summaryRes, profileRes] = await Promise.all([
        fetch('/api/dashboard/summary', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/team/me', { headers: { Authorization: `Bearer ${token}` } }),
      ])
      if (summaryRes.ok) {
        const data = await summaryRes.json()
        const radioItems = (data.timeline || []).filter((t) => t.type === 'radio').map((t) => ({ ...t.data, createdAt: t.timestamp }))
        const lapItems = (data.timeline || []).filter((t) => t.type === 'lap').map((t) => ({ ...t.data, timestamp: t.timestamp }))
        setMessages(radioItems.length > 0 ? radioItems : MOCK_MESSAGES)
        setLaps(lapItems.length > 0 ? lapItems : MOCK_LAPS)
        setDrivers(data.drivers || [])
      }
      if (profileRes.ok) {
        const profile = await profileRes.json()
        setPairingToken(profile.pairingToken || null)
        setPairingExpiry(profile.pairingTokenExpiresAt || null)
      }
    } catch {
      setMessages(MOCK_MESSAGES)
      setLaps(MOCK_LAPS)
    } finally {
      setLoading(false)
    }
  }

  const generateToken = async () => {
    setGenerating(true)
    try {
      const res = await fetch('/api/team/pairing-token', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setPairingToken(data.pairingToken)
        setPairingExpiry(data.expiresAt)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setGenerating(false)
    }
  }

  useEffect(() => {
    if (token) fetchData()
    else setLoading(false)
  }, [token])

  // Socket.IO
  useEffect(() => {
    if (!token) return
    let socket
    const init = async () => {
      try {
        const { io } = await import('socket.io-client')
        socket = io({ auth: { token } })
        socket.on('radio:new', () => fetchData())
        socket.on('lap:new', () => fetchData())
      } catch {}
    }
    init()
    return () => { if (socket) socket.disconnect() }
  }, [token])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-16 md:px-8">
      {/* Header row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
            Pit Wall Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">
            {teamData?.name || 'Team Console'}
          </h1>
        </div>
        <PairingTokenCard
          token={pairingToken}
          expiresAt={pairingExpiry}
          onRegenerate={generateToken}
          generating={generating}
        />
      </div>

      {/* Two-column layout */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Left: Radio Feed */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
              Radio Feed — Live
            </h2>
          </div>

          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] p-12 text-center">
              <p className="text-sm text-white/40">
                Share your pairing token with your driver to get started.
              </p>
              {pairingToken && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(pairingToken)
                  }}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25"
                >
                  Copy Token
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3 max-h-[520px]  overflow-y-auto pr-1 scrollbar-thin">
              {messages.map((msg, i) => (
                <RadioMessageCard key={msg._id || i} message={msg} />
              ))}
            </div>
          )}
        </div>

        {/* Right: Lap Time Chart */}
        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]  text-white/50">
            Lap Performance
          </h2>
          <LapTimeChart laps={laps} messages={messages} />

          {/* Stats grid */}
          <div className="mt-4 grid grid-cols-3  gap-3">
            {[
              { label: 'Drivers', value: drivers.length || '—' },
              { label: 'Messages', value: messages.length },
              { label: 'Laps', value: laps.length },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
                <p className="font-mono text-2xl font-black text-white">{value}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/30">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


/* ═══════════════════════════════════════════════════
   MAIN EXPORT — switches based on auth state
   ═══════════════════════════════════════════════════ */
export default function TeamDashboard() {
  const authStatus = useSelector((state) => state.auth.status)

  return (
    <BackgroundWrapper>
      {authStatus ? <TeamDashboardPanel /> : <TeamAuthPanel />}
    </BackgroundWrapper>
  )
}
