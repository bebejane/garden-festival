import styles from "./Program.module.scss"
import contentStyles from "./Content.module.scss"
import cn from "classnames";
import { useAppState, UIAction } from "/lib/context/appstate"
import { format, isSameDay } from 'date-fns'
import { parseFromTimeZone, formatToTimeZone } from 'date-fns-timezone'
import { useEffect } from "react";
import Link from "next/link"

export default function Program({events, participants, date, timeZone, show}) {
  if(!show) return null

  const [appState, setAppState] = useAppState();
  useEffect(()=>document.getElementById(`${format(appState.date, 'yyyy-MM-d')}`)?.scrollIntoView({ behavior: "smooth"}), [appState.date])
  useEffect(()=>console.log('tz'), [appState.timeZone])
  
  let currentDate;
  const program = events.sort((a,b) => new Date(a.startTime) > new Date(b.startTime)).map((ev, idx) => {    
    let eventDate;
    if(!isSameDay(currentDate, new Date(ev.startTime))){
      currentDate = new Date(ev.startTime);
      eventDate = currentDate;
    }
    const fDate = formatToTimeZone(ev.startTime, 'HH:mm', { timeZone: appState.zone.timeZone })
    return (
      <div key={idx} className={styles.event}>
        <div className={styles.symbol}>
          <Link href={`/${ev.participant.slug}/${ev.slug}`}>
            <a>
              <img 
                id={`program-symbol-${ev.id}`}
                eventid={ev.id}
                participantid={ev.participant.id}
                src={ev.participant.symbol.url} 
                className={contentStyles.placeholderSymbol}
              />
            </a>
          </Link>
        </div>
        <div className={styles.info}>
          {eventDate && 
            <h2 id={format(eventDate, 'yyyy-MM-d')} className={styles.weekday}>
              {format(eventDate, 'EEEE MMMM d, yyyy ')}
            </h2>
          }
          <p>
            {ev.startTime && <span>{fDate} (CET) </span>}
            <h3>{ev.title}</h3>
            <br/>
            {ev.summary}
          </p>
          <p>
            <Link href={`${ev.participant.slug}/${ev.slug}`}>
              <a>Go to event</a>
            </Link>
          </p>
        </div>
      </div>
    )
  })
	return (
		<div className={styles.program}>
      <div className={styles.program}>
        {program}
      </div>
		</div>
	);
}