import { DRIVE_PROFILES } from 'app/lib/constants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

 type DriveProfileKey = keyof typeof DRIVE_PROFILES

 type DriveProfileSelectorProps = {
  value: DriveProfileKey
  onChange: (profile: DriveProfileKey) => void
}

 export function DriveProfileSelector({ value, onChange }: DriveProfileSelectorProps) {
  const selectedLabel = DRIVE_PROFILES[value].label


  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor="drive-profile" className="text-sm font-medium text-slate-200">
          Drive profile
        </label>
        <p className="text-xs text-muted-foreground">Blend of city and highway usage</p>
      </div>
      <Select value={value} onValueChange={(next) => onChange(next as DriveProfileKey)}>
        <SelectTrigger id="drive-profile">
          <SelectValue placeholder="Select a profile">{selectedLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent className="min-w-[16rem]">
          {Object.values(DRIVE_PROFILES).map((profile) => (
            <SelectItem key={profile.key} value={profile.key} textValue={profile.label}>
              <span className="font-medium text-foreground">{profile.label}</span>
              <span className="text-xs text-muted-foreground">{profile.description}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
