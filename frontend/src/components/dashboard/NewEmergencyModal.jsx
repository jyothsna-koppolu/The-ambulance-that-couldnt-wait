import { useState } from 'react'
import { X } from 'lucide-react'
import { patientLocations } from '../../data/dashboard'

const EMERGENCY_TYPES = [
  'Accident / Trauma',
  'Cardiac',
  'Stroke',
  'Breathing Difficulty',
  'Burns',
  'Other',
]

const SEVERITY_LEVELS = ['Critical', 'High', 'Moderate', 'Low']

const AGE_GROUPS = ['Child', 'Adult', 'Senior']

export default function NewEmergencyModal({ isOpen, onClose, onDispatch }) {
  const [emergencyType, setEmergencyType] = useState('')
  const [severity, setSeverity] = useState('')
  const [location, setLocation] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [ageGroup, setAgeGroup] = useState('Adult')
  const [patientCount, setPatientCount] = useState(1)

  if (!isOpen) return null

  const isValid = emergencyType && severity && location

  const handleDispatch = () => {
    if (!isValid) return
    
    onDispatch({
      emergencyType,
      severity: severity.toUpperCase(),
      location,
      symptoms,
      ageGroup,
      patientCount,
    })
    
    handleClose()
  }

  const handleClose = () => {
    setEmergencyType('')
    setSeverity('')
    setLocation('')
    setSymptoms('')
    setAgeGroup('Adult')
    setPatientCount(1)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg border border-line bg-panel p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink">New Emergency</h2>
            <p className="mt-1 text-xs text-muted">Dispatch emergency response</p>
          </div>
          <button
            onClick={handleClose}
            className="rounded p-1 text-muted transition-colors hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wide">
              Emergency Type <span className="text-critical">*</span>
            </label>
            <select
              value={emergencyType}
              onChange={(e) => setEmergencyType(e.target.value)}
              className="mt-2 w-full rounded border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
            >
              <option value="">Select type...</option>
              {EMERGENCY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wide">
              Severity <span className="text-critical">*</span>
            </label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {SEVERITY_LEVELS.map((level) => (
                <button
                  key={level}
                  onClick={() => setSeverity(level)}
                  className={`rounded border px-2 py-2 text-xs font-medium transition-colors ${
                    severity === level
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-line bg-canvas text-ink hover:border-muted'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wide">
              Patient Location <span className="text-critical">*</span>
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-2 w-full rounded border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
            >
              <option value="">Select location...</option>
              {patientLocations.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wide">
              Symptoms / Indicators
            </label>
            <input
              type="text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe symptoms or indicators..."
              className="mt-2 w-full rounded border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted uppercase tracking-wide">
                Age Group
              </label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="mt-2 w-full rounded border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
              >
                {AGE_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted uppercase tracking-wide">
                Patient Count
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={patientCount}
                onChange={(e) => setPatientCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="mt-2 w-full rounded border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleClose}
              className="flex-1 rounded border border-line px-4 py-2 text-sm text-ink transition-colors hover:bg-canvas"
            >
              Cancel
            </button>
            <button
              onClick={handleDispatch}
              disabled={!isValid}
              className="flex-1 rounded bg-accent px-4 py-2 text-sm font-medium text-canvas transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Dispatch Emergency
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
