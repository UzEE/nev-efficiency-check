import { CHART_POINTS, DISTANCE_SLIDER, DRIVE_PROFILES, VEHICLE_TYPES } from './constants'
import type { DriveProfileKey, VehicleKey } from './constants'

export type TcoPoint = {
  distance: number
  value: number
}

export type TcoSeries = {
  vehicle: VehicleKey
  label: string
  color: string
  points: Array<TcoPoint>
}

export const getRatePerKm = (vehicle: VehicleKey, profile: DriveProfileKey) =>
  DRIVE_PROFILES[profile].rates[vehicle]

export const calculateTco = (
  vehicle: VehicleKey,
  distance: number,
  profile: DriveProfileKey,
): number => {
  const rate = getRatePerKm(vehicle, profile)
  const upfront = VEHICLE_TYPES[vehicle].upfrontPrice
  return upfront + rate * distance
}

export const buildSeries = (
  profile: DriveProfileKey,
  maxDistance = DISTANCE_SLIDER.max,
): Array<TcoSeries> => {
  const step = Math.max(maxDistance / CHART_POINTS, DISTANCE_SLIDER.step)
  const vehicleKeys = Object.keys(VEHICLE_TYPES) as Array<VehicleKey>

  return vehicleKeys.map((vehicle) => {
    const { label, color } = VEHICLE_TYPES[vehicle]
    const points: Array<TcoPoint> = []
    const start = Number(DISTANCE_SLIDER.min)

    for (let distance = start; distance <= maxDistance; distance += step) {
      points.push({
        distance,
        value: calculateTco(vehicle, distance, profile),
      })
    }

    if (points[points.length - 1]?.distance !== maxDistance) {
      points.push({
        distance: maxDistance,
        value: calculateTco(vehicle, maxDistance, profile),
      })
    }

    return {
      vehicle,
      label,
      color,
      points,
    }
  })
}

export const getSeriesSummary = (
  distance: number,
  profile: DriveProfileKey,
) =>
  (Object.keys(VEHICLE_TYPES) as Array<VehicleKey>).map((vehicle) => ({
    vehicle,
    label: VEHICLE_TYPES[vehicle].label,
    color: VEHICLE_TYPES[vehicle].color,
    upfront: VEHICLE_TYPES[vehicle].upfrontPrice,
    rate: getRatePerKm(vehicle, profile),
    value: calculateTco(vehicle, distance, profile),
  }))

export const DRIVE_PROFILE_OPTIONS = (Object.keys(DRIVE_PROFILES) as Array<DriveProfileKey>).map((key) => ({
  key,
  label: DRIVE_PROFILES[key].label,
  description: DRIVE_PROFILES[key].description,
}))
