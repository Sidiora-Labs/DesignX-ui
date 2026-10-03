# DesignX UI CLI

`@sidioralabs/designx-ui` is the npm package; it installs the `dx-ui` command for accessible, motion-first React components built on Base UI and Tailwind CSS 4. Node.js 18.17 or later is required.

```bash
npx @sidioralabs/designx-ui@latest init          # dx.json, theme CSS, lib/utils, base deps
npx @sidioralabs/designx-ui@latest add button card dialog
npx @sidioralabs/designx-ui@latest add -a        # everything
npx @sidioralabs/designx-ui@latest list
```

| Command | Options |
| --- | --- |
| `init` | `-y, --yes` · `--css <path>` · `--registry <url>` |
| `add [components...]` | `-a, --all` · `-o, --overwrite` · `-p, --path <dir>` |
| `list` | |

`--cwd <dir>` works with every command. The registry is shadcn-compatible, so `npx shadcn@latest add @dx/<name>` works too.

Registry items are fetched from `https://dxuireact.com/r/{name}.json` by default. Use `--registry` during `init` to point at your own registry; `{name}` is replaced with the item name.

To work on the CLI, run `npm --prefix cli run check` from the repository root. It runs the tests and previews the published package contents.

Docs: https://dxuireact.com/docs/cli
