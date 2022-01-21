import styles from "./Festival.module.scss"
import contentStyles from "../Content.module.scss"
import cn from "classnames";
import { useAppState } from "/lib/context/appstate"
import { format, isSameDay, intervalToDuration, formatDuration } from 'date-fns'
import { formatToTimeZone } from 'date-fns-timezone'
import { useState, useEffect } from "react";
import Link from "next/link"
import Markdown from "/components/common/Markdown";
import anime from "animejs";

export default function Festival({ events, dayEvents, participants, date, timeZone, show, symbolSize }) {
  if (!show) return null

  const [appState] = useAppState();
  const view = dayEvents ? 'weekday' : 'festival';
  const [remember, setRemember] = useState(false)
  const handleClick = (event) => {
    console.log('click', event)
    if(event.inactive){
      setRemember(event.id)
      setTimeout(()=>setRemember(false), 1000)
      const target = document.getElementById(`festival-symbol-${event.id}`)
      console.log(target)
      anime({
        targets:target,
        
        scale:[{
          value: 0.98, 
          duration:200, 
          easing:'easeOutElastic(0.1,4)'
        }, {
          value: 1, 
          duration:300, 
          easing:'easeOutElastic(0.5,0.4)'
        }]
      })
    }
  }
  
  let currentDate;

  const schedule = [...(dayEvents || events)].map((ev, idx) => {
    let eventDate;
    if (!isSameDay(currentDate, new Date(ev.startTime))) {
      currentDate = new Date(ev.startTime);
      eventDate = currentDate;
    }
    const durationUntil = intervalToDuration({ start: new Date(), end: new Date(ev.startTime) })

    const eventContent = (
      <a className={cn(styles.event, (!ev.register && !ev.launched) && styles.inactive, remember && styles.remember)} onClick={()=>handleClick(ev)}>
        <div className={styles.upcoming}><span class="meta">UPCOMING</span></div>
        <div className={styles.symbol}>
          <img
            id={`${view}-symbol-${ev.id}`}
            eventid={ev.id}
            participantid={ev.participant.id}
            src={`${ev.symbol.url}?w=${symbolSize * 2}`}
            className={contentStyles.placeholderSymbol}
          />
        </div>
        <div className={styles.info}>
          <p>
            {ev.startTime &&
              <span className="metaLight">
                {formatToTimeZone(ev.startTime, 'ddd HH:mm', { timeZone: appState.zone.timeZone })} • {ev.typeOfEvent?.title} • By {ev.participant.title}
              </span>
            }
            <h2>{ev.title}</h2>
            <h2 className={cn(styles.sub, "sub")}>{ev.subTitle}</h2>
            <p className="summary">
              <Markdown>
                {ev.summary}
              </Markdown>
            </p>
          </p>
          {!ev.launched &&
            <span className={cn(styles.launch, remember === ev.id && styles.remember, "metaLight")} onTouchEnd={()=>handleClick(ev)}>
              <span>
              {ev.register ?
                <>PRE REGISTER TO PARTICIPATE IN THIS EVENT</>
              :
                <>THIS EVENT WILL BE LAUNCHED IN {formatDuration({ days: durationUntil.days })} AND {formatDuration({ hours: durationUntil.hours })}</>
              }
              </span>
            </span>
          }
        </div>
      </a>
    )

    return (
      <>
        {eventDate &&
          <h1 key={`ehead-${idx}`} id={format(eventDate, 'yyyy-MM-d')} className={styles.weekday}>
            {format(eventDate, 'EEEE')}<br />{format(eventDate, 'MMMM d')}
          </h1>
        }
        {ev.register || ev.launched ?
          <Link key={`elink-${idx}`} href={`/${ev.participant.slug}/${ev.slug}`}>
            {eventContent}
          </Link>
          :
          <>
            {eventContent}
          </>
        }
      </>
    )
  })
  return (
    <div className={styles.festival}>
      {schedule}
    </div>
  );
}