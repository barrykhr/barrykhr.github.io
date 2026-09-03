import { navbar, rail } from './sections/nav.js';
import { heroSection } from './sections/hero.js';
import { proofSection } from './sections/proof.js';
import { problemSection } from './sections/problem.js';
import { modelSection } from './sections/model.js';
import { qualificationSection } from './sections/qualification.js';
import { journeySection } from './sections/journey.js';
import { solutionsSection } from './sections/solutions.js';
import { clientsSection } from './sections/clients.js';
import { intelligenceSection } from './sections/intelligence.js';
import { faqSection } from './sections/faq.js';
import { contactSection } from './sections/contact.js';

/**
 * The homepage is one continuous story, ordered so each section answers the
 * question the previous one raises:
 *   motion → proof → the gap → the model → how fit is judged →
 *   what candidates get → what we take on → who came back → where it goes.
 */
export const homepage = () =>
  [
    navbar(),
    rail(),
    '<main id="main">',
    heroSection(),
    proofSection(),
    problemSection(),
    modelSection(),
    qualificationSection(),
    journeySection(),
    solutionsSection(),
    clientsSection(),
    intelligenceSection(),
    faqSection(),
    '</main>',
    contactSection(),
  ].join('\n');
