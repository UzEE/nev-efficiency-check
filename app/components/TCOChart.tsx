import { animated, useSpring } from '@react-spring/web'

import { AxisBottom, AxisLeft } from '@visx/axis'
import { GridRows } from '@visx/grid'
import { Group } from '@visx/group'
import { ParentSize } from '@visx/responsive'
import { scaleLinear } from '@visx/scale'
import { LinePath } from '@visx/shape'
import * as React from 'react'

import { DISTANCE_SLIDER, DRIVE_PROFILES } from 'app/lib/constants'
import { calculateTco } from 'app/lib/tco'
import { cn, formatCurrency } from 'app/lib/utils'
import type { DriveProfileKey, VehicleKey } from 'app/lib/constants'
import type { TcoSeries } from 'app/lib/tco'

type LegendItem = {
  vehicle: VehicleKey
  label: string
  color: string
}

type TCOChartProps = {
  series: Array<TcoSeries>
  selectedDistance: number
  driveProfile: DriveProfileKey
  legendItems: Array<LegendItem>
  activeVehicles: Array<VehicleKey>
  onToggleVehicle: (vehicle: VehicleKey) => void
}

const margins = { top: 20, right: 20, bottom: 40, left: 110 }

export function TCOChart({
  series,
  selectedDistance,
  driveProfile,
  legendItems,
  activeVehicles,
  onToggleVehicle,
}: TCOChartProps) {
  const profileCopy = DRIVE_PROFILES[driveProfile]
  const isClient = typeof window !== 'undefined'

  return (
    <section
      className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 text-white"
      aria-label="Total cost of ownership chart"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">TCO curves</p>
          <h2 className="text-2xl font-semibold">{profileCopy.label} profile</h2>
          <p className="text-sm text-slate-400">{profileCopy.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {legendItems.map((item) => {
            const isActive = activeVehicles.includes(item.vehicle)
            return (
              <button
                key={item.vehicle}
                type="button"
                onClick={() => onToggleVehicle(item.vehicle)}
                aria-pressed={isActive}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-3 py-1 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  isActive
                    ? 'border-white/70 bg-white/10 text-white'
                    : 'border-white/10 bg-white/0 text-slate-400 hover:border-white/30 hover:text-white',
                )}
              >
                <span
                  className="h-2 w-8 rounded-full"
                  style={{ backgroundColor: item.color, opacity: isActive ? 1 : 0.3 }}
                  aria-hidden="true"
                />
                {item.label}
              </button>
            )
          })}
        </div>
      </div>
      <div className="mt-6 h-[420px] w-full">
        {series.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/15 text-sm text-slate-400">
            Enable at least one vehicle to render the chart.
          </div>
        ) : isClient ? (
          <ParentSize>
            {({ width, height }) => (
              <ChartCanvas
                width={width}
                height={height}
                series={series}
                selectedDistance={selectedDistance}
                driveProfile={driveProfile}
              />
            )}
          </ParentSize>
        ) : (
          <div className="h-full w-full animate-pulse rounded-2xl bg-white/5" aria-hidden />
        )}
      </div>
    </section>
  )
}

const AnimatedGroup = animated(Group)

type ChartCanvasProps = {
  width: number
  height: number
  series: Array<TcoSeries>
  selectedDistance: number
  driveProfile: DriveProfileKey
}

function ChartCanvas({ width, height, series, selectedDistance, driveProfile }: ChartCanvasProps) {
  const innerWidth = Math.max(width - margins.left - margins.right, 0)
  const innerHeight = Math.max(height - margins.top - margins.bottom, 0)

  const { yMin, yMax } = React.useMemo(() => {
    if (series.length === 0) {
      return { yMin: 0, yMax: 1 }
    }

    let min = Number.POSITIVE_INFINITY
    let max = Number.NEGATIVE_INFINITY

    series.forEach((item) => {
      item.points.forEach((point) => {
        min = Math.min(min, point.value)
        max = Math.max(max, point.value)
      })
    })

    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      return { yMin: 0, yMax: 1 }
    }

    const paddedMin = Math.max(min * 0.75, 0)
    const paddedMax = Math.max(max * 1.25, paddedMin + Math.max(max - min, 1))

    return { yMin: paddedMin, yMax: paddedMax }
  }, [series])

  const xScale = React.useMemo(
    () =>
      scaleLinear<number>({
        domain: [DISTANCE_SLIDER.min, DISTANCE_SLIDER.max],
        range: [0, innerWidth],
      }),
    [innerWidth],
  )

  const yScale = React.useMemo(
    () =>
      scaleLinear<number>({
        domain: [yMin, yMax],
        range: [innerHeight, 0],
      }),
    [innerHeight, yMin, yMax],
  )

  const markerPoints = React.useMemo(
    () =>
      series.map((item) => ({
        vehicle: item.vehicle,
        color: item.color,
        label: item.label,
        distance: selectedDistance,
        value: calculateTco(item.vehicle, selectedDistance, driveProfile),
      })),
    [driveProfile, selectedDistance, series],
  )

  const [fadeIn, api] = useSpring(() => ({ opacity: 1 }))

  React.useEffect(() => {
    api.start({
      from: { opacity: 0 },
      to: { opacity: 1 },
      config: { tension: 170, friction: 26 },
    })
  }, [api, driveProfile, selectedDistance, series])

  return (
    <svg role="img" width={width} height={height} aria-label="Animated total cost of ownership chart">
      <g transform={`translate(${margins.left}, ${margins.top})`}>
        <GridRows
          scale={yScale}
          width={innerWidth}
          stroke="rgba(148, 163, 184, 0.2)"
          numTicks={4}
        />
        <AxisLeft
          scale={yScale}
          hideZero
          numTicks={4}
          tickFormat={(value) => formatCurrency(Number(value))}
          stroke="#1e293b"
          tickStroke="#64748b"
          tickLabelProps={() => ({
            fill: '#94a3b8',
            fontSize: 12,
            dx: '-0.75em',
            textAnchor: 'end',
          })}
        />
        <AxisBottom
          top={innerHeight}
          scale={xScale}
          numTicks={5}
          stroke="#1e293b"
          tickStroke="#64748b"
          tickFormat={(value) => `${Number(value) / 1000}k`}
          tickLabelProps={() => ({
            fill: '#94a3b8',
            fontSize: 12,
            dy: '1.5em',
          })}
        />
        {series.map((item) => (
          <AnimatedGroup key={item.vehicle} style={fadeIn}>
            <LinePath
              data={item.points}
              x={(d) => xScale(d.distance)}
              y={(d) => yScale(d.value)}
              stroke={item.color}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </AnimatedGroup>
        ))}
        <line
          x1={xScale(selectedDistance)}
          x2={xScale(selectedDistance)}
          y1={0}
          y2={innerHeight}
          stroke="#e2e8f0"
          strokeDasharray="4 6"
          strokeWidth={1}
          opacity={0.5}
        />
        {markerPoints.map((point) => (
          <g key={point.vehicle}>
            <circle
              cx={xScale(point.distance)}
              cy={yScale(point.value)}
              r={6}
              fill="#0f172a"
              stroke={point.color}
              strokeWidth={3}
            />
          </g>
        ))}
      </g>
    </svg>
  )
}
