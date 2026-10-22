# Changelog

Notable changes to the `@sidioralabs/designx-ui` CLI and the DesignX UI registry are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the CLI follows [Semantic Versioning](https://semver.org/).
Releases are marked by version bumps of the CLI in `cli/package.json`. Each entry links to the commit it came from.

## [Unreleased]

### Added

- A **Trading** registry group with 45 components for exchange and DeFi trading apps, ported from the Paxeer SDK as presentational components. Data comes in through props and actions go out through callbacks. ([0f765de])
  - Primitives: `numeral`, `token-icon`, `symbol-info-bar`.
  - Markets: `markets-list`, `market-selector`, `markets-ticker`, `markets-overview`, `funding-rate`, `funding-comparison`, `recent-trades`, `chart-panel`, `orderbook-trades`.
  - Order entry: `order-entry`, `leverage-selector`, `margin-mode`, `tpsl-editor`, `order-confirm`.
  - Positions and orders: `positions-table`, `close-position`, `adjust-margin`, `reverse-position`, `orders-table`, `position-history`, `funding-fee-history`.
  - Account and portfolio: `account-summary`, `asset-panel`, `portfolio-assets`, `portfolio-performance`, `deposit-withdraw`, `deposit-status`, `transfer-history`, `fee-tier`, `chain-selector`, `api-key-manager`.
  - Community: `leaderboard`, `campaign-card`, `epoch-rewards`, `pnl-share-card`, `trade-notification`, `announcement-bar`.
  - Vaults and affiliate: `vault-card`, `vault-form`, `referral-card`, `affiliate-summary`, `referees-table`.
- `trading-01`, a trading terminal block that composes the Trading components. ([0f765de])
- `lib-trading`, shared number formatting, symbol parsing, profit and loss tones and a display-only countdown. ([0f765de])
- Docs pages, demos and API references for every Trading component, and a Trading section in the docs navigation and search. ([0f765de])

## [0.5.0] - 2026-10-11

### Added

- 199 new registry components across four new groups and the agents kit. ([dbec129])
  - Elements: 105 components.
  - Text: 35 components.
  - Effects: 21 components.
  - Transitions: 17 components.
  - Agents: 21 more components, for 40 in total.
- 34 marketing blocks: headers, features, logo clouds, stats, testimonials, team, pricing, FAQ, CTA and footers. ([dbec129])
- `lib-demo-data`, `lib-animation` and `lib-slot` registry libs, and `CODEMAP.md`. ([dbec129])
- Technology badges in the README. ([1aa6f90])
- A Vercel config with SPA rewrites, security headers and caching for `/r/*` registry files. ([8ba9285])

### Changed

- Registry items now link to their docs on `dxuireact.com` instead of `ui.designx.dev`. ([dbec129])
- The registry builder resolves multi-file kit items and their libs for the new groups, and accepts single-quoted imports. ([dbec129])
- The lint config now reports seven more jsx-a11y and React rules as warnings. ([dbec129])
- The docs footer shows the npm package name instead of the version. ([8ba9285])
- Landing page components are more responsive on mobile. ([2d71001])
- The CLI version is now 0.5.0. ([65b1662])

### Fixed

- Refreshing a docs page on Vercel no longer returns a 404. ([e603a6b])
- The CLI `bin` path in `cli/package.json` no longer starts with `./`. ([14d271a])

## [0.1.0] - 2026-10-03

### Added

- `dx-ui init` sets up `dx.json`, the theme stylesheet, `lib/utils.ts`, and base dependencies. ([42bc83c])
- `dx-ui add` installs components with their registry and npm dependencies, and rewrites import aliases. ([42bc83c])
- `dx-ui list` lists everything in the registry. ([42bc83c])
- A shadcn-compatible registry served from `https://dxuireact.com/r/{name}.json`. ([42bc83c])

### Security

- The CLI refuses registry files whose paths would be written outside the project or the chosen install directory. ([42bc83c])

[Unreleased]: https://github.com/Sidiora-Labs/DesignX-ui/compare/65b166295e7e69d3cf2ec2c86f2487c522157fa3...HEAD
[0.5.0]: https://github.com/Sidiora-Labs/DesignX-ui/compare/42bc83c5e188c377d0324521808dbac98253fd88...65b166295e7e69d3cf2ec2c86f2487c522157fa3
[0.1.0]: https://github.com/Sidiora-Labs/DesignX-ui/tree/42bc83c5e188c377d0324521808dbac98253fd88
[0f765de]: https://github.com/Sidiora-Labs/DesignX-ui/commit/0f765de439c6430fd848239eda3fbc3815cbf509
[65b1662]: https://github.com/Sidiora-Labs/DesignX-ui/commit/65b166295e7e69d3cf2ec2c86f2487c522157fa3
[dbec129]: https://github.com/Sidiora-Labs/DesignX-ui/commit/dbec1291d81f8dee802ddfbb63dc21326a94a031
[2d71001]: https://github.com/Sidiora-Labs/DesignX-ui/commit/2d71001982a09c47346d06f6f1829819773a0030
[e603a6b]: https://github.com/Sidiora-Labs/DesignX-ui/commit/e603a6b7c4f1799f2023f8df8a3aa91bf4b1db4e
[1aa6f90]: https://github.com/Sidiora-Labs/DesignX-ui/commit/1aa6f9080ffa3473ef99731908ecb13d71bf93db
[8ba9285]: https://github.com/Sidiora-Labs/DesignX-ui/commit/8ba9285a76756caf8be6aa8a8fefe2ad0dca9b68
[14d271a]: https://github.com/Sidiora-Labs/DesignX-ui/commit/14d271a66bb340c82a9eacba554c57fdf4eb7be6
[42bc83c]: https://github.com/Sidiora-Labs/DesignX-ui/commit/42bc83c5e188c377d0324521808dbac98253fd88
