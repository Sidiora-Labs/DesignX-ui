# Security Policy

## Supported versions

Security fixes are released for the latest published version of the `@sidioralabs/designx-ui` CLI and for the current registry served at [dxuireact.com](https://dxuireact.com).

## Reporting a vulnerability

Please don't report security vulnerabilities in public issues, discussions, or pull requests.

Report them privately through [GitHub's private vulnerability reporting](https://github.com/Sidiora-Labs/DesignX-ui/security/advisories/new). If you can't use GitHub, contact us through [sidioralabs.com](https://sidioralabs.com).

Please include:

- A description of the issue and its impact
- Steps to reproduce, or a proof of concept
- The affected version, component, or registry item
- Any suggested fix, if you have one

We'll acknowledge your report, keep you updated while we investigate, and credit you in the advisory once a fix is released unless you'd prefer to stay anonymous.

## Scope

In scope:

- The CLI in `cli/`, including how it fetches registry items and writes files to a project
- The registry build and the generated files in `public/r/`
- Component source code that the registry distributes

Out of scope:

- Vulnerabilities in third-party dependencies that are already publicly known. Report those upstream.
- Issues that require a compromised machine or a malicious custom registry that the user chose to configure
