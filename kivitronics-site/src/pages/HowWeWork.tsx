import { Seo } from '@/components/Seo'
import { PageHero } from '@/components/PageHero'
import { ProcessTimeline } from '@/sections/ProcessTimeline'
import { QualificationModel } from '@/sections/QualificationModel'
import { ProtectingJourney } from '@/sections/ProtectingJourney'
import { AccountableHuman } from '@/sections/AccountableHuman'
import { InterviewPreparation } from '@/sections/InterviewPreparation'
import { ConversionToJoining } from '@/sections/ConversionToJoining'
import { FinalCta } from '@/sections/FinalCta'

export function HowWeWork() {
  return (
    <>
      <Seo
        title="How we work — KiVitronics Consulting"
        description="Nine stages under one accountable owner: requirement, map, source, qualify, submit, prepare, engage, offer, join. Five qualification dimensions and eight candidate touchpoints."
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
          { value: '8', label: 'Candidate touchpoints' },
          { value: '91%', label: 'Offer → joining' },
        ]}
      />
      <ProcessTimeline />
      <QualificationModel />
      <ProtectingJourney />
      <AccountableHuman />
      <InterviewPreparation />
      <ConversionToJoining />
      <FinalCta />
    </>
  )
}
