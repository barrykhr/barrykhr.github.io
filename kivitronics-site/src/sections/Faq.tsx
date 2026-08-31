import { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { cx } from "@/lib/cx";
import { faqCategories } from "@/data/faqs";
import {
  ArrowRight,
  Container,
  Reveal,
  Section,
  SectionHeading,
} from "@/components/primitives";

/**
 * FAQ — two categories, ten questions each.
 *
 * Both tabpanels stay in the DOM (the inactive one carries `hidden`) and every
 * answer stays in the DOM when collapsed, so the whole set is crawlable rather
 * than only whichever tab happens to be open. Collapsed answers are `inert`, so
 * they are neither focusable nor announced while closed.
 */

function PlusMinus({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface transition-[background-color,border-color] duration-[var(--duration-fast)] group-hover:border-border-strong group-hover:bg-surface-2"
    >
      <span className="absolute h-px w-3.5 bg-foreground" />
      <span
        className={cx(
          "absolute h-3.5 w-px bg-foreground transition-transform duration-[240ms] ease-[var(--ease-out)]",
          open && "rotate-90",
        )}
      />
    </span>
  );
}

export function Faq() {
  const [active, setActive] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function selectTab(next: number) {
    setActive(next);
    setOpenId(null); // a question left open under the other tab reads as a glitch
  }

  function onTabKeyDown(e: React.KeyboardEvent) {
    const last = faqCategories.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next !== null) {
      e.preventDefault();
      selectTab(next);
      tabRefs.current[next]?.focus();
    }
  }

  return (
    <Section tone="surface" id="faq">
      <Container>
        <div className="max-w-[60rem]">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions, answered."
            lede="Whether you’re building a team or looking for your next opportunity, here’s what you need to know about working with KiVitronics."
          />

          {/* ── Category switch ── */}
          <Reveal delay={140}>
            <div
              role="tablist"
              aria-label="FAQ categories"
              onKeyDown={onTabKeyDown}
              className="mt-10 inline-flex rounded-lg border border-border bg-surface-2 p-1"
            >
              {faqCategories.map((c, i) => {
                const selected = i === active;
                return (
                  <button
                    key={c.id}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    role="tab"
                    id={`${baseId}-tab-${c.id}`}
                    aria-selected={selected}
                    aria-controls={`${baseId}-panel-${c.id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => selectTab(i)}
                    className={cx(
                      "min-h-11 rounded-md px-6 text-[0.875rem] font-medium transition-[background-color,color,box-shadow] duration-[var(--duration-fast)]",
                      selected
                        ? "bg-primary text-white shadow-xs"
                        : "text-muted-strong hover:text-foreground",
                    )}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* ── Panels: both rendered so every answer stays crawlable ── */}
          {faqCategories.map((c, ci) => {
            const isActivePanel = ci === active;
            return (
              <div
                key={c.id}
                role="tabpanel"
                id={`${baseId}-panel-${c.id}`}
                aria-labelledby={`${baseId}-tab-${c.id}`}
                hidden={!isActivePanel}
                className="mt-10"
              >
                <dl className="border-t border-border">
                  {c.items.map((item, i) => {
                    const id = `${c.id}-${i}`;
                    const open = openId === id;
                    return (
                      <div
                        key={item.q}
                        className={cx(
                          "border-b border-border transition-colors duration-[var(--duration-base)]",
                          open && "bg-background",
                        )}
                      >
                        <dt>
                          <button
                            type="button"
                            aria-expanded={open}
                            aria-controls={`${baseId}-answer-${id}`}
                            id={`${baseId}-question-${id}`}
                            onClick={() => setOpenId(open ? null : id)}
                            className="group flex w-full items-center gap-4 py-5 text-left sm:gap-6 sm:py-6"
                          >
                            <span
                              className={cx(
                                "label tnum hidden w-8 shrink-0 transition-colors duration-[var(--duration-fast)] sm:block",
                                open ? "text-primary" : "text-faint",
                              )}
                            >
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span
                              className={cx(
                                "flex-1 text-[1rem] leading-snug font-medium transition-colors duration-[var(--duration-fast)] sm:text-[1.0625rem]",
                                open ? "text-primary" : "text-foreground",
                              )}
                            >
                              {item.q}
                            </span>
                            <PlusMinus open={open} />
                          </button>
                        </dt>

                        <dd
                          id={`${baseId}-answer-${id}`}
                          role="region"
                          aria-labelledby={`${baseId}-question-${id}`}
                          inert={!open}
                          className={cx(
                            "grid transition-[grid-template-rows] duration-[240ms] ease-[var(--ease-out)]",
                            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                          )}
                        >
                          <div className="overflow-hidden">
                            <p className="max-w-[68ch] pr-12 pb-6 text-[0.9375rem] leading-relaxed text-muted sm:pl-14">
                              {item.a}
                            </p>
                          </div>
                        </dd>
                      </div>
                    );
                  })}
                </dl>

                {/* ── Contextual CTA ── */}
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[0.9375rem] text-muted">{c.cta.prompt}</p>
                  <Link
                    to={c.cta.href}
                    className="group inline-flex min-h-11 items-center gap-2 self-start text-[0.9375rem] font-medium text-primary sm:self-auto"
                  >
                    {c.cta.label}
                    <ArrowRight />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
