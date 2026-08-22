import { createContext, useContext, useReducer, useEffect, useCallback, useState } from 'react'
import { storage } from '../utils/storage'
import { activeEmergencies, ambulances as initialAmbulances, hospitals, patientLocations } from '../data/dashboard'
import { assessEmergency } from '../services/aiAssessmentService'
import { getCrewByAmbulanceId } from '../data/crew'

const EmergencyContext = createContext(null)
const SIMULATION_DURATION_MS = 30000
const SIMULATION_TICK_MS = 250

const createSeedEmergencies = () => activeEmergencies.map((item) => {
  const location = patientLocations.find(candidate => candidate.name === item.location)
  const assignedHospital = hospitals.find(hospital => hospital.name === item.hospital)
  const dispatcherSeed = item.id === 'EMG-2418'
  const createdAt = new Date().toISOString()

  const seededEmergency = {
    id: item.id,
    patientId: item.patientId,
    emergencyType: item.type,
    severity: item.severity,
    priority: item.severity === 'CRITICAL' ? 'CRITICAL' : item.severity === 'HIGH' ? 'HIGH' : 'NORMAL',
    location: item.location,
    locationLabel: item.location,
    symptoms: '',
    ageGroup: 'Adult',
    patientCount: 1,
    createdAt,
    updatedAt: createdAt,
    status: dispatcherSeed ? 'NEW' : item.status === 'ASSESSING' ? 'DISPATCHED' : item.status,
    assignedAmbulanceId: dispatcherSeed ? null : item.ambulance || null,
    assignedHospitalId: dispatcherSeed ? null : assignedHospital?.id || null,
    eta: dispatcherSeed ? null : item.status === 'ARRIVED' ? 'ARRIVED' : item.status === 'TRANSPORTING' ? '4 min' : '9 min',
    routeId: dispatcherSeed ? null : 'SIMULATED ROUTE B · 21 km · 15 min',
    source: 'OPERATIONAL_DATA',
    locationCoordinates: location ? { x: location.x, y: location.y } : null,
    timeline: [{
      time: item.time,
      title: 'Emergency received',
      detail: `${item.id} · ${item.type} · ${item.severity}`,
      status: 'completed',
    }, {
      time: item.time,
      title: 'AI analysis completed',
      detail: 'Operational decision support generated for dispatcher review.',
      status: 'completed',
    }],
  }

  return { ...seededEmergency, aiAssessment: assessEmergency(seededEmergency, createSeedAmbulances()) }
})

const createSeedAmbulances = () => initialAmbulances.map(ambulance => {
  const emergency = activeEmergencies.find(item => item.ambulance === ambulance.id && item.id !== 'EMG-2418')
  return {
    ...ambulance,
    crew: getCrewByAmbulanceId(ambulance.id),
    status: emergency ? (emergency.status === 'ASSESSING' ? 'DISPATCHED' : emergency.status) : ambulance.status,
    assignedEmergencyId: emergency?.id || null,
    assignedHospitalId: emergency ? hospitals.find(hospital => hospital.name === emergency.hospital)?.id || null : null,
    destination: emergency?.hospital || null,
    routeProgress: 0,
  }
})

const normaliseAmbulances = (savedAmbulances) => {
  const records = (Array.isArray(savedAmbulances) && savedAmbulances.length > 0 ? savedAmbulances : createSeedAmbulances()).filter(ambulance => ambulance && typeof ambulance === 'object' && ambulance.id)
  return records.map(ambulance => ({
  ...ambulance,
  crew: ambulance.crew || getCrewByAmbulanceId(ambulance.id),
  assignedEmergencyId: ambulance.assignedEmergencyId || null,
  }))
}

