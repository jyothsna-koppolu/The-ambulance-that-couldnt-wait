import Panel from '../common/Panel'
import StatusBadge from '../common/StatusBadge'
import { useEmergency } from '../../context/EmergencyContext'

export default function AmbulanceStatus() {
  const { ambulances } = useEmergency()
  return (
    <Panel title="Ambulance status" action={<span className="font-mono text-[10px] text-muted">OPERATIONAL DATA</span>}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-xs">
          <thead className="text-[10px] tracking-wide text-muted uppercase">
            <tr>
              <th className="pb-2 font-medium">Unit</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Pred. ETA</th>
              <th className="pb-2 font-medium">Traffic</th>
              <th className="pb-2 font-medium">Equipment</th>
            </tr>
          </thead>
          <tbody>
            {ambulances.map((unit) => (
              <tr key={unit.id} className="border-t border-line">
                <td className="py-2 font-mono text-accent">{unit.id}</td>
                <td className="py-2">
                  <StatusBadge value={unit.status} />
                </td>
                <td className="py-2 text-ink">{unit.eta}</td>
                <td className="py-2">
                  <StatusBadge value={unit.traffic} />
                </td>
                <td className="py-2 text-muted">{unit.equipment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}
