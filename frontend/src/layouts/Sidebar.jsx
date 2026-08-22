import { NavLink } from 'react-router-dom'
import {
  Activity,
  Ambulance,
  BarChart3,
  Brain,
  Building2,
  LayoutDashboard,
  Map,
  PlayCircle,
  Siren,
} from 'lucide-react'

const LINKS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/emergencies', label: 'Emergency Requests', icon: Siren },
  { to: '/ambulances', label: 'Ambulances', icon: Ambulance },
  { to: '/hospitals', label: 'Hospitals', icon: Building2 },
  { to: '/map', label: 'Live Map', icon: Map },
  { to: '/insights', label: 'AI Insights', icon: Brain },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/simulation', label: 'Simulation', icon: PlayCircle },
]

export default function Sidebar({ onNavigate }) {
  return (
    <aside className="flex h-full w-[240px] shrink-0 flex-col border-r border-line bg-panel">
      <div className="border-b border-line px-4 py-5">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded border border-accent/40 bg-accent/10">
            <Activity className="h-4 w-4 text-accent" />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-wide text-ink">LifeLine AI</p>
            <p className="text-[10px] tracking-[0.12em] text-muted uppercase">Emergency ops</p>
          </div>
        </div>
        <p className="mt-3 text-[11px] leading-4 text-muted">
          Don&apos;t find the shortest path. Find the smartest path to treatment.
        </p>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `mb-1 flex items-center gap-2 rounded px-3 py-2 text-sm ${
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-muted hover:bg-white/5 hover:text-ink'
              }`
            }
          >
            <link.icon className="h-4 w-4 shrink-0" />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <p className="border-t border-line px-4 py-3 text-[10px] leading-4 text-muted">
        Prototype for decision support. Does not replace medical professionals or authorized emergency infrastructure.
      </p>
    </aside>
  )
}
