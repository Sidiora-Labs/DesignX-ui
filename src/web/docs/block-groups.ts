import { blocks, type BlockItem } from "./catalog";

/** Gallery categories, derived from the block slug so `catalog.ts` stays plain data. */
export type BlockGroupId =
  | "application"
  | "heroes"
  | "features"
  | "logos"
  | "stats"
  | "testimonials"
  | "team"
  | "pricing"
  | "faq"
  | "cta"
  | "footers";

const PREFIX: [string, BlockGroupId][] = [
  ["header-", "heroes"],
  ["features-", "features"],
  ["logo-cloud-", "logos"],
  ["stats-", "stats"],
  ["testimonials-", "testimonials"],
  ["team-", "team"],
  ["pricing-", "pricing"],
  ["faq-", "faq"],
  ["cta-", "cta"],
  ["footer-", "footers"],
];

export const blockGroupLabels: Record<BlockGroupId, string> = {
  application: "Application",
  heroes: "Heroes",
  features: "Features",
  logos: "Logo clouds",
  stats: "Stats",
  testimonials: "Testimonials",
  team: "Team",
  pricing: "Pricing",
  faq: "FAQ",
  cta: "Calls to action",
  footers: "Footers",
};

export function blockGroupOf(block: BlockItem): BlockGroupId {
  if ((block.category ?? "application") === "application") return "application";
  return PREFIX.find(([p]) => block.slug.startsWith(p))?.[1] ?? "application";
}

export const blockGroups = (Object.keys(blockGroupLabels) as BlockGroupId[])
  .map((id) => ({ id, label: blockGroupLabels[id], items: blocks.filter((b) => blockGroupOf(b) === id) }))
  .filter((g) => g.items.length > 0);

export const blockBySlug = Object.fromEntries(blocks.map((b) => [b.slug, b])) as Record<string, BlockItem>;
