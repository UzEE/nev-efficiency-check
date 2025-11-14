import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <main className="flex-1 px-6 py-12">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <section className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-slate-400">Project</p>
          <h1 className="text-4xl font-semibold text-white">About NEV Efficiency Check</h1>
          <p className="text-base leading-relaxed text-slate-300">
            This tool helps policymakers, fleet managers, and EV enthusiasts understand how vehicle technology choices
            evolve over long operating distances. It combines Pakistan-specific prices with blended PKR/km assumptions to
            surface break-even points between ICE, HEV, PHEV, and BEV platforms.
          </p>
        </section>
      </div>
    </main>
  )
}
