export const crews = [
  { id: 'CREW-01', name: 'North Response', ambulanceId: 'AMB-01', members: ['A. Morgan', 'J. Reed'], roles: ['Driver', 'Paramedic'] },
  { id: 'CREW-02', name: 'Trauma Response', ambulanceId: 'AMB-02', members: ['S. Patel', 'R. Chen'], roles: ['Driver', 'Paramedic'] },
  { id: 'CREW-03', name: 'West Medical', ambulanceId: 'AMB-03', members: ['M. Lewis', 'T. Green'], roles: ['Driver', 'EMT'] },
  { id: 'CREW-04', name: 'Stroke Response', ambulanceId: 'AMB-04', members: ['K. Brooks', 'D. Shah'], roles: ['Driver', 'Paramedic'] },
  { id: 'CREW-05', name: 'Central Support', ambulanceId: 'AMB-05', members: ['N. Clark', 'P. Evans'], roles: ['Driver', 'EMT'] },
  { id: 'CREW-06', name: 'East Response', ambulanceId: 'AMB-06', members: ['L. Rivera', 'C. Wu'], roles: ['Driver', 'Paramedic'] },
  { id: 'CREW-07', name: 'Cardiac Response', ambulanceId: 'AMB-07', members: ['E. Foster', 'H. Kim'], roles: ['Driver', 'Paramedic'] },
  { id: 'CREW-08', name: 'South Response', ambulanceId: 'AMB-08', members: ['B. Adams', 'Y. Okafor'], roles: ['Driver', 'EMT'] },
  { id: 'CREW-09', name: 'Riverside Support', ambulanceId: 'AMB-09', members: ['G. Turner', 'I. Singh'], roles: ['Driver', 'EMT'] },
  { id: 'CREW-10', name: 'Metro Advanced', ambulanceId: 'AMB-10', members: ['F. Lopez', 'W. Hart'], roles: ['Driver', 'Paramedic'] },
]

export const getCrewByAmbulanceId = (ambulanceId) => crews.find(crew => crew.ambulanceId === ambulanceId)
