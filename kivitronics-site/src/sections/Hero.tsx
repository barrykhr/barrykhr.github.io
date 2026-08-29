import { brand, cta } from '@/data/site'
import { ButtonLink, Container, Reveal } from '@/components/primitives'
import { TalentNetwork } from '@/components/viz/TalentNetwork'

const stageLegend = ['Market', 'Sourced', 'Qualified', 'Offer', 'Joined']

export function Hero() {
  return (
    <section className="on-ink relative isolate overflow-hidden bg-ink text-ivory">
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />

      <Container width="wide" className="relative pt-[7.5rem] pb-[clamp(3rem,2rem+4vw,6rem)] lg:pt-[10rem]">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* ---- Statement ---- */}
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow flex items-center gap-3 text-gold">
                <span aria-hidden="true" className="h-px w-8 bg-gold/70" />
                Specialist recruitment consultancy
              </p>
            </Reveal>

            <h1 className="mt-8 text-d1 font-semibold text-ivory">
              {brand.promise.map((line, i) => (
                <Reveal key={line} as="span" delay={80 + i * 90} className="block">
                  {i === 2 ? (
                    <>
                      Personally <span className="text-gold">managed.</span>
                    </>
                  ) : (
                    line
                  )}
                </Reveal>
              ))}
            </h1>

            <Reveal delay={380}>
              <p className="mt-9 max-w-[52ch] text-lede text-ivory/64">
                Recruitment built around quality, accountability and successful joining. We don’t
                just send candidates — we take responsibility for the hiring journey.
              </p>
            </Reveal>

            <Reveal delay={460}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink to={cta.primary.href} variant="gold">
                  {cta.primary.label}
                </ButtonLink>
                <ButtonLink to="/how-we-work" variant="ghost-dark">
                  See how we work
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          {/* ---- Talent network ---- */}
          <div className="lg:col-span-5">
            <Reveal delay={220}>
              <figure className="relative">
                <div className="relative overflow-hidden border border-ivory/12">
                  <TalentNetwork className="h-[280px] w-full sm:h-[360px] lg:h-[440px] xl:h-[500px]" />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_0%_50%,transparent_40%,rgba(11,15,20,0.55)_100%)]"
                  />
                </div>
                <figcaption className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                  {stageLegend.map((label, i) => (
                    <span
                      key={label}
                      className="flex items-center gap-2 text-[0.6875rem] font-medium tracking-[0.12em] text-ivory/55 uppercase"
                    >
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          background:
                            i === stageLegend.length - 1
                              ? '#C8A84E'
                              : `rgba(200,168,78,${0.3 + i * 0.15})`,
                        }}
                      />
                      {label}
                    </span>
                  ))}
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
