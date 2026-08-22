export const SYSTEM_STATUS = {
  label: 'OPERATIONAL',
  operationalMode: true,
  clock: '18:15:42',
  region: 'Metro Sector 4',
}

export const kpis = [
  { id: 'active', label: 'Active Emergencies', value: '4', delta: '+1 since 18:00', tone: 'critical' },
  { id: 'critical', label: 'Critical Emergencies', value: '1', delta: 'Accident / Trauma', tone: 'critical' },
  { id: 'available-amb', label: 'Available Ambulances', value: '6', delta: '10 in fleet', tone: 'ok' },
  { id: 'enroute', label: 'Ambulances En Route', value: '3', delta: '2 transporting', tone: 'warn' },
  { id: 'hospitals', label: 'Available Hospitals', value: '5', delta: '8 in network', tone: 'ok' },
  { id: 'response', label: 'Avg Response Time', value: '8.4 min', delta: 'Simulated', tone: 'neutral' },
  { id: 'arrival', label: 'Avg Hospital Arrival', value: '14.2 min', delta: 'Simulated', tone: 'neutral' },
  { id: 'saved', label: 'Estimated Time Saved', value: '7 min', delta: 'Synthetic comparison', tone: 'ok' },
  { id: 'routes', label: 'Active Simulated Routes', value: '2', delta: '1 route pending', tone: 'warn' },
]

export const activeEmergencies = [
  {
    id: 'EMG-2418',
    patientId: 'PT-A7F2',
    type: 'Accident / Trauma',
    severity: 'CRITICAL',
    location: 'Ring Road & 6th Ave',
    time: '18:15:00',
    ambulance: 'AMB-02',
    hospital: 'Awaiting destination',
    status: 'ASSESSING',
  },
  {
    id: 'EMG-2416',
    type: 'Cardiac',
    patientId: 'PT-C91B',
    severity: 'HIGH',
    location: 'Harbor District',
    time: '18:02:11',
    ambulance: 'AMB-07',
    hospital: 'Central Heart Institute',
    status: 'TRANSPORTING',
  },
  {
    id: 'EMG-2414',
    type: 'Stroke',
    patientId: 'PT-D33K',
    severity: 'HIGH',
    location: 'West Park Clinic pickup',
    time: '17:48:40',
    ambulance: 'AMB-04',
    hospital: 'Metro Trauma Center',
    status: 'EN_ROUTE',
  },
  {
    id: 'EMG-2411',
    type: 'Breathing Difficulty',
    patientId: 'PT-E12M',
    severity: 'MODERATE',
    location: 'North Residences',
    time: '17:21:05',
    ambulance: 'AMB-01',
    hospital: 'CityCare Medical Center',
    status: 'ARRIVED',
  },
]

export const ambulances = [
  { id: 'AMB-01', status: 'AT_SCENE', eta: '—', traffic: 'LOW', equipment: 'ALS', location: { x: 28, y: 40 }, distance: 5 },
  { id: 'AMB-02', status: 'AVAILABLE', eta: '9 min', traffic: 'MODERATE', equipment: 'Trauma / ALS', location: { x: 18, y: 62 }, distance: 7 },
  { id: 'AMB-03', status: 'AVAILABLE', eta: '12 min', traffic: 'HIGH', equipment: 'BLS', location: { x: 36, y: 28 }, distance: 8 },
  { id: 'AMB-04', status: 'EN_ROUTE', eta: '6 min', traffic: 'MODERATE', equipment: 'Stroke kit', location: { x: 52, y: 45 }, distance: 4 },
  { id: 'AMB-05', status: 'OFFLINE', eta: '—', traffic: '—', equipment: 'ALS', location: { x: 45, y: 55 }, distance: 3 },
  { id: 'AMB-06', status: 'AVAILABLE', eta: '14 min', traffic: 'SEVERE', equipment: 'Burns', location: { x: 65, y: 35 }, distance: 11 },
  { id: 'AMB-07', status: 'TRANSPORTING', eta: '4 min', traffic: 'LOW', equipment: 'Cardiac', location: { x: 72, y: 34 }, distance: 15 },
  { id: 'AMB-08', status: 'DISPATCHED', eta: '11 min', traffic: 'HIGH', equipment: 'ALS', location: { x: 58, y: 52 }, distance: 9 },
  { id: 'AMB-09', status: 'AVAILABLE', eta: '18 min', traffic: 'MODERATE', equipment: 'BLS', location: { x: 38, y: 72 }, distance: 13 },
  { id: 'AMB-10', status: 'AVAILABLE', eta: '16 min', traffic: 'HIGH', equipment: 'ALS', location: { x: 25, y: 55 }, distance: 10 },
]

