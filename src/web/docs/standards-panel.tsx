import type { CatalogItem } from "./catalog";
import { modernGuidanceDocs, standardsForItem } from "./standards";

export function StandardsPanel({ item }: { item: CatalogItem }) {
  const areas = standardsForItem(item);
  return (
    <section id="standards" className="not-prose mt-16 rounded-3xl border border-hairline bg-tile/60 p-6 sm:p-8" aria-labelledby="standards-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-code text-[11px] tracking-[0.06em] text-faint uppercase">Modern Web Guidance</p>
          <h2 id="standards-title" className="mt-2 text-2xl font-bold tracking-[-0.025em] text-ink">Standards checklist</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-pencil">
            These checks apply to {item.title} as shipped. They are distilled from the cross-browser guidance maintained by Chrome, Edge,
            Firefox, MDN, and the web community.
          </p>
        </div>
        <a className="site-focus rounded-md text-sm text-ink underline decoration-divider underline-offset-4 hover:decoration-ink" href={modernGuidanceDocs} target="_blank" rel="noreferrer">
          Read the guidance ↗
        </a>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {areas.map((area) => (
          <article key={area.id} className="rounded-2xl border border-hairline bg-canvas/70 p-5">
            <h3 className="text-base font-semibold text-ink">{area.label}</h3>
            <p className="mt-2 text-sm leading-relaxed text-pencil">{area.summary}</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-pencil">
              {area.checks.map((check) => <li key={check}>{check}</li>)}
            </ul>
            <a className="site-focus mt-4 inline-block rounded-sm text-xs text-ink underline decoration-divider underline-offset-4 hover:decoration-ink" href={area.source} target="_blank" rel="noreferrer">
              Open {area.label.toLowerCase()} source
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
