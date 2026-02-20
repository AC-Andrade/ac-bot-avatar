# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-20

### Added

- Initial monorepo structure with Turborepo and Yarn Workspaces.
- `@acandrade/ac-bot-avatar-utils`: Hashing, color, and seedable PRNG utilities.
- `@acandrade/ac-bot-avatar-core`: Shared types and interface definitions.
- `@acandrade/ac-bot-avatar-assets`: SVG assets for eyes and mouths with generation scripts.
- `@acandrade/ac-bot-avatar-react`: Main React components (`ACBotAvatar`, `HashedACBotAvatar`).
- Development documentation (`DEVELOPMENT.md`) and professional commit history.
- Local package testing workflow using `yarn run pack`.
- Automated publishing pipeline via GitHub Actions.
