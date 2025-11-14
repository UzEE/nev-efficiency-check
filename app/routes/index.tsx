import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import { z } from 'zod';

import { DriveProfileSelector } from 'app/components/DriveProfileSelector';
import { DistanceSlider } from 'app/components/Slider';
import { TCOChart } from 'app/components/TCOChart';
import {
  DISTANCE_SLIDER,
  DRIVE_PROFILES,
  ENERGY_INPUTS,
  VEHICLE_EFFICIENCY,
  VEHICLE_TYPES
} from 'app/lib/constants';
import { buildSeries, getSeriesSummary } from 'app/lib/tco';
import { cn, formatCurrency, formatDistance } from 'app/lib/utils';
import type { DriveProfileKey, VehicleKey } from 'app/lib/constants';

const vehicleKeys = Object.keys(VEHICLE_TYPES) as Array<VehicleKey>;
const driveProfileKeys = Object.keys(DRIVE_PROFILES) as Array<DriveProfileKey>;
// z.enum requires a tuple; lint rule disallows [] syntax elsewhere, so disable for this line.
// eslint-disable-next-line @typescript-eslint/array-type
const driveProfileEnum = z.enum(driveProfileKeys as [DriveProfileKey, ...DriveProfileKey[]]);

const searchSchema = z.object({
  distance: z.coerce.number().optional(),
  profile: driveProfileEnum.optional(),
  vehicles: z.string().optional()
});

type IndexSearch = z.infer<typeof searchSchema>;

const DEFAULT_DISTANCE = DISTANCE_SLIDER.defaultValue;
const DEFAULT_PROFILE: DriveProfileKey = 'mix';

const clampDistance = (value: number) =>
  Math.min(
    Math.max(Number.isFinite(value) ? value : DEFAULT_DISTANCE, DISTANCE_SLIDER.min),
    DISTANCE_SLIDER.max
  );

const parseProfile = (value: DriveProfileKey | undefined): DriveProfileKey =>
  value && driveProfileKeys.includes(value) ? value : DEFAULT_PROFILE;

const normalizeVehicles = (list: Array<VehicleKey>): Array<VehicleKey> => {
  const unique = Array.from(new Set(list));
  const normalized = vehicleKeys.filter((vehicle) => unique.includes(vehicle));
  return normalized.length ? normalized : vehicleKeys;
};

const parseVehicles = (value?: string): Array<VehicleKey> => {
  if (!value) {
    return vehicleKeys;
  }
  const tokens = value
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean) as Array<VehicleKey>;
  return normalizeVehicles(tokens);
};

const serializeVehicles = (vehicles: Array<VehicleKey>) => vehicles.join(',');

const arraysEqual = (a: Array<VehicleKey>, b: Array<VehicleKey>) =>
  a.length === b.length && a.every((item, index) => item === b[index]);

export const Route = createFileRoute('/')({
  validateSearch: (search) => searchSchema.parse(search),
  component: IndexPage
});

function IndexPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const homeSharePercent = Math.round(ENERGY_INPUTS.homeChargingShare * 100);
  const fastSharePercent = Math.round(ENERGY_INPUTS.fastChargingShare * 100);

  const searchDistance = React.useMemo(
    () => clampDistance(search.distance ?? DEFAULT_DISTANCE),
    [search.distance]
  );
  const searchProfile = React.useMemo(() => parseProfile(search.profile), [search.profile]);
  const searchVehicles = React.useMemo(() => parseVehicles(search.vehicles), [search.vehicles]);

  const [distance, setDistance] = React.useState<number>(searchDistance);
  const [profile, setProfile] = React.useState<DriveProfileKey>(searchProfile);
  const [activeVehicles, setActiveVehicles] = React.useState<Array<VehicleKey>>(searchVehicles);

  React.useEffect(() => {
    if (distance !== searchDistance) {
      setDistance(searchDistance);
    }
  }, [distance, searchDistance]);

  React.useEffect(() => {
    if (profile !== searchProfile) {
      setProfile(searchProfile);
    }
  }, [profile, searchProfile]);

  React.useEffect(() => {
    if (!arraysEqual(activeVehicles, searchVehicles)) {
      setActiveVehicles(searchVehicles);
    }
  }, [activeVehicles, searchVehicles]);

  const updateSearch = React.useCallback(
    (partial: Partial<IndexSearch>) => {
      navigate({
        search: (prev) => {
          const next: IndexSearch = { ...prev };
          if ('distance' in partial) {
            if (partial.distance === undefined) {
              delete next.distance;
            } else {
              next.distance = partial.distance;
            }
          }
          if ('profile' in partial) {
            if (partial.profile === undefined) {
              delete next.profile;
            } else {
              next.profile = partial.profile;
            }
          }
          if ('vehicles' in partial) {
            if (!partial.vehicles) {
              delete next.vehicles;
            } else {
              next.vehicles = partial.vehicles;
            }
          }
          return next;
        },
        replace: true
      });
    },
    [navigate]
  );

  const chartSeries = React.useMemo(() => buildSeries(profile), [profile]);
  const summaries = React.useMemo(() => getSeriesSummary(distance, profile), [distance, profile]);

  const visibleSeries = React.useMemo(
    () => chartSeries.filter((item) => activeVehicles.includes(item.vehicle)),
    [chartSeries, activeVehicles]
  );

  const visibleSummaries = React.useMemo(
    () => summaries.filter((item) => activeVehicles.includes(item.vehicle)),
    [summaries, activeVehicles]
  );

  const leader = React.useMemo(() => {
    const [first, ...rest] = visibleSummaries;
    if (!first) {
      return null;
    }

    return rest.reduce((prev, curr) => (curr.value < prev.value ? curr : prev), first);
  }, [visibleSummaries]);

  const legendItems = React.useMemo(
    () => chartSeries.map(({ vehicle, label, color }) => ({ vehicle, label, color })),
    [chartSeries]
  );

  const handleDistanceChange = (nextValue: number) => {
    const clamped = clampDistance(nextValue);
    setDistance(clamped);
    updateSearch({ distance: clamped === DEFAULT_DISTANCE ? undefined : clamped });
  };

  const handleProfileChange = (nextProfile: DriveProfileKey) => {
    setProfile(nextProfile);
    updateSearch({ profile: nextProfile === DEFAULT_PROFILE ? undefined : nextProfile });
  };

  const handleLegendToggle = (vehicle: VehicleKey) => {
    setActiveVehicles((prev) => {
      const isActive = prev.includes(vehicle);
      if (isActive && prev.length === 1) {
        return prev;
      }
      const nextList = isActive ? prev.filter((item) => item !== vehicle) : [...prev, vehicle];
      const normalized = normalizeVehicles(nextList);
      updateSearch({
        vehicles:
          normalized.length === vehicleKeys.length ? undefined : serializeVehicles(normalized)
      });
      return normalized;
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-8 px-6 py-10">
      <section className="mx-auto w-full max-w-7xl space-y-5 text-center">
        <p className="text-sm uppercase tracking-widest text-primary">Simulator</p>
        <h1 className="text-5xl font-semibold text-white">Total Cost of Ownership</h1>
        <p className="text-base text-slate-300">
          Adjust distance travelled and drive profile to compare lifetime ownership costs across
          four propulsion technologies common in Pakistan.
        </p>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur md:grid-cols-2">
        <DistanceSlider value={distance} onChange={handleDistanceChange} />
        <DriveProfileSelector value={profile} onChange={handleProfileChange} />
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {visibleSummaries.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-sm text-slate-300">
            Select at least one vehicle in the legend to compare costs.
          </div>
        ) : (
          visibleSummaries.map((summary) => (
            <article
              key={summary.vehicle}
              className={cn(
                'rounded-2xl border border-white/10 bg-white/5 p-4 text-sm shadow-sm backdrop-blur',
                leader && summary.vehicle === leader.vehicle && 'border-primary/60 bg-primary/10'
              )}
            >
              <p className="text-xs uppercase tracking-wide text-slate-400">{summary.label}</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {formatCurrency(summary.value)}
              </p>
              <p className="text-xs text-slate-400">{formatDistance(distance)} travelled</p>
              <p className="mt-3 text-xs text-slate-400">
                Upfront {formatCurrency(summary.upfront)} · {summary.rate.toFixed(2)} PKR/km
              </p>
            </article>
          ))
        )}
      </section>

      <section className="mx-auto w-full max-w-7xl">
        <TCOChart
          series={visibleSeries}
          selectedDistance={distance}
          driveProfile={profile}
          legendItems={legendItems}
          activeVehicles={activeVehicles}
          onToggleVehicle={handleLegendToggle}
        />
      </section>

      <section className="mx-auto w-full max-w-7xl space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-primary/80">Fuel & energy inputs</p>
          <h2 className="text-2xl font-semibold text-white">Operating cost assumptions</h2>
          <p className="text-sm text-slate-300">
            Each PKR/km figure bakes in local fuel and charging prices for the blend described
            below. Assumes petrol at PKR {ENERGY_INPUTS.petrolPricePerLitre.toLocaleString()} / L,
            home electricity at PKR
            {` ${ENERGY_INPUTS.homeElectricityPerKwh} / kWh`} and DC fast charging at PKR
            {` ${ENERGY_INPUTS.fastChargePerKwh} / kWh`} with a {homeSharePercent}% /{' '}
            {fastSharePercent}% home/DC split for electric miles.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {Object.values(DRIVE_PROFILES).map((driveProfile) => (
            <article
              key={driveProfile.key}
              className="rounded-2xl border border-white/10 bg-slate-900/40 p-4"
            >
              <header className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {driveProfile.label}
                </p>
                <p className="text-sm text-slate-300">{driveProfile.description}</p>
              </header>
              <dl className="mt-4 space-y-2 text-sm text-slate-200">
                {vehicleKeys.map((vehicle) => {
                  const vehicleMeta = VEHICLE_TYPES[vehicle];
                  const rate = driveProfile.rates[vehicle];
                  const efficiencyEntries = VEHICLE_EFFICIENCY[vehicle];
                  return (
                    <div
                      key={`${driveProfile.key}-${vehicle}`}
                      className="flex items-center justify-between gap-3"
                    >
                      <dt className="text-xs uppercase tracking-wide text-slate-400">
                        {vehicleMeta.label}
                      </dt>
                      <dd className="text-right">
                        <p className="font-semibold text-white">{rate.toFixed(2)} PKR/km</p>
                        <ul className="space-y-0.5 text-[0.7rem] text-slate-400">
                          {efficiencyEntries.map((entry) => (
                            <li key={`${vehicle}-${entry.label}`}>
                              {entry.value} {entry.unit} · {entry.label}
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl rounded-3xl border border-white/10 bg-white/5 p-6 text-xs text-slate-400">
        <p>
          Rates exclude financing, taxation, depreciation, and maintenance escalations. Charging
          mixes assume 80% home charging with the remaining 20% delivered by mid-trip commercial DC
          fast chargers. Always validate live fuel tariffs and electricity slabs before making
          purchasing decisions.
        </p>
      </section>
    </main>
  );
}
