# Contributing to DesignX UI

Thanks for helping improve DesignX UI. This guide covers how to set up the project, what we look for in a change, and how releases work.

By participating, you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to contribute

- **Report a bug:** open a [bug report](https://github.com/Sidiora-Labs/DesignX-ui/issues/new/choose) with steps to reproduce.
- **Suggest a component or feature:** open a feature request and describe the use case first.
- **Improve the docs:** fix typos, clarify examples, or add missing props.
- **Send a fix or a new component:** for anything larger than a small fix, open an issue first so we can agree on the approach before you write code.

Please report security issues privately. See [SECURITY.md](SECURITY.md).

## Setup

You need [Bun](https://bun.sh) 1.3 or later and Node.js 22 (see `.nvmrc`).

```bash
git clone https://github.com/Sidiora-Labs/DesignX-ui.git
cd DesignX-ui
bun install
bun run dev
```

## Project layout

| Path | Contents |
| --- | --- |
| `src/web/components/ui/` | Core UI components |
| `src/web/components/dx/` | DX Motion components |
| `src/web/components/agents/`, `charts/`, `motion/` | Component kits |
| `src/web/docs/` | Documentation pages, catalog, and API tables |
| `src/web/demos/` | Live examples shown in the docs |
| `scripts/` | Registry generation and validation |
| `public/r/` | Generated registry JSON (do not edit by hand) |
| `cli/` | The `@sidioralabs/designx-ui` CLI |

## Making a change

1. Create a branch from `main`.
2. Make your change. If you edit a component, regenerate the registry:

   ```bash
   bun run registry
   ```

3. Run the checks:

   ```bash
   bun run lint
   bun run check
   bun run build
   ```

4. Commit `public/r/` together with the component change so the registry matches the source.
5. Open a pull request and fill in the template.

### Component guidelines

- Build on Base UI primitives where one exists. Keyboard support, focus management, and ARIA must work.
- Style with Tailwind and the existing design tokens. Avoid new hard-coded colours.
- Respect `prefers-reduced-motion` in animated components.
- Import shared code through the `@/` alias (`@/lib/utils`, `@/components/ui/...`) so the CLI can rewrite imports for users.
- Add a demo in `src/web/demos/` and a catalog entry in `src/web/docs/catalog.ts`.
- Keep each component self-contained. It is copied into users' projects and should read clearly as their own code.

### CLI changes

The CLI in `cli/` has no runtime dependencies and supports Node.js 18.17 and later. Keep it that way. Add or update tests in `cli/test/` and run:

```bash
npm --prefix cli run check
```

## Pull requests

- Keep pull requests focused on one change.
- Describe what changed and why, and include screenshots or recordings for visual changes.
- CI must pass before a pull request can be merged.
- A maintainer will review your pull request. We may suggest changes before merging.

## Releases

The CLI publishes to npm automatically when a change to `cli/package.json` with a new version lands on `main`. Maintainers handle version bumps. Notable changes are recorded in [CHANGELOG.md](CHANGELOG.md).

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
