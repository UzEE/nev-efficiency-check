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
import { formatCurrency } from 'app/lib/utils'
import type { DriveProfileKey } from 'app/lib/constants'
import type { TcoSeries } from 'app/lib/tco'

type TCOChartProps = {
  series: Array<TcoSeries>
  selectedDistance: number
  driveProfile: DriveProfileKey
}

const margins = { top: 20, right: 20, bottom: 40, left: 80 }

export function TCOChart({ series, selectedDistance, driveProfile }: TCOChartProps) {
  const profileCopy = DRIVE_PROFILES[driveProfile]

  const [isClient, setIsClient] = React.useState(false)
  React.useEffect(() => setIsClient(true), [])

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
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {series.map((item) => (
            <span key={item.vehicle} className="flex items-center gap-2">
              <span
                className="h-2 w-8 rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              {item.label}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-6 h-[420px] w-full">
        {isClient ? (
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

  const yMaxValue = React.useMemo(() => {
    return series.reduce((acc, item) => {
      const localMax = item.points.reduce((pointMax, point) => Math.max(pointMax, point.value), 0)
      return Math.max(acc, localMax)
    }, 0)
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
        domain: [0, yMaxValue * 1.05],
        range: [innerHeight, 0],
      }),
    [innerHeight, yMaxValue],
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

  const [fadeIn, api] = useSpring(() => ({ opacity: 0 }))

  React.useEffect(() => {
    api.start({
      from: { opacity: 0 },
      to: { opacity: 1 },
      config: { tension: 170, friction: 26 },
    })
  }, [api, driveProfile, selectedDistance])

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
            dx: '-0.5em',
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
        {/* Marker */}
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
