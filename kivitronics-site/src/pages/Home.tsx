import { Seo } from '@/components/Seo'
import { brand } from '@/data/content'
import { Hero } from '@/sections/Hero'
import { WhatWeDo } from '@/sections/WhatWeDo'
import { Industries } from '@/sections/Industries'
import { Approach } from '@/sections/Approach'
import { EverySize } from '@/sections/EverySize'
import { Faq } from '@/sections/Faq'
import { Contact } from '@/sections/Contact'

export function Home() {
  return (
    <>
      <Seo
        title={`${brand.fullName} — ${brand.tagline}`}
        description={brand.description}
        path="/"
      />
      <span id="top" />
      <Hero />
      <WhatWeDo />
      <Industries />
      <Approach />
      <EverySize />
      <Faq />
      <Contact />
    </>
  )
}
