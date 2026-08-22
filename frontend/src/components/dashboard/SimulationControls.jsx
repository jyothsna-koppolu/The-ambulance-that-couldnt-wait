import { Play, Pause, RotateCcw, AlertTriangle, Activity, Zap } from 'lucide-react'
import { useEmergency } from '../../context/EmergencyContext'

export default function SimulationControls() {
  const { ambulances, crewStatus, resetOperationalState, simulateTraffic, simulateHospitalLoad, simulationPaused, pauseSimulation, resumeSimulation } = useEmergency()
  const movingUnit = ambulances.find(ambulance => ambulance.status === 'DISPATCHED' && ambulance.assignedEmergencyId)
  const startJourney = () => {
    if (movingUnit) crewStatus(movingUnit.id, 'EN_ROUTE', 'Response started', `${movingUnit.id} crew started response.`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={startJourney}
        disabled={!movingUnit}
        className="inline-flex items-center gap-2 rounded border border-line px-3 py-2 text-xs font-medium text-muted transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        title="Start the next dispatched synthetic journey"
      >
        <Play size={14} />
        Start Journey
      </button>

      <button
        onClick={simulationPaused ? resumeSimulation : pauseSimulation}
        className="inline-flex items-center gap-2 rounded border border-line px-3 py-2 text-xs font-medium text-muted transition-colors"
        title="Pause or resume shared ambulance movement"
      >
        <Pause size={14} />
        {simulationPaused ? 'Resume' : 'Pause'}
      </button>

      <button
        onClick={simulateTraffic}
        className="inline-flex items-center gap-2 rounded border border-line px-3 py-2 text-xs font-medium text-muted transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        title="Activate the synthetic traffic scenario"
      >
        <AlertTriangle size={14} />
        Simulate Traffic
      </button>

      <button
        onClick={simulateHospitalLoad}
        className="inline-flex items-center gap-2 rounded border border-line px-3 py-2 text-xs font-medium text-muted transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        title="Mark the synthetic hospital load scenario"
      >
        <Activity size={14} />
        Hospital Load
      </button>

      <div className="w-px bg-line" />

      <button
        onClick={startJourney}
        className="inline-flex items-center gap-2 rounded border border-line px-3 py-2 text-xs font-medium text-muted transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        title="Start the next dispatched synthetic journey"
      >
        <Zap size={14} />
        Run Full Simulation
      </button>

      <button
        onClick={resetOperationalState}
        className="inline-flex items-center gap-2 rounded border border-line px-3 py-2 text-xs font-medium text-muted transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        title="Reset operational state"
      >
        <RotateCcw size={14} />
        Reset
      </button>
    </div>
  )
}
