import styles from "./Festival.module.scss"
import contentStyles from "../Content.module.scss"
import LinkButton from "../LinkButton";
import cn from "classnames";
import { useAppState, AppAction } from "/lib/context/appstate"
import { format, isSameDay } from 'date-fns'
import { formatToTimeZone } from 'date-fns-timezone'
import { useEffect } from "react";
import Link from "next/link"

export default function Festival({events, dayEvents, participants, date, timeZone, show}) {
  if(!show) return null

  const [appState, setAppState] = useAppState();
  useEffect(()=>{
    return
    count++;
    if(count === 1) return
    const el = document.getElementById(`${format(appState.date, 'yyyy-MM-d')}`)
    el?.scrollIntoView({ block:"center", behavior: "smooth"})
    console.log('scroll')
    
  }, [appState.date])

  
  
  let currentDate;
  const schedule = [...(dayEvents || events)].sort((a,b) => new Date(a.startTime) > new Date(b.startTime)).map((ev, idx) => {    
    let eventDate;
    if(!isSameDay(currentDate, new Date(ev.startTime))){
      currentDate = new Date(ev.startTime);
      eventDate = currentDate;
    }
    return (
      <>
        {eventDate && 
          <h1 id={format(eventDate, 'yyyy-MM-d')} className={styles.weekday}>
            {format(eventDate, 'EEEE MMMM d, yyyy')}
          </h1>
        }
        <div key={idx} className={styles.event}>
          <div className={styles.symbol}>
            <Link href={`/${ev.participant.slug}/${ev.slug}`}>
              <a>
                <img 
                  id={`festival-symbol-${ev.id}`}
                  eventid={ev.id}
                  participantid={ev.participant.id}
                  src={`${ev.participant.symbol.url}?w=200`} 
                  className={contentStyles.placeholderSymbol}
                />
              </a>
            </Link>
          </div>
          <div className={styles.info}>
            <p>
              {ev.startTime && 
                <span>
                  {formatToTimeZone(ev.startTime, 'dddd MMMM D, HH:mm z', { timeZone: appState.zone.timeZone })}
                </span>
              }
              <h3>{ev.title}</h3>
              <br/>
              {ev.summary}
            </p>
            <p>
            <LinkButton href={`/${ev.participant.slug}/${ev.slug}`}>  
              Go to event
            </LinkButton>
            </p>
          </div>
        </div>
      </>
    )
  })
	return (
		<div className={styles.festival}>
      {schedule}
		</div>
	);
}