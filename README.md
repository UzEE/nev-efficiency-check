# NEV Efficiency Check

An interactive TanStack Start + React simulator that compares total cost of ownership (TCO) curves for ICE, HEV, PHEV, and BEV options across Pakistan-specific drive profiles. Built with Bun, Tailwind, shadcn/ui primitives, VisX, and react-spring animations.

## Getting Started

```bash
bun install
bun run dev
```

The dev server runs on Vite with TanStack Start SSR. Use `bun run build` to produce the production bundle (`dist/client` + `dist/server`).

## Scripts

| Script | Purpose |
| --- | --- |
| `bun run dev` | Start Vite + TanStack Start in development mode |
| `bun run build` | Build client + server bundles |
| `bun run preview` | Preview the production build via Vite |
| `bun run start` | Serve the built app with the Bun production server (`server.ts`) |
| `bun run lint` | Run ESLint using the shared TanStack config |
| `bun run format` | Check formatting with Prettier (`bun run format:write` to fix) |
| `bun run typecheck` | Run `tsc --noEmit` |
| `bun test` | Placeholder for future Bun-based tests |

## Architecture Highlights

- **TanStack Start** for file-based routing + SSR (`app/routes/*`, `app/router.tsx`).
- **VisX + @react-spring/web** for the animated TCO chart (`app/components/TCOChart.tsx`).
- **shadcn/ui**-style primitives wired manually because the upstream CLI requires Node ≥ 18.18.0. A compatible `components.json` plus local `ui` components (slider, select) are provided.
- **TailwindCSS 3.x** configured via `tailwind.config.ts` with shared design tokens in `app/styles/globals.css`.
- **Utilities** and hard-coded economics live under `app/lib` to keep route components purely presentational.

## Deployment

The repo targets Vercel (Bun runtime) per the project brief:

```bash
vercel init
vercel
vercel --prod
```

If you run into the `shadcn` CLI limitation on environments that ship Node < 18.18.0, keep using the checked-in primitives or upgrade the Node version before invoking `shadcn` commands.
