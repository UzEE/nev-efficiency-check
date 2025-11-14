export const VEHICLE_TYPES = {
  ice: {
    key: 'ice',
    label: 'ICE (H6 1.5T)',
    upfrontPrice: 9_624_054,
    color: '#f97316'
  },
  hev: {
    key: 'hev',
    label: 'HEV',
    upfrontPrice: 12_413_603,
    color: '#22d3ee'
  },
  phev: {
    key: 'phev',
    label: 'H6 PHEV (Lazy)',
    upfrontPrice: 13_619_952,
    color: '#c084fc'
  },
  phevDiligent: {
    key: 'phevDiligent',
    label: 'H6 PHEV (Diligent – all city EV)',
    upfrontPrice: 13_619_952,
    color: '#f472b6'
  },
  bev: {
    key: 'bev',
    label: 'BEV (Atto 3)',
    upfrontPrice: 9_400_000,
    color: '#a3e635'
  }
} as const;

export type VehicleKey = keyof typeof VEHICLE_TYPES;

export type EfficiencyEntry = {
  label: string;
  value: number;
  unit: string;
};

export const VEHICLE_EFFICIENCY: Record<VehicleKey, Array<EfficiencyEntry>> = {
  ice: [
    {
      label: 'Petrol cycle',
      value: 12.3,
      unit: 'km/L'
    }
  ],
  hev: [
    {
      label: 'Petrol cycle',
      value: 19.4,
      unit: 'km/L'
    }
  ],
  phev: [
    {
      label: 'Hybrid petrol assist',
      value: 17.8,
      unit: 'km/L'
    },
    {
      label: 'Battery-only',
      value: 6.4,
      unit: 'km/kWh'
    }
  ],
  phevDiligent: [
    {
      label: 'City EV mode',
      value: 6.4,
      unit: 'km/kWh'
    },
    {
      label: 'Highway hybrid assist',
      value: 13.33,
      unit: 'km/L'
    }
  ],
  bev: [
    {
      label: 'Battery-only',
      value: 6.1,
      unit: 'km/kWh'
    }
  ]
};

export const ENERGY_INPUTS = {
  petrolPricePerLitre: 265,
  homeElectricityPerKwh: 20,
  fastChargePerKwh: 80,
  homeChargingShare: 0.8,
  fastChargingShare: 0.2
} as const;

export const DRIVE_PROFILES = {
  urban: {
    key: 'urban',
    label: 'Urban',
    description: '80% city / 20% highway',
    rates: {
      ice: 24.99,
      hev: 15.9,
      phev: 12.51,
      phevDiligent: 6.96,
      bev: 5.09
    }
  },
  mix: {
    key: 'mix',
    label: 'Mix',
    description: '75% city / 25% highway',
    rates: {
      ice: 24.61,
      hev: 16.09,
      phev: 12.82,
      phevDiligent: 7.62,
      bev: 5.55
    }
  },
  long: {
    key: 'long',
    label: 'Long Distance',
    description: '67% city / 33% highway',
    rates: {
      ice: 23.98,
      hev: 16.4,
      phev: 13.34,
      phevDiligent: 8.67,
      bev: 6.32
    }
  }
} as const;

export type DriveProfileKey = keyof typeof DRIVE_PROFILES;

export const DISTANCE_SLIDER = {
  min: 0,
  max: 500_000,
  step: 1_000,
  defaultValue: 250_000
} as const;

export const CHART_POINTS = 64;
