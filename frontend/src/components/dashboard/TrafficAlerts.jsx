import { trafficAlerts } from '../../data/dashboard'
import Panel from '../common/Panel'
import StatusBadge from '../common/StatusBadge'

export default function TrafficAlerts() {
  return (
    <Panel
      title="Traffic alerts"
      action={<span className="font-mono text-[10px] text-high uppercase">Synthetic traffic</span>}
    >
      <ul className="space-y-3">
        {trafficAlerts.map((alert) => (
          <li key={alert.id} className="border-b border-line pb-3 last:border-0 last:pb-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-ink">{alert.title}</p>
              <StatusBadge value={alert.level} />
            </div>
            <p className="mt-1 text-xs leading-5 text-muted">{alert.detail}</p>
            <p className="mt-1 font-mono text-[10px] text-muted">{alert.time}</p>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
