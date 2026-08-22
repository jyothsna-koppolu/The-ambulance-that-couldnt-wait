export default function PageHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <p className="mb-1 font-mono text-[11px] tracking-[0.18em] text-accent uppercase">{eyebrow}</p>
      )}
      <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
      {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{description}</p>}
    </div>
  )
}
