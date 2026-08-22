import { useState, useMemo } from 'react'
import { Plus, Search, X } from 'lucide-react'
import { useEmergency } from '../context/EmergencyContext'
import StatusBadge from '../components/common/StatusBadge'
import EmergencyDetailDrawer from '../components/dashboard/EmergencyDetailDrawer'
import NewEmergencyModal from '../components/dashboard/NewEmergencyModal'

const SEVERITY_OPTIONS = ['All', 'Critical', 'High', 'Moderate', 'Low']
const STATUS_OPTIONS = ['All', 'NEW', 'DISPATCHED', 'EN_ROUTE', 'AT_SCENE', 'TRANSPORTING', 'ARRIVED', 'COMPLETED']
const TYPE_OPTIONS = ['All', 'Accident / Trauma', 'Cardiac', 'Stroke', 'Breathing Difficulty', 'Burns', 'Other']
const SORT_OPTIONS = ['Newest', 'Oldest', 'Highest Severity', 'Lowest ETA', 'Status']

export default function Emergencies() {
  const { emergencies, createEmergency, addTimelineEvent, assignAmbulance, dispatchEmergency } = useEmergency()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEmergency, setSelectedEmergency] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [sortBy, setSortBy] = useState('Newest')
  const selectedEmergencyRecord = emergencies.find(emergency => emergency.id === selectedEmergency?.id)

  const filteredAndSortedEmergencies = useMemo(() => {
    let filtered = [...emergencies]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(e =>
        e.id.toLowerCase().includes(query) ||
        e.patientId.toLowerCase().includes(query) ||
        e.emergencyType.toLowerCase().includes(query) ||
        e.locationLabel.toLowerCase().includes(query) ||
        (e.assignedAmbulanceId && e.assignedAmbulanceId.toLowerCase().includes(query))
      )
    }

    if (severityFilter !== 'All') {
      filtered = filtered.filter(e => e.severity === severityFilter.toUpperCase())
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(e => e.status === statusFilter)
    }

    if (typeFilter !== 'All') {
      filtered = filtered.filter(e => e.emergencyType === typeFilter)
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'Newest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'Oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'Highest Severity':
          const severityOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MODERATE': 2, 'LOW': 1 }
          return severityOrder[b.severity] - severityOrder[a.severity]
        case 'Lowest ETA':
          const etaA = parseInt(e.eta) || 999
          const etaB = parseInt(b.eta) || 999
          return etaA - etaB
        case 'Status':
          const statusOrder = { 'NEW': 1, 'DISPATCHED': 2, 'EN_ROUTE': 3, 'AT_SCENE': 4, 'TRANSPORTING': 5, 'ARRIVED': 6, 'COMPLETED': 7 }
          return statusOrder[a.status] - statusOrder[b.status]
        default:
          return 0
      }
    })

    return filtered
  }, [emergencies, searchQuery, severityFilter, statusFilter, typeFilter, sortBy])

  const kpis = useMemo(() => {
    const active = emergencies.filter(e => 
      ['NEW', 'DISPATCHED', 'EN_ROUTE', 'AT_SCENE', 'TRANSPORTING'].includes(e.status)
    ).length
    const critical = emergencies.filter(e => 
      e.severity === 'CRITICAL' && 
      ['NEW', 'DISPATCHED', 'EN_ROUTE', 'AT_SCENE', 'TRANSPORTING'].includes(e.status)
    ).length
    const dispatched = emergencies.filter(e => e.status === 'DISPATCHED').length
    const completed = emergencies.filter(e => e.status === 'COMPLETED').length

    return [
      { id: 'active', label: 'Active', value: active, tone: 'critical' },
      { id: 'critical', label: 'Critical', value: critical, tone: 'critical' },
      { id: 'dispatched', label: 'Dispatched', value: dispatched, tone: 'warn' },
      { id: 'completed', label: 'Completed', value: completed, tone: 'ok' },
    ]
  }, [emergencies])

  const handleDispatch = (emergencyData) => {
    const newEmergency = createEmergency(emergencyData)
    
    addTimelineEvent(newEmergency.id, 'Emergency request created', 'Dispatcher received request')
  }

  const handleAssignAmbulance = (emergencyId, ambulanceId) => {
    assignAmbulance(emergencyId, ambulanceId)
  }

  const handleDispatchEmergency = (emergencyId) => {
    dispatchEmergency(emergencyId)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSeverityFilter('All')
    setStatusFilter('All')
    setTypeFilter('All')
    setSortBy('Newest')
  }

  const hasActiveFilters = searchQuery || severityFilter !== 'All' || statusFilter !== 'All' || typeFilter !== 'All'

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">Operations center</p>
          <h1 className="text-2xl font-semibold tracking-tight">Emergency Requests</h1>
          <p className="mt-1 text-xs text-muted">Live emergency intake and dispatch monitoring</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded bg-accent px-4 py-2 text-sm font-medium text-canvas transition-colors hover:bg-accent/90"
        >
          <Plus size={16} />
          New Emergency
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.id} className="rounded border border-line bg-panel px-4 py-3">
            <p className="text-[10px] tracking-[0.16em] text-muted uppercase">{kpi.label}</p>
            <p className={`mt-2 font-mono text-2xl font-semibold ${
              kpi.tone === 'critical' ? 'text-critical' :
              kpi.tone === 'warn' ? 'text-high' :
              'text-ok'
            }`}>
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search emergencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded border border-line bg-canvas pl-10 pr-4 py-2 text-sm text-ink focus:border-accent focus:outline-none"
          />
        </div>
        
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="rounded border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
        >
          {SEVERITY_OPTIONS.map(option => (
            <option key={option} value={option}>{option} Severity</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
        >
          {STATUS_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
        >
          {TYPE_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
        >
          {SORT_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 rounded border border-line px-3 py-2 text-sm text-ink transition-colors hover:bg-canvas"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      {filteredAndSortedEmergencies.length === 0 ? (
        <div className="rounded border border-line bg-panel p-8 text-center">
          <p className="text-sm text-muted">
            {hasActiveFilters ? 'No requests match the current filters.' : 'No emergency requests yet.'}
          </p>
          {!hasActiveFilters && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded bg-accent px-4 py-2 text-sm font-medium text-canvas transition-colors hover:bg-accent/90"
            >
              <Plus size={16} />
              Create Emergency
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded border border-line bg-panel">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line bg-canvas/40">
              <tr className="text-[10px] tracking-wide text-muted uppercase">
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Severity</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Ambulance</th>
                <th className="px-4 py-3 font-medium">ETA</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedEmergencies.map((emergency) => (
                <tr key={emergency.id} className="border-t border-line hover:bg-canvas/20">
                  <td className="px-4 py-3 font-mono text-accent">{emergency.id}</td>
                  <td className="px-4 py-3 text-ink">{emergency.emergencyType}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${
                      emergency.severity === 'CRITICAL' ? 'text-critical' :
                      emergency.severity === 'HIGH' ? 'text-high' :
                      emergency.severity === 'MODERATE' ? 'text-moderate' :
                      'text-muted'
                    }`}>
                      {emergency.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink">{emergency.locationLabel}</td>
                  <td className="px-4 py-3">
                    <StatusBadge value={emergency.status} />
                  </td>
                  <td className="px-4 py-3 text-ink">{emergency.assignedAmbulanceId || '—'}</td>
                  <td className="px-4 py-3 text-ink">{emergency.eta || '—'}</td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(emergency.createdAt).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: false 
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedEmergency(emergency)}
                      className="text-accent hover:text-accent/80 transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <NewEmergencyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDispatch={handleDispatch}
      />

      {selectedEmergency && (
        <EmergencyDetailDrawer
          emergency={selectedEmergencyRecord}
          onClose={() => setSelectedEmergency(null)}
          onAssignAmbulance={handleAssignAmbulance}
          onDispatchEmergency={handleDispatchEmergency}
        />
      )}
    </div>
  )
}
