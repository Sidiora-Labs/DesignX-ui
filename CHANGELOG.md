# Changelog

Notable changes to the `@sidioralabs/designx-ui` CLI and the DesignX UI registry are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the CLI follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.1.0]

### Added

- `dx-ui init` sets up `dx.json`, the theme stylesheet, `lib/utils.ts`, and base dependencies.
- `dx-ui add` installs components with their registry and npm dependencies, and rewrites import aliases.
- `dx-ui list` lists everything in the registry.
- A shadcn-compatible registry served from `https://dxuireact.com/r/{name}.json`.

### Security

- The CLI refuses registry files whose paths would be written outside the project or the chosen install directory.

[Unreleased]: https://github.com/Sidiora-Labs/DesignX-ui/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Sidiora-Labs/DesignX-ui/releases/tag/v0.1.0
