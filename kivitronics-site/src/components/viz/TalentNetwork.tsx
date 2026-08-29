import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/lib/hooks'

/**
 * Hero visual — a talent field resolving into a single hire.
 *
 * Five columns, each narrower than the last: market, sourced, qualified, offer,
 * joined. Nodes drift gently; a pulse travels the surviving path and lands on
 * the gold terminal node. It is the site's argument in one image: many people
 * considered, one person joining, and a continuous line between the two.
 *
 * Canvas rather than SVG: ~80 animated nodes at 60fps with no layout cost.
 * With `prefers-reduced-motion` the same composition renders once, statically.
 */

type Node = {
  x: number
  y: number
  /** Drift phase and amplitude, so the field breathes rather than jitters. */
  phase: number
  amp: number
  col: number
  survives: boolean
  r: number
}

const COLUMNS = [30, 18, 10, 5, 1]
const COL_X = [0.07, 0.3, 0.52, 0.74, 0.93]

const INK = '#0B0F14'
const GOLD = '#C8A84E'
const COBALT = '#4D6FFF'

export function TalentNetwork({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let nodes: Node[] = []
    let raf = 0
    let start = performance.now()

    /** Deterministic pseudo-random so the composition is stable across reloads. */
    let seed = 20241112
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296
      return seed / 4294967296
    }

    function build() {
      seed = 20241112
      nodes = []
      COLUMNS.forEach((count, col) => {
        const x = COL_X[col] * width
        for (let i = 0; i < count; i++) {
          // Later columns cluster toward the centre — the funnel narrowing.
          const spread = 0.92 - col * 0.17
          const t = count === 1 ? 0.5 : i / (count - 1)
          const jitter = (rand() - 0.5) * (col === 0 ? 0.1 : 0.05)
          const y = (0.5 + (t - 0.5) * spread + jitter) * height
          nodes.push({
            x,
            y,
            phase: rand() * Math.PI * 2,
            amp: col === 0 ? 5 + rand() * 5 : 3 + rand() * 3,
            col,
            // Only a slice of each column carries forward.
            survives: i % Math.max(2, Math.round(count / (COLUMNS[col + 1] ?? 1))) === 0,
            r: col === 4 ? 6 : col === 3 ? 3.6 : 2.4 + rand() * 1.1,
          })
        }
      })
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      build()
    }

    function drift(node: Node, time: number) {
      if (reduced) return { x: node.x, y: node.y }
      return {
        x: node.x + Math.cos(time * 0.00022 + node.phase) * node.amp * 0.55,
        y: node.y + Math.sin(time * 0.00028 + node.phase) * node.amp,
      }
    }

    function draw(now: number) {
      // rAF can hand back a timestamp from just before `start` was recorded.
      const time = Math.max(0, now - start)
      ctx!.clearRect(0, 0, width, height)

      const positions = nodes.map((n) => ({ node: n, ...drift(n, time) }))
      const byCol = COLUMNS.map((_, col) => positions.filter((p) => p.node.col === col))

      // --- Links: every node reaches forward, survivors more brightly.
      for (let col = 0; col < COLUMNS.length - 1; col++) {
        const from = byCol[col]
        const to = byCol[col + 1]
        from.forEach((a, i) => {
          const b = to[i % to.length]
          const alive = a.node.survives
          ctx!.beginPath()
          ctx!.moveTo(a.x, a.y)
          const midX = (a.x + b.x) / 2
          ctx!.bezierCurveTo(midX, a.y, midX, b.y, b.x, b.y)
          ctx!.strokeStyle = alive
            ? `rgba(200,168,78,${0.16 + col * 0.05})`
            : `rgba(104,117,138,${0.09 - col * 0.012})`
          ctx!.lineWidth = alive ? 0.9 : 0.6
          ctx!.stroke()
        })
      }

      // --- Travelling pulse along one surviving path per cycle.
      if (!reduced) {
        const cycle = 5200
        const t = ((time % cycle) / cycle) * (COLUMNS.length - 1)
        const seg = Math.min(Math.floor(t), COLUMNS.length - 2)
        const local = t - seg
        const from = (byCol[seg] ?? []).filter((p) => p.node.survives)
        const to = byCol[seg + 1] ?? []
        const pick = Math.floor((time / cycle) % Math.max(from.length, 1))
        const a = from[pick % Math.max(from.length, 1)] ?? byCol[seg][0]
        const b = to[pick % to.length]
        if (a && b && to.length > 0) {
          const midX = (a.x + b.x) / 2
          const u = local
          const inv = 1 - u
          const px =
            inv * inv * inv * a.x + 3 * inv * inv * u * midX + 3 * inv * u * u * midX + u * u * u * b.x
          const py =
            inv * inv * inv * a.y + 3 * inv * inv * u * a.y + 3 * inv * u * u * b.y + u * u * u * b.y
          const glow = ctx!.createRadialGradient(px, py, 0, px, py, 26)
          glow.addColorStop(0, 'rgba(77,111,255,0.55)')
          glow.addColorStop(1, 'rgba(77,111,255,0)')
          ctx!.fillStyle = glow
          ctx!.beginPath()
          ctx!.arc(px, py, 26, 0, Math.PI * 2)
          ctx!.fill()
          ctx!.fillStyle = COBALT
          ctx!.beginPath()
          ctx!.arc(px, py, 2.6, 0, Math.PI * 2)
          ctx!.fill()
        }
      }

      // --- Nodes.
      positions.forEach(({ node, x, y }) => {
        const terminal = node.col === COLUMNS.length - 1
        if (terminal) {
          const halo = ctx!.createRadialGradient(x, y, 0, x, y, 40)
          halo.addColorStop(0, 'rgba(200,168,78,0.34)')
          halo.addColorStop(1, 'rgba(200,168,78,0)')
          ctx!.fillStyle = halo
          ctx!.beginPath()
          ctx!.arc(x, y, 40, 0, Math.PI * 2)
          ctx!.fill()
        }
        ctx!.beginPath()
        ctx!.arc(x, y, node.r, 0, Math.PI * 2)
        if (terminal) ctx!.fillStyle = GOLD
        else if (node.survives) ctx!.fillStyle = `rgba(200,168,78,${0.35 + node.col * 0.14})`
        else ctx!.fillStyle = `rgba(104,117,138,${0.42 - node.col * 0.05})`
        ctx!.fill()

        if (terminal) {
          ctx!.beginPath()
          ctx!.arc(x, y, node.r + 7, 0, Math.PI * 2)
          ctx!.strokeStyle = 'rgba(200,168,78,0.4)'
          ctx!.lineWidth = 1
          ctx!.stroke()
        }
      })

      if (!reduced) raf = requestAnimationFrame(draw)
    }

    const observer = new ResizeObserver(() => {
      resize()
      if (reduced) draw(performance.now())
    })
    observer.observe(canvas)

    resize()
    start = performance.now()
    if (reduced) draw(start)
    else raf = requestAnimationFrame(draw)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        role="img"
        aria-label="A field of candidates narrowing across five stages — market, sourced, qualified, offer — to a single highlighted node representing the person who joins."
        style={{ background: INK }}
      />
    </div>
  )
}
