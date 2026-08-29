import { Seo } from '@/components/Seo'
import { PageHero } from '@/components/PageHero'
import { ProcessTimeline } from '@/sections/ProcessTimeline'
import { QualificationModel } from '@/sections/QualificationModel'
import { AccountableHuman } from '@/sections/AccountableHuman'
import { FinalCta } from '@/sections/FinalCta'

export function HowWeWork() {
  return (
    <>
      <Seo
        title="How we work — KiVitronics Consulting"
        description="Nine stages under one accountable owner: requirement, map, source, qualify, submit, prepare, engage, offer, join — plus the five dimensions every candidate is qualified against."
        path="/how-we-work"
      />
      <PageHero
        eyebrow="How we work"
        title={
          <>
            Nine stages.
            <span className="block text-ivory/45">One owner.</span>
          </>
        }
        lede="Most recruitment breaks at the handovers — between sourcing and submission, between interview and offer, between acceptance and joining. Our operating model removes the handovers rather than managing them."
        figures={[
          { value: '9', label: 'Stages, one owner' },
          { value: '5', label: 'Qualification dimensions' },
          { value: '20–30', label: 'Days, standard closure' },
          { value: '72%', label: 'Mandate closure' },
        ]}
      />
      <ProcessTimeline />
      <QualificationModel />
      <AccountableHuman />
      <FinalCta />
    </>
  )
}
