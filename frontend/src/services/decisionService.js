const EMERGENCY_CAPABILITIES = {
  'Accident / Trauma': ['Trauma', 'ALS'],
  'Cardiac': ['Cardiac', 'ALS'],
  'Stroke': ['Stroke'],
  'Breathing Difficulty': ['ALS'],
  'Burns': ['Burns'],
}

const SEVERITY_WEIGHTS = {
  'CRITICAL': 1.0,
  'HIGH': 0.8,
  'MODERATE': 0.6,
}

const TRAFFIC_PENALTIES = {
  'LOW': 0,
  'MODERATE': 2,
  'HIGH': 5,
  'SEVERE': 10,
}

const LOAD_PENALTIES = {
  'LOW': 0,
  'MODERATE': 3,
  'HIGH': 6,
  'VERY HIGH': 12,
}

export const getRequiredCapabilities = (emergencyType) => {
  return EMERGENCY_CAPABILITIES[emergencyType] || ['ALS']
}

export const scoreAmbulance = (ambulance, emergencyType, patientLocation) => {
  const requiredCapabilities = getRequiredCapabilities(emergencyType)
  const equipmentList = ambulance.equipment.split(' / ').map(e => e.trim())
  
  let capabilityPenalty = 0
  const hasRequiredCapability = requiredCapabilities.some(req => 
    equipmentList.some(eq => eq.toLowerCase().includes(req.toLowerCase()))
  )
  
  if (!hasRequiredCapability) {
    capabilityPenalty = 999
  }
  
  const etaMatch = ambulance.eta.match(/(\d+)/)
  const eta = etaMatch ? parseInt(etaMatch[1]) : 999
  
  const trafficPenalty = TRAFFIC_PENALTIES[ambulance.traffic] || 0
  
  let availabilityPenalty = 0
  if (ambulance.status !== 'AVAILABLE') {
    availabilityPenalty = 50
  }
  
  const score = eta + capabilityPenalty + trafficPenalty + availabilityPenalty
  
  return {
    ...ambulance,
    score,
    eta: eta,
    hasRequiredCapability,
    capabilityPenalty,
    trafficPenalty,
    availabilityPenalty,
  }
}

export const rankAmbulances = (ambulances, emergencyType, patientLocation) => {
  const scored = ambulances.map(amb => 
    scoreAmbulance(amb, emergencyType, patientLocation)
  )
  
  return scored
    .filter(amb => amb.score < 999)
    .sort((a, b) => a.score - b.score)
}

export const generateRoutes = (fromLocation, toLocation) => {
  return [
    {
      id: 'A',
      name: 'Route A - Shortest Distance',
      distance: 16,
      baseTime: 12,
      trafficDelay: 7,
      constructionDelay: 0,
      incidentDelay: 0,
      blocked: false,
      status: 'available',
    },
    {
      id: 'B',
      name: 'Route B - Fastest Predicted Emergency Route',
      distance: 21,
      baseTime: 14,
      trafficDelay: 1,
      constructionDelay: 0,
      incidentDelay: 0,
      blocked: false,
      status: 'available',
    },
    {
      id: 'C',
      name: 'Route C - Alternative Route',
      distance: 18,
      baseTime: 15,
      trafficDelay: 3,
      constructionDelay: 2,
      incidentDelay: 0,
      blocked: false,
      status: 'available',
    },
  ]
}

export const scoreRoute = (route) => {
  const predictedETA = route.baseTime + route.trafficDelay + route.constructionDelay + route.incidentDelay
  
  let blockedPenalty = 0
  if (route.blocked) {
    blockedPenalty = 999
  }
  
  const constructionPenalty = route.constructionDelay * 1.5
  
  const score = predictedETA + constructionPenalty + blockedPenalty
  
  return {
    ...route,
    predictedETA,
    score,
    blockedPenalty,
    constructionPenalty,
  }
}

export const rankRoutes = (routes) => {
  const scored = routes.map(route => scoreRoute(route))
  return scored
    .filter(route => route.score < 999)
    .sort((a, b) => a.score - b.score)
}

export const filterHospitalsByCapability = (hospitals, emergencyType) => {
  const requiredCapabilities = getRequiredCapabilities(emergencyType)
  
  return hospitals.filter(hospital => {
    if (requiredCapabilities.includes('Trauma') && !hospital.trauma) {
      return false
    }
    if (requiredCapabilities.includes('Cardiac') && !hospital.cardiac) {
      return false
    }
    if (requiredCapabilities.includes('Stroke') && !hospital.stroke) {
      return false
    }
    if (requiredCapabilities.includes('Burns') && !hospital.burns) {
      return false
    }
    return true
  })
}

