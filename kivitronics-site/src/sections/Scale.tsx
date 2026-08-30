import { reach, timeToClose } from '@/data/metrics'
import { Container, Reveal, Section } from '@/components/primitives'
import { ReachField } from '@/components/viz/ReachField'

/**
 * The one section where reach and delivery sit on the same screen — so the
 * copy is explicit that they are different kinds of claim.
 */
export function Scale() {
  return (
    <Section tone="canvas" id="scale">
      <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-0 opacity-40" />
      <Container width="wide" className="relative">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-20">
          <div>
            <Reveal>
              <p className="label flex items-center gap-2.5 text-primary-light">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
                Scale
              </p>
            </Reveal>

            <Reveal delay={70}>
              <p className="tnum mt-8 text-metric font-medium text-canvas-fg">
                {reach.network.display}
                <span className="text-primary-light">{reach.network.suffix}</span>
              </p>
            </Reveal>

            <Reveal delay={110}>
              <p className="mt-5 max-w-[34ch] text-h3 text-canvas-fg">{reach.network.label}</p>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-5 max-w-[46ch] text-[0.9375rem] leading-relaxed text-canvas-muted">
                {reach.note} What that reach converts into is on the right — measured, and measured
                at joining.
              </p>
            </Reveal>

            <Reveal delay={210}>
              <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-canvas-line pt-8">
                {timeToClose.map((t) => (
                  <div key={t.label}>
                    <dt className="sr-only">{t.label}</dt>
                    <dd>
                      <p className="tnum text-[1.75rem] leading-none font-medium text-canvas-fg">
                        {t.range}
                        <span className="ml-1.5 text-[0.8125rem] font-normal text-primary-light">
                          {t.unit}
                        </span>
                      </p>
                      <p className="mt-2.5 text-[0.8125rem] text-canvas-muted">{t.label}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="rounded-xl border border-canvas-line bg-canvas-2 p-5 lg:p-7">
              <div className="flex items-center justify-between">
                <p className="label text-canvas-faint">Markets served</p>
                <p className="label text-canvas-faint">Delivery network</p>
              </div>

              <ReachField className="mt-5" />

              <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-canvas-line pt-6">
                {[
                  { v: '136', l: 'Roles closed' },
                  { v: '91%', l: 'Offer to joining' },
                  { v: '25', l: 'Companies served' },
                ].map((s) => (
                  <div key={s.l} className="rounded-md border border-canvas-line bg-canvas-3 px-3 py-3">
                    <dt className="sr-only">{s.l}</dt>
                    <dd>
                      <p className="tnum text-[1.25rem] leading-none font-medium text-canvas-fg">{s.v}</p>
                      <p className="mt-2 text-[0.6875rem] leading-tight text-canvas-muted">{s.l}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
