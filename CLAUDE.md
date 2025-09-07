# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SvelteKit 5 web application called "ai-reporter" that uses:

- SvelteKit with TypeScript
- Tailwind CSS v4 for styling
- Vitest for testing with browser and server test environments
- ESLint and Prettier for code quality
- pnpm as the package manager

## Common Commands

**Development:**

- `pnpm dev` - Start development server
- `pnpm dev -- --open` - Start dev server and open in browser

**Code Quality:**

- `pnpm lint` - Run Prettier check and ESLint
- `pnpm format` - Format code with Prettier
- `pnpm check` - Run Svelte type checking
- `pnpm check:watch` - Run type checking in watch mode

**Testing:**

- `pnpm test` - Run all tests once
- `pnpm test:unit` - Run tests in watch mode

**Build:**

- `pnpm build` - Create production build
- `pnpm preview` - Preview production build

## Test Architecture

The project uses Vitest with two separate test environments:

- **Client tests:** Browser environment using Playwright, for `.svelte.{test,spec}.{js,ts}` files
- **Server tests:** Node environment, for regular `.{test,spec}.{js,ts}` files (excluding Svelte component tests)

Test setup file: `vitest-setup-client.ts` (for browser tests only)

## File Structure

- `src/routes/` - SvelteKit routes and pages
- `src/lib/` - Reusable components and utilities
- `static/` - Static assets
- Standard SvelteKit project structure with `$lib` alias for `src/lib`

## Development Notes

- Uses Svelte 5 (latest version)
- Tailwind CSS v4 configuration in `vite.config.ts`
- TypeScript with strict mode enabled
- ESLint config uses flat config format
