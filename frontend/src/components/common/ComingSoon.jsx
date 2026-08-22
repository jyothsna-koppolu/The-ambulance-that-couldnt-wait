import { Link } from 'react-router-dom'
import PageHeader from './PageHeader'
import Panel from './Panel'

export default function ComingSoon({ title, phase, summary, bullets }) {
  return (
    <div>
      <PageHeader
        eyebrow="Phase placeholder"
        title={title}
        description="This screen is reserved for a later implementation phase. The command-center shell is live; this module is not yet connected to engines or APIs."
      />
      <Panel title="Status">
        <p className="text-sm text-ink">{summary}</p>
        <p className="mt-2 font-mono text-xs text-accent">{phase}</p>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          {bullets.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
        <Link
          to="/"
          className="mt-6 inline-flex rounded border border-line px-3 py-2 text-xs font-medium tracking-wide text-ink uppercase hover:border-accent hover:text-accent"
        >
          Return to dashboard
        </Link>
      </Panel>
    </div>
  )
}
