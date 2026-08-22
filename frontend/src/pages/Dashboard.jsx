import { useState, useMemo } from 'react'
import { Plus, CheckCircle } from 'lucide-react'
import { useEmergency } from '../context/EmergencyContext'
import KpiCard from '../components/common/KpiCard'
import EmergencyMap from '../components/dashboard/EmergencyMap'
import ActiveEmergencyPanel from '../components/dashboard/ActiveEmergencyPanel'
import AiRecommendationCard from '../components/dashboard/AiRecommendationCard'
import TrafficAlerts from '../components/dashboard/TrafficAlerts'
import HospitalAlerts from '../components/dashboard/HospitalAlerts'
import AmbulanceStatus from '../components/dashboard/AmbulanceStatus'
import HospitalStatus from '../components/dashboard/HospitalStatus'
import EmergencyTimeline from '../components/dashboard/EmergencyTimeline'
import ComparisonCard from '../components/dashboard/ComparisonCard'
import NewEmergencyModal from '../components/dashboard/NewEmergencyModal'
import SimulationControls from '../components/dashboard/SimulationControls'

function DashboardContent() {
  const { emergencies, ambulances, hospitals, createEmergency, addTimelineEvent } = useEmergency()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  
  const activeEmergenciesList = useMemo(() => {
    return emergencies.filter(e => 
      ['NEW', 'DISPATCHED', 'EN_ROUTE', 'AT_SCENE', 'TRANSPORTING'].includes(e.status)
    )
  }, [emergencies])

  const dynamicKpis = useMemo(() => {
    const active = activeEmergenciesList.length
    const critical = activeEmergenciesList.filter(e => e.severity === 'CRITICAL').length
    const availableAmb = ambulances.filter(a => a.status === 'AVAILABLE').length
    const enRoute = activeEmergenciesList.filter(e => e.status === 'EN_ROUTE').length
    
    return [
      { id: 'active', label: 'Active Emergencies', value: String(active), delta: `+${active} total`, tone: 'critical' },
      { id: 'critical', label: 'Critical Emergencies', value: String(critical), delta: critical > 0 ? 'Immediate attention' : 'None', tone: 'critical' },
      { id: 'available-amb', label: 'Available Ambulances', value: String(availableAmb), delta: `${ambulances.length} in fleet`, tone: 'ok' },
      { id: 'enroute', label: 'Ambulances En Route', value: String(enRoute), delta: `${active - enRoute} pending`, tone: enRoute > 0 ? 'warn' : 'ok' },
      { id: 'hospitals', label: 'Available Hospitals', value: String(hospitals.length), delta: `${hospitals.length} in network`, tone: 'ok' },
      { id: 'response', label: 'Avg Response Time', value: '8.4 min', delta: 'Simulated', tone: 'neutral' },
      { id: 'arrival', label: 'Avg Hospital Arrival', value: '14.2 min', delta: 'Simulated', tone: 'neutral' },
      { id: 'saved', label: 'Estimated Time Saved', value: '7 min', delta: 'Synthetic comparison', tone: 'ok' },
      { id: 'routes', label: 'Active Simulated Routes', value: '2', delta: '1 route pending', tone: 'warn' },
    ]
  }, [activeEmergenciesList, ambulances, hospitals])

  const handleDispatchEmergency = (emergencyData) => {
    const newEmergency = createEmergency(emergencyData)
    
    addTimelineEvent(newEmergency.id, 'Emergency request created', 'Dispatcher received request')
    
    setToastMessage(`Emergency ${newEmergency.id} created.`)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  if (!emergencies) {
    return <div className="p-4">Loading...</div>
  }

  return (
    <div className="space-y-4">
      {showToast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded border border-ok/40 bg-ok/10 px-4 py-3 text-ok">
          <CheckCircle size={16} />
          <span className="text-sm">{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">Command center</p>
          <h1 className="text-2xl font-semibold tracking-tight">Operations dashboard</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded bg-accent px-4 py-2 text-sm font-medium text-canvas transition-colors hover:bg-accent/90"
          >
            <Plus size={16} />
            New Emergency
          </button>
          <SimulationControls />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3 2xl:grid-cols-9">
        {dynamicKpis.map((kpi) => (
          <KpiCard key={kpi.id} {...kpi} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
        <EmergencyMap />
        <ActiveEmergencyPanel />
      </div>

      <AiRecommendationCard />

      <div className="grid gap-4 lg:grid-cols-2">
        <TrafficAlerts />
        <HospitalAlerts />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <AmbulanceStatus />
        <HospitalStatus />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.4fr]">
        <EmergencyTimeline />
        <ComparisonCard />
      </div>

      <NewEmergencyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDispatch={handleDispatchEmergency}
      />
    </div>
  )
}

export default function Dashboard() {
  return <DashboardContent />
}
