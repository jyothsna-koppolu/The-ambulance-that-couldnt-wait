const SEVERITY_ORDER = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL']

const PRIORITY_BY_SEVERITY = {
  CRITICAL: 'IMMEDIATE',
  HIGH: 'HIGH',
  MODERATE: 'STANDARD',
  LOW: 'LOW',
}

const CAPABILITIES_BY_TYPE = {
  'Accident / Trauma': ['trauma', 'als'],
  Cardiac: ['cardiac', 'als'],
  Stroke: ['stroke'],
  'Breathing Difficulty': ['als'],
  Burns: ['burns'],
}

const severityIndex = (severity) => {
  const index = SEVERITY_ORDER.indexOf(String(severity || '').toUpperCase())
  return index >= 0 ? index : 0
}

const normaliseAmbulances = (ambulances) => Array.isArray(ambulances) ? ambulances : []

const selectAmbulance = (emergency, ambulances) => {
  const required = CAPABILITIES_BY_TYPE[emergency?.emergencyType] || ['als']
  return normaliseAmbulances(ambulances)
    .filter(ambulance => ambulance?.status === 'AVAILABLE')
    .map(ambulance => {
      const equipment = String(ambulance.equipment || '').toLowerCase()
      const capabilityMatch = required.some(capability => equipment.includes(capability))
      const eta = Number.parseInt(String(ambulance.eta || ''), 10)
      return { ambulance, capabilityMatch, eta: Number.isFinite(eta) ? eta : 999 }
    })
    .sort((a, b) => Number(b.capabilityMatch) - Number(a.capabilityMatch) || a.eta - b.eta || String(a.ambulance.id).localeCompare(String(b.ambulance.id)))[0]?.ambulance
}

export const assessEmergency = (emergency, ambulances = []) => {
  if (!emergency) return null

  const baseSeverity = String(emergency.severity || '').toUpperCase()
  const reasoning = []
  let assessmentIndex = severityIndex(baseSeverity)
  const type = emergency.emergencyType || 'Unspecified emergency'
  const symptoms = String(emergency.symptoms || '').trim()
  const patientCount = Number(emergency.patientCount) || 0
  const ageGroup = String(emergency.ageGroup || '').trim()

  if (baseSeverity && SEVERITY_ORDER.includes(baseSeverity)) {
    reasoning.push(`Dispatcher-entered severity: ${baseSeverity}.`)
  } else {
    reasoning.push('Insufficient information for AI assessment.')
  }

  if (type !== 'Unspecified emergency') reasoning.push(`Emergency type recorded as ${type}.`)
  if (patientCount > 1) {
    assessmentIndex = Math.min(3, assessmentIndex + 1)
    reasoning.push(`Multiple patients reported: ${patientCount}.`)
  }
  if (symptoms) reasoning.push('Reported symptoms or indicators were provided for dispatcher review.')
  if (ageGroup) reasoning.push(`Age group recorded as ${ageGroup}.`)

  const severity = SEVERITY_ORDER[assessmentIndex]
  const recommendedAmbulance = selectAmbulance(emergency, ambulances)
  const operationalWarnings = []

  if (!recommendedAmbulance) {
    operationalWarnings.push('No available ambulance with matching capability was found.')
  } else if (recommendedAmbulance.traffic && ['HIGH', 'SEVERE'].includes(recommendedAmbulance.traffic)) {
    operationalWarnings.push(`${recommendedAmbulance.id} reports ${recommendedAmbulance.traffic.toLowerCase()} traffic.`)
  }
  if (!emergency.locationLabel && !emergency.location) operationalWarnings.push('Pickup location is missing.')
  if (!symptoms && !baseSeverity) operationalWarnings.push('Symptoms and dispatcher-entered severity are missing.')

  const informationCount = [baseSeverity, type !== 'Unspecified emergency' ? type : '', patientCount > 0 ? patientCount : '', ageGroup, symptoms].filter(Boolean).length
  const confidence = Math.min(96, 60 + informationCount * 7 + (patientCount > 1 ? 4 : 0))

  return {
    severity,
    confidence,
    reasoning,
    dispatchPriority: PRIORITY_BY_SEVERITY[severity],
    recommendedResponse: severity === 'CRITICAL' || severity === 'HIGH'
      ? 'Prioritize an available emergency response unit for dispatcher review.'
      : 'Dispatch an available ambulance according to dispatcher review and operational availability.',
    recommendedAmbulanceId: recommendedAmbulance?.id,
    recommendationReason: recommendedAmbulance
      ? `Available ${recommendedAmbulance.id} selected by capability match, then lowest estimated response time.`
      : 'No recommendation available until a suitable ambulance is available.',
    operationalWarnings,
    assessedAt: new Date().toISOString(),
  }
}