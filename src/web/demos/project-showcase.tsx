import { BookOpenIcon, CircleArrowOutUpRightIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { ProjectShowcase, type ShowcaseProject } from "@/components/dx/project-showcase";

const img = (id: string) => `https://images.unsplash.com/${id}?w=1400&q=80&auto=format&fit=crop`;

const actions = (
  <>
    <a href="https://dxuireact.com" target="_blank" rel="noreferrer" className={buttonVariants({ size: "sm" })}>
      Live preview <CircleArrowOutUpRightIcon />
    </a>
    <a href="https://dxuireact.com/docs" target="_blank" rel="noreferrer" className={buttonVariants({ size: "sm", variant: "outline" })}>
      Source code <BookOpenIcon />
    </a>
  </>
);

const copy = (
  <>
    <p>A design system and component kit built for teams that ship weekly. Tokens, motion and accessibility are baked in.</p>
    <p>Every primitive is copy-paste friendly and themable through a single set of CSS variables.</p>
    <p>Want to build something together? Get in touch.</p>
  </>
);

const projects: ShowcaseProject[] = [
  { id: "atlas", title: "Atlas OSS", image: img("photo-1506905925346-21bda4d32df4"), tagline: "Open source, at scale", description: copy, actions },
  { id: "neon", title: "NeonSync Pro", image: img("photo-1501785888041-af3ef285b470"), tagline: "Realtime sync engine", description: copy, actions },
  { id: "pixel", title: "PixelForge Studio", image: img("photo-1469474968028-56623f02e42e"), tagline: "Design tooling", description: copy, actions },
  { id: "flow", title: "TaskFlow", image: img("photo-1447752875215-b2761acb3c5d"), tagline: "Planning, simplified", description: copy, actions },
  { id: "cloud", title: "CloudVibe", image: img("photo-1433086966358-54859d0ed716"), tagline: "Edge hosting", description: copy, actions },
];

export default function ProjectShowcaseDemo() {
  return <ProjectShowcase projects={projects} className="h-[560px]" />;
}
