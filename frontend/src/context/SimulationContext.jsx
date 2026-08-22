import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'

const SimulationContext = createContext(null)

export const SimulationProvider = ({ children }) => {
  const [simulationState, setSimulationState] = useState('IDLE')
  const [currentEmergency, setCurrentEmergency] = useState(null)
  const [selectedAmbulance, setSelectedAmbulance] = useState(null)
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [ambulanceProgress, setAmbulanceProgress] = useState(0)
  const [currentETA, setCurrentETA] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [aiRecommendation, setAiRecommendation] = useState(null)
  const [comparison, setComparison] = useState(null)
  const [trafficIncidentActive, setTrafficIncidentActive] = useState(false)
  const [hospitalCapacityChanged, setHospitalCapacityChanged] = useState(false)
  const [isSimulationRunning, setIsSimulationRunning] = useState(false)
  
  const simulationTimerRef = useRef(null)

  const addTimelineEvent = useCallback((title, detail) => {
    const now = new Date()
    const timestamp = now.toLocaleTimeString('en-US', { hour12: false })
    setTimeline(prev => [...prev, { time: timestamp, title, detail, status: 'completed' }])
  }, [])

  const resetSimulation = useCallback(() => {
    if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current)
      simulationTimerRef.current = null
    }
    
    setSimulationState('IDLE')
    setCurrentEmergency(null)
    setSelectedAmbulance(null)
    setSelectedRoute(null)
    setSelectedHospital(null)
    setAmbulanceProgress(0)
    setCurrentETA(null)
    setTimeline([])
    setAiRecommendation(null)
    setComparison(null)
    setTrafficIncidentActive(false)
    setHospitalCapacityChanged(false)
    setIsSimulationRunning(false)
  }, [])

  const cleanupTimers = useCallback(() => {
    if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current)
      simulationTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      cleanupTimers()
    }
  }, [cleanupTimers])

  const value = {
    simulationState,
    setSimulationState,
    currentEmergency,
    setCurrentEmergency,
    selectedAmbulance,
    setSelectedAmbulance,
    selectedRoute,
    setSelectedRoute,
    selectedHospital,
    setSelectedHospital,
    ambulanceProgress,
    setAmbulanceProgress,
    currentETA,
    setCurrentETA,
    timeline,
    setTimeline,
    addTimelineEvent,
    aiRecommendation,
    setAiRecommendation,
    comparison,
    setComparison,
    trafficIncidentActive,
    setTrafficIncidentActive,
    hospitalCapacityChanged,
    setHospitalCapacityChanged,
    isSimulationRunning,
    setIsSimulationRunning,
    resetSimulation,
    simulationTimerRef,
    cleanupTimers,
  }

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>
}

export const useSimulation = () => {
  const context = useContext(SimulationContext)
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider')
  }
  return context
}
