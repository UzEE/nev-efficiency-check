# AGENT GUIDANCE
1. Use Bun (latest) for everything: `bun install`, `bun run dev`, `bun run build`.
2. Tailwind/shadcn setup: run `npx tailwindcss init -p` and `bunx shadcn-ui init` before scaffolding UI components.
3. Run lint via `bun run lint`; format with Prettier config defaults (2-space, semicolons, single quotes where possible).
4. Tests: `bun test` for all, `bun test app/lib/tco.test.ts` for a single file; keep tests colocated near source.
5. TypeScript only, ESM only; prefer explicit return types on exported functions/components.
6. Imports: absolute from `app/*` via configured tsconfig paths; group as std libs, third-party, internal; no default exports for utilities.
7. Components should be PascalCase, hooks camelCase, constants SCREAMING_SNAKE_CASE; avoid one-letter variable names.
8. Favor functional React components with TanStack loaders/actions for data; keep state in route components, pass props down.
9. Styling: Tailwind utility-first, supplement with shadcn/ui primitives; define shared tokens in `styles/globals.css`.
10. Animation/chart logic belongs in `app/components/TCOChart.tsx` using VisX + `@react-spring/web` transitions; keep render pure.
11. Error handling: validate inputs with zod when needed, graceful fallbacks (no throws) in UI; log to console only inside server contexts.
12. Utilities live in `app/lib`; keep side-effect-free, covered by tests.
13. Routes: `/`, `/about`, `/methodology` under `app/routes`; static content uses MDX-like JSX sections.
14. Keep constants (prices, PKR/km, slider bounds) in `app/lib/constants.ts`; never duplicate literal values elsewhere.
15. Commit flow: `git init`, stage intentionally, `gh repo create ... --push`; commits should explain why, not what.
16. Deployment: ensure Bun scripts work on Vercel (`vercel init`, `vercel`, `vercel --prod`), include `vercel.json` when SSR tweaks required.
17. Accessibility: label slider/select controls, provide chart legends and aria descriptions.
18. Prefer async/await over promise chains; narrow try/catch per operation and surface friendly UI messages.
19. Avoid global mutable state; use TanStack Start context/provider for shared simulator state if required.
20. Document new commands/components in README as they’re added; keep this file updated with any rule changes.
