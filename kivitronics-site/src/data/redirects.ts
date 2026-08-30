/**
 * URL map from the previous information architecture.
 *
 * Old URLs stay live and 301-equivalent (client-side `Navigate replace`) so
 * nothing already indexed or linked breaks. Remove an entry only once the old
 * URL has genuinely dropped out of search results and backlinks.
 */
export const redirects: { from: string; to: string }[] = [
  { from: '/what-we-do', to: '/solutions' },
  { from: '/proof', to: '/how-we-work#record' },
  { from: '/start-a-mandate', to: '/contact' },
  { from: '/talk-to-us', to: '/contact' },
  { from: '/solutions/talent-solutions', to: '/solutions/talent-matching' },
]
