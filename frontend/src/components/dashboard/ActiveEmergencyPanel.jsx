import Panel from '../common/Panel'
import StatusBadge from '../common/StatusBadge'
import { useEmergency } from '../../context/EmergencyContext'

export default function ActiveEmergencyPanel() {
  const { emergencies } = useEmergency()
  const activeEmergencies = emergencies.filter(item => ['NEW', 'DISPATCHED', 'EN_ROUTE', 'AT_SCENE', 'TRANSPORTING'].includes(item.status))
  return (
    <Panel
      title="Active emergencies"
      className="h-full"
      action={<span className="font-mono text-[10px] text-muted">{activeEmergencies.length} OPEN</span>}
    >
      <ul className="space-y-3">
        {activeEmergencies.map((item) => (
          <li key={item.id} className="rounded border border-line bg-panel-2 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-accent">{item.id}</p>
                  <p className="mt-1 text-sm font-medium text-ink">{item.emergencyType}</p>
              </div>
              <StatusBadge value={item.severity} />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-muted">
              <div>
                Patient <span className="text-ink">{item.patientId}</span>
              </div>
              <div>
                Status <StatusBadge value={item.status} />
              </div>
              <div className="col-span-2">{item.locationLabel}</div>
              <div>Unit {item.assignedAmbulanceId || 'Unassigned'}</div>
              <div>Hospital {item.assignedHospitalId || 'Awaiting destination'}</div>
            </dl>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
