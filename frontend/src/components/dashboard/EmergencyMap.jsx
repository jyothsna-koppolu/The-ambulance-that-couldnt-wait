import { useState } from 'react'
import { mapNodes } from '../../data/dashboard'
import { patientLocations } from '../../data/dashboard'
import { useEmergency } from '../../context/EmergencyContext'

const TONE = {
  severe: '#ef4455',
  warn: '#f59e3b',
  ok: '#3dd6c6',
}

export default function EmergencyMap({ 
  selectedRoute = 'B', 
  ambulancePosition = null,
  patientLocation = null 
}) {
  const [zoom, setZoom] = useState(1)
  const [center, setCenter] = useState({ x: 50, y: 50 })
  const { ambulances, hospitals, emergencies } = useEmergency()
  const patient = patientLocation || mapNodes.patient
  const activeEmergencies = emergencies.filter(emergency => !['ARRIVED', 'COMPLETED'].includes(emergency.status))
  const activeUnit = ambulances.find(unit => ['EN_ROUTE', 'TRANSPORTING'].includes(unit.status) && unit.assignedEmergencyId)
  const activeEmergency = activeUnit ? emergencies.find(emergency => emergency.id === activeUnit.assignedEmergencyId) : null
  const activeDestination = activeUnit?.status === 'TRANSPORTING'
    ? hospitals.find(hospital => hospital.id === activeEmergency?.assignedHospitalId)
    : patientLocations.find(location => location.name === activeEmergency?.locationLabel)
  const activeTarget = activeDestination?.location || activeDestination

  return (
    <PanelMap>
      <div className="absolute right-4 top-16 z-10 flex flex-col overflow-hidden rounded border border-line bg-panel/90">
        <button type="button" onClick={() => setZoom(value => Math.min(value + 0.25, 2))} className="px-3 py-2 text-sm text-ink hover:bg-white/5" aria-label="Zoom in">+</button>
        <button type="button" onClick={() => setZoom(value => Math.max(value - 0.25, 1))} className="border-t border-line px-3 py-2 text-sm text-ink hover:bg-white/5" aria-label="Zoom out">-</button>
        <button type="button" onClick={() => { setZoom(1); setCenter({ x: 50, y: 50 }) }} className="border-t border-line px-2 py-2 text-[10px] text-muted hover:bg-white/5" aria-label="Recenter map">CENTER</button>
      </div>
      <svg viewBox={`${center.x - 50 / zoom} ${center.y - 50 / zoom} ${100 / zoom} ${100 / zoom}`} className="h-full w-full" role="img" aria-label="Synthetic road emergency operations map">
        <defs>
          <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#1c2a38" strokeWidth="0.4" />
          </pattern>
          <marker id="route-arrow" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
            <path d="M 0 0 L 4 2 L 0 4 z" fill="#3dd6c6" />
          </marker>
        </defs>
        <rect width="100" height="100" fill="#0a1219" />
        <rect width="100" height="100" fill="url(#grid)" />
        <path d="M 8 22 H 92" stroke="#243445" strokeWidth="1.2" />
        <path d="M 8 48 H 92" stroke="#243445" strokeWidth="1.6" />
        <path d="M 8 74 H 92" stroke="#243445" strokeWidth="1.2" />
        <path d="M 22 8 V 92" stroke="#243445" strokeWidth="1.2" />
        <path d="M 48 8 V 92" stroke="#243445" strokeWidth="1.6" />
        <path d="M 76 8 V 92" stroke="#243445" strokeWidth="1.2" />

        <g fill="none" stroke="#344b5d" strokeWidth="0.8" opacity="0.9">
          <path d="M 8 14 C 24 20, 38 18, 52 26 S 78 34, 92 30" />
          <path d="M 8 38 C 28 34, 40 42, 58 38 S 78 44, 92 54" />
          <path d="M 10 86 C 28 72, 42 82, 58 70 S 78 76, 90 86" />
          <path d="M 14 8 C 22 24, 18 44, 30 58 S 34 78, 42 92" />
          <path d="M 58 8 C 52 22, 64 38, 58 52 S 66 76, 62 92" />
          <path d="M 86 8 C 74 22, 84 42, 76 58 S 82 78, 86 92" />
        </g>
        <g fill="#8a9bb0" fontSize="2.4" fontFamily="IBM Plex Mono, monospace">
          <text x="11" y="12">NORTH AVE</text><text x="11" y="36">HARBOR ROAD</text><text x="11" y="84">RIVERSIDE BLVD</text>
          <text x="15" y="20" transform="rotate(78 15 20)">6TH AVE</text><text x="55" y="20" transform="rotate(84 55 20)">METRO WAY</text><text x="83" y="18" transform="rotate(82 83 18)">EAST LINK</text>
        </g>
        {activeUnit && activeTarget && (
          <path
            d={`M ${activeUnit.location.x} ${activeUnit.location.y} Q ${(activeUnit.location.x + activeTarget.x) / 2} ${Math.min(activeUnit.location.y, activeTarget.y) - 10} ${activeTarget.x} ${activeTarget.y}`}
            fill="none"
            stroke="#3dd6c6"
            strokeWidth="1.5"
            strokeDasharray="2 1"
            markerEnd="url(#route-arrow)"
          />
        )}

        {mapNodes.routes.map((route) => (
          <g key={route.id}>
            <path
              d={route.d}
              fill="none"
              stroke={TONE[route.tone]}
              strokeWidth={route.id === selectedRoute ? 1.8 : 1.1}
              strokeDasharray={route.id === selectedRoute ? undefined : '1.6 1.4'}
              opacity={route.id === selectedRoute ? 1 : 0.7}
              markerEnd={route.id === selectedRoute ? 'url(#route-arrow)' : undefined}
            />
            {route.id === selectedRoute && <text x="55" y="62" fill="#3dd6c6" fontSize="2.8" fontFamily="IBM Plex Mono, monospace">SIMULATED ROUTE · {route.label}</text>}
          </g>
        ))}

        {ambulances.map((unit) => {
          const pos = ambulancePosition && unit.id === ambulancePosition.id ? ambulancePosition : unit.location
          return (
            <g key={unit.id}>
              <circle cx={pos.x} cy={pos.y} r="2.2" fill="#3dd6c6" />
              <text x={pos.x + 3} y={pos.y + 1} fill="#8a9bb0" fontSize="3.2" fontFamily="IBM Plex Mono, monospace">
                {unit.id}
              </text>
            </g>
          )
        })}

        {hospitals.map((hospital) => (
          <g key={hospital.id}>
            <rect x={hospital.location.x - 1.6} y={hospital.location.y - 1.6} width="3.2" height="3.2" fill="#e8eef4" />
            <text x={hospital.location.x + 3} y={hospital.location.y + 1.2} fill="#8a9bb0" fontSize="3" fontFamily="IBM Plex Sans, sans-serif">
              {hospital.name}
            </text>
          </g>
        ))}

        {(activeEmergencies.length > 0 ? activeEmergencies : [{ id: 'fallback-patient', locationLabel: patient.label }]).map((emergency) => {
          const location = emergency.locationCoordinates || patientLocations.find(candidate => candidate.name === emergency.locationLabel) || patient
          return (
            <g key={emergency.id}>
              <circle cx={location.x} cy={location.y} r="3.2" fill="#ef4455" />
              <circle cx={location.x} cy={location.y} r="5.4" fill="none" stroke="#ef4455" strokeWidth="0.5" opacity="0.7" />
              <text x={location.x + 4} y={location.y - 3} fill="#ef4455" fontSize="3.4" fontFamily="IBM Plex Sans, sans-serif">
                {emergency.id === 'fallback-patient' ? 'Patient scene' : emergency.id}
              </text>
            </g>
          )
        })}
      </svg>
    </PanelMap>
  )
}

