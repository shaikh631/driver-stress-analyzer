import React, { useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'

function DriverAccessModal({ isOpen, onClose, onSuccess }) {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      digits: Array(6).fill(''),
    },
  })

  const inputRefs = useRef([])

  useEffect(() => {
    if (!isOpen) return

    reset({ digits: Array(6).fill('') })
    const focusTimer = window.setTimeout(() => inputRefs.current[0]?.focus(), 50)

    return () => window.clearTimeout(focusTimer)
  }, [isOpen, reset])

  if (!isOpen) return null

  const onSubmit = async (data) => {
    const code = data.digits.join('').toUpperCase()

    if (code.length !== 6) {
      setError('digits', { message: 'Enter all 6 characters' })
      return
    }

    try {
      const res = await fetch('/api/driver/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pairingToken: code, driverName: 'Driver' }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Verification failed')
      }

      // Store driver session for subsequent API calls
      localStorage.setItem('driverSession', JSON.stringify({
        sessionId: result.driverSessionId,
        driverId: result.driverId,
        teamName: result.teamName,
      }))

      onSuccess()
    } catch (error) {
      setError('digits', {
        message: error.message || 'Verification failed',
      })
    }
  }

  const handlePaste = (event, onChangeAll) => {
    const pasted = event.clipboardData.getData('text').replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6)

    if (!pasted) return

    event.preventDefault()
    const nextDigits = Array(6).fill('')
    pasted.split('').forEach((digit, index) => {
      nextDigits[index] = digit
    })
    onChangeAll(nextDigits)
    inputRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-zinc-800 bg-[#111111] p-6 text-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-600" />
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-red-400">
            Driver verification
          </span>
        </div>

        <h2 className="mt-4 text-2xl font-black">Enter Driver Access Code</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Use the 6-character team pairing code to open the driver protocol.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="digits"
            control={control}
            rules={{
              validate: (value) => value.join('').length === 6 || 'Enter all 6 characters',
            }}
            render={({ field }) => (
              <div
                className="mt-6 flex justify-between gap-2"
                onPaste={(event) => handlePaste(event, field.onChange)}
              >
                {field.value.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      inputRefs.current[index] = element
                    }}
                    type="text"
                    inputMode="text"
                    maxLength={1}
                    value={digit}
                    onChange={(event) => {
                      const value = event.target.value.toUpperCase()
                      if (!/^[A-Z0-9]?$/.test(value)) return

                      const nextDigits = [...field.value]
                      nextDigits[index] = value
                      field.onChange(nextDigits)

                      if (value && index < 5) {
                        inputRefs.current[index + 1]?.focus()
                      }
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Backspace' && !field.value[index] && index > 0) {
                        inputRefs.current[index - 1]?.focus()
                      }
                    }}
                    className="h-12 w-10 rounded border border-zinc-700 bg-black text-center text-lg font-bold text-white uppercase outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/30 sm:w-12"
                  />
                ))}
              </div>
            )}
          />

          {errors.digits && (
            <p className="mt-3 text-sm font-medium text-red-400">{errors.digits.message}</p>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded border border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DriverAccessModal