const normaliseEmergencies = (savedEmergencies, savedAmbulances) => (Array.isArray(savedEmergencies) && savedEmergencies.length > 0 ? savedEmergencies : createSeedEmergencies()).filter(emergency => emergency && typeof emergency === 'object' && emergency.id).map(emergency => {
  const normalized = {
    ...emergency,
    source: 'OPERATIONAL_DATA',
    patientId: emergency.patientId || 'UNASSIGNED-PATIENT',
    emergencyType: emergency.emergencyType || 'Unspecified emergency',
    severity: emergency.severity || 'LOW',
    locationLabel: emergency.locationLabel || emergency.location || 'Location unavailable',
    patientCount: Number(emergency.patientCount) || 1,
    timeline: Array.isArray(emergency.timeline) ? emergency.timeline : [],
  }
  return { ...normalized, aiAssessment: emergency.aiAssessment || assessEmergency(normalized, savedAmbulances) }
})

const generateEmergencyId = () => {
  const num = Math.floor(Math.random() * 9000) + 1000
  return `EMG-${num}`
}

const generatePatientId = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const prefix = letters[Math.floor(Math.random() * letters.length)]
  const suffix = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `PT-${prefix}${suffix}`
}

const INITIAL_STATE = {
  emergencies: createSeedEmergencies(),
  ambulances: createSeedAmbulances(),
  hospitals: hospitals.slice(0, 4),
  loading: false,
  error: null,
}

const emergencyReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    
    case 'LOAD_EMERGENCIES':
      return { ...state, emergencies: action.payload.emergencies, ambulances: action.payload.ambulances, hospitals: action.payload.hospitals, loading: false }
    
    case 'CREATE_EMERGENCY':
      return {
        ...state,
        emergencies: [action.payload, ...state.emergencies],
      }
    
    case 'UPDATE_EMERGENCY':
      return {
        ...state,
        emergencies: state.emergencies.map(emergency =>
          emergency.id === action.payload.id
            ? (() => {
                const updated = { ...emergency, ...action.payload.updates, updatedAt: new Date().toISOString() }
                return { ...updated, aiAssessment: assessEmergency(updated, state.ambulances) }
              })()
            : emergency
        ),
      }

    case 'REASSESS_EMERGENCY':
      return {
        ...state,
        emergencies: state.emergencies.map(emergency =>
          emergency.id === action.payload.id
            ? { ...emergency, aiAssessment: assessEmergency(emergency, state.ambulances), updatedAt: new Date().toISOString() }
            : emergency
        ),
      }
    
    case 'UPDATE_EMERGENCY_STATUS':
      return {
        ...state,
        emergencies: state.emergencies.map(emergency =>
          emergency.id === action.payload.id
            ? { 
                ...emergency, 
                status: action.payload.status, 
                updatedAt: new Date().toISOString(),
                timeline: [
                  ...emergency.timeline,
                  {
                    time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                    title: `Status changed to ${action.payload.status}`,
                    detail: action.payload.detail || '',
                    status: 'completed'
                  }
                ]
              }
            : emergency
        ),
      }
    
    case 'ADD_TIMELINE_EVENT':
      return {
        ...state,
        emergencies: state.emergencies.map(emergency =>
          emergency.id === action.payload.id
            ? {
                ...emergency,
                timeline: [
                  ...emergency.timeline,
                  {
                    time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                    title: action.payload.title,
                    detail: action.payload.detail,
                    status: 'completed'
                  }
                ]
              }
            : emergency
        ),
      }
    
    case 'ASSIGN_AMBULANCE':
      {
        const previousAmbulanceId = state.emergencies.find(emergency => emergency.id === action.payload.emergencyId)?.assignedAmbulanceId
      return {
        ...state,
        emergencies: state.emergencies.map(emergency =>
          emergency.id === action.payload.emergencyId
            ? {
                ...emergency,
                assignedAmbulanceId: action.payload.ambulanceId,
                routeId: 'SIMULATED ROUTE B · 21 km · 15 min',
                status: 'DISPATCHED',
                updatedAt: new Date().toISOString(),
                timeline: [
                  ...emergency.timeline,
                  {
                    time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                    title: 'Ambulance assigned',
                    detail: `${action.payload.ambulanceId} assigned by dispatcher`,
                    status: 'completed'
                  }
                ]
              }
            : emergency
        ),
        ambulances: state.ambulances.map(ambulance => {
          if (ambulance.id === previousAmbulanceId && ambulance.id !== action.payload.ambulanceId) {
            return { ...ambulance, status: 'AVAILABLE', assignedEmergencyId: null, assignedHospitalId: null, destination: null, eta: ambulance.eta || '—' }
          }
          return ambulance.id === action.payload.ambulanceId
            ? { ...ambulance, status: 'DISPATCHED', assignedEmergencyId: action.payload.emergencyId, eta: '—' }
            : ambulance
        }),
      }
      }
    
    case 'DISPATCH_EMERGENCY':
      return {
        ...state,
        emergencies: state.emergencies.map(emergency =>
          emergency.id === action.payload
            ? {
                ...emergency,
                status: 'EN_ROUTE',
                updatedAt: new Date().toISOString(),
                timeline: [
                  ...emergency.timeline,
                  {
                    time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                    title: 'Emergency dispatched',
                    detail: `${emergency.assignedAmbulanceId} en route to scene`,
                    status: 'completed'
                  }
                ]
              }
            : emergency
        ),
        ambulances: state.ambulances.map(ambulance =>
          ambulance.assignedEmergencyId === action.payload
            ? { ...ambulance, status: 'EN_ROUTE' }
            : ambulance
        ),
      }

    case 'CREW_STATUS': {
      const { ambulanceId, emergencyId, status, title, detail, hospitalId, destination, eta } = action.payload
      return {
        ...state,
        emergencies: state.emergencies.map(emergency =>
          emergency.id === emergencyId
            ? {
                ...emergency,
                status,
                assignedHospitalId: hospitalId || emergency.assignedHospitalId,
                eta: eta || emergency.eta,
                updatedAt: new Date().toISOString(),
                timeline: [...emergency.timeline, {
                  time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                  title,
                  detail,
                  status: 'completed',
                }],
              }
            : emergency
        ),
        ambulances: state.ambulances.map(ambulance =>
          ambulance.id === ambulanceId
            ? {
                ...ambulance,
                status,
                assignedEmergencyId: status === 'ARRIVED' ? null : ambulance.assignedEmergencyId,
                assignedHospitalId: hospitalId || ambulance.assignedHospitalId,
                destination: destination || ambulance.destination,
                eta: eta || ambulance.eta,
                routeProgress: status === 'AT_SCENE' || status === 'ARRIVED' ? 1 : ambulance.routeProgress,
              }
            : ambulance
        ),
      }
    }

    case 'UPDATE_AMBULANCE':
      return {
        ...state,
        ambulances: state.ambulances.map(ambulance =>
          ambulance.id === action.payload.id ? { ...ambulance, ...action.payload.updates } : ambulance
        ),
        emergencies: state.emergencies.map(emergency =>
          emergency.assignedAmbulanceId === action.payload.id && action.payload.updates.eta !== undefined
            ? { ...emergency, eta: action.payload.updates.eta, updatedAt: new Date().toISOString() }
            : emergency
        ),
      }
    
    case 'DELETE_EMERGENCY':
      return {
        ...state,
        emergencies: state.emergencies.filter(e => e.id !== action.payload),
      }
    
    case 'RESET':
      return INITIAL_STATE
    
    default:
      return state
  }
}

