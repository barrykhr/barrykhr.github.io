import { useMemo } from 'react'
import { usePrefersReducedMotion } from '@/lib/hooks'

/**
 * The two markets we actually work in, drawn as a network rather than a map —
 * a map would imply offices and coverage we have not claimed. The dot field is
 * the searchable network; the two rings are the markets; the arcs are the
 * delivery relationship between them.
 */

const COLS = 26
const ROWS = 12
const CELL = 22

const US = { col: 5, row: 4 }
const IN = { col: 19, row: 7 }

export function ReachField({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()

  const dots = useMemo(() => {
    // Deterministic pseudo-random so the field never reshuffles between renders.
    let seed = 8123
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296
      return seed / 4294967296
    }
    const out: { x: number; y: number; o: number }[] = []
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const dUS = Math.hypot(c - US.col, (r - US.row) * 1.6)
        const dIN = Math.hypot(c - IN.col, (r - IN.row) * 1.6)
        const near = Math.min(dUS, dIN)
        // Density falls off away from the two markets.
        const o = Math.max(0.06, 0.5 - near * 0.045) * (0.6 + rand() * 0.7)
        out.push({ x: c * CELL + CELL / 2, y: r * CELL + CELL / 2, o: Math.min(o, 0.6) })
      }
    }
    return out
  }, [])

  const w = COLS * CELL
  const h = ROWS * CELL
  const ux = US.col * CELL + CELL / 2
  const uy = US.row * CELL + CELL / 2
  const ix = IN.col * CELL + CELL / 2
  const iy = IN.row * CELL + CELL / 2

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full"
        role="img"
        aria-label="A network field with two highlighted markets — the United States and India — connected by delivery routes."
      >
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={1.5} fill="#A0A5AE" opacity={d.o} />
        ))}

        {/* delivery routes */}
        <path
          d={`M ${ux} ${uy} C ${ux + 90} ${uy - 60}, ${ix - 90} ${iy - 70}, ${ix} ${iy}`}
          fill="none"
          stroke="#1F45E0"
          strokeWidth="1.4"
          strokeDasharray="4 6"
          className={reduced ? undefined : 'dash-flow'}
          opacity="0.9"
        />
        <path
          d={`M ${ux} ${uy} C ${ux + 70} ${uy + 70}, ${ix - 70} ${iy + 60}, ${ix} ${iy}`}
          fill="none"
          stroke="#4FD1BC"
          strokeWidth="1.1"
          strokeDasharray="3 7"
          className={reduced ? undefined : 'dash-flow'}
          opacity="0.5"
        />

        {[
          { x: ux, y: uy, label: 'United States', color: '#1F45E0' },
          { x: ix, y: iy, label: 'India', color: '#4FD1BC' },
        ].map((node) => (
          <g key={node.label}>
            <circle cx={node.x} cy={node.y} r="16" fill={node.color} opacity="0.12" />
            <circle cx={node.x} cy={node.y} r="16" fill="none" stroke={node.color} strokeWidth="1" opacity="0.4" />
            <circle cx={node.x} cy={node.y} r="4.5" fill={node.color} />
            <text
              x={node.x}
              y={node.y - 26}
              textAnchor="middle"
              fill="#F7F7F6"
              style={{ fontSize: 11, fontWeight: 500, letterSpacing: '-0.01em' }}
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
