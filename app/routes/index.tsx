import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'

import { DriveProfileSelector } from 'app/components/DriveProfileSelector'
import { DistanceSlider } from 'app/components/Slider'
import { TCOChart } from 'app/components/TCOChart'
import { DISTANCE_SLIDER } from 'app/lib/constants'
import { buildSeries, getSeriesSummary } from 'app/lib/tco'
import { cn, formatCurrency, formatDistance } from 'app/lib/utils'
import type { DriveProfileKey } from 'app/lib/constants'

export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  const [distance, setDistance] = React.useState<number>(DISTANCE_SLIDER.defaultValue)
  const [profile, setProfile] = React.useState<DriveProfileKey>('mix')

  const chartSeries = React.useMemo(() => buildSeries(profile), [profile])
  const summaries = React.useMemo(() => getSeriesSummary(distance, profile), [distance, profile])

  const leader = React.useMemo(() => {
    const [first, ...rest] = summaries
    if (!first) {
      return null
    }

    return rest.reduce((prev, curr) => (curr.value < prev.value ? curr : prev), first)
  }, [summaries])

  return (
    <main className="flex flex-1 flex-col gap-8 px-6 py-10">
      <section className="mx-auto w-full max-w-6xl space-y-5 text-center">
        <p className="text-sm uppercase tracking-widest text-primary">Simulator</p>
        <h1 className="text-5xl font-semibold text-white">Total Cost of Ownership</h1>
        <p className="text-base text-slate-300">
          Adjust distance travelled and drive profile to compare lifetime ownership costs across four propulsion
          technologies common in Pakistan.
        </p>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur md:grid-cols-2">
        <DistanceSlider value={distance} onChange={(next) => setDistance(next)} />
        <DriveProfileSelector value={profile} onChange={(next) => setProfile(next)} />
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 md:grid-cols-4">
        {summaries.map((summary) => (
          <article
            key={summary.vehicle}
            className={cn(
              'rounded-2xl border border-white/10 bg-white/5 p-4 text-sm shadow-sm backdrop-blur',
              leader && summary.vehicle === leader.vehicle && 'border-primary/60 bg-primary/10',
            )}
          >
            <p className="text-xs uppercase tracking-wide text-slate-400">{summary.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(summary.value)}</p>
            <p className="text-xs text-slate-400">{formatDistance(distance)} travelled</p>
            <p className="mt-3 text-xs text-slate-400">
              Upfront {formatCurrency(summary.upfront)} · {summary.rate.toFixed(2)} PKR/km
            </p>
          </article>
        ))}
      </section>

      <section className="mx-auto w-full max-w-6xl">
        <TCOChart series={chartSeries} selectedDistance={distance} driveProfile={profile} />
      </section>

      <section className="mx-auto w-full max-w-6xl rounded-3xl border border-white/10 bg-white/5 p-6 text-xs text-slate-400">
        <p>
          Assumptions: blended PKR/km rates incorporate “Lazy PHEV” charging behavior (Home + mid-trip commercial). No
          financing, taxation, or residual adjustments are included. Chart values are estimates only; verify prices and
          charging mixes before making purchase decisions.
        </p>
      </section>
    </main>
  )
}