export const EmergencyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(emergencyReducer, INITIAL_STATE)
  const [isHydrated, setIsHydrated] = useState(false)
  const [simulationPaused, setSimulationPaused] = useState(false)
  const [trafficSimulationActive, setTrafficSimulationActive] = useState(false)
  const [hospitalLoadChanged, setHospitalLoadChanged] = useState(false)

  useEffect(() => {
    const loadEmergencies = async () => {
      try {
        const stored = storage.get()
        dispatch({
          type: 'LOAD_EMERGENCIES',
          payload: {
            emergencies: stored
              ? normaliseEmergencies(stored, normaliseAmbulances(storage.getAmbulances()))
              : createSeedEmergencies(),
            ambulances: normaliseAmbulances(storage.getAmbulances()),
            hospitals: hospitals.slice(0, 4),
          },
        })
        setIsHydrated(true)
      } catch (error) {
        console.error('Failed to load emergencies from storage:', error)
        dispatch({ type: 'LOAD_EMERGENCIES', payload: { emergencies: createSeedEmergencies(), ambulances: createSeedAmbulances(), hospitals: hospitals.slice(0, 4) } })
        setIsHydrated(true)
      }
    }

    loadEmergencies()
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    storage.set(state.emergencies)
    storage.setAmbulances(state.ambulances)
  }, [isHydrated, state.emergencies, state.ambulances])

  useEffect(() => {
    const timer = setInterval(() => {
      state.ambulances
        .filter(ambulance => !simulationPaused && ['EN_ROUTE', 'TRANSPORTING'].includes(ambulance.status) && ambulance.assignedEmergencyId)
        .forEach(ambulance => {
          const emergency = state.emergencies.find(item => item.id === ambulance.assignedEmergencyId)
          const target = ambulance.status === 'TRANSPORTING'
            ? hospitals.find(hospital => hospital.id === (emergency?.assignedHospitalId || 'H-02'))
            : patientLocations.find(location => location.name === emergency?.locationLabel)
          if (!target || (ambulance.routeProgress || 0) >= 1) return

          const targetX = target.location?.x ?? target.x
          const targetY = target.location?.y ?? target.y
          const progress = Math.min((ambulance.routeProgress || 0) + SIMULATION_TICK_MS / SIMULATION_DURATION_MS, 1)
          dispatch({
            type: 'UPDATE_AMBULANCE',
            payload: {
              id: ambulance.id,
              updates: {
                location: {
                  x: progress >= 1 ? targetX : ambulance.location.x + (targetX - ambulance.location.x) * SIMULATION_TICK_MS / SIMULATION_DURATION_MS,
                  y: progress >= 1 ? targetY : ambulance.location.y + (targetY - ambulance.location.y) * SIMULATION_TICK_MS / SIMULATION_DURATION_MS,
                },
                routeProgress: progress,
                eta: progress >= 1 ? 'ARRIVED' : `${Math.floor((1 - progress) * SIMULATION_DURATION_MS / 60000)}:${String(Math.floor((1 - progress) * SIMULATION_DURATION_MS / 1000) % 60).padStart(2, '0')}`,
              },
            },
          })
        })
    }, SIMULATION_TICK_MS)
    return () => clearInterval(timer)
  }, [simulationPaused, state.ambulances, state.emergencies])

  const createEmergency = useCallback((emergencyData) => {
    const emergencyId = generateEmergencyId()
    const patientId = generatePatientId()
    const newEmergency = {
      id: emergencyId,
      patientId: patientId,
      emergencyType: emergencyData.emergencyType,
      severity: emergencyData.severity,
      priority: emergencyData.severity === 'CRITICAL' ? 'CRITICAL' : 
                 emergencyData.severity === 'HIGH' ? 'HIGH' : 'NORMAL',
      location: emergencyData.location,
      locationLabel: emergencyData.location,
      locationCoordinates: patientLocations.find(location => location.name === emergencyData.location) || null,
      symptoms: emergencyData.symptoms || '',
      ageGroup: emergencyData.ageGroup || 'Adult',
      patientCount: emergencyData.patientCount || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'NEW',
      assignedAmbulanceId: null,
      assignedHospitalId: null,
      eta: null,
      routeId: null,
      source: 'USER_CREATED',
      timeline: [
        {
          time: new Date().toLocaleTimeString('en-US', { hour12: false }),
          title: 'Emergency request received',
          detail: `${emergencyData.emergencyType} · ${emergencyData.severity}`,
          status: 'completed'
        },
        {
          time: new Date().toLocaleTimeString('en-US', { hour12: false }),
          title: 'Emergency created',
          detail: `ID: ${emergencyId} · Patient: ${patientId}`,
          status: 'completed'
        },
        {
          time: new Date().toLocaleTimeString('en-US', { hour12: false }),
          title: 'AI analysis completed',
          detail: 'Operational decision support generated for dispatcher review.',
          status: 'completed'
        }
      ]
    }

    const assessedEmergency = { ...newEmergency, aiAssessment: assessEmergency(newEmergency, state.ambulances) }
    dispatch({ type: 'CREATE_EMERGENCY', payload: assessedEmergency })
    return assessedEmergency
  }, [state.ambulances])

  const updateEmergency = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE_EMERGENCY', payload: { id, updates } })
  }, [])

  const reassessEmergency = useCallback((id) => {
    dispatch({ type: 'REASSESS_EMERGENCY', payload: { id } })
  }, [])

  const updateEmergencyStatus = useCallback((id, status, detail) => {
    dispatch({ type: 'UPDATE_EMERGENCY_STATUS', payload: { id, status, detail } })
  }, [])

  const addTimelineEvent = useCallback((id, title, detail) => {
    dispatch({ type: 'ADD_TIMELINE_EVENT', payload: { id, title, detail } })
  }, [])

  const assignAmbulance = useCallback((emergencyId, ambulanceId) => {
    const emergency = state.emergencies.find(item => item.id === emergencyId)
    const ambulance = state.ambulances.find(item => item.id === ambulanceId)
    if (!emergency || !ambulance || ambulance.status !== 'AVAILABLE') return
    dispatch({ type: 'ASSIGN_AMBULANCE', payload: { emergencyId, ambulanceId } })
  }, [state.emergencies, state.ambulances])

  const dispatchEmergency = useCallback((emergencyId) => {
    dispatch({ type: 'DISPATCH_EMERGENCY', payload: emergencyId })
  }, [])

  const crewStatus = useCallback((ambulanceId, status, title, detail, hospitalId) => {
    const emergency = state.emergencies.find(item => item.assignedAmbulanceId === ambulanceId)
    if (!emergency) return
    const hospital = hospitalId ? hospitals.find(item => item.id === hospitalId) : null
    dispatch({
      type: 'CREW_STATUS',
      payload: {
        ambulanceId,
        emergencyId: emergency.id,
        status,
        title,
        detail,
        hospitalId,
        destination: hospital?.name,
        eta: status === 'AT_SCENE' || status === 'ARRIVED' ? 'ARRIVED' : undefined,
      },
    })
    if (status === 'EN_ROUTE' || status === 'TRANSPORTING') {
      dispatch({ type: 'UPDATE_AMBULANCE', payload: { id: ambulanceId, updates: { routeProgress: 0 } } })
    }
  }, [state.emergencies])

  const resetOperationalState = useCallback(() => {
    dispatch({ type: 'LOAD_EMERGENCIES', payload: { emergencies: createSeedEmergencies(), ambulances: createSeedAmbulances(), hospitals: hospitals.slice(0, 4) } })
    setSimulationPaused(false)
    setTrafficSimulationActive(false)
    setHospitalLoadChanged(false)
  }, [])

  const deleteEmergency = useCallback((id) => {
    dispatch({ type: 'DELETE_EMERGENCY', payload: id })
  }, [])

  const getEmergencyById = useCallback((id) => {
    return state.emergencies.find(e => e.id === id)
  }, [state.emergencies])

  const getEmergenciesByStatus = useCallback((status) => {
    return state.emergencies.filter(e => e.status === status)
  }, [state.emergencies])

  const getEmergenciesBySeverity = useCallback((severity) => {
    return state.emergencies.filter(e => e.severity === severity)
  }, [state.emergencies])

  const value = {
    ...state,
    createEmergency,
    updateEmergency,
    reassessEmergency,
    updateEmergencyStatus,
    addTimelineEvent,
    assignAmbulance,
    dispatchEmergency,
    deleteEmergency,
    getEmergencyById,
    getEmergenciesByStatus,
    getEmergenciesBySeverity,
    crewStatus,
    simulationPaused,
    pauseSimulation: () => setSimulationPaused(true),
    resumeSimulation: () => setSimulationPaused(false),
    resetOperationalState,
    trafficSimulationActive,
    hospitalLoadChanged,
    simulateTraffic: () => setTrafficSimulationActive(true),
    simulateHospitalLoad: () => setHospitalLoadChanged(true),
  }

  return <EmergencyContext.Provider value={value}>{children}</EmergencyContext.Provider>
}

export const useEmergency = () => {
  const context = useContext(EmergencyContext)
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider')
  }
  return context
}
