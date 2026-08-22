import Panel from '../common/Panel'
import StatusBadge from '../common/StatusBadge'
import { useEmergency } from '../../context/EmergencyContext'

export default function HospitalStatus() {
  const { hospitals } = useEmergency()
  return (
    <Panel title="Hospital status" action={<span className="font-mono text-[10px] text-muted">OPERATIONAL DATA</span>}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-xs">
          <thead className="text-[10px] tracking-wide text-muted uppercase">
            <tr>
              <th className="pb-2 font-medium">Facility</th>
              <th className="pb-2 font-medium">Load</th>
              <th className="pb-2 font-medium">Trauma</th>
              <th className="pb-2 font-medium">Admission delay</th>
            </tr>
          </thead>
          <tbody>
            {hospitals.map((hospital) => (
              <tr key={hospital.id} className="border-t border-line">
                <td className="py-2">
                  <span className="font-mono text-accent">{hospital.id}</span>
                  <span className="ml-2 text-ink">{hospital.name}</span>
                </td>
                <td className="py-2">
                  <StatusBadge value={hospital.load} />
                </td>
                <td className="py-2 text-ink">{hospital.trauma ? 'Yes' : 'No'}</td>
                <td className="py-2 text-muted">{hospital.delay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}
