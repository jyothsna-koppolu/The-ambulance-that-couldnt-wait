import { useState } from 'react'
import { X, Clock, MapPin, Activity, User, AlertTriangle, Truck } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'
import { useEmergency } from '../../context/EmergencyContext'
import AiAssessmentPanel from './AiAssessmentPanel'

export default function EmergencyDetailDrawer({ emergency, onClose, onAssignAmbulance, onDispatchEmergency }) {
  const { ambulances, hospitals, reassessEmergency } = useEmergency()
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState(null)
  
  if (!emergency) return null

  const formatDate = (isoString) => {
    if (!isoString) return '—'
    return new Date(isoString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    })
  }

  const availableAmbulances = ambulances.filter(amb => amb.status === 'AVAILABLE')
  const canAssign = emergency.status === 'NEW' || emergency.status === 'ASSESSING'
  const canDispatch = emergency.status === 'DISPATCHED' && emergency.assignedAmbulanceId
  const assignedAmbulance = ambulances.find(ambulance => ambulance.id === emergency.assignedAmbulanceId)
  const assignedCrew = assignedAmbulance?.crew
  const assignedHospital = hospitals.find(hospital => hospital.id === emergency.assignedHospitalId)

  const handleAssign = () => {
    if (selectedAmbulanceId && onAssignAmbulance) {
      onAssignAmbulance(emergency.id, selectedAmbulanceId)
    }
  }

  const handleDispatch = () => {
    if (onDispatchEmergency) {
      onDispatchEmergency(emergency.id)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 h-full w-full max-w-lg overflow-y-auto border-l border-line bg-panel shadow-2xl">
        <div className="sticky top-0 border-b border-line bg-panel p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-xs text-accent">{emergency.id}</p>
              <h2 className="mt-1 text-lg font-semibold text-ink">Emergency Details</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded p-1 text-muted transition-colors hover:text-ink"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <div className="flex items-center justify-between">
            <StatusBadge value={emergency.status} />
            <span className="rounded border border-line bg-canvas/60 px-2 py-1 text-[10px] text-muted uppercase">
              {emergency.source}
            </span>
          </div>

          <div className="grid gap-4 rounded border border-line bg-canvas/40 p-4">
            <div>
              <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Patient ID</p>
              <p className="mt-1 font-mono text-sm text-accent">{emergency.patientId}</p>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Emergency Type</p>
              <p className="mt-1 text-sm text-ink">{emergency.emergencyType}</p>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Severity</p>
              <p className="mt-1 text-sm text-ink">{emergency.severity}</p>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Priority</p>
              <p className="mt-1 text-sm text-ink">{emergency.priority}</p>
            </div>
          </div>

          <AiAssessmentPanel assessment={emergency.aiAssessment} onReassess={() => reassessEmergency(emergency.id)} />

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 text-muted" />
              <div>
                <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Location</p>
                <p className="mt-1 text-sm text-ink">{emergency.locationLabel}</p>
              </div>
            </div>
            {emergency.symptoms && (
              <div className="flex items-start gap-3">
                <Activity size={16} className="mt-0.5 text-muted" />
                <div>
                  <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Symptoms</p>
                  <p className="mt-1 text-sm text-ink">{emergency.symptoms}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <User size={16} className="mt-0.5 text-muted" />
              <div className="flex gap-4">
                <div>
                  <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Age Group</p>
                  <p className="mt-1 text-sm text-ink">{emergency.ageGroup}</p>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Patients</p>
                  <p className="mt-1 text-sm text-ink">{emergency.patientCount}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 rounded border border-line bg-canvas/40 p-4">
            <div>
              <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Created</p>
              <p className="mt-1 text-sm text-ink">{formatDate(emergency.createdAt)}</p>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Last Updated</p>
              <p className="mt-1 text-sm text-ink">{formatDate(emergency.updatedAt)}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Assigned Ambulance</p>
              <p className="mt-1 text-sm text-ink">
                {emergency.assignedAmbulanceId || <span className="text-muted">Not assigned</span>}
              </p>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Ambulance Status</p>
              <p className="mt-1 text-sm text-ink">{assignedAmbulance?.status || 'Awaiting dispatcher assignment'}</p>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Crew</p>
              <p className="mt-1 text-sm text-ink">{assignedCrew ? `${assignedCrew.id} · ${assignedCrew.name}` : 'Awaiting ambulance assignment'}</p>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Current Location</p>
              <p className="mt-1 text-sm text-ink">{assignedAmbulance?.location ? `X: ${assignedAmbulance.location.x.toFixed(1)}, Y: ${assignedAmbulance.location.y.toFixed(1)}` : 'Location unavailable'}</p>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.16em] text-muted uppercase">ETA</p>
              <p className="mt-1 text-sm text-ink">{emergency.eta || <span className="text-muted">Awaiting dispatch</span>}</p>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Assigned Hospital</p>
              <p className="mt-1 text-sm text-ink">
                {assignedHospital ? `${assignedHospital.name} (${assignedHospital.id})` : <span className="text-muted">Awaiting transport destination</span>}
              </p>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Route</p>
              <p className="mt-1 text-sm text-ink">
                {emergency.routeId ? `${emergency.routeId} · Simulated route` : <span className="text-muted">Route assigned when dispatch begins</span>}
              </p>
            </div>
          </div>

          {canAssign && (
            <div className="rounded border border-line bg-canvas/40 p-4">
              <p className="text-[11px] tracking-[0.16em] text-muted uppercase flex items-center gap-2 mb-3">
                <Truck size={14} />
                Assign Ambulance
              </p>
              {availableAmbulances.length === 0 ? (
                <p className="text-sm text-muted">NO AVAILABLE AMBULANCES</p>
              ) : (
                <div className="space-y-3">
                  {availableAmbulances.map(amb => (
                    <button
                      key={amb.id}
                      onClick={() => setSelectedAmbulanceId(amb.id)}
                      className={`w-full rounded border px-3 py-2 text-left text-sm transition-colors ${
                        selectedAmbulanceId === amb.id
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-line bg-canvas text-ink hover:border-muted'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{amb.id}</span>
                        <span className="text-xs text-muted">ETA: {amb.eta}</span>
                      </div>
                      <div className="mt-1 text-xs text-muted">{amb.equipment}</div>
                    </button>
                  ))}
                  <button
                    onClick={handleAssign}
                    disabled={!selectedAmbulanceId}
                    className="w-full rounded bg-accent px-4 py-2 text-sm font-medium text-canvas transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Assign Ambulance
                  </button>
                </div>
              )}
            </div>
          )}

          {!emergency.assignedAmbulanceId && emergency.aiAssessment?.recommendedAmbulanceId && (
            <p className="text-xs text-muted">Recommendation status: awaiting dispatcher approval.</p>
          )}

          {canDispatch && (
            <button
              onClick={handleDispatch}
              className="w-full rounded bg-accent px-4 py-3 text-sm font-medium text-canvas transition-colors hover:bg-accent/90"
            >
              DISPATCH
            </button>
          )}

          <div>
            <p className="text-[11px] tracking-[0.16em] text-muted uppercase flex items-center gap-2">
              <Clock size={14} />
              Timeline
            </p>
            <div className="mt-3 space-y-3">
              {emergency.timeline && emergency.timeline.length > 0 ? (
                emergency.timeline.map((event, idx) => (
                  <div key={idx} className="relative pl-4">
                    <div className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-accent" />
                    <p className="font-mono text-[11px] text-accent">{event.time}</p>
                    <p className="mt-0.5 text-sm text-ink">{event.title}</p>
                    {event.detail && <p className="text-xs text-muted">{event.detail}</p>}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted">No timeline events yet</p>
              )}
            </div>
          </div>

          <div className="rounded border border-accent/30 bg-accent/5 p-3">
              <p className="text-[11px] tracking-[0.16em] text-accent uppercase flex items-center gap-2">
              <AlertTriangle size={14} />
              Operational Decision Support
            </p>
            <p className="mt-2 text-xs text-muted">
              {emergency.aiAssessment?.recommendationReason || 'Priority assessment is available for dispatcher review.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