export const scoreHospital = (hospital, travelTime, emergencyType) => {
  const delayMatch = hospital.delay.match(/(\d+)/)
  const admissionDelay = delayMatch ? parseInt(delayMatch[1]) : 0
  
  const loadPenalty = LOAD_PENALTIES[hospital.load] || 0
  
  let capabilityPenalty = 0
  const requiredCapabilities = getRequiredCapabilities(emergencyType)
  
  if (requiredCapabilities.includes('Trauma') && !hospital.trauma) {
    capabilityPenalty += 50
  }
  if (requiredCapabilities.includes('Cardiac') && !hospital.cardiac) {
    capabilityPenalty += 50
  }
  if (requiredCapabilities.includes('Stroke') && !hospital.stroke) {
    capabilityPenalty += 50
  }
  if (requiredCapabilities.includes('Burns') && !hospital.burns) {
    capabilityPenalty += 50
  }
  
  const score = travelTime + admissionDelay + loadPenalty + capabilityPenalty
  
  return {
    ...hospital,
    score,
    admissionDelay,
    loadPenalty,
    capabilityPenalty,
  }
}

export const rankHospitals = (hospitals, travelTime, emergencyType) => {
  const filtered = filterHospitalsByCapability(hospitals, emergencyType)
  const scored = filtered.map(hospital => 
    scoreHospital(hospital, travelTime, emergencyType)
  )
  
  return scored
    .filter(hospital => hospital.capabilityPenalty < 50)
    .sort((a, b) => a.score - b.score)
}

export const calculateNormalResponse = (ambulances, routes, hospitals, emergencyType) => {
  const closestAmbulance = [...ambulances]
    .filter(amb => amb.status === 'AVAILABLE')
    .sort((a, b) => {
      const etaA = parseInt(a.eta) || 999
      const etaB = parseInt(b.eta) || 999
      return etaA - etaB
    })[0]
  
  const shortestRoute = [...routes].sort((a, b) => a.distance - b.distance)[0]
  
  const nearestHospital = [...hospitals]
    .filter(h => h.trauma || emergencyType !== 'Accident / Trauma')
    .sort((a, b) => a.distance - b.distance)[0]
  
  const normalETA = (parseInt(closestAmbulance?.eta) || 0) + 
                    (shortestRoute?.baseTime || 0) + 
                    (parseInt(hospitals[0]?.delay) || 0)
  
  return {
    ambulance: closestAmbulance?.id || 'N/A',
    route: shortestRoute?.id || 'N/A',
    hospital: nearestHospital?.name || 'N/A',
    response: `${normalETA} min`,
    trafficDelay: `${shortestRoute?.trafficDelay || 0} min`,
    admissionDelay: `${nearestHospital?.delay || '0'} min`,
  }
}

export const generateAIRecommendation = (
  emergency,
  ambulance,
  route,
  hospital,
  normalResponse
) => {
  const lifelineETA = ambulance.eta + route.predictedETA + hospital.admissionDelay
  const normalETA = parseInt(normalResponse.response) || 0
  const timeSaved = Math.max(0, normalETA - lifelineETA)
  
  const reasons = []
  
  if (ambulance.hasRequiredCapability) {
    reasons.push(`✓ Required capability (${ambulance.equipment})`)
  }
  if (ambulance.eta < 15) {
    reasons.push(`✓ Lowest predicted ETA (${ambulance.eta} min)`)
  }
  if (ambulance.trafficPenalty < 3) {
    reasons.push(`✓ Better traffic conditions`)
  }
  
  if (route.id === 'B') {
    reasons.push(`✓ Route B has lowest predicted emergency travel time under current traffic`)
  }
  
  if (hospital.loadPenalty < 5) {
    reasons.push(`✓ Lower emergency load (${hospital.load})`)
  }
  if (hospital.admissionDelay < 8) {
    reasons.push(`✓ Lower admission delay (${hospital.admissionDelay} min)`)
  }
  
  return {
    emergency: emergency.type,
    severity: emergency.severity,
    recommendedAmbulance: ambulance.id,
    recommendedRoute: route.id,
    recommendedHospital: hospital.name,
    predictedAmbulanceETA: `${ambulance.eta} min`,
    predictedHospitalETA: `${route.predictedETA} min`,
    admissionDelay: `${hospital.admissionDelay} min`,
    totalEstimatedJourney: `${lifelineETA} min`,
    decisionConfidence: timeSaved > 5 ? 'HIGH' : 'MODERATE',
    reasons,
    timeSaved: `${timeSaved} min`,
  }
}
