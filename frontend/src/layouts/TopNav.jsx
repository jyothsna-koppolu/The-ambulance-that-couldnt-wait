import { Bell, Menu } from 'lucide-react'
import { SYSTEM_STATUS } from '../data/dashboard'
import StatusBadge from '../components/common/StatusBadge'
import { useEmergency } from '../context/EmergencyContext'

export default function TopNav({ onMenu }) {
  const { emergencies } = useEmergency()
  const activeEmergencies = emergencies.filter(emergency => !['ARRIVED', 'COMPLETED'].includes(emergency.status))
  const criticalCount = activeEmergencies.filter((item) => item.severity === 'CRITICAL').length

  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b border-line bg-panel px-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded border border-line p-2 text-muted lg:hidden"
          onClick={onMenu}
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>
        <div>
          <p className="text-xs text-muted">{SYSTEM_STATUS.region}</p>
          <p className="font-mono text-sm text-ink">{SYSTEM_STATUS.clock}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <span className="hidden items-center gap-2 rounded border border-line px-2 py-1 sm:inline-flex">
          <span className="text-[10px] tracking-wide text-muted uppercase">System</span>
          <StatusBadge value={SYSTEM_STATUS.label} />
        </span>
        <span className="inline-flex items-center gap-2 rounded border border-line px-2 py-1">
          <span className="text-[10px] tracking-wide text-muted uppercase">Active</span>
          <span className="font-mono text-xs text-ink">{activeEmergencies.length}</span>
          <span className="text-[10px] text-critical">{criticalCount} critical</span>
        </span>
        <button
          type="button"
          className="relative rounded border border-line p-2 text-muted"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-critical" />
        </button>
        <span className="rounded border border-high/40 bg-high/10 px-2 py-1 font-mono text-[10px] text-high uppercase">
          Operational mode
        </span>
      </div>
    </header>
  )
}