export const hospitals = [
  { id: 'H-01', name: 'CityCare Medical Center', load: 'HIGH', trauma: true, cardiac: false, stroke: false, burns: false, als: true, delay: '9 min', location: { x: 62, y: 18 }, distance: 20 },
  { id: 'H-02', name: 'Metro Trauma Center', load: 'VERY HIGH', trauma: true, cardiac: true, stroke: true, burns: false, als: true, delay: '14 min', location: { x: 78, y: 22 }, distance: 24 },
  { id: 'H-03', name: 'Central Heart Institute', load: 'MODERATE', trauma: false, cardiac: true, stroke: false, burns: false, als: true, delay: '6 min', location: { x: 62, y: 18 }, distance: 20 },
  { id: 'H-04', name: 'Riverside General', load: 'LOW', trauma: true, cardiac: false, stroke: false, burns: false, als: true, delay: '3 min', location: { x: 84, y: 68 }, distance: 28 },
  { id: 'H-05', name: 'Northside Emergency', load: 'MODERATE', trauma: false, cardiac: false, stroke: false, burns: false, als: true, delay: '5 min', location: { x: 35, y: 25 }, distance: 15 },
  { id: 'H-06', name: 'East Bay Medical', load: 'HIGH', trauma: true, cardiac: false, stroke: false, burns: false, als: true, delay: '11 min', location: { x: 88, y: 45 }, distance: 32 },
  { id: 'H-07', name: 'St. Helena Burns Unit', load: 'LOW', trauma: false, cardiac: false, stroke: false, burns: true, als: true, delay: '4 min', location: { x: 45, y: 75 }, distance: 18 },
  { id: 'H-08', name: 'University Teaching Hospital', load: 'HIGH', trauma: true, cardiac: true, stroke: true, burns: true, als: true, delay: '10 min', location: { x: 72, y: 55 }, distance: 22 },
]

export const trafficAlerts = [
  {
    id: 'TR-01',
    level: 'SEVERE',
    title: 'Rush-hour congestion',
    detail: 'Ring Road westbound average speed 18 km/h. Predicted delay +7 min on Route A.',
    time: '18:14',
  },
  {
    id: 'TR-02',
    level: 'HIGH',
    title: 'Construction zone',
    detail: 'Harbor overpass single-lane. Route C currently blocked for heavy vehicles.',
    time: '18:08',
  },
  {
    id: 'TR-03',
    level: 'MODERATE',
    title: 'Incident watch',
    detail: 'No active collision on recommended Route B. Traffic incident inject available in Simulation.',
    time: '18:15',
  },
]

export const hospitalAlerts = [
  {
    id: 'HA-01',
    level: 'CRITICAL',
    title: 'Metro Trauma Center load',
    detail: 'Emergency load VERY HIGH. Expected admission delay 14 min.',
  },
  {
    id: 'HA-02',
    level: 'WARN',
    title: 'CityCare capacity',
    detail: 'Emergency beds at 82%. Trauma capability available.',
  },
  {
    id: 'HA-03',
    level: 'OK',
    title: 'Riverside General',
    detail: 'LOW load, trauma capable, expected admission delay 3 min.',
  },
]

