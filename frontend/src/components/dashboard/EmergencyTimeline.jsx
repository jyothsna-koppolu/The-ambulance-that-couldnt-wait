import Panel from '../common/Panel'
import { useEmergency } from '../../context/EmergencyContext'

export default function EmergencyTimeline({ timeline, emergencyId } = {}) {
  const { emergencies } = useEmergency()
  const activeEmergency = emergencies.find(emergency => ['NEW', 'DISPATCHED', 'EN_ROUTE', 'AT_SCENE', 'TRANSPORTING'].includes(emergency.status))
  const currentTimeline = timeline || activeEmergency?.timeline || []
  const currentEmergencyId = emergencyId || activeEmergency?.id
  const displayTimeline = currentTimeline.length > 0 ? currentTimeline : null

  return (
    <Panel 
      title="Emergency timeline" 
      action={<span className="font-mono text-[10px] text-muted">{currentEmergencyId || 'No active emergency'}</span>}
    >
      {!displayTimeline ? (
        <p className="text-sm text-muted">Dispatch an emergency to see the timeline.</p>
      ) : (
        <ol className="relative space-y-4 border-l border-line pl-4">
          {displayTimeline.map((event, idx) => (
            <li key={idx}>
              <span className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
              <p className="font-mono text-[11px] text-accent">{event.time}</p>
              <p className="mt-0.5 text-sm text-ink">{event.title}</p>
              <p className="text-xs text-muted">{event.detail}</p>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  )
}
