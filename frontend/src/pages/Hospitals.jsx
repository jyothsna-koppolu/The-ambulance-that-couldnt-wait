import PageHeader from '../components/common/PageHeader'
import Panel from '../components/common/Panel'
import StatusBadge from '../components/common/StatusBadge'
import { useEmergency } from '../context/EmergencyContext'

export default function Hospitals() {
  const { hospitals, emergencies, ambulances } = useEmergency()

  return (
    <div>
      <PageHeader eyebrow="Hospital network" title="Hospitals" description="Synthetic hospital availability and capability data for operational display." />
      <Panel title="Hospital status" action={<span className="font-mono text-[10px] text-muted">OPERATIONAL DATA</span>}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead className="text-[10px] tracking-wide text-muted uppercase">
              <tr>
                <th className="pb-2 font-medium">Hospital</th>
                <th className="pb-2 font-medium">Load</th>
                <th className="pb-2 font-medium">Capabilities</th>
                <th className="pb-2 font-medium">Delay</th>
                <th className="pb-2 font-medium">Incoming</th>
              </tr>
            </thead>
            <tbody>
              {hospitals.map(hospital => (
                <tr key={hospital.id} className="border-t border-line">
                  <td className="py-3"><p className="font-medium text-ink">{hospital.name}</p><p className="font-mono text-[10px] text-muted">{hospital.id}</p></td>
                  <td className="py-3"><StatusBadge value={hospital.load} /></td>
                  <td className="py-3 text-muted">{['trauma', 'cardiac', 'stroke', 'burns', 'als'].filter(capability => hospital[capability]).join(' · ')}</td>
                  <td className="py-3 text-ink">{hospital.delay}</td>
                  <td className="py-3 text-muted">{emergencies.filter(emergency => emergency.assignedHospitalId === hospital.id && !['ARRIVED', 'COMPLETED'].includes(emergency.status)).map(emergency => {
                    const ambulance = ambulances.find(unit => unit.id === emergency.assignedAmbulanceId)
                    return `${ambulance?.id || 'Unassigned'} · ${emergency.id}`
                  }).join(' · ') || 'None reported'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
