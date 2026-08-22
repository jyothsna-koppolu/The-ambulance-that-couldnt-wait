const STORAGE_KEY = 'lifeline_emergencies'
const AMBULANCE_STORAGE_KEY = 'lifeline_ambulances'

export const storage = {
  get: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) return null
      const parsed = JSON.parse(data)
      return Array.isArray(parsed) ? parsed : null
    } catch {
      return null
    }
  },

  set: (emergencies) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(emergencies))
      return true
    } catch {
      return false
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      return true
    } catch {
      return false
    }
  },

  getAmbulances: () => {
    try {
      const data = localStorage.getItem(AMBULANCE_STORAGE_KEY)
      if (!data) return null
      const parsed = JSON.parse(data)
      return Array.isArray(parsed) ? parsed : null
    } catch {
      return null
    }
  },

  setAmbulances: (ambulances) => {
    try {
      localStorage.setItem(AMBULANCE_STORAGE_KEY, JSON.stringify(ambulances))
      return true
    } catch {
      return false
    }
  },
}
