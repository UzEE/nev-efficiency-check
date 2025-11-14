import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/methodology')({
  component: MethodologyPage
});

function MethodologyPage() {
  return (
    <main className="flex-1 px-6 py-12">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <section className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-slate-400">Data & Assumptions</p>
          <h1 className="text-4xl font-semibold text-white">Methodology Overview</h1>
          <ul className="list-disc space-y-2 pl-6 text-base text-slate-300">
            <li>
              Upfront prices and PKR/km values are hard-coded constants provided in the MVP brief.
            </li>
            <li>
              TCO curves use the linear model{' '}
              <span className="font-semibold">upfrontPrice + (mixedPKRperKm × distance)</span>.
            </li>
            <li>Drive profiles apply pre-mixed PKR/km values for city/highway blends.</li>
            <li>
              Future enhancements will allow updating prices, currency inflation, and charging
              assumptions.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
