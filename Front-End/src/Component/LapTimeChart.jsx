import React from 'react'

const moodColors = {
  Calm: '#10b981',
  Stressed: '#ef4444',
  Tired: '#f59e0b',
  Frustrated: '#ea580c',
  unknown: '#6b7280',
}

/**
 * Pure SVG lap-time chart with mood-colored markers.
 * No external charting library required.
 */
export default function LapTimeChart({ laps = [], messages = [] }) {
  if (laps.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02]">
        <p className="text-sm text-white/30">No lap data yet</p>
      </div>
    )
  }

  const times = laps.map((l) => l.lapTimeMs || l.data?.lapTimeMs || 0)
  const maxTime = Math.max(...times)
  const minTime = Math.min(...times)
  const range = maxTime - minTime || 1

  const chartW = 600
  const chartH = 200
  const padX = 40
  const padY = 20
  const plotW = chartW - padX * 2
  const plotH = chartH - padY * 2

  // Build points
  const points = times.map((t, i) => ({
    x: padX + (i / Math.max(1, times.length - 1)) * plotW,
    y: padY + (1 - (t - minTime) / range) * plotH,
    lap: laps[i],
    time: t,
  }))

  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ')

  // Find mood for each lap timestamp (nearest radio message before that lap)
  const getMoodForLap = (lap) => {
    const lapTime = new Date(lap.timestamp || lap.data?.timestamp).getTime()
    let nearest = null
    for (const msg of messages) {
      const msgTime = new Date(msg.createdAt || msg.timestamp).getTime()
      if (msgTime <= lapTime) {
        if (!nearest || msgTime > new Date(nearest.createdAt || nearest.timestamp).getTime()) {
          nearest = msg
        }
      }
    }
    return nearest?.mood || nearest?.data?.mood || 'unknown'
  }

  // Y-axis labels
  const yLabels = [minTime, minTime + range / 2, maxTime].map((v) => ({
    label: (v / 1000).toFixed(1) + 's',
    y: padY + (1 - (v - minTime) / range) * plotH,
  }))

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
          Lap Times vs. Stress
        </h3>
        {/* Legend */}
        <div className="flex items-center gap-3">
          {['Calm', 'Stressed', 'Tired', 'Frustrated'].map((m) => (
            <div key={m} className="flex items-center gap-1">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: moodColors[m] }}
              />
              <span className="text-[10px] text-white/40">{m}</span>
            </div>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {yLabels.map((yl, i) => (
          <g key={i}>
            <line
              x1={padX}
              y1={yl.y}
              x2={chartW - padX}
              y2={yl.y}
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="4 4"
            />
            <text
              x={padX - 6}
              y={yl.y + 3}
              textAnchor="end"
              fill="rgba(255,255,255,0.3)"
              fontSize="9"
              fontFamily="monospace"
            >
              {yl.label}
            </text>
          </g>
        ))}

        {/* Area fill under the line */}
        <polygon
          points={`${points[0].x},${padY + plotH} ${polyline} ${points[points.length - 1].x},${padY + plotH}`}
          fill="url(#areaGradient)"
        />

        {/* Line */}
        <polyline
          points={polyline}
          fill="none"
          stroke="#ff6a2c"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Mood-colored dots */}
        {points.map((p, i) => {
          const mood = getMoodForLap(laps[i])
          return (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r="5"
                fill={moodColors[mood]}
                stroke="#0a0503"
                strokeWidth="2"
              />
              {/* Lap number label */}
              <text
                x={p.x}
                y={padY + plotH + 14}
                textAnchor="middle"
                fill="rgba(255,255,255,0.3)"
                fontSize="8"
                fontFamily="monospace"
              >
                L{laps[i].lapNumber || laps[i].data?.lapNumber || i + 1}
              </text>
            </g>
          )
        })}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,106,44,0.15)" />
            <stop offset="100%" stopColor="rgba(255,106,44,0)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
