import { CodeBlock } from "../code-block";
import { modernGuidanceDocs, modernGuidanceSource } from "../standards";

const upstream = (slug: string) => `${modernGuidanceSource}/tree/main/guides/${slug}`;

export function ModernWebGuide() {
  return (
    <>
      <p>
        DX UI follows the platform-first direction of Google Chrome&apos;s Modern Web Guidance: prefer native browser capabilities,
        preserve accessible semantics, and add a small fallback when a feature is not available. The source repository is the reference
        for the recommendations here and is updated independently from this registry.
      </p>
      <p>
        Use this page as the review contract for a component before it enters your application. Every component page also carries a
        group-specific checklist and direct links to the upstream material.
      </p>
      <h2 id="workflow">A practical workflow</h2>
      <ol>
        <li>Start with the semantic HTML element and the browser behaviour you need.</li>
        <li>Search the upstream guidance for the interaction, layout, or performance problem.</li>
        <li>Progressively enhance with feature detection and keep a usable baseline.</li>
        <li>Test keyboard, screen reader, reduced-motion, narrow-container, and slow-device paths.</li>
        <li>Measure interaction latency and layout stability before adding animation or JavaScript scheduling.</li>
      </ol>
      <h2 id="principles">Platform principles</h2>
      <div className="not-prose grid gap-3 sm:grid-cols-2">
        {[
          ["Semantic first", "Use native controls and landmarks; ARIA fills gaps instead of replacing browser behaviour.", "accessibility/accessibility"],
          ["CSS before JavaScript", "Use container queries, intrinsic sizing, scroll-driven animation, and discrete transitions where they fit.", "css/css-layout"],
          ["Responsive by construction", "Let components respond to their container and to user preferences rather than a fixed viewport list.", "css/responsive-design"],
          ["Fast by default", "Reserve media space, defer non-critical work, and keep interaction handlers short.", "performance/performance"],
          ["Input survives real users", "Keep autofill, validation, IME composition, and native form submission intact.", "forms/forms"],
          ["Secure composition", "Treat every copied component as application code with explicit origins, policy, and data boundaries.", "security/security"],
        ].map(([title, summary, slug]) => (
          <a key={title} href={upstream(slug)} target="_blank" rel="noreferrer" className="site-focus rounded-2xl border border-hairline bg-tile p-5 transition-colors hover:bg-divider/50">
            <h3 className="text-base font-semibold text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-pencil">{summary}</p>
            <span className="mt-4 inline-block font-code text-[11px] text-faint">Upstream guide ↗</span>
          </a>
        ))}
      </div>
      <h2 id="fallbacks">Progressive enhancement</h2>
      <p>
        New platform features should make the experience better, not make the baseline disappear. Gate optional CSS with <code>@supports</code>,
        test the unenhanced path, and keep fallbacks small enough to remove later.
      </p>
      <CodeBlock lang="css" title="progressive-enhancement.css" code={`.card {\n  display: grid;\n  gap: 1rem;\n}\n\n@supports (container-type: inline-size) {\n  .card-shell { container-type: inline-size; }\n  @container (min-width: 32rem) {\n    .card { grid-template-columns: 1fr 1fr; }\n  }\n}`} />
      <h2 id="source">Source and update policy</h2>
      <p>
        The registry does not vendor the upstream repository. It links to the source at <a href={modernGuidanceSource} target="_blank" rel="noreferrer">{modernGuidanceSource}</a>
        and keeps the component checklists intentionally short so updates can be reviewed with platform changes. See the official
        <a href={modernGuidanceDocs} target="_blank" rel="noreferrer"> Modern Web Guidance documentation</a> for the full corpus and compatibility details.
      </p>
    </>
  );
}

export function AccessibilityGuide() {
  return (
    <>
      <p>Accessibility is part of the component contract. A polished visual state is incomplete if a keyboard user, screen reader, zoom user, or someone with motion sensitivity cannot reach the same outcome.</p>
      <h2 id="semantics">Semantics and names</h2>
      <ul>
        <li>Use headings, landmarks, lists, links, buttons, forms, and native inputs for their intended meaning.</li>
        <li>Give icon-only buttons an accessible name and keep visible labels when the action is unfamiliar.</li>
        <li>Associate descriptions and validation errors with <code>aria-describedby</code> and <code>aria-invalid</code>.</li>
      </ul>
      <h2 id="keyboard">Keyboard and focus</h2>
      <p>Every action must be reachable without a pointer. Keep focus visible, preserve focus when overlays close, and use roving focus only for true composite widgets such as tabs, toolbars, and grids.</p>
      <CodeBlock lang="tsx" code={`<button type="button" aria-describedby={helpId}>\n  Save changes\n</button>\n<p id={helpId}>Your draft stays private until you publish.</p>`} />
      <h2 id="motion">Motion and contrast</h2>
      <p>Use motion to explain a state change, keep it interruptible, and provide a reduced-motion path. Never rely on colour, blur, or animation as the only signal.</p>
      <CodeBlock lang="css" code={`@media (prefers-reduced-motion: reduce) {\n  *,\n  *::before,\n  *::after {\n    animation-duration: 0.001ms !important;\n    transition-duration: 0.001ms !important;\n    scroll-behavior: auto !important;\n  }\n}`} />
    </>
  );
}

