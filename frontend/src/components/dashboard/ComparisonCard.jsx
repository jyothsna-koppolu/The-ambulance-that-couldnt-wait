import Panel from '../common/Panel'

export default function ComparisonCard({ comparison }) {
  if (!comparison) {
    return (
      <Panel
        title="Before vs LifeLine AI"
        action={<span className="font-mono text-[10px] text-high uppercase">Synthetic data</span>}
      >
        <p className="text-sm text-muted">Dispatch an emergency to see dynamic comparison.</p>
      </Panel>
    )
  }

  return (
    <Panel
      title="Before vs LifeLine AI"
      action={<span className="font-mono text-[10px] text-high uppercase">Simulated result</span>}
    >
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
        <Column title="Normal response" rows={comparison.normal} />
        <Column title="LifeLine AI" rows={comparison.lifeline} accent />
        <div className="flex min-w-[160px] flex-col justify-center rounded border border-ok/30 bg-ok/10 px-4 py-5 text-center">
          <p className="text-[10px] tracking-[0.16em] text-ok uppercase">Estimated time saved</p>
          <p className="mt-2 font-mono text-4xl font-semibold text-ok">{comparison.saved}</p>
          <p className="mt-2 text-[11px] text-muted">Not a measured real-world result</p>
        </div>
      </div>
    </Panel>
  )
}

function Column({ title, rows, accent = false }) {
  const items = [
    ['Route', rows.route],
    ['Ambulance', rows.ambulance],
    ['Hospital', rows.hospital],
    ['Response', rows.response],
    ['Traffic delay', rows.trafficDelay],
    ['Admission delay', rows.admissionDelay],
  ]

  return (
    <div className={`rounded border px-4 py-3 ${accent ? 'border-accent/40 bg-accent/5' : 'border-line bg-canvas/40'}`}>
      <p className="text-xs font-semibold tracking-wide text-muted uppercase">{title}</p>
      <dl className="mt-3 space-y-2">
        {items.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 text-xs">
            <dt className="text-muted">{label}</dt>
            <dd className="text-right text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
