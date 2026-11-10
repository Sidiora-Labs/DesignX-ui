import { blocks, catalog, groupLabels, guides } from "./catalog";

export type NavLink = { title: string; href: string; isNew?: boolean };
export type NavSection = { title: string; items: NavLink[] };

export const docsNav: NavSection[] = [
  { title: "Getting started", items: guides.map((g) => ({ title: g.title, href: g.slug === "introduction" ? "/docs" : `/docs/${g.slug}` })) },
  {
    title: "Browse",
    items: [
      { title: "All components", href: "/docs/components" },
      { title: "Blocks", href: "/blocks" },
      { title: "Theme generator", href: "/themes" },
    ],
  },
  {
    title: "Components",
    items: catalog
      .filter((c) => c.group === "ui")
      .map((c) => ({ title: c.title, href: `/docs/components/${c.slug}` }))
      .sort((a, b) => a.title.localeCompare(b.title)),
  },
  {
    title: "DX Motion",
    items: catalog.filter((c) => c.group === "dx").map((c) => ({ title: c.title, href: `/docs/components/${c.slug}`, isNew: true })),
  },
  ...(["agents", "charts", "trading", "motion", "text", "transitions", "effects", "elements"] as const).map((g) => ({
    title: groupLabels[g],
    items: catalog
      .filter((c) => c.group === g)
      .map((c) => ({ title: c.title, href: `/docs/components/${c.slug}` }))
      .sort((a, b) => a.title.localeCompare(b.title)),
  })),
];

export const mainNav: NavLink[] = [
  { title: "Docs", href: "/docs" },
  { title: "Components", href: "/docs/components" },
  { title: "Blocks", href: "/blocks" },
  { title: "Themes", href: "/themes" },
];

export const blockNav = blocks.map((b) => ({ title: b.title, href: `/blocks/${b.slug}` }));

/** Flat list in reading order, for prev/next links. */
export const flatDocs = docsNav.filter((s) => s.title !== "Browse").flatMap((s) => s.items);
