import { esc } from './components/ui.js';
import { site } from './content.js';

/** Only verified facts go into structured data. */
const jsonLd = () =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    description: site.description,
    slogan: 'Talent, in motion.',
  });

export const document = ({ body, css, js }) => `<!doctype html>
<html lang="${esc(site.locale)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(site.title)}</title>
<meta name="description" content="${esc(site.description)}">
<meta name="theme-color" content="${esc(site.themeColor)}">
<link rel="canonical" href="${esc(site.canonical)}">

<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(site.title)}">
<meta property="og:description" content="${esc(site.description)}">
<meta property="og:url" content="${esc(site.canonical)}">
<meta property="og:image" content="${esc(site.canonical + site.ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="KiVitronics — Talent, in motion.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(site.title)}">
<meta name="twitter:description" content="${esc(site.description)}">
<meta name="twitter:image" content="${esc(site.canonical + site.ogImage)}">

<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/favicon.svg">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" media="print" onload="this.media='all'">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap" media="print" onload="this.media='all'">
<noscript>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap">
</noscript>

<link rel="stylesheet" href="${esc(css)}">
<script>document.documentElement.classList.add('js');</script>
<script type="application/ld+json">${jsonLd()}</script>
</head>
<body>
${body}
<script src="${esc(js)}" defer></script>
</body>
</html>
`;
