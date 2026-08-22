import { hospitalAlerts } from '../../data/dashboard'
import Panel from '../common/Panel'
import StatusBadge from '../common/StatusBadge'

export default function HospitalAlerts() {
  return (
    <Panel title="Hospital capacity alerts">
      <ul className="space-y-3">
        {hospitalAlerts.map((alert) => (
          <li key={alert.id} className="border-b border-line pb-3 last:border-0 last:pb-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-ink">{alert.title}</p>
              <StatusBadge value={alert.level === 'WARN' ? 'HIGH' : alert.level === 'OK' ? 'LOW' : alert.level} />
            </div>
            <p className="mt-1 text-xs leading-5 text-muted">{alert.detail}</p>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
