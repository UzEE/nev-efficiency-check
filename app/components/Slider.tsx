import { DISTANCE_SLIDER } from 'app/lib/constants'
import { formatDistance } from 'app/lib/utils'

import { Slider as SliderPrimitive } from './ui/slider'

type DistanceSliderProps = {
  value: number
  onChange: (value: number) => void
}

export function DistanceSlider({ value, onChange }: DistanceSliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label htmlFor="distance-slider" className="text-sm font-medium text-slate-200">
          Distance travelled
        </label>
        <span className="text-sm font-semibold text-primary">{formatDistance(value)}</span>
      </div>
      <SliderPrimitive
        id="distance-slider"
        max={DISTANCE_SLIDER.max}
        min={DISTANCE_SLIDER.min}
        step={DISTANCE_SLIDER.step}
        value={[value]}
        onValueChange={([next]) => onChange(next ?? value)}
        aria-label="Distance in kilometers"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatDistance(DISTANCE_SLIDER.min)}</span>
        <span>{formatDistance(DISTANCE_SLIDER.max)}</span>
      </div>
    </div>
  )
}
