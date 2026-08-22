import { useParams, useNavigate } from 'react-router-dom'
import { useEmergency } from '../context/EmergencyContext'
import { patientLocations, mapNodes } from '../data/dashboard'
import { getCrewByAmbulanceId } from '../data/crew'
import { MapPin, Truck, Clock, AlertTriangle, CheckCircle } from 'lucide-react'

export default function CrewView() {
  const { ambulanceId } = useParams()
  const navigate = useNavigate()
  const { emergencies, ambulances: fleet, hospitals, crewStatus } = useEmergency()

  const ambulance = fleet.find(amb => amb.id === ambulanceId)
  const crew = getCrewByAmbulanceId(ambulanceId)
  const assignedEmergency = emergencies.find(e => e.assignedAmbulanceId === ambulanceId)
  
  const canStartResponse = assignedEmergency && assignedEmergency.status === 'DISPATCHED'
  const canArriveScene = assignedEmergency && assignedEmergency.status === 'EN_ROUTE'
  const canStartTransport = assignedEmergency && assignedEmergency.status === 'AT_SCENE'
  const canArriveHospital = assignedEmergency && assignedEmergency.status === 'TRANSPORTING'
  
  const destination = ['TRANSPORTING', 'ARRIVED'].includes(assignedEmergency?.status)
    ? hospitals.find(hospital => hospital.id === (assignedEmergency.assignedHospitalId || 'H-02'))
    : patientLocations.find(location => location.name === assignedEmergency?.locationLabel)
  
  const handleStartResponse = () => {
    if (!assignedEmergency) return
    
    crewStatus(ambulanceId, 'EN_ROUTE', 'Response started', `${ambulanceId} crew started response.`)
  }
  
  const handleArrivedAtScene = () => {
    if (!assignedEmergency) return
    
    crewStatus(ambulanceId, 'AT_SCENE', 'Arrived at scene', `${ambulanceId} arrived at emergency location.`)
  }
  
  const handleStartTransport = () => {
    if (!assignedEmergency) return
    
    crewStatus(ambulanceId, 'TRANSPORTING', 'Transport started', `${ambulanceId} started patient transport.`, 'H-02')
  }
  
  const handleArrivedAtHospital = () => {
    if (!assignedEmergency) return
    
    crewStatus(ambulanceId, 'ARRIVED', 'Arrived at hospital', `${ambulanceId} arrived at destination.`)
  }
  
  if (!ambulance) {
    return (
      <div className="min-h-screen bg-panel p-4">
        <div className="mx-auto max-w-md rounded-lg border border-critical/40 bg-critical/10 p-6 text-center">
          <AlertTriangle size={48} className="mx-auto mb-4 text-critical" />
          <h1 className="text-xl font-semibold text-critical">AMBULANCE NOT FOUND</h1>
          <p className="mt-2 text-muted">Ambulance {ambulanceId} does not exist in the fleet.</p>
          <button
            onClick={() => navigate('/ambulances')}
            className="mt-4 rounded bg-accent px-4 py-2 text-sm font-medium text-canvas"
          >
            Return to Ambulances
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-panel">
      <div className="mx-auto max-w-2xl space-y-4 p-4">
        <header className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-accent uppercase">Lifeline AI</p>
            <h1 className="text-xl font-semibold tracking-tight">Ambulance Crew</h1>
          </div>
          <button
            onClick={() => navigate('/ambulances')}
            className="rounded border border-line px-3 py-1 text-xs text-muted hover:bg-canvas"
          >
            Back
          </button>
        </header>

        <div className="rounded-lg border border-line bg-canvas/40 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Truck size={24} className="text-accent" />
              <div>
                <p className="font-mono text-lg font-semibold text-accent">{ambulance.id}</p>
                <p className="text-xs text-muted">{ambulance.equipment}</p>
                  <p className="text-xs text-muted">{crew?.id} · {crew?.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-ink">{ambulance.status}</p>
              <p className="text-xs text-muted">Metro Sector 4</p>
            </div>
          </div>

        <div className="rounded-lg border border-line bg-canvas/40 p-4">
          <p className="text-[10px] tracking-[0.18em] text-muted uppercase">Crew information</p>
          <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            <div><p className="text-[10px] text-muted uppercase">Crew members</p><p className="text-ink">{crew?.members.join(' · ')}</p></div>
            <div><p className="text-[10px] text-muted uppercase">Roles</p><p className="text-ink">{crew?.roles.join(' · ')}</p></div>
          </div>
        </div>
        </div>

        {!assignedEmergency ? (
          <div className="rounded-lg border border-line bg-canvas/40 p-8 text-center">
            <AlertTriangle size={48} className="mx-auto mb-4 text-muted" />
            <h2 className="text-lg font-semibold text-ink">NO ACTIVE ASSIGNMENT</h2>
            <p className="mt-2 text-sm text-muted">
              {ambulance.id} is {ambulance.status}. Waiting for dispatch.
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-lg border border-line bg-canvas/40 p-4">
              <p className="text-[10px] tracking-[0.18em] text-muted uppercase">Current Emergency</p>
              <div className="mt-3 space-y-2">
                <div>
                  <p className="font-mono text-sm text-accent">{assignedEmergency.id}</p>
                  <p className="text-lg font-semibold text-ink">{assignedEmergency.emergencyType}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded px-2 py-1 text-xs font-medium ${
                    assignedEmergency.severity === 'CRITICAL' 
                      ? 'bg-critical/20 text-critical' 
                      : 'bg-high/20 text-high'
                  }`}>
                    {assignedEmergency.severity}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[10px] text-muted uppercase">Patient ID</p>
                    <p className="font-mono text-accent">{assignedEmergency.patientId}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted uppercase">Patients</p>
                    <p className="text-ink">{assignedEmergency.patientCount}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-line bg-canvas/40 p-4">
              <p className="text-[10px] tracking-[0.18em] text-muted uppercase">Destination</p>
              <div className="mt-3 flex items-start gap-3">
                <MapPin size={20} className="mt-0.5 text-accent" />
                <div>
                  <p className="text-base font-medium text-ink">
                    {destination?.name || assignedEmergency.locationLabel}
                  </p>
                  <p className="text-xs text-muted">
                    {['TRANSPORTING', 'ARRIVED'].includes(assignedEmergency.status) ? 'Hospital destination' : 'Pickup location'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-line bg-canvas/40 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-accent" />
                  <p className="text-[10px] tracking-[0.18em] text-muted uppercase">ETA</p>
                </div>
                <p className="font-mono text-2xl font-semibold text-accent">
                  {ambulance.eta || '—'}
                </p>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <p className="text-xs text-muted">LIVE SIMULATION</p>
              </div>
            </div>

            <div className="rounded-lg border border-line bg-canvas/40 p-4">
              <p className="text-[10px] tracking-[0.18em] text-muted uppercase">Current Location</p>
              <div className="mt-3">
                <p className="text-base font-medium text-ink">
                  {ambulance.location
                    ? `X: ${ambulance.location.x.toFixed(1)}, Y: ${ambulance.location.y.toFixed(1)}`
                    : 'Metro Sector 4'}
                </p>
                <p className="text-xs text-muted">SYNTHETIC / SIMULATED LOCATION</p>
              </div>
            </div>

            <div className="rounded-lg border border-line bg-canvas/40 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] tracking-[0.18em] text-muted uppercase">Route Map</p>
                <span className="rounded border border-high/40 bg-high/10 px-2 py-1 font-mono text-[10px] text-high uppercase">
                  Synthetic / simulated
                </span>
              </div>
              <div className="relative aspect-square w-full overflow-hidden rounded bg-[#0a1219]">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <defs>
                    <pattern id="crew-grid" width="8" height="8" patternUnits="userSpaceOnUse">
                      <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#1c2a38" strokeWidth="0.4" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="#0a1219" />
                  <rect width="100" height="100" fill="url(#crew-grid)" />
                  
                  {mapNodes.routes.map((route) => (
                    <path
                      key={route.id}
                      d={route.d}
                      fill="none"
                      stroke={route.tone === 'severe' ? '#ef4455' : '#3dd6c6'}
                      strokeWidth="1.1"
                      strokeDasharray="1.6 1.4"
                      opacity="0.7"
                    />
                  ))}
                  
                    {hospitals.map((hospital) => (
                    <g key={hospital.id}>
                      <rect x={hospital.location.x - 1.6} y={hospital.location.y - 1.6} width="3.2" height="3.2" fill="#e8eef4" />
                    </g>
                  ))}
                  
                  <circle 
                    cx={ambulance.location?.x || 50} 
                    cy={ambulance.location?.y || 50} 
                    r="2.5" 
                    fill="#3dd6c6" 
                  />
                  <text 
                    x={(ambulance.location?.x || 50) + 3} 
                    y={(ambulance.location?.y || 50) + 1} 
                    fill="#3dd6c6" 
                    fontSize="3" 
                    fontFamily="IBM Plex Mono, monospace"
                  >
                    {ambulanceId}
                  </text>
                  
                  {assignedEmergency && (
                    <>
                      <circle 
                        cx={destination?.location?.x || destination?.x || 50} 
                        cy={destination?.location?.y || destination?.y || 50} 
                        r="3" 
                        fill="#ef4455" 
                      />
                      <circle 
                        cx={destination?.location?.x || destination?.x || 50} 
                        cy={destination?.location?.y || destination?.y || 50} 
                        r="5" 
                        fill="none" 
                        stroke="#ef4455" 
                        strokeWidth="0.5" 
                        opacity="0.7" 
                      />
                    </>
                  )}
                </svg>
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-muted">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#3dd6c6]" />
                  Ambulance
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#ef4455]" />
                  {['TRANSPORTING', 'ARRIVED'].includes(assignedEmergency?.status) ? 'Hospital' : 'Emergency'}
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-[#e8eef4]" />
                  Hospitals
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-line bg-canvas/40 p-4">
              <p className="text-[10px] tracking-[0.18em] text-muted uppercase">Current Status</p>
              <div className="mt-3">
                <p className="text-lg font-semibold text-ink">{assignedEmergency.status}</p>
              </div>
            </div>

            <div className="rounded-lg border border-line bg-canvas/40 p-4">
              <p className="text-[10px] tracking-[0.18em] text-muted uppercase">Emergency Timeline</p>
              <ol className="mt-3 space-y-3 border-l border-line pl-4">
                {(assignedEmergency.timeline || []).map((event, index) => (
                  <li key={`${event.time}-${index}`} className="relative">
                    <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-accent" />
                    <p className="font-mono text-[11px] text-accent">{event.time}</p>
                    <p className="text-sm text-ink">{event.title}</p>
                    {event.detail && <p className="text-xs text-muted">{event.detail}</p>}
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-3">
              {canStartResponse && (
                <button
                  onClick={handleStartResponse}
                  className="w-full rounded-lg bg-accent py-4 text-lg font-semibold text-canvas transition-colors hover:bg-accent/90"
                >
                  START RESPONSE
                </button>
              )}

              {canArriveScene && (
                <button
                  onClick={handleArrivedAtScene}
                  className="w-full rounded-lg bg-accent py-4 text-lg font-semibold text-canvas transition-colors hover:bg-accent/90"
                >
                  ARRIVED AT SCENE
                </button>
              )}

              {canStartTransport && (
                <button
                  onClick={handleStartTransport}
                  className="w-full rounded-lg bg-accent py-4 text-lg font-semibold text-canvas transition-colors hover:bg-accent/90"
                >
                  START TRANSPORT
                </button>
              )}

              {canArriveHospital && (
                <button
                  onClick={handleArrivedAtHospital}
                  className="w-full rounded-lg bg-accent py-4 text-lg font-semibold text-canvas transition-colors hover:bg-accent/90"
                >
                  ARRIVED AT HOSPITAL
                </button>
              )}

              {assignedEmergency.status === 'ARRIVED' && (
                <div className="rounded-lg border border-ok/40 bg-ok/10 p-4 text-center">
                  <CheckCircle size={32} className="mx-auto mb-2 text-ok" />
                  <p className="font-semibold text-ok">TRANSPORT COMPLETE</p>
                  <p className="text-sm text-muted">
                    {assignedEmergency.id} · Patient transferred to destination
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-line bg-canvas/40 p-3 text-center">
              <p className="text-[10px] text-muted">
                Use only when safe to interact.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
