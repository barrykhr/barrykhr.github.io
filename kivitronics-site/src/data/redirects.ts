/**
 * URL map from the previous multi-page architecture.
 *
 * The site is one page now, so every old route resolves to the section that
 * carries the nearest equivalent content. Old URLs stay live rather than 404,
 * which matters for anything already indexed or linked.
 */
export const redirects: { from: string; to: string }[] = [
  { from: '/solutions', to: '/#what-we-do' },
  { from: '/solutions/rpo', to: '/#what-we-do' },
  { from: '/solutions/it-recruitment', to: '/#what-we-do' },
  { from: '/solutions/non-it-recruitment', to: '/#what-we-do' },
  { from: '/solutions/global-recruitment', to: '/#what-we-do' },
  { from: '/solutions/talent-matching', to: '/#approach' },
  { from: '/solutions/talent-solutions', to: '/#what-we-do' },
  { from: '/what-we-do', to: '/#what-we-do' },
  { from: '/industries', to: '/#industries' },
  { from: '/how-we-work', to: '/#approach' },
  { from: '/proof', to: '/#approach' },
  { from: '/about', to: '/#every-size' },
  { from: '/insights', to: '/' },
  { from: '/careers', to: '/#contact' },
  { from: '/for-talent', to: '/#faq' },
  { from: '/contact', to: '/#contact' },
  { from: '/start-a-mandate', to: '/#contact' },
  { from: '/talk-to-us', to: '/#contact' },
]