export const timeline = [
  { time: '18:15:00', title: 'Emergency received', detail: 'EMG-2418 · Accident / Trauma · Ring Road & 6th Ave' },
  { time: '18:15:03', title: 'Severity assessed', detail: 'CRITICAL · decision support only · not a diagnosis' },
  { time: '18:15:05', title: 'Ambulance ranked', detail: 'AMB-02 recommended (lowest predicted ETA + trauma equipment)' },
  { time: '18:15:08', title: 'Route ranked', detail: 'Route B recommended (longer distance, lower predicted travel time)' },
  { time: '18:15:42', title: 'Awaiting dispatch confirmation', detail: 'Simulation Center can run the full journey workflow' },
]

export const aiRecommendation = {
  decision: 'Recommend AMB-02 → Route B → evaluate trauma-capable hospitals by load, not distance',
  reason:
    'AMB-02 is farther than AMB-01 but has the lowest predicted arrival under current traffic and carries suitable trauma equipment. Route B is longer than Route A, but predicted congestion on A adds approximately 7 minutes.',
  factors: [
    'Emergency severity: CRITICAL',
    'Ambulance predicted ETA, not Euclidean distance',
    'Equipment suitability (Trauma / ALS)',
    'Predicted travel time over shortest path',
    'Hospital capability and expected admission delay (next step)',
  ],
  benefit: 'Synthetic comparison: 11 min vs 18 min normal response.',
}

export const comparison = {
  normal: {
    route: 'Shortest distance',
    ambulance: 'Closest unit (AMB-01)',
    hospital: 'Nearest trauma center',
    response: '18 min',
    trafficDelay: '6 min',
    admissionDelay: '8 min',
  },
  lifeline: {
    route: 'Lowest predicted emergency travel time',
    ambulance: 'Lowest predicted ETA + capability (AMB-02)',
    hospital: 'Capability + capacity + ETA',
    response: '11 min',
    trafficDelay: '1 min',
    admissionDelay: '3 min',
  },
  saved: '7 min',
}

export const patientLocations = [
  { id: 'LOC-01', name: 'Ring Road & 6th Ave', x: 42, y: 58 },
  { id: 'LOC-02', name: 'Harbor District', x: 72, y: 34 },
  { id: 'LOC-03', name: 'West Park Clinic pickup', x: 52, y: 45 },
  { id: 'LOC-04', name: 'North Residences', x: 38, y: 72 },
  { id: 'LOC-05', name: 'Downtown Central', x: 50, y: 50 },
  { id: 'LOC-06', name: 'Industrial Zone', x: 75, y: 60 },
  { id: 'LOC-07', name: 'Suburb East', x: 85, y: 35 },
  { id: 'LOC-08', name: 'Airport Road', x: 65, y: 75 },
]

export const mapNodes = {
  patient: { x: 42, y: 58, label: 'Patient' },
  ambulances: [
    { id: 'AMB-01', x: 28, y: 40, status: 'AVAILABLE' },
    { id: 'AMB-02', x: 18, y: 62, status: 'AVAILABLE' },
    { id: 'AMB-03', x: 36, y: 28, status: 'AVAILABLE' },
    { id: 'AMB-07', x: 72, y: 34, status: 'TRANSPORTING' },
  ],
  hospitals: [
    { id: 'MTC', x: 78, y: 22, name: 'Metro Trauma' },
    { id: 'RG', x: 84, y: 68, name: 'Riverside' },
    { id: 'CHI', x: 62, y: 18, name: 'Heart Institute' },
  ],
  routes: [
    { id: 'A', d: 'M 42 58 C 50 48, 62 36, 78 22', tone: 'severe', label: 'A 16m' },
    { id: 'B', d: 'M 18 62 C 40 78, 64 74, 84 68', tone: 'ok', label: 'B 9m' },
    { id: 'C', d: 'M 42 58 C 58 52, 70 40, 78 22', tone: 'warn', label: 'C 18m' },
  ],
}
