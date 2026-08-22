import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { EmergencyProvider } from './context/EmergencyContext'
import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard'
import Emergencies from './pages/Emergencies'
import Ambulances from './pages/Ambulances'
import Hospitals from './pages/Hospitals'
import LiveMap from './pages/LiveMap'
import AIInsights from './pages/AIInsights'
import Analytics from './pages/Analytics'
import Simulation from './pages/Simulation'
import CrewView from './pages/CrewView'

export default function App() {
  return (
    <BrowserRouter>
      <EmergencyProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/emergencies" element={<Emergencies />} />
            <Route path="/ambulances" element={<Ambulances />} />
            <Route path="/hospitals" element={<Hospitals />} />
            <Route path="/map" element={<LiveMap />} />
            <Route path="/insights" element={<AIInsights />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          <Route path="/crew/:ambulanceId" element={<CrewView />} />
        </Routes>
      </EmergencyProvider>
    </BrowserRouter>
  )
}
