import styles from "./Festival.module.scss"
import { format, isSameDay } from 'date-fns'
import EventBox from "/components/common/EventBox";
import { useAppState } from "/lib/context/appstate";
import { utcToZonedTime } from "date-fns-tz";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Festival({ events, dayEvents, participants, date, show, symbolSize }) {
  
  if (!show) return null

  const [ appState ] = useAppState();
  const { timeZone } = appState.zone;
  const router = useRouter()

  // Go to root festival page when change timezone
  useEffect(()=>router.asPath.toLowerCase().startsWith('/festival/') && router.push('/festival'), [appState.zone]) 

  let currentDate;
  return (
    <div className={styles.festival}>
      {[...(dayEvents || events)].map((ev, idx) => {
        let eventDate;
        let header;
        
        if (!isSameDay(currentDate, utcToZonedTime(ev.startTime, timeZone) )) {
          currentDate = utcToZonedTime(ev.startTime, timeZone);
          eventDate = currentDate;
          header = ev.isPreParty ? 'Pre Party' : ev.isAfterParty ? 'After Party' : <>{format(eventDate, 'EEEE')}<br />{format(eventDate, 'MMMM d')}</>
        }
        return (
          <>
            {eventDate &&
              <h1 key={`ehead-${idx}`} id={format(eventDate, 'yyyy-MM-d')} className={styles.weekday}>
                {header}
              </h1>
            }
            <EventBox event={ev} view={dayEvents ? 'weekday' : 'festival'} symbolSize={symbolSize}/>
          </>
        )
      })}
    </div>
  );
}