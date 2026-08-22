import PageHeader from '../components/common/PageHeader'
import Panel from '../components/common/Panel'
import SimulationControls from '../components/dashboard/SimulationControls'
import { useEmergency } from '../context/EmergencyContext'

export default function Simulation() {
  const { emergencies, ambulances, trafficSimulationActive, hospitalLoadChanged } = useEmergency()
  const moving = ambulances.filter(ambulance => ['EN_ROUTE', 'TRANSPORTING'].includes(ambulance.status))

  return (
    <div>
      <PageHeader eyebrow="Simulation center" title="Simulation Center" description="Synthetic movement controls for the existing emergency operations workflow." />
      <Panel title="Journey controls" action={<span className="font-mono text-[10px] text-muted">OPERATIONAL MODE</span>}>
        <SimulationControls />
        <p className="mt-4 text-xs text-muted">{moving.length} unit{moving.length === 1 ? '' : 's'} currently moving.</p>
      </Panel>
      <Panel title="Simulation status" className="mt-4">
        <div className="grid gap-4 text-sm sm:grid-cols-3">
          <div><p className="text-[10px] text-muted uppercase">Emergencies</p><p className="mt-1 font-mono text-xl text-ink">{emergencies.length}</p></div>
          <div><p className="text-[10px] text-muted uppercase">Moving units</p><p className="mt-1 font-mono text-xl text-accent">{moving.length}</p></div>
          <div><p className="text-[10px] text-muted uppercase">Location source</p><p className="mt-1 text-ink">Synthetic coordinates</p></div>
        </div>
        <p className="mt-4 text-xs text-muted">Traffic scenario: {trafficSimulationActive ? 'ACTIVE' : 'INACTIVE'} · Hospital load scenario: {hospitalLoadChanged ? 'ACTIVE' : 'INACTIVE'}</p>
      </Panel>
    </div>
  )
}
