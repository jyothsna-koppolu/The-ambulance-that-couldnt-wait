import { useNavigate } from 'react-router-dom'
import { useEmergency } from '../context/EmergencyContext'
import StatusBadge from '../components/common/StatusBadge'

export default function Ambulances() {
  const navigate = useNavigate()
  const { emergencies, ambulances } = useEmergency()

  const getAmbulanceEmergency = (ambulanceId) => {
    return emergencies.find(e => e.assignedAmbulanceId === ambulanceId)
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">Fleet management</p>
        <h1 className="text-2xl font-semibold tracking-tight">Ambulances</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ambulances.map((ambulance) => {
          const assignedEmergency = getAmbulanceEmergency(ambulance.id)
          
          return (
            <div
              key={ambulance.id}
              className="rounded-lg border border-line bg-canvas/40 p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-lg font-semibold text-accent">{ambulance.id}</p>
                  <p className="text-xs text-muted">{ambulance.equipment}</p>
                </div>
                <StatusBadge value={ambulance.status} />
              </div>

              {assignedEmergency && (
                <div className="mt-4 rounded border border-line bg-canvas/60 p-3">
                  <p className="text-[10px] tracking-[0.18em] text-muted uppercase">Assigned Emergency</p>
                  <p className="mt-1 font-mono text-sm text-accent">{assignedEmergency.id}</p>
                  <p className="text-sm text-ink">{assignedEmergency.emergencyType}</p>
                  <p className="text-xs text-muted">{assignedEmergency.locationLabel}</p>
                </div>
              )}

              <div className="mt-3 text-xs text-muted">
                Crew: <span className="text-ink">{ambulance.crew?.id} · {ambulance.crew?.name}</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-[10px] text-muted uppercase">ETA</p>
                  <p className="text-ink">{ambulance.eta}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted uppercase">Traffic</p>
                  <p className="text-ink">{ambulance.traffic}</p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/crew/${ambulance.id}`)}
                className="mt-4 w-full rounded border border-accent/40 bg-accent/5 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
              >
                OPEN CREW VIEW
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