export function PerformanceGuide() {
  return (
    <>
      <p>Measure the experience users feel: LCP for the first useful view, CLS for layout stability, and INP for interaction latency.</p>
      <h2 id="media">Media and layout stability</h2>
      <p>Give images intrinsic dimensions, lazy-load non-critical media, and use <code>fetchpriority="high"</code> only for the actual LCP resource. Large offscreen sections can use <code>content-visibility: auto</code> with <code>contain-intrinsic-size</code>.</p>
      <CodeBlock lang="tsx" code={`<img\n  src={src}\n  alt={alt}\n  width={640}\n  height={360}\n  loading="lazy"\n  decoding="async"\n/>`} />
      <h2 id="scheduling">Scheduling work</h2>
      <p>Prefer CSS and browser observers for visual work. When a task still needs JavaScript, yield between chunks so input can be handled promptly.</p>
      <CodeBlock lang="ts" code={`async function processQueue(queue: Task[]) {\n  for (const task of queue) {\n    task.run();\n    if ("yield" in scheduler) await scheduler.yield();\n    else await new Promise(requestAnimationFrame);\n  }\n}`} />
      <h2 id="components">Component rules</h2>
      <ul>
        <li>Keep expensive demos lazy and keep hidden tabs out of the layout when they are not needed.</li>
        <li>Use ResizeObserver and IntersectionObserver instead of polling.</li>
        <li>Animate transforms and opacity, avoid forced synchronous layout, and remove unnecessary <code>will-change</code>.</li>
      </ul>
    </>
  );
}

export function CssLayoutGuide() {
  return (
    <>
      <p>Modern CSS lets components describe their constraints directly. Start with intrinsic sizing and let the browser solve the layout before reaching for a resize listener.</p>
      <h2 id="responsive">Responsive components</h2>
      <CodeBlock lang="css" code={`.shell {\n  container-type: inline-size;\n  padding-inline: clamp(1rem, 4vw, 4rem);\n}\n\n@container (min-width: 42rem) {\n  .toolbar { grid-template-columns: auto 1fr auto; }\n}`} />
      <h2 id="logical">Logical properties</h2>
      <p>Use <code>margin-inline</code>, <code>padding-block</code>, and logical inset properties so the same component works in right-to-left and vertical writing modes.</p>
      <h2 id="transitions">Entry and exit transitions</h2>
      <p>For top-layer UI, combine native dialog or popover semantics with <code>@starting-style</code> and <code>transition-behavior: allow-discrete</code>. Keep a non-animated state for reduced motion and unsupported browsers.</p>
      <CodeBlock lang="css" code={`dialog {\n  opacity: 1;\n  transition: opacity 180ms ease, display 180ms allow-discrete;\n}\n\n@starting-style {\n  dialog { opacity: 0; }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  dialog { transition: none; }\n}`} />
    </>
  );
}

export function FormsGuide() {
  return (
    <>
      <p>Forms are a browser feature, not a styling problem. Keep the platform&apos;s submission, autofill, validation, and IME behaviour while composing the visual shell around it.</p>
      <h2 id="fields">Fields that fit their content</h2>
      <CodeBlock lang="css" code={`textarea {\n  field-sizing: content;\n  min-block-size: 3rem;\n  max-block-size: 16rem;\n  overflow-y: auto;\n}`} />
      <h2 id="autocomplete">Autofill and validation</h2>
      <p>Use stable <code>name</code>, <code>autocomplete</code>, and <code>inputmode</code> values. Show errors after interaction, keep the message adjacent to the field, and expose the same state programmatically.</p>
      <h2 id="ime">IME-safe submission</h2>
      <CodeBlock lang="tsx" code={`function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {\n  if (event.isComposing || event.keyCode === 229) return;\n  if (event.key === "Enter" && !event.shiftKey) {\n    event.preventDefault();\n    submit();\n  }\n}`} />
    </>
  );
}

export function SecurityGuide() {
  return (
    <>
      <p>Copied source still runs with your application&apos;s permissions. Keep policy, origins, and data handling explicit when you install registry items.</p>
      <h2 id="policy">Policy and origins</h2>
      <ul>
        <li>Set a restrictive Content-Security-Policy and avoid injecting HTML unless it is trusted and sanitised.</li>
        <li>Use Trusted Types for DOM sinks that accept HTML and keep third-party scripts on an allowlist.</li>
        <li>Use <code>rel="noopener noreferrer"</code> for new-tab links and set a deliberate referrer policy.</li>
      </ul>
      <h2 id="privacy">Privacy in UI</h2>
      <p>Mask sensitive balances, keep logs free of secrets, and collect only the data needed for the user-visible task. Treat previews and examples as production code paths when they render user input.</p>
    </>
  );
}

export function AgentsGuide() {
  return (
    <>
      <p>Agent interfaces are asynchronous applications. The UI must make work, waiting, interruption, approval, and failure understandable without relying on animation or a live pointer.</p>
      <h2 id="streaming">Streaming and live state</h2>
      <ul>
        <li>Keep the conversation in a labelled log and announce new assistant content through a polite live region.</li>
        <li>Show a stable pending state before the first token and expose errors next to the action that can recover.</li>
        <li>Keep a jump-to-latest action available without stealing focus from a reader who is reviewing earlier content.</li>
      </ul>
      <h2 id="tools">Tools and approvals</h2>
      <p>Tool calls should show the name, status, duration, and result. Destructive or external actions need an explicit approval surface with a clear cancel path and a keyboard reachable decision.</p>
      <h2 id="privacy">Context and privacy</h2>
      <p>Display which sources or files are in context, avoid leaking secrets into citations and logs, and keep long-running work cancellable. See the security checklist before exposing user data to a model or tool.</p>
    </>
  );
}