function PanelMap({ children }) {
  return (
    <section className="flex min-h-[420px] flex-col overflow-hidden rounded-lg border border-line bg-panel">
      <header className="flex items-center justify-between border-b border-line px-4 py-3">
        <div>
          <h2 className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">Live emergency map</h2>
          <p className="mt-1 text-[11px] text-muted">Modular map abstraction · synthetic coordinates</p>
        </div>
        <span className="rounded border border-high/40 bg-high/10 px-2 py-1 font-mono text-[10px] text-high uppercase">
          Synthetic / simulated map
        </span>
      </header>
      <div className="relative min-h-0 flex-1 p-2">{children}</div>
      <footer className="flex flex-wrap gap-4 border-t border-line px-4 py-2 text-[11px] text-muted">
        <Legend color="#ef4455" label="Patient" />
        <Legend color="#3dd6c6" label="Ambulance" />
        <Legend color="#e8eef4" label="Hospital" />
        <Legend color="#3dd6c6" label="Recommended route" solid />
        <Legend color="#ef4455" label="Congested alternatives" />
      </footer>
    </section>
  )
}

function Legend({ color, label, solid = false }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="h-2 w-4 rounded-sm"
        style={{
          background: solid ? color : 'transparent',
          borderBottom: solid ? undefined : `2px dashed ${color}`,
          backgroundColor: solid ? color : color,
          opacity: solid ? 1 : 0.85,
        }}
      />
      {label}
    </span>
  )
}
