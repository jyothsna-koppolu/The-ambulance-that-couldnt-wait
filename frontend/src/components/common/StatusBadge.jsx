const TONES = {
  CRITICAL: 'bg-critical/15 text-critical border-critical/30',
  HIGH: 'bg-high/15 text-high border-high/30',
  MODERATE: 'bg-moderate/15 text-moderate border-moderate/30',
  LOW: 'bg-ok/15 text-ok border-ok/30',
  OK: 'bg-ok/15 text-ok border-ok/30',
  AVAILABLE: 'bg-ok/15 text-ok border-ok/30',
  DISPATCHED: 'bg-accent/15 text-accent border-accent/30',
  EN_ROUTE: 'bg-accent/15 text-accent border-accent/30',
  TRANSPORTING: 'bg-high/15 text-high border-high/30',
  AT_SCENE: 'bg-moderate/15 text-moderate border-moderate/30',
  ARRIVED: 'bg-ok/15 text-ok border-ok/30',
  OFFLINE: 'bg-white/5 text-muted border-line',
  ASSESSING: 'bg-high/15 text-high border-high/30',
  SEVERE: 'bg-critical/15 text-critical border-critical/30',
  VERY_HIGH: 'bg-critical/15 text-critical border-critical/30',
  WARN: 'bg-high/15 text-high border-high/30',
  OPERATIONAL: 'bg-ok/15 text-ok border-ok/30',
}

export default function StatusBadge({ value }) {
  const key = String(value).replace(/\s+/g, '_')
  const tone = TONES[key] || TONES[value] || 'bg-white/5 text-muted border-line'

  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-[10px] font-medium tracking-wide uppercase ${tone}`}
    >
      {value}
    </span>
  )
}
