import Panel from '../common/Panel'
import StatusBadge from '../common/StatusBadge'

export default function AiAssessmentPanel({ assessment, onReassess }) {
  if (!assessment) {
    return (
      <Panel title="AI assessment" action={<span className="font-mono text-[10px] text-muted">PROTOTYPE</span>}>
        <p className="text-sm text-muted">Insufficient information for AI assessment.</p>
      </Panel>
    )
  }

  return (
    <Panel title="AI assessment" action={<span className="font-mono text-[10px] text-muted">PROTOTYPE</span>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><p className="text-[10px] tracking-wide text-muted uppercase">AI severity</p><div className="mt-1"><StatusBadge value={assessment.severity} /></div></div>
        <div><p className="text-[10px] tracking-wide text-muted uppercase">AI estimate</p><p className="mt-1 font-mono text-lg text-ok">{assessment.confidence}% confidence</p><p className="text-[10px] text-muted">Not clinically validated</p></div>
        <div><p className="text-[10px] tracking-wide text-muted uppercase">Dispatch priority</p><p className="mt-1 font-medium text-ink">{assessment.dispatchPriority}</p></div>
        <div><p className="text-[10px] tracking-wide text-muted uppercase">Recommended ambulance</p><p className="mt-1 font-mono text-accent">{assessment.recommendedAmbulanceId || 'NONE'}</p></div>
      </div>
      <div className="mt-4">
        <p className="text-[10px] tracking-wide text-muted uppercase">Reasoning</p>
        <ul className="mt-2 space-y-1 text-xs text-ink">{assessment.reasoning.map((reason, index) => <li key={`${reason}-${index}`}>{reason}</li>)}</ul>
      </div>
      <p className="mt-4 text-xs text-muted">{assessment.recommendedResponse}</p>
      <p className="mt-1 text-xs text-muted">{assessment.recommendationReason}</p>
      {assessment.operationalWarnings?.length > 0 && <div className="mt-3 rounded border border-high/30 bg-high/5 p-3 text-xs text-high">{assessment.operationalWarnings.map((warning, index) => <p key={`${warning}-${index}`}>{warning}</p>)}</div>}
      <p className="mt-3 text-[10px] text-muted">AI decision support only. Not a medical diagnosis or substitute for professional emergency judgment.</p>
      {onReassess && <button onClick={onReassess} className="mt-3 rounded border border-line px-3 py-2 text-xs font-medium text-ink hover:border-accent hover:text-accent">REASSESS</button>}
    </Panel>
  )
}