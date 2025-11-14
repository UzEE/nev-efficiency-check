import { describe, expect, test } from 'bun:test'

import { DRIVE_PROFILES, VEHICLE_TYPES } from './constants'
import { calculateTco } from './tco'

describe('calculateTco', () => {
  test('combines upfront price and running costs', () => {
    const distance = 1_000
    const profile = 'urban'
    const result = calculateTco('bev', distance, profile)
    const expected = VEHICLE_TYPES.bev.upfrontPrice + DRIVE_PROFILES[profile].rates.bev * distance

    expect(result).toBe(expected)
  })
})
