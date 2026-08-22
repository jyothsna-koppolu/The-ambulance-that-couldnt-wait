import Panel from '../common/Panel'

export default function AiRecommendationCard({ recommendation }) {
  if (!recommendation) {
    return (
      <Panel
        title="AI recommendation"
        action={
          <span className="font-mono text-[10px] text-muted uppercase">Decision support · not a diagnosis</span>
        }
      >
        <p className="text-sm text-muted">Dispatch an emergency to see AI-powered decision support.</p>
      </Panel>
    )
  }

  return (
    <Panel
      title="AI Decision Support"
      action={
        <span className="font-mono text-[10px] text-muted uppercase">Decision support · not a diagnosis</span>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Emergency</p>
          <p className="mt-1 text-sm font-medium text-ink">{recommendation.emergency}</p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Severity</p>
          <p className="mt-1 text-sm font-medium text-ink">{recommendation.severity}</p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Recommended Ambulance</p>
          <p className="mt-1 text-sm font-medium text-accent">{recommendation.recommendedAmbulance}</p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Recommended Route</p>
          <p className="mt-1 text-sm font-medium text-accent">{recommendation.recommendedRoute}</p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Recommended Hospital</p>
          <p className="mt-1 text-sm font-medium text-accent">{recommendation.recommendedHospital}</p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Decision Confidence</p>
          <p className="mt-1 text-sm font-medium text-ok">{recommendation.decisionConfidence}</p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Predicted Ambulance ETA</p>
          <p className="mt-1 text-sm font-medium text-ink">{recommendation.predictedAmbulanceETA}</p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Predicted Hospital ETA</p>
          <p className="mt-1 text-sm font-medium text-ink">{recommendation.predictedHospitalETA}</p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Admission Delay</p>
          <p className="mt-1 text-sm font-medium text-ink">{recommendation.admissionDelay}</p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Total Estimated Journey</p>
          <p className="mt-1 text-sm font-medium text-accent">{recommendation.totalEstimatedJourney}</p>
        </div>
      </div>

      <div className="mt-4 rounded border border-line bg-canvas/60 p-3">
        <p className="text-[11px] tracking-[0.16em] text-accent uppercase">Why this decision?</p>
        <ul className="mt-2 space-y-1">
          {recommendation.reasons.map((reason, idx) => (
            <li key={idx} className="text-xs text-ink">
              {reason}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 font-mono text-xs text-ok">
        Estimated time saved: {recommendation.timeSaved}
      </p>
      <p className="mt-1 text-[10px] text-muted">
        Simulated result · Not a measured real-world medical performance
      </p>
    </Panel>
  )
}
