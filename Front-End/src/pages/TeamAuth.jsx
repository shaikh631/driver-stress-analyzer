// TeamAuth.jsx
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, ChevronRight } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { login } from '../Store/authSlice'

const LIGHT_COUNT = 5

function StartLights() {
  const [litCount, setLitCount] = useState(0)

  useEffect(() => {
    let i = 0
    const onInterval = setInterval(() => {
      i += 1
      setLitCount(i)
      if (i >= LIGHT_COUNT) {
        clearInterval(onInterval)
        setTimeout(() => setLitCount(0), 900) // "lights out" reset, like a race start
      }
    }, 350)
    return () => clearInterval(onInterval)
  }, [])

  return (
    <div className="flex gap-3" aria-hidden="true">
      {Array.from({ length: LIGHT_COUNT }).map((_, i) => (
        <span
          key={i}
          className={`h-3.5 w-3.5 rounded-full transition-colors duration-300 ${
            i < litCount ? 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.7)]' : 'bg-white/10'
          }`}
        />
      ))}
    </div>
  )
}

function TeamAuth() {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const password = watch('password')

  const switchMode = (next) => {
    setMode(next)
    reset()
  }

  const onSubmit = async (data) => {
    try {
      if (mode === 'login') {
        // TODO: replace with your real auth call
        // await dispatch(loginTeamMember({ email: data.email, password: data.password })).unwrap()
        await mockAuth(data)
      } else {
        // TODO: replace with your real signup call
        // await dispatch(signupTeamMember(data)).unwrap()
        await mockAuth(data)
      }
      dispatch(login({ userData: { name: data.name, email: data.email } }))
      navigate('/team')
    } catch (err) {
      // surfaced via react-hook-form root error, or swap for a toast
      console.error(err)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      {/* Brand panel */}
      <div className="relative flex w-full flex-col justify-between bg-[#0B0F14] px-8 py-10 text-white md:w-2/5 md:px-12 md:py-14">
        <div>
          <Link to="/" className="text-2xl font-black tracking-tight">
            CO-DRIVER
          </Link>
        </div>

        <div className="mt-16 md:mt-0">
          <StartLights />
          <h1 className="mt-6 text-3xl font-black leading-tight tracking-tight md:text-4xl">
            Team access,
            <br />
            lights out.
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
            Sign in to run telemetry, manage the pit wall, and keep every driver
            on pace.
          </p>
        </div>

        <p className="mt-16 font-mono text-xs uppercase tracking-widest text-white/30 md:mt-0">
          Team console · v1.0
        </p>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-1 items-center justify-center bg-[#F7F7F5] px-6 py-14 md:px-12">
        <div className="w-full max-w-sm">
          {/* Tab toggle */}
          <div className="mb-8 inline-flex rounded-2xl bg-slate-950/5 p-1">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`rounded-xl px-5 py-2 text-sm font-semibold transition ${
                mode === 'login'
                  ? 'bg-slate-950 text-white'
                  : 'text-slate-500 hover:text-slate-950'
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`rounded-xl px-5 py-2 text-sm font-semibold transition ${
                mode === 'signup'
                  ? 'bg-slate-950 text-white'
                  : 'text-slate-500 hover:text-slate-950'
              }`}
            >
              Sign up
            </button>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-slate-950">
            {mode === 'login' ? 'Welcome back' : 'Join the team'}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {mode === 'login'
              ? 'Enter your credentials to open the console.'
              : 'Create an account to get on the pit wall.'}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            {mode === 'signup' && (
              <Field
                label="Full name"
                icon={User}
                error={errors.name?.message}
              >
                <input
                  type="text"
                  placeholder="Alex Rivera"
                  className="w-full bg-transparent text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none"
                  {...register('name', {
                    required: 'Enter your name',
                  })}
                />
              </Field>
            )}

            <Field label="Email" icon={Mail} error={errors.email?.message}>
              <input
                type="email"
                placeholder="you@team.com"
                className="w-full bg-transparent text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none"
                {...register('email', {
                  required: 'Enter your email',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email',
                  },
                })}
              />
            </Field>

            <Field
              label="Password"
              icon={Lock}
              error={errors.password?.message}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            >
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none"
                {...register('password', {
                  required: 'Enter your password',
                  minLength: {
                    value: 8,
                    message: 'At least 8 characters',
                  },
                })}
              />
            </Field>

            {mode === 'signup' && (
              <Field
                label="Confirm password"
                icon={Lock}
                error={errors.confirmPassword?.message}
              >
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none"
                  {...register('confirmPassword', {
                    required: 'Confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords don\u2019t match',
                  })}
                />
              </Field>
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-slate-500 hover:text-slate-950"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              {isSubmitting
                ? 'Please wait...'
                : mode === 'login'
                ? 'Log in'
                : 'Create account'}
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            {mode === 'login' ? (
              <>
                New to the team?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="font-semibold text-slate-950 hover:underline"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have access?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="font-semibold text-slate-950 hover:underline"
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

function Field({ label, icon: Icon, error, trailing, children }) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-slate-400">
        {label}
      </label>
      <div
        className={`flex items-center gap-2.5 rounded-2xl border bg-white px-4 py-3 transition focus-within:border-slate-950 ${
          error ? 'border-red-300' : 'border-slate-200'
        }`}
      >
        <Icon className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.5} />
        {children}
        {trailing}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  )
}

// Placeholder — swap for your real auth call
async function mockAuth(data) {
  await new Promise((r) => setTimeout(r, 600))
  return data
}

export default TeamAuth
