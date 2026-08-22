import EmergencyMap from '../components/dashboard/EmergencyMap'
import { useEmergency } from '../context/EmergencyContext'

export default function LiveMap() {
  const { ambulances } = useEmergency()
  const activeUnit = ambulances.find(unit => ['EN_ROUTE', 'TRANSPORTING'].includes(unit.status))

  return (
    <div className="space-y-4">
      <div>
        <p className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">Operations map</p>
        <h1 className="text-2xl font-semibold tracking-tight">Live Map</h1>
        <p className="mt-1 text-xs text-muted">SYNTHETIC OPERATIONS · SIMULATED LOCATION</p>
      </div>
      <EmergencyMap ambulancePosition={activeUnit ? { ...activeUnit.location, id: activeUnit.id } : null} />
    </div>
  )
}
