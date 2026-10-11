/**
 * Sample people, testimonials and images used by DX UI demos and blocks.
 * Replace with your own data — nothing here is required at runtime.
 */

export type Person = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  location: string;
  experience: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  quote: string;
  rating: number;
  stars: number;
};

const avatar = (n: number) => `/images/dx/people/p${n}.webp`;

/** A sample photo, 1–20. */
export const photo = (n: number) => `/images/dx/photos/ph${((n - 1) % 20) + 1}.webp`;

const PEOPLE: Person[] = [
  ["Maya Solis", "Design Lead", "Lisbon", "Shapes the DX visual language and the motion guidelines."],
  ["Theo Park", "Staff Engineer", "Seoul", "Owns the registry, the CLI and everything that ships to npm."],
  ["Ava Lindqvist", "Product Designer", "Stockholm", "Turns rough flows into calm, considered interfaces."],
  ["Noah Adeyemi", "Frontend Engineer", "Lagos", "Obsessed with springs, focus rings and frame budgets."],
  ["Lena Fischer", "Design Engineer", "Berlin", "Bridges design files and code with prototypes that become components."],
  ["Marco Bellini", "Engineering Manager", "Milan", "Keeps the team shipping weekly without burning out."],
  ["Priya Raman", "Accessibility Lead", "Bangalore", "Audits every component with a keyboard and a screen reader."],
  ["Jonas Weber", "Motion Designer", "Zurich", "Tunes every easing curve until it feels physical."],
  ["Sofia Moreno", "Developer Advocate", "Madrid", "Writes the docs, the examples and the launch posts."],
  ["Kai Nakamura", "Platform Engineer", "Tokyo", "Keeps builds fast and the docs site instant."],
  ["Chloe Martin", "Researcher", "Paris", "Runs usability studies with the teams that adopt DX UI."],
  ["Omar Haddad", "Founding Engineer", "Dubai", "Wrote the first DX component and still reviews every PR."],
].map(([name, role, location, bio], i) => ({
  id: String(i + 1),
  name,
  role,
  avatar: avatar(i + 1),
  bio,
  location,
  experience: `${3 + ((i * 3) % 9)} years`,
}));

const QUOTES = [
  "We replaced three internal libraries with DX UI in a sprint. The motion alone made our product feel twice as polished.",
  "Copying the source in was the right call. We tweaked the springs to match our brand and never fought a wrapper.",
  "The accessibility defaults are the best I've seen in a component kit. Keyboard support just works.",
  "Our designers and engineers finally speak the same language — the tokens map one-to-one with our design files.",
  "Blocks got our marketing site from zero to launch in two days. Every section looked considered.",
  "The registry works with the shadcn CLI, so adoption across our monorepo was painless.",
  "Dark mode, reduced motion and RTL were handled before we even asked. That never happens.",
  "Small details — the press depth, the focus rings, the easing — add up to something customers notice.",
];

const TESTIMONIALS: Testimonial[] = QUOTES.map((q, i) => {
  const p = PEOPLE[(i * 5) % PEOPLE.length];
  return { id: `t${i + 1}`, name: p.name, role: p.role, avatar: p.avatar, content: q, quote: q, rating: 5, stars: 5 };
});

export function getAllPeople() {
  return PEOPLE;
}

/** `count` people starting at `offset` (wraps around). */
export function somePeople(count: number, offset = 0) {
  return Array.from({ length: count }, (_, i) => PEOPLE[(offset + i) % PEOPLE.length]);
}

export function getTestimonials(count = TESTIMONIALS.length) {
  return Array.from({ length: count }, (_, i) => TESTIMONIALS[i % TESTIMONIALS.length]);
}

/** Avatars are already sized; the size argument is accepted for API symmetry. */
export function getAvatarUrl(src: string, _size?: number) {
  return src;
}

/** Image URLs pass through unchanged; options are accepted for API symmetry. */
export function imageUrl(src: string, _opts?: Record<string, unknown>) {
  return src;
}
