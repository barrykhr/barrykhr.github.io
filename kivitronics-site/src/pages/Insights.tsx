import { Seo } from '@/components/Seo'
import { PageHero } from '@/components/PageHero'
import { insightCategories, insights } from '@/data/insights'
import { Badge, Container, Reveal, Section } from '@/components/primitives'
import { FinalCta } from '@/sections/FinalCta'

/**
 * The structure is real and CMS-ready; the articles are not written yet, so
 * each card carries an honest state rather than fabricated content. Add an
 * entry with status 'published' and a slug and it renders as a live card.
 */
export function Insights() {
  return (
    <>
      <Seo
        title="Insights — KiVitronics"
        description="Hiring intelligence, talent market insight and recruitment benchmarks drawn from live mandates."
        path="/insights"
      />
      <PageHero
        eyebrow="Insights"
        title="Hiring intelligence, drawn from live mandates."
        lede="Where processes break, how the market is actually behaving, and what separates an interview that converts from one that does not. Nothing is published until we have the evidence for it."
      />

      <Section tone="background">
        <Container width="wide">
          <Reveal>
            <ul className="flex flex-wrap gap-2">
              {insightCategories.map((c) => (
                <li key={c}>
                  <Badge>{c}</Badge>
                </li>
              ))}
            </ul>
          </Reveal>

          <ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {insights.map((item, i) => {
              const published = item.status === 'published' && item.slug
              const body = (
                <article className="flex h-full flex-col justify-between rounded-lg border border-border bg-surface p-6 transition-[border-color,box-shadow,transform] duration-[var(--duration-base)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md lg:p-7">
                  <div className="flex items-start justify-between gap-3">
                    <span className="label text-primary">{item.category}</span>
                    {!published && <Badge>Coming soon</Badge>}
                  </div>
                  <div className="mt-12">
                    <h2 className="text-h3 text-foreground">{item.title}</h2>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{item.standfirst}</p>
                  </div>
                </article>
              )
              return (
                <li key={item.id}>
                  <Reveal delay={(i % 3) * 70} className="h-full">
                    {published ? <a href={`/insights/${item.slug}`}>{body}</a> : body}
                  </Reveal>
                </li>
              )
            })}
          </ul>
        </Container>
      </Section>

      <FinalCta />
    </>
  )
}
