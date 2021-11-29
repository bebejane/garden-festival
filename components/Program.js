import styles from "./Program.module.scss"
import contentStyles from "./Content.module.scss"
import cn from "classnames";
import { useUI, UIAction } from "/lib/context/ui"
import { format, isSameDay } from 'date-fns'
import { parseFromTimeZone, formatToTimeZone } from 'date-fns-timezone'
import { useEffect } from "react";
import Link from "next/link"

export default function Program({events, participants, date, timeZone, show}) {
  if(!show) return null

  const [ui, setUI] = useUI();
  useEffect(()=>document.getElementById(`${format(ui.date, 'yyyy-MM-d')}`)?.scrollIntoView({ behavior: "smooth"}), [ui])
  
  let currentDate;
  const program = events.sort((a,b) => new Date(a.startTime) > new Date(b.startTime)).map((ev, idx) => {    
    let eventDate;
    if(!isSameDay(currentDate, new Date(ev.startTime))){
      currentDate = new Date(ev.startTime);
      eventDate = currentDate;
    }
    const fDate = formatToTimeZone(ev.startTime, 'HH:mm', { timeZone:'Europe/London' })
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