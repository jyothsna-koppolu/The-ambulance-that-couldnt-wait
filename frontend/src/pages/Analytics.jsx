import PageHeader from '../components/common/PageHeader'
import Panel from '../components/common/Panel'
import KpiCard from '../components/common/KpiCard'
import { useEmergency } from '../context/EmergencyContext'

export default function Analytics() {
  const { emergencies, ambulances } = useEmergency()
  const active = emergencies.filter(item => !['ARRIVED', 'COMPLETED'].includes(item.status))
  const completed = emergencies.filter(item => ['ARRIVED', 'COMPLETED'].includes(item.status))
  const critical = active.filter(item => item.severity === 'CRITICAL')

  return (
    <div>
      <PageHeader eyebrow="Operational analytics" title="Analytics" description="Synthetic response and utilization metrics from the current operational state." />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KpiCard label="Active Emergencies" value={active.length} delta="Operational data" tone="critical" />
        <KpiCard label="Completed Emergencies" value={completed.length} delta="Arrived / completed" tone="ok" />
        <KpiCard label="Critical Cases" value={critical.length} delta="Dispatcher-entered" tone="critical" />
        <KpiCard label="Active Ambulances" value={ambulances.filter(item => item.status !== 'OFFLINE').length} delta={`${ambulances.length} in fleet`} tone="neutral" />
      </div>
      <Panel title="Response overview" className="mt-4" action={<span className="font-mono text-[10px] text-muted">SIMULATED DATA</span>}>
        <div className="grid gap-4 text-sm sm:grid-cols-3">
          <div><p className="text-[10px] text-muted uppercase">Average response</p><p className="mt-1 font-mono text-xl text-ink">8.4 min</p></div>
          <div><p className="text-[10px] text-muted uppercase">Average hospital arrival</p><p className="mt-1 font-mono text-xl text-ink">14.2 min</p></div>
          <div><p className="text-[10px] text-muted uppercase">Estimated time saved</p><p className="mt-1 font-mono text-xl text-ok">7 min</p></div>
        </div>
      </Panel>
    </div>
  )
}
