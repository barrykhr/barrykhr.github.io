/**
 * Two different kinds of claim, deliberately kept apart.
 *
 * `delivery*` — outcomes we have produced. Every figure traces to the
 *   KiVitronics delivery record.
 * `reach*` — the size of the network we search. This is capability, not
 *   performance, and the UI never presents it alongside delivery figures as
 *   though it were one.
 */

export type Metric = {
  value: number
  display: string
  prefix?: string
  suffix?: string
  label: string
  note?: string
}

/** Above the fold. Outcomes only. */
export const headlineMetrics: Metric[] = [
  { value: 136, display: '136', label: 'Roles closed', note: 'Measured at joining' },
  { value: 91, display: '91', suffix: '%', label: 'Offer to joining', note: 'Offers that became hires' },
  { value: 72, display: '72', suffix: '%', label: 'Mandate closure', note: 'Of mandates accepted' },
  { value: 60, display: '60', suffix: '%', label: 'Repeat clients', note: 'Returned with more work' },
]

export const deliveryMetrics: Metric[] = [
  { value: 136, display: '136', label: 'Roles closed' },
  { value: 72, display: '72', suffix: '%', label: 'Mandate closure' },
  { value: 91, display: '91', suffix: '%', label: 'Offer to joining' },
  { value: 60, display: '60', suffix: '%', label: 'Repeat client rate' },
  { value: 25, display: '25', label: 'Companies served' },
  { value: 15, display: '15', label: 'Issued more than one mandate' },
  { value: 65, display: '65', suffix: '+', label: 'Hires across our three deepest accounts' },
]

/** Network reach — how wide the search is, not what it has produced. */
export const reach = {
  network: { value: 500, display: '500', suffix: 'K+', label: 'Professionals in our IT and non-IT network' },
  markets: [
    { code: 'US', name: 'United States', note: 'Client-side hiring and delivery' },
    { code: 'IN', name: 'India', note: 'Delivery team and talent market' },
  ],
  note: 'Network reach describes the market we can search. It is not a delivery statistic.',
}

export const timeToClose = [
  { range: '20–30', unit: 'days', label: 'Standard closure', detail: 'IT and non-IT mandates.' },
  { range: '~45', unit: 'days', label: 'Niche and scarce skills', detail: 'Narrow markets, senior briefs.' },
]
