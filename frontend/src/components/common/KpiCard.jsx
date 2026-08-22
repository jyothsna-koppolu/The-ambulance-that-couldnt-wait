const TONE_BAR = {
  critical: 'bg-critical',
  warn: 'bg-high',
  ok: 'bg-ok',
  neutral: 'bg-accent',
}

export default function KpiCard({ label, value, delta, tone = 'neutral' }) {
  return (
    <article className="relative overflow-hidden rounded-lg border border-line bg-panel px-4 py-3">
      <span className={`absolute inset-y-0 left-0 w-0.5 ${TONE_BAR[tone]}`} />
      <p className="text-[11px] tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-1 font-mono text-2xl font-semibold tracking-tight text-ink">{value}</p>
      <p className="mt-1 text-[11px] text-muted">{delta}</p>
    </article>
  )
}
