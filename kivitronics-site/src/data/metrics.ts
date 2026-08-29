/**
 * Delivery metrics. Every figure here is drawn from the KiVitronics
 * positioning material. Do not add a metric without a source.
 */

export type Metric = {
  value: number
  display: string
  suffix?: string
  label: string
  note?: string
}

/** The four headline numbers used in the above-the-fold proof strip. */
export const headlineMetrics: Metric[] = [
  { value: 136, display: '136', label: 'Roles closed', note: 'Delivered to joining' },
  { value: 72, display: '72', suffix: '%', label: 'Mandates closed', note: 'Of mandates received' },
  { value: 91, display: '91', suffix: '%', label: 'Offer → joining', note: 'Offers that became hires' },
  { value: 60, display: '60', suffix: '%', label: 'Repeat clients', note: 'Came back with more work' },
]

/** The full delivery record, used on the Proof section and Proof page. */
export const deliveryMetrics: Metric[] = [
  { value: 136, display: '136', label: 'Roles closed' },
  { value: 72, display: '72', suffix: '%', label: 'Mandate closure' },
  { value: 91, display: '91', suffix: '%', label: 'Offer → joining' },
  { value: 60, display: '60', suffix: '%', label: 'Repeat client rate' },
  { value: 25, display: '25', label: 'Companies served' },
  { value: 15, display: '15', label: 'With more than one mandate' },
  {
    value: 65,
    display: '65',
    suffix: '+',
    label: 'Hires across our three deepest client relationships',
  },
]

export const timeToClose = [
  {
    range: '20–30',
    unit: 'days',
    label: 'Standard closure',
    detail: 'Tech and non-tech mandates.',
  },
  {
    range: '~45',
    unit: 'days',
    label: 'Niche and difficult hiring',
    detail: 'Scarce skills, narrow markets, senior briefs.',
  },
]
