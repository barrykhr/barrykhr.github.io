import { Seo } from '@/components/Seo'
import { PageHero } from '@/components/PageHero'
import { ProofOfDelivery } from '@/sections/ProofOfDelivery'
import { ConversionToJoining } from '@/sections/ConversionToJoining'
import { ClientRelationships } from '@/sections/ClientRelationships'
import { FinalCta } from '@/sections/FinalCta'

export function Proof() {
  return (
    <>
      <Seo
        title="Proof — KiVitronics Consulting"
        description="136 roles closed. 72% mandate closure. 91% offer-to-joining conversion. 60% repeat-client rate across 25 companies served."
        path="/proof"
      />
      <PageHero
        eyebrow="Proof"
        title={
          <>
            Measured at joining,
            <span className="text-ivory/45"> not at submission.</span>
          </>
        }
        lede="Activity metrics are easy to publish and easy to inflate. These are the numbers that only exist if the person actually started."
        figures={[
          { value: '136', label: 'Roles closed' },
          { value: '25', label: 'Companies served' },
          { value: '15', label: 'Gave more than one mandate' },
          { value: '65+', label: 'Hires across three relationships' },
        ]}
      />
      <ProofOfDelivery />
      <ConversionToJoining />
      <ClientRelationships />
      <FinalCta />
    </>
  )
}
