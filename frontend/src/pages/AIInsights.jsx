import PageHeader from '../components/common/PageHeader'
import Panel from '../components/common/Panel'
import StatusBadge from '../components/common/StatusBadge'
import { useEmergency } from '../context/EmergencyContext'

export default function AIInsights() {
  const { emergencies, ambulances } = useEmergency()
  const active = emergencies.filter(item => !['ARRIVED', 'COMPLETED'].includes(item.status))
  const critical = active.filter(item => item.severity === 'CRITICAL')
  const enRoute = ambulances.filter(item => ['EN_ROUTE', 'TRANSPORTING'].includes(item.status))
  const assessments = emergencies.filter(item => item.aiAssessment)

  return (
    <div>
      <PageHeader eyebrow="Decision support" title="AI Insights" description="Operational indicators only. This page does not diagnose patients or predict severity." />
      <div className="grid gap-4 md:grid-cols-3">
        <Panel title="Active emergencies"><p className="font-mono text-3xl text-ink">{active.length}</p><p className="mt-1 text-xs text-muted">Current operational count</p></Panel>
        <Panel title="Critical cases"><p className="font-mono text-3xl text-critical">{critical.length}</p><p className="mt-1 text-xs text-muted">Dispatcher-entered severity</p></Panel>
        <Panel title="Units moving"><p className="font-mono text-3xl text-accent">{enRoute.length}</p><p className="mt-1 text-xs text-muted">Simulated movement</p></Panel>
      </div>
      <Panel title="Current operational notes" className="mt-4" action={<span className="font-mono text-[10px] text-muted">NOT A DIAGNOSIS</span>}>
        <ul className="space-y-2 text-sm text-muted">
          <li>{active.length} active emergencies currently tracked.</li>
          <li>{critical.length} critical emergency requiring dispatcher attention.</li>
          <li>{enRoute.length} ambulance units currently en route or transporting.</li>
        </ul>
      </Panel>
      <Panel title="Emergency assessments" className="mt-4" action={<span className="font-mono text-[10px] text-muted">{assessments.length} ASSESSED</span>}>
        <div className="space-y-3">
          {assessments.map(emergency => (
            <div key={emergency.id} className="rounded border border-line bg-canvas/40 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2"><span className="font-mono text-xs text-accent">{emergency.id}</span><StatusBadge value={emergency.aiAssessment.severity} /></div>
              <div className="mt-2 grid gap-2 text-xs sm:grid-cols-3"><span className="text-muted">Confidence <strong className="text-ok">{emergency.aiAssessment.confidence}%</strong></span><span className="text-muted">Priority <strong className="text-ink">{emergency.aiAssessment.dispatchPriority}</strong></span><span className="text-muted">Recommend <strong className="font-mono text-accent">{emergency.aiAssessment.recommendedAmbulanceId || 'NONE'}</strong></span></div>
              <p className="mt-2 text-xs text-muted">{emergency.aiAssessment.reasoning[0]}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
