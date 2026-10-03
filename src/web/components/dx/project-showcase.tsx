import * as React from "react";
import { motion } from "motion/react";
import { ArrowLeftIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type ShowcaseProject = {
  id: string;
  title: string;
  /** Image URL. */
  image: string;
  /** Heading shown above the description in the detail view. */
  tagline?: string;
  description?: React.ReactNode;
  /** Buttons or links shown at the end of the detail view. */
  actions?: React.ReactNode;
};

export type ProjectShowcaseProps = Omit<React.ComponentProps<"section">, "onChange" | "defaultValue"> & {
  projects: ShowcaseProject[];
  /** Label above the list. */
  label?: React.ReactNode;
  /** Id of the open project, or null for the list. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (id: string | null) => void;
  /** Let the floating preview be dragged around. */
  draggable?: boolean;
};

const radius = { borderRadius: 24 };

function ProjectShowcase({
  projects,
  label = "Selected work",
  value,
  defaultValue = null,
  onValueChange,
  draggable = true,
  className,
  ...props
}: ProjectShowcaseProps) {
  const uid = React.useId();
  const area = React.useRef<HTMLElement>(null);
  const [inner, setInner] = React.useState<string | null>(defaultValue);
  const openId = value !== undefined ? value : inner;
  const setOpen = React.useCallback(
    (id: string | null) => {
      if (value === undefined) setInner(id);
      onValueChange?.(id);
    },
    [value, onValueChange],
  );
  const [hover, setHover] = React.useState(0);

  const openIndex = projects.findIndex((p) => p.id === openId);
  const open = openIndex >= 0 ? projects[openIndex] : null;
  const shown = projects[open ? openIndex : hover] ?? projects[0];

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <section
      ref={area}
      data-slot="project-showcase"
      className={cn("relative h-[620px] w-full overflow-x-hidden overflow-y-auto overscroll-contain scrollbar-hover", className)}
      {...props}
    >
      {!open ? (
        <div className="relative size-full min-h-[460px]">
          <motion.img
            drag={draggable}
            dragConstraints={area}
            dragElastic={0.15}
            dragMomentum={false}
            layoutId={`${uid}-img`}
            style={radius}
            src={shown.image}
            alt=""
            draggable={false}
            className={cn(
              "absolute top-[8%] left-[6%] aspect-video w-[min(22rem,55%)] border border-outline-variant object-cover shadow-lg",
              draggable && "cursor-grab active:cursor-grabbing",
            )}
          />
          <ul className="absolute right-[6%] bottom-[10%] flex flex-col gap-1.5">
            <li aria-hidden className="mb-1 flex items-center gap-3 text-xs tracking-[0.18em] text-muted-foreground uppercase">
              {label}
              <span className="h-px flex-1 bg-current" />
            </li>
            {projects.map((p, i) => (
              <li key={p.id}>
                <motion.button
                  type="button"
                  layoutId={`${uid}-title-${p.id}`}
                  onPointerEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onClick={() => setOpen(p.id)}
                  className={cn(
                    "relative flex w-fit items-center text-3xl font-medium tracking-tighter outline-none transition-opacity sm:text-4xl",
                    "focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-4",
                    hover === i ? "opacity-100" : "opacity-45",
                  )}
                >
                  {p.title}
                  {hover === i && (
                    <motion.span
                      aria-hidden
                      initial={{ x: 10, width: 15, height: 0 }}
                      animate={{ x: 10, width: 5, height: 5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-full rounded-full bg-current"
                    />
                  )}
                </motion.button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-10 px-6 py-12">
          <button
            type="button"
            onClick={() => setOpen(null)}
            className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:text-foreground"
          >
            <ArrowLeftIcon className="size-4" /> All projects
          </button>
          <div className="relative min-h-16">
            <motion.h2 layoutId={`${uid}-title-${open.id}`} className="w-fit text-5xl font-medium tracking-tighter sm:text-6xl">
              {open.title}
            </motion.h2>
          </div>
          <motion.img layoutId={`${uid}-img`} style={radius} src={open.image} alt="" className="aspect-video w-full object-cover" />
          <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.25 } },
              }}
              className="flex flex-col gap-4"
            >
              {open.tagline && (
                <motion.div variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }} className="flex items-center gap-3">
                  <h3 className="text-2xl font-semibold tracking-tight">{open.tagline}</h3>
                  <motion.span
                    aria-hidden
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.35, duration: 0.5 }}
                    className="h-0.5 flex-1 origin-left rounded-full bg-foreground"
                  />
                </motion.div>
              )}
              {open.description && (
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
                  className="flex flex-col gap-2 text-sm leading-6 text-muted-foreground"
                >
                  {open.description}
                </motion.div>
              )}
              {open.actions && (
                <motion.div variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }} className="mt-6 flex flex-wrap items-center gap-2.5">
                  {open.actions}
                </motion.div>
              )}
            </motion.div>
        </div>
      )}
    </section>
  );
}

export { ProjectShowcase };
