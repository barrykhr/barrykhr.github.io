import { Seo } from '@/components/Seo'
import { Hero } from '@/sections/Hero'
import { MetricStrip } from '@/sections/MetricStrip'
import { ProblemFunnel } from '@/sections/ProblemFunnel'
import { Beliefs } from '@/sections/Beliefs'
import { ProcessTimeline } from '@/sections/ProcessTimeline'
import { QualificationModel } from '@/sections/QualificationModel'
import { ProofOfDelivery } from '@/sections/ProofOfDelivery'
import { ClientRelationships } from '@/sections/ClientRelationships'
import { ProtectingJourney } from '@/sections/ProtectingJourney'
import { AccountableHuman } from '@/sections/AccountableHuman'
import { InterviewPreparation } from '@/sections/InterviewPreparation'
import { ConversionToJoining } from '@/sections/ConversionToJoining'
import { TechnologyVision } from '@/sections/TechnologyVision'
import { Insights } from '@/sections/Insights'
import { AboutSection } from '@/sections/AboutSection'
import { FinalCta } from '@/sections/FinalCta'

/**
 * The homepage is one argument told in order: the promise, the proof, the
 * problem, the belief, the model, the evidence, the human, the roadmap, the ask.
 */
export function Home() {
  return (
    <>
      <Seo
        title="KiVitronics Consulting — The right talent. Properly qualified. Personally managed."
        description="A specialist recruitment consultancy that owns the hiring outcome from requirement to joining. 136 roles closed, 72% mandate closure, 91% offer-to-joining conversion."
        path="/"
      />
      <Hero />
      <MetricStrip />
      <ProblemFunnel />
      <Beliefs />
      <ProcessTimeline />
      <QualificationModel />
      <ProofOfDelivery />
      <ClientRelationships />
      <ProtectingJourney />
      <AccountableHuman />
      <InterviewPreparation />
      <ConversionToJoining />
      <TechnologyVision />
      <Insights limit={3} />
      <AboutSection />
      <FinalCta />
    </>
  )
}
